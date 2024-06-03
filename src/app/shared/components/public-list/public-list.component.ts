import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AddProductComponentComponent } from '@modules/+lists/components/add-product-component/add-product-component.component';
import { TransformListToRecipeComponent } from '@modules/+lists/components/transform-list-to-recipe/transform-list-to-recipe.component';
import { TranslateService } from '@ngx-translate/core';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { Article, ArticleList, Category, List } from '@shared/models/cart.models';
import { DEFAULT_MODAL_OPTIONS } from '@shared/models/modal.model';
import { TableAlingEnum, TableColumnTypeEnum, TableConfig, TableRow } from '@shared/models/table.models';
import { CartService } from '@shared/services/cart.service';
import { LoadingService } from '@shared/services/loading.service';
import { ModalService } from '@shared/services/modal.service';
import { StatusService } from '@shared/services/status.service';
import { TOAST_STATE, ToastService } from '@shared/services/toast.service';
import { stringFrom } from '@shared/utils/string.utils';
import { ArticleDetailComponent } from '../article-detail/article-detail.component';
import { NUMBERS } from '@shared/constants/number.constants';
import { IconEmum } from '@shared/models/icon.models';
import { formatPrice, getCategory } from '@shared/utils/cart.utils';
import { finalize } from 'rxjs';
import { PdfContainerComponent } from '@modules/+lists/components/pdf-container/pdf-container.component';

@Component({
  selector: 'app-public-list',
  templateUrl: './public-list.component.html',
  styleUrl: './public-list.component.scss'
})
export class PublicListComponent implements OnInit {

  @Input({required: true}) articles!: Article[];
  @Input({required: true}) categories!: Category[];
  @Input({required: true}) list!: List | undefined;

  tableData: TableRow[] = [];
  tableConfig: TableConfig = this.getTableConfig();

  private _destroyRef = inject(DestroyRef);

  constructor(
    private translate: TranslateService,
    private statusService: StatusService,
    private modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.assingEvents();
    this.updatetable();
  }

  public updatetable(): void{
    if (!this.list) {
      return;
    }
    this.list.totalPrice = this.getListPrice();
    this.tableData = this.list.articleList.map((articleList: ArticleList) => this.getTableRow(articleList));
    this.tableConfig = this.getTableConfig();
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
            amount: NUMBERS.N_1,
            unit: STRING_EMPTY, //TODO: Add unit
            isActive: true,
          };
          this.list?.articleList.push(articleList);
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

  handleAddArticle(): void {
    this.modalService.open(AddProductComponentComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { articles: this.articles, categories: this.categories, publicMode: true },
      prevenCloseOutside: true,
    });
  }

  handleDetail(row: TableRow): void {
    const article = this.articles.find((a: Article) => a.id === row.id);
    this.modalService.open(ArticleDetailComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { article, categories: this.categories, publicMode: true },
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
      style: articleList.isActive ? STRING_EMPTY : 'text-decoration: line-through',
    };

  }

  getFormattedPrice(): string {
    return formatPrice(this.list?.totalPrice || NUMBERS.N_0);
  }

  getTableConfig(): TableConfig {
    const literals = this.translate.instant('LISTS.HEADERS');
    return {
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

  private inOutChart(row: TableRow): void {
    if (!this.list) {
      return;
    }
    row['style'] = row['style'] ? STRING_EMPTY : 'text-decoration: line-through';
    const articleList = this.list.articleList.find((articleList: ArticleList) => articleList.articleId === row.id);
    if (articleList) {
      articleList.isActive = !articleList.isActive;
      this.updatetable();
    }
  }

  private alterAmount(row: TableRow, amount: number): void {
    if (!this.list || amount < NUMBERS.N_1) {
      return;
    }
    const articleList = this.list.articleList.find((articleList: ArticleList) => articleList.articleId === row.id);
    if (articleList) {
      articleList.amount = amount > NUMBERS.N_0 ? amount : NUMBERS.N_1;
      this.updatetable();
    }
  }

  private removeArticleFromList(row: TableRow): void {
    if (!this.list) {
      return;
    }
    this.list.articleList = this.list.articleList.filter((articleList: ArticleList) => articleList.articleId !== row.id);
    this.updatetable();
  }

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
