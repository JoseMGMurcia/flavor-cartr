import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NUMBERS } from '@shared/constants/number.constants';
import { TableAlingEnum, TableColumnTypeEnum, TableConfig, TableRow } from '@shared/models/table.models';
import { CartService } from '@shared/services/cart.service';
import { LoadingService } from '@shared/services/loading.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { Article, Category } from '@shared/models/cart.models';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { ModalService } from '@shared/services/modal.service';
import { ModalOptions } from '@shared/models/modal.model';
import { AddListComponent } from '@modules/+lists/components/add-list/add-list.component';
import { TableComponent } from '@shared/components/table/table.component';
import { formatPrice, getCategory } from '@shared/utils/cart.utils';
import { IconEmum } from '@shared/models/icon.models';

@Component({
  selector: 'app-lists-main-component',
  templateUrl: './lists-main.component.html',
  styleUrl: './lists-main.component.scss',
})
export class ListsMainComponent implements OnInit{

  tableData: TableRow[] = [];
  tableConfig: TableConfig = this.getTableConfig();
  swLoadingFinished = false;
  private _articles: Article[] = [];
  private _categories: Category[] = [];
  private _destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.fetch();
  }

  constructor(
    private translate: TranslateService,
    private loading: LoadingService,
    private cartService: CartService,
    private modalService: ModalService,
  ) { }

  handleNewList(): void {
    const options: ModalOptions = {
      animations: {
        modal: {
          enter: 'enter-scaling 0.4s',
        },
      },
    };
    this.modalService.open(AddListComponent, options);
  }

  private fetch(): void {
    this.loadData();
  }

  private loadData(): void {
    this.loading.show();
    forkJoin([
      this.cartService.getArticles()
        .pipe(catchError(() => of([])),
          takeUntilDestroyed(this._destroyRef)
        ),
      this.cartService.getCategories()
        .pipe(catchError(() => of([])),
          takeUntilDestroyed(this._destroyRef)
        ),
    ])
      .pipe(finalize(() => {
        this.loading.hide();
        this.swLoadingFinished = true;
      }))
      .subscribe(([articles, categories]: [Article[], Category[]]) => {
        this._articles = articles;
        this._categories = categories;
        this.tableData = this._articles.map((article: Article) => ({
          ...article,
          averagePrice: formatPrice(article.averagePrice),
          category: getCategory(article, this._categories),
        }));
        this.tableConfig = this.getTableConfig();
      })
  }

  private getTableConfig(): TableConfig {
    const literals = this.translate.instant('LISTS.HEADERS');
    return {
      columns: [
        {
          key: 'name',
          label: literals.NAME,
          type: TableColumnTypeEnum.TEXT,
        },
        {
          key: 'brand',
          label: literals.BRAND,
          type: TableColumnTypeEnum.TEXT,
        },
        {
          key: 'category',
          label: literals.CATEGORY,
          type: TableColumnTypeEnum.TEXT,
        },
        {
          key: 'description',
          label: literals.DESCRIPTION,
          type: TableColumnTypeEnum.TEXT,
          maxChars: NUMBERS.N_20,
        },
        {
          key: 'quantity',
          label: literals.QUANTITY,
          type: TableColumnTypeEnum.TEXT,
          aling: TableAlingEnum.CENTER,
        },
        {
          key: 'averagePrice',
          label: literals.PRICE,
          type: TableColumnTypeEnum.TEXT,
          aling: TableAlingEnum.RIGHT,
        },
        {
          key: 'detail',
          label: literals.DETAIL,
          type: TableColumnTypeEnum.ACTIONS,
          action: (row: TableRow) => row['quantity'] = Number(row['quantity']) + NUMBERS.N_1,
          actionIcon: IconEmum.DETAIL ,
        }
      ],
      pagination: {
        actualPage: NUMBERS.N_1,
        itemsPerPage: NUMBERS.N_20 ,
        totalItems: this.tableData.length,
      }
    }
  }
}
