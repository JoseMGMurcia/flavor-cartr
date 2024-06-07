import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddProductComponentComponent } from 'app/components/add-product-component/add-product-component.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NUMBERS } from 'app/constants/number.constants';
import { STRING_EMPTY } from 'app/constants/string.constants';
import { BUTTON_CLASS } from 'app/constants/style.constants';
import { Article, ArticleList, Category, Recipe, User } from "app/models/cart.models";
import { DEFAULT_MODAL_OPTIONS, DialogOptions } from 'app/models/modal.model';
import { TableAlingEnum, TableColumnTypeEnum, TableConfig, TableRow } from 'app/models/table.models';
import { CartService } from 'app/services/cart.service';
import { LoadingService } from 'app/services/loading.service';
import { ModalService } from 'app/services/modal.service';
import { StatusService } from 'app/services/status.service';
import { TOAST_STATE, ToastService } from 'app/services/toast.service';
import { stringFrom } from 'app/utils/string.utils';
import { formatPrice, getCategory } from 'app/utils/cart.utils';
import { finalize } from 'rxjs';
import { PdfContainerComponent } from 'app/components/pdf-container/pdf-container.component';
import { IconEmum } from 'app/models/icon.models';
import { AddRecipeComponent } from 'app/components/add-recipe/add-recipe.component';
import { TableComponent } from '../table/table.component';
import { ArticleDetailComponent } from 'app/components/article-detail/article-detail.component';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrl: './recipe.component.scss',
  standalone: true,
  imports: [
    TranslateModule,
    TableComponent
  ]
})
export class RecipeComponent implements OnInit{

  articles!: Article[];
  categories!: Category[];
  @Input({required: true}) user!: User;
  @Input({required: true}) swLastRecipe!: boolean;

  recipe!: Recipe | undefined;

  tableData: TableRow[] = [];
  tableConfig: TableConfig = this.getTableConfig();

  private _destroyRef = inject(DestroyRef);

  constructor(
    private cartService: CartService,
    private translate: TranslateService,
    private loading: LoadingService,
    private statusService: StatusService,
    private modalService: ModalService,
    private toast: ToastService,
  ) {}

  public setData(recipe: Recipe, articles: Article[], categories: Category[]): void {
    this.articles = articles;
    this.categories = categories;
    this.recipe = recipe;
    this.updatetable();
  }

  ngOnInit(): void {
    this.assingEvents();
    this.updatetable();
  }

  assingEvents(): void {
    this.statusService.addedarticle$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((articleId: string) => {
        const articleAlreadyPresent = this.recipe?.articleList.some((articleList: ArticleList) => articleList.articleId === articleId)
        const articleIdIsString = typeof articleId === 'string';
        if (!!articleId && !articleAlreadyPresent && articleIdIsString) {
          const articleList: ArticleList = {
            articleId,
            amount: NUMBERS.N_1,
            unit: STRING_EMPTY,
            isActive: true,
          };
          this.recipe?.articleList.push(articleList);
          this.saveRecipe();
          this.updatetable();
        }
      });

      this.statusService.addedCategory$
        .pipe(takeUntilDestroyed(this._destroyRef))
        .subscribe((category: Category) => {
          if (!category.id) {
            return;
          }
          this.categories.push(category);
        });
  }

  handleDeleteList(): void {
    const literals = this.translate.instant('RECIPES.DELETE_RECIPE_DIALOG');
    const dialog: DialogOptions = {
      title: literals.TITLE,
      message: this.translate.instant('RECIPES.DELETE_RECIPE_DIALOG.CONTENT', { name: stringFrom(this.recipe?.name) }),
      buttons: [
        {
          label: literals.CANCEL,
          action: () => this.modalService.close(),
          className: BUTTON_CLASS.SECONDARY
        },
        {
          label: literals.DELETE,
          action: () => this.deleteRecipe(),
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

  handleDetail(row: TableRow): void {
    const article = this.articles.find((a: Article) => a.id === row.id);
    this.modalService.open(ArticleDetailComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { article, categories: this.categories },
      prevenCloseOutside: true,
    });
  }

  getTableRow(articleList: ArticleList): TableRow {
    const article = this.articles.find((a: Article) => a.id === articleList.articleId);

    return {
      ...article,
      ...articleList,
      category: article ? getCategory(article, this.categories) : STRING_EMPTY,
      averagePrice: `${formatPrice(article ? (article.averagePrice * articleList.amount) : NUMBERS.N_0)}`,
      id: articleList.articleId,
    };
  }

  handleEditRecipe(): void {
    this.modalService.open(AddRecipeComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { userId: this.user.id, recipe: this.recipe },
      prevenCloseOutside: true,
    });
  }

  private saveRecipe(): void {
    // Can't save a recipe if there is not recipe
    if (!this.recipe) {
      return;
    }
    this.sortRecipe();
    this.loading.show();
    this.cartService.putRecipe(this.recipe)
      .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => this.loading.hide()))
      .subscribe({
        next: () => {
          this.statusService.setReloadListsPending(true);
          this.toast.showToast(TOAST_STATE.SUCCESS, this.translate.instant('TOAST.SAVE_RECIPE_OK'));
        },
        error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.SAVE_RECIPE_KO')),
      });
  }

