import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddListComponent } from 'app/components/add-list/add-list.component';
import { AddProductComponentComponent } from 'app/components/add-product-component/add-product-component.component';
import { ArticleDetailComponent } from 'app/components/article-detail/article-detail.component';
import { PdfContainerComponent } from 'app/components/pdf-container/pdf-container.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NUMBERS } from 'app/constants/number.constants';
import { STRING_EMPTY } from 'app/constants/string.constants';
import { BUTTON_CLASS } from 'app/constants/style.constants';
import { Article, ArticleList, Category, List, User } from "app/models/cart.models";
import { IconEmum } from 'app/models/icon.models';
import { DEFAULT_MODAL_OPTIONS, DialogOptions } from 'app/models/modal.model';
import { NotDisplayColumnsEnum, TableAlingEnum, TableColumnTypeEnum, TableConfig, TableRow } from 'app/models/table.models';
import { CartService } from 'app/services/cart.service';
import { LoadingService } from 'app/services/loading.service';
import { ModalService } from 'app/services/modal.service';
import { StatusService } from 'app/services/status.service';
import { TOAST_STATE, ToastService } from 'app/services/toast.service';
import { formatPrice, getCategory } from 'app/utils/cart.utils';
import { stringFrom } from 'app/utils/string.utils';
import { finalize } from 'rxjs';
import { TransformListToRecipeComponent } from 'app/components/transform-list-to-recipe/transform-list-to-recipe.component';
import { ImportRecipeComponent } from 'app/components/import-recipe/import-recipe.component';
import { TableComponent } from 'app/components/table/table.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  standalone: true,
  imports: [
    TranslateModule,
    TableComponent,
  ]
})

// This component is used to display a list of articles
export class ListComponent implements OnInit{
  articles!: Article[];
  categories!: Category[];
  @Input({required: true}) user!: User;
  @Input({required: true}) swLastList!: boolean;

  list!: List | undefined;

  tableData: TableRow[] = [];
  tableConfig: TableConfig = this.getTableConfig();

  // Returns the name of the list and if it is public or private
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

  // Sets the data of the list
  public setData(list: List, articles: Article[], categories: Category[]): void {
    this.articles = articles;
    this.categories = categories;
    this.list = list;
    this.updatetable();
  }

  ngOnInit(): void {
    this.assingEvents();
    this.updatetable();
  }

 // Subscribes to the events of adding an article and a category
  assingEvents(): void {

    // Add article to the list
    this.statusService.addedarticle$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((articleId: string) => {
        const articleAlreadyPresent = this.list?.articleList.some((articleList: ArticleList) => articleList.articleId === articleId)
        const articleIdIsString = typeof articleId === 'string';
        if (!!articleId && !articleAlreadyPresent && articleIdIsString) {
          const articleList: ArticleList = {
            articleId,
            amount: NUMBERS.N_1,
            unit: STRING_EMPTY,
            isActive: true,
          };
          this.list?.articleList.push(articleList);
          this.saveList();
          this.updatetable();
        }
      });

      // Add category to the list
      this.statusService.addedCategory$
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe((category: Category) => {
          if (!category.id) {
            return;
          }
          this.categories.push(category);
        });
  }

  // Handles the deletion of the list by displaying a dialog
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

