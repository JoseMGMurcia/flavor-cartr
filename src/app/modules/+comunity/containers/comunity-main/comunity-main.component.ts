import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NUMBERS } from '@shared/constants/number.constants';
import { ROUTES } from '@shared/constants/routes.constants';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { List } from '@shared/models/cart.models';
import { IconEmum } from '@shared/models/icon.models';
import { TableAlingEnum, TableColumnTypeEnum, TableConfig, TableRow } from '@shared/models/table.models';
import { CartService } from '@shared/services/cart.service';
import { LoadingService } from '@shared/services/loading.service';
import { TOAST_STATE, ToastService } from '@shared/services/toast.service';
import { formatPrice } from '@shared/utils/cart.utils';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-comunity-main',
  templateUrl: './comunity-main.component.html',
  styleUrl: './comunity-main.component.scss'
})
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

  private goDetail(row: TableRow): void {
    this.router.navigate([ROUTES.COMUNITY.DETAIL.fullPath, row.id]);
  }

  private mapListToTableRow(list: List): TableRow {
    return {
      ...list,
      totalPrice: formatPrice(list.totalPrice),
      creationDate: list.creationDate?.substring(NUMBERS.N_0, NUMBERS.N_10),
      style: 'min-width: 350px',
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
          key: 'creationDate',
          label: literals.CREATION_DATE,
          type: TableColumnTypeEnum.NUMBER,
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
