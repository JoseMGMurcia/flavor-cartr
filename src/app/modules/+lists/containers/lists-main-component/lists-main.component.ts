import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NUMBERS } from '@shared/constants/number.constants';
import { TableAlingEnum, TableColumnTypeEnum, TableConfig, TableRow } from '@shared/models/table.models';
import { CartService } from '@shared/services/cart.service';
import { LoadingService } from '@shared/services/loading.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, forkJoin, of } from 'rxjs';
import { Article, Category, User } from '@shared/models/cart.models';
import { ModalService } from '@shared/services/modal.service';
import { DEFAULT_MODAL_OPTIONS, ModalOptions } from '@shared/models/modal.model';
import { AddListComponent } from '@modules/+lists/components/add-list/add-list.component';
import { formatPrice, getCategory } from '@shared/utils/cart.utils';
import { IconEmum } from '@shared/models/icon.models';
import { SocialService } from '@shared/services/social.service';
import { TOAST_STATE, ToastService } from '@shared/services/toast.service';

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
  private _user!: User;

  ngOnInit(): void {
    this.fetch();
  }

  constructor(
    private translate: TranslateService,
    private loading: LoadingService,
    private cartService: CartService,
    private modalService: ModalService,
    private socialService: SocialService,
    private toast: ToastService,
  ) { }

  handleNewList(): void {
    this.modalService.open(AddListComponent, DEFAULT_MODAL_OPTIONS);
  }

  private fetch(): void {
    this.getUser();

  }

  private getUser(): void {
    this.loading.show();
    this.socialService.user$
      .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => this.loading.hide()))
      .subscribe({
        next: (user) => {
          this._user = user;
          this.loadData();
        },
        error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.USER')),
      });
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
        if (articles.length === NUMBERS.N_0) {
          this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.ARTICLES_OR_CATEGORIES'));
        }
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
