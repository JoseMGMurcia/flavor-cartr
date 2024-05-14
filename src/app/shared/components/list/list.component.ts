import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddListComponent } from '@modules/+lists/components/add-list/add-list.component';
import { AddProductComponentComponent } from '@modules/+lists/components/add-product-component/add-product-component.component';
import { TranslateService } from '@ngx-translate/core';
import { NUMBERS } from '@shared/constants/number.constants';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { BUTTON_CLASS } from '@shared/constants/style.constants';
import { Article, ArticleList, Category, List, User } from '@shared/models/cart.models';
import { IconEmum } from '@shared/models/icon.models';
import { DEFAULT_MODAL_OPTIONS, DialogOptions } from '@shared/models/modal.model';
import { TableAlingEnum, TableColumnTypeEnum, TableConfig, TableRow } from '@shared/models/table.models';
import { CartService } from '@shared/services/cart.service';
import { LoadingService } from '@shared/services/loading.service';
import { ModalService } from '@shared/services/modal.service';
import { StatusService } from '@shared/services/status.service';
import { TOAST_STATE, ToastService } from '@shared/services/toast.service';
import { getCategory } from '@shared/utils/cart.utils';
import { stringFrom } from '@shared/utils/string.utils';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit{
  @Input({required: true}) list!: List | undefined;
  @Input({required: true}) articles!: Article[];
  @Input({required: true}) categories!: Category[];
  @Input({required: true}) user!: User;

  tableData: TableRow[] = [];
  tableConfig: TableConfig = this.getTableConfig();

  get listName(): string {
    return  `${stringFrom(this.list?.name)} (${this.translate.instant(this.list?.isPublic ? 'LISTS.PUBLIC_LIST' : 'LISTS.PRIVATE_LIST')})`;
  }

  private _destroyRef = inject(DestroyRef);

  constructor(
    private cartService: CartService,
    private translate: TranslateService,
    private loading: LoadingService,
    private statusService: StatusService,
    private modalService: ModalService,
    private toast: ToastService,
  ) {}


  ngOnInit(): void {
    this.assingEvents();
    this.tableData = this.list?.articleList.map((articleList: ArticleList) => this.getTableRow(articleList)) || [];
  }

  assingEvents(): void {
    this.statusService.addedarticle$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((articleId: string) => {
        const articleAlreadyPresent = this.list?.articleList.some((articleList: ArticleList) => articleList.articleId === articleId)
        const articleIdIsString = typeof articleId === 'string';
        if (!!articleId && !articleAlreadyPresent && articleIdIsString) {
          const articleList: ArticleList = {
            articleId,
            amount: NUMBERS.N_0,
          };
          this.list?.articleList.push(articleList);
          const row = this.getTableRow(articleList);
          if (!!row['category'] && !!row['name']) {
            this.tableData = [ ...this.tableData, this.getTableRow(articleList)];
            this.tableConfig = this.getTableConfig();
          }
        }
      });
  }

  handleDeleteList(): void {
    const literals = this.translate.instant('LISTS.DELETE_LIST_DIALOG');
    const dialog: DialogOptions = {
      title: literals.TITLE,
      message: this.translate.instant('LISTS.DELETE_LIST_DIALOG.CONTENT', { name: stringFrom(this.list?.name) }),
      buttons: [
        {
          label: literals.CANCEL,
          action: () => this.modalService.close(),
          className: BUTTON_CLASS.SECONDARY
        },
        {
          label: literals.DELETE,
          action: () => this.deleteList(),
          className: BUTTON_CLASS.PRIMARY
        }
      ]
    }
    this.modalService.easyDialog(dialog);
  }

  handleAddArticle(): void {
    this.modalService.open(AddProductComponentComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { articles: this.articles, categories: this.categories },
      prevenCloseOutside: true,
    });
  }

  getTableRow(articleList: ArticleList): TableRow {
    const article = this.articles.find((a: Article) => a.id === articleList.articleId);
    console.log('Add article', article );

    return {
      ...article,
      ...articleList,
      category: article ? getCategory(article, this.categories) : STRING_EMPTY,
      id: articleList.articleId,
    };

  }

  handleDeleteArticle(row: TableRow): void {
    // TODO
  }

  handleEditList(): void {
    this.modalService.open(AddListComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { userId: this.user.id, list: this.list },
      prevenCloseOutside: true,
    });
  }

  handleSaveList(): void {
    if (!this.list) {
      return;
    }
    this.loading.show();
    this.cartService.putList(this.list)
      .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => this.loading.hide()))
      .subscribe({
        next: () => {
          this.statusService.setReloadListsPending(true);
          this.toast.showToast(TOAST_STATE.SUCCESS, this.translate.instant('TOAST.SAVE_LIST_OK'));
        },
        error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.SAVE_LIST_KO')),
      });

  }

  private deleteList(): void {
    this.loading.show();
    this.cartService.deleteList(stringFrom(this.list?.id))
      .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => {
          this.loading.hide();
          this.statusService.setReloadListsPending(true);
        }))
      .subscribe({
        next: () => {
          this.toast.showToast(TOAST_STATE.SUCCESS, this.translate.instant('TOAST.DELETE_LIST_OK'));
        },
        error: (error) => {
          if(error.status !== NUMBERS.N_200){
            this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.DELETE_LIST_KO'));
            return;
          }
          this.toast.showToast(TOAST_STATE.SUCCESS, this.translate.instant('TOAST.DELETE_LIST_OK'));
        },
      });
  }

  getTableConfig(): TableConfig {
    const literals = this.translate.instant('LISTS.HEADERS');
    return {
      columns: [
        {
          key: 'name',
          label: literals.NAME,
          type: TableColumnTypeEnum.TEXT,
        },
        {
          key: 'category',
          label: literals.CATEGORY,
          type: TableColumnTypeEnum.TEXT,
        },

        {
          key: 'amount',
          label: literals.QUANTITY,
          type: TableColumnTypeEnum.TEXT,
          aling: TableAlingEnum.CENTER,
        },
        {
          key: 'detail',
          label: STRING_EMPTY,
          type: TableColumnTypeEnum.ACTIONS,
          action: (row: TableRow) =>
            row['amount'] = Number(row['amount']) - NUMBERS.N_1 >  NUMBERS.N_0 ? Number(row['amount']) - NUMBERS.N_1 :NUMBERS.N_0,
          actionIcon: IconEmum.MINUS ,
        },
        {
          key: 'detail',
          label: STRING_EMPTY,
          type: TableColumnTypeEnum.ACTIONS,
          action: (row: TableRow) => row['amount'] = Number(row['amount']) + NUMBERS.N_1,
          actionIcon: IconEmum.PLUS ,
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
          action: (row: TableRow) => row['amount'] = Number(row['amount']) + NUMBERS.N_1,
          actionIcon: IconEmum.DETAIL ,
        }
      ],
      pagination: {
        actualPage: NUMBERS.N_1,
        itemsPerPage: NUMBERS.N_10,
        totalItems: this.tableData.length,
      }
    };
  }
}