  handlePdf(): void {
    this.loading.show();
    const id = this.recipe?.id || STRING_EMPTY;
    this.cartService.getRecipePdf(id)
    .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => this.loading.hide()))
      .subscribe({
        next: (response) => {

          const file = new Blob([response], { type: 'application/pdf' });
          this.modalService.open(PdfContainerComponent, {
            ...DEFAULT_MODAL_OPTIONS,
            data: { file, name: this.recipe?.name },
            prevenCloseOutside: true,
          });
        },
        error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.GET_PDF_KO')),
      });
  }

  getFormattedPrice(): string {
    return formatPrice(this.recipe?.totalPrice || NUMBERS.N_0);
  }

  private deleteRecipe(): void {

    // Can't delete last recipe
    if (this.swLastRecipe) {
      this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.DELETE_LAST_LIST'));
      return;
    }

    // Delete recipe
    this.loading.show();
    this.cartService.deleteRecipe(stringFrom(this.recipe?.id))
      .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => {
          this.loading.hide();
          this.statusService.setReloadListsPending(true);
        }))
      .subscribe({
        next: () => {
          this.toast.showToast(TOAST_STATE.SUCCESS, this.translate.instant('TOAST.DELETE_RECIPE_OK'));
        },
        // Handle error
        error: (error) => {
          if(error.status !== NUMBERS.N_200){
            this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.DELETE_RECIPE_KO'));
            return;
          }
          this.toast.showToast(TOAST_STATE.SUCCESS, this.translate.instant('TOAST.DELETE_RECIPE_OK'));
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
          key: 'brand',
          label: literals.BRAND,
          type: TableColumnTypeEnum.TEXT,
          aling: TableAlingEnum.CENTER,
        },
        {
          key: 'amount',
          label: literals.QUANTITY,
          type: TableColumnTypeEnum.NUMBER,
          aling: TableAlingEnum.CENTER,
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
      pagination: {
        actualPage: this.tableConfig ? this.tableConfig.pagination.actualPage : NUMBERS.N_1,
        itemsPerPage: this.tableConfig ? this.tableConfig.pagination.itemsPerPage : NUMBERS.N_10,
        totalItems: this.tableData.length,
      }
    };
  }

  private alterAmount(row: TableRow, amount: number): void {
    if (!this.recipe || amount < NUMBERS.N_1) {
      return;
    }
    const articleList = this.recipe.articleList.find((articleList: ArticleList) => articleList.articleId === row.id);
    if (articleList) {
      articleList.amount = amount > NUMBERS.N_0 ? amount : NUMBERS.N_1;
      this.saveRecipe();
      this.updatetable();
    }
  }

  private removeArticleFromList(row: TableRow): void {
    if (!this.recipe) {
      return;
    }
    this.recipe.articleList = this.recipe.articleList.filter((articleList: ArticleList) => articleList.articleId !== row.id);
    this.updatetable();
    this.saveRecipe();
  }

  private updatetable(): void{
    if (!this.recipe) {
      return;
    }
    this.recipe.totalPrice = this.getRecipePrice();
    this.tableData = this.recipe.articleList.map((articleList: ArticleList) => this.getTableRow(articleList));
    this.tableConfig = this.getTableConfig();
  }

  private sortRecipe(): void {
    if (!this.recipe) {
      return;
    }
    this.recipe.articleList = this.recipe.articleList.sort((a: ArticleList, b: ArticleList) => {
      const articleA = this.articles.find((article: Article) => article.id === a.articleId);
      const articleB = this.articles.find((article: Article) => article.id === b.articleId);
      if (articleA && articleB) {
        return articleA.name.localeCompare(articleB.name);
      }
      return NUMBERS.N_0;
    });
  }

  private getRecipePrice(): number {
    if (!this.recipe) {
      return NUMBERS.N_0;
    }
    return this.recipe.articleList.reduce((acc: number, articleList: ArticleList) => {
      const article = this.articles.find((a: Article) => a.id === articleList.articleId);
      return acc + (article ? (article.averagePrice * articleList.amount) : NUMBERS.N_0);
    }, NUMBERS.N_0);
  }
}