  // Shows a modal to add an article
  handleAddArticle(): void {
    this.modalService.open(AddProductComponentComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { articles: this.articles, categories: this.categories },
      prevenCloseOutside: true,
    });
  }

  // Shows a modal to transform the list into a recipe
  handleTransforToReceipt(): void {
    this.modalService.open(TransformListToRecipeComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { list: this.list },
      prevenCloseOutside: true,
    });
  }

  // Shows a modal to edit the list details
  handleDetail(row: TableRow): void {
    const article = this.articles.find((a: Article) => a.id === row.id);
    this.modalService.open(ArticleDetailComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { article, categories: this.categories },
      prevenCloseOutside: true,
    });
  }

  // Returns a table row with the article details
  getTableRow(articleList: ArticleList): TableRow {
    const article = this.articles.find((a: Article) => a.id === articleList.articleId);

    return {
      ...article,
      ...articleList,
      category: article ? getCategory(article, this.categories) : STRING_EMPTY,
      averagePrice: `${formatPrice(article ? (article.averagePrice * articleList.amount) : NUMBERS.N_0)}`,
      id: articleList.articleId,
      style: articleList.isActive ? STRING_EMPTY : 'text-decoration: line-through',
    };
  }

  // Handles the edition of the list
  handleEditList(): void {
    this.modalService.open(AddListComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { userId: this.user.id, list: this.list },
      prevenCloseOutside: true,
    });
  }

  private saveList(): void {
    // Can't save a list if there is not list
    if (!this.list) {
      return;
    }
    this.sortList();
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

  // Handles the download of the list in PDF format
  handlePdf(): void {
    this.loading.show();
    const id = this.list?.id || STRING_EMPTY;
    this.cartService.getListPdf(id)
    .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => this.loading.hide()))
      .subscribe({
        next: (response) => {

          // Show a modal with the PDF file
          const file = new Blob([response], { type: 'application/pdf' });
          this.modalService.open(PdfContainerComponent, {
            ...DEFAULT_MODAL_OPTIONS,
            data: { file, name: this.list?.name },
            prevenCloseOutside: true,
          });
        },
        error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.GET_PDF_KO')),
      });
  }

  // Shows a modal to import a recipe
  handleImportReceit(): void {
    this.modalService.open(ImportRecipeComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { userId: this.user.id, list: this.list},
      prevenCloseOutside: true,
    });
  }

  // Returns the total price of the list
  getFormattedPrice(): string {
    return formatPrice(this.list?.totalPrice || NUMBERS.N_0);
  }

  // Deletes the list
  private deleteList(): void {

    // Can't delete last list
    if (this.swLastList) {
      this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.DELETE_LAST_LIST'));
      return;
    }

    // Delete list
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
        // Handle error
        error: (error) => {
          if(error.status !== NUMBERS.N_200){
            this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.DELETE_LIST_KO'));
            return;
          }
          this.toast.showToast(TOAST_STATE.SUCCESS, this.translate.instant('TOAST.DELETE_LIST_OK'));
        },
      });
  }

  // Returns the configuration of the table
  getTableConfig(): TableConfig {
    const literals = this.translate.instant('LISTS.HEADERS');
    return {
      // Columns of the table
      columns: [
        {
          key: 'crossOut',
          label: STRING_EMPTY,
          type: TableColumnTypeEnum.ACTIONS,
          action: (row: TableRow) => this.inOutChart(row),
          actionIcon: IconEmum.CART ,
        },
        {
          key: 'name',
          label: literals.NAME,
          type: TableColumnTypeEnum.TEXT,
        },
        {
          key: 'category',
          label: literals.CATEGORY,
          type: TableColumnTypeEnum.TEXT,
          notDisplay: NotDisplayColumnsEnum.MEDIUM,
        },
        {
          key: 'brand',
          label: literals.BRAND,
          type: TableColumnTypeEnum.TEXT,
          aling: TableAlingEnum.CENTER,
          notDisplay: NotDisplayColumnsEnum.MEDIUM,
        },
        {
          key: 'amount',
          label: literals.QUANTITY,
          type: TableColumnTypeEnum.NUMBER,
          aling: TableAlingEnum.CENTER,
          notDisplayHeader: NotDisplayColumnsEnum.SMALL
        },
        {
          key: 'detail',
          label: STRING_EMPTY,
          type: TableColumnTypeEnum.ACTIONS,
          action: (row: TableRow) => this.alterAmount(row, Number(row['amount']) - NUMBERS.N_1),
          actionIcon: IconEmum.MINUS ,
        },
        {
          key: 'detail',
          label: STRING_EMPTY,
          type: TableColumnTypeEnum.ACTIONS,
          action: (row: TableRow) => this.alterAmount(row, Number(row['amount']) + NUMBERS.N_1),
          actionIcon: IconEmum.PLUS ,
        },
        {
          key: 'averagePrice',
          label: literals.PRICE,
          type: TableColumnTypeEnum.NUMBER,
          aling: TableAlingEnum.RIGHT,
        },
        {
          key: 'detail',
          label: literals.DETAIL,
          type: TableColumnTypeEnum.ACTIONS,
          action: (row: TableRow) => this.handleDetail(row),
          actionIcon: IconEmum.DETAIL ,
        },
        {
          key: 'delete',
          label: literals.DELETE,
          type: TableColumnTypeEnum.ACTIONS,
          action: (row: TableRow) => this.removeArticleFromList(row),
          actionIcon: IconEmum.TRASH ,
        }
      ],

      // Pagination of the table
      pagination: {
        actualPage: this.tableConfig ? this.tableConfig.pagination.actualPage : NUMBERS.N_1,
        itemsPerPage: this.tableConfig ? this.tableConfig.pagination.itemsPerPage : NUMBERS.N_10,
        totalItems: this.tableData.length,
      }
    };
  }

  // Handles the addition of an article to the cart or its removal
  private inOutChart(row: TableRow): void {

    // If there is no list, return
    if (!this.list) {
      return;
    }
    row['style'] = row['style'] ? STRING_EMPTY : 'text-decoration: line-through';
    const articleList = this.list.articleList.find((articleList: ArticleList) => articleList.articleId === row.id);
    if (articleList) {
      articleList.isActive = !articleList.isActive;
      this.saveList();
      this.updatetable();
    }
  }

  // Handles the modification of the amount of an article in the list
  private alterAmount(row: TableRow, amount: number): void {
    if (!this.list || amount < NUMBERS.N_1) {
      return;
    }
    const articleList = this.list.articleList.find((articleList: ArticleList) => articleList.articleId === row.id);
    if (articleList) {
      articleList.amount = amount > NUMBERS.N_0 ? amount : NUMBERS.N_1;
      this.saveList();
      this.updatetable();
    }
  }

  // Removes an article from the list
  private removeArticleFromList(row: TableRow): void {
    if (!this.list) {
      return;
    }
    this.list.articleList = this.list.articleList.filter((articleList: ArticleList) => articleList.articleId !== row.id);
    this.updatetable();
    this.saveList();
  }

  // Updates the table with the list data
  private updatetable(): void{
    if (!this.list) {
      return;
    }
    this.list.totalPrice = this.getListPrice();
    this.tableData = this.list.articleList.map((articleList: ArticleList) => this.getTableRow(articleList));
    this.tableConfig = this.getTableConfig();
  }


  // Sorts the list of articles alphabetically
  private sortList(): void {
    if (!this.list) {
      return;
    }
    this.list.articleList = this.list.articleList.sort((a: ArticleList, b: ArticleList) => {
      const articleA = this.articles.find((article: Article) => article.id === a.articleId);
      const articleB = this.articles.find((article: Article) => article.id === b.articleId);
      if (articleA && articleB) {
        return articleA.name.localeCompare(articleB.name);
      }
      return NUMBERS.N_0;
    });
  }

  // Returns the total price of the list by adding the price of each article and its amount
  private getListPrice(): number {
    if (!this.list) {
      return NUMBERS.N_0;
    }
    return this.list.articleList.reduce((acc: number, articleList: ArticleList) => {
      const article = this.articles.find((a: Article) => a.id === articleList.articleId);
      return acc + (article ? (article.averagePrice * articleList.amount) : NUMBERS.N_0);
    }, NUMBERS.N_0);
  }
}
