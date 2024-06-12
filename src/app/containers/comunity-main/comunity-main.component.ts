import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NUMBERS } from 'app/constants/number.constants';
import { STRING_EMPTY } from 'app/constants/string.constants';
import { List } from "app/models/cart.models";
import { IconEmum } from 'app/models/icon.models';
import { NotDisplayColumnsEnum, TableAlingEnum, TableColumnTypeEnum, TableConfig, TableRow } from 'app/models/table.models';
import { CartService } from 'app/services/cart.service';
import { LoadingService } from 'app/services/loading.service';
import { TOAST_STATE, ToastService } from 'app/services/toast.service';
import { formatPrice } from 'app/utils/cart.utils';
import { finalize } from 'rxjs';
import { TableComponent } from 'app/components/table/table.component';
import { ROUTES } from 'app/constants/routes.constants';

@Component({
  selector: 'app-comunity-main',
  templateUrl: './comunity-main.component.html',
  styleUrl: './comunity-main.component.scss',
  standalone: true,
  imports: [
    TranslateModule,
    TableComponent,
  ]
})
// This component is used to display the public lists
export class ComunityMainComponent implements OnInit{

  tableData: TableRow[] = [];
  tableConfig: TableConfig = this.getTableConfig();

  private _lists: List[] = [];
  private _destroyRef = inject(DestroyRef);

  constructor(
    private cartService: CartService,
    private translate: TranslateService,
    private loading: LoadingService,
    private toast: ToastService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  // This function is used to fetch the public lists from the server and set the table data
  private fetch(): void {
    this.loading.show();
    this.cartService.getPublicLists()
    .pipe(takeUntilDestroyed(this._destroyRef),
      finalize(() => this.loading.hide())
    ).subscribe({
      next: (lists: List[]) => {
        this._lists = lists;
        this.tableData = this._lists.map((list) => this.mapListToTableRow(list));
        this.tableConfig = this.getTableConfig();
      },
      error: () => {
        this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.GET_LISTS_KO'));
      }
    });
  }

  // This function is used to navigate to the detail of a public list
  private goDetail(row: TableRow): void {
    this.router.navigate([ROUTES.COMUNITY.DETAIL.fullPath, row.id]);
  }

  private mapListToTableRow(list: List): TableRow {
    return {
      ...list,
      totalPrice: formatPrice(list.totalPrice),
      creationDate: list.creationDate?.substring(NUMBERS.N_0, NUMBERS.N_10),
    };
  }

  private getTableConfig(): TableConfig {
    const literals = this.translate.instant('COMUNITY.HEADERS');
    return {
      columns: [
        {
          key: 'detail',
          label: STRING_EMPTY,
          type: TableColumnTypeEnum.ACTIONS,
          action: (row: TableRow) => this.goDetail(row),
          actionIcon: IconEmum.DETAIL ,
        },
        {
          key: 'name',
          label: literals.NAME,
          type: TableColumnTypeEnum.TEXT,
        },
        {
          key: 'spacer',
          label: STRING_EMPTY,
          type: TableColumnTypeEnum.TEXT,
          notDisplay: NotDisplayColumnsEnum.MEDIUM
        },
        {
          key: 'creationDate',
          label: literals.CREATION_DATE,
          type: TableColumnTypeEnum.NUMBER,
          notDisplay: NotDisplayColumnsEnum.MEDIUM
        },
        {
          key: 'totalPrice',
          label: literals.TOTAL_PRICE,
          type: TableColumnTypeEnum.NUMBER,
          aling: TableAlingEnum.CENTER,
        },
      ],
      pagination: {
        actualPage: this.tableConfig ? this.tableConfig.pagination.actualPage : NUMBERS.N_1,
        itemsPerPage: this.tableConfig ? this.tableConfig.pagination.itemsPerPage : NUMBERS.N_10,
        totalItems: this.tableData.length,
      }
    };
  }

}
