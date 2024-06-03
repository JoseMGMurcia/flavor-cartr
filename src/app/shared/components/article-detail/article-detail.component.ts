import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NUMBERS } from '@shared/constants/number.constants';
import { EURO_SYMBOL, STRING_EMPTY } from '@shared/constants/string.constants';
import { Article, Category, Price } from '@shared/models/cart.models';
import { ModalDataGet } from '@shared/models/modal.model';
import { TableAlingEnum, TableColumnTypeEnum, TableConfig, TableRow } from '@shared/models/table.models';
import { CartService } from '@shared/services/cart.service';
import { LoadingService } from '@shared/services/loading.service';
import { ModalService } from '@shared/services/modal.service';
import { formatPrice } from '@shared/utils/cart.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { TOAST_STATE, ToastService } from '@shared/services/toast.service';
import { stringFrom } from '@shared/utils/string.utils';
import { maxLength, noSpecialChars, required } from '@shared/utils/validator.utils';
import { StatusService } from '@shared/services/status.service';
import { IconEmum } from '@shared/models/icon.models';

const TABS = {
  PRICES: NUMBERS.N_1,
  CATEGORIES : NUMBERS.N_2,
};

@Component({
  selector: 'app-article-detail',
  templateUrl: './article-detail.component.html',
  styleUrl: './article-detail.component.scss'
})
export class ArticleDetailComponent extends ModalDataGet implements OnInit{

  form = this.getForm();
  priceForm = this.getPricesForm();
  article!: Article;
  categories!: Category[];
  edditMode = false;
  addPriceMode = false;
  currentTab = TABS.PRICES;
  publicMode: boolean = false;

  pricesTableData: TableRow[] = [];
  categoriesTableData: TableRow[] = [];
  pricesTableConfig: TableConfig = this.getPricesTableConfig();
  categoriesTableConfig: TableConfig = this.getCategoriesTableConfig();

  private prices: Price[] = [];
  private _destroyRef = inject(DestroyRef);

  constructor(
    private loading: LoadingService,
    private modalService: ModalService,
    private translate: TranslateService,
    private cartService: CartService,
    private toast: ToastService,
    private statusService: StatusService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetch();
  }

  handleSave(): void {
    this.edditMode = false;
    const values = this.form.getRawValue();
    this.article.name = stringFrom(values.name);
    this.article.description = stringFrom(values.description);
    this.article.imageUrl = stringFrom(values.imageUrl);
    this.article.brand = stringFrom(values.brand);
    this.save(this.article);
  }

  save(article: Article): void{
    this.loading.show();
    this.cartService.putArticle(article)
      .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => this.loading.hide()))
      .subscribe({
        next: (article) => {
          this.article = article;
          this.toast.showToast(TOAST_STATE.SUCCESS, this.translate.instant('TOAST.EDIT_ARTICLE_OK'));
          this.statusService.setReloadListsPending(true);
        },
        error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.EDIT_ARTICLE_KO')),
      });
  }

  handleSavePrice(): void {
    const values = this.priceForm.getRawValue();
    const price: Price = {
      id: STRING_EMPTY,
      articleId: this.article.id,
      priceDate: STRING_EMPTY,
      cost: Number(values.cost),
      currency: stringFrom(values.currency),
      shop: stringFrom(values.shop),
    }
    this.loading.show();
    this.cartService.postPrice(price)
      .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => this.loading.hide()))
      .subscribe({
        next: (price) => {
          this.toast.showToast(TOAST_STATE.SUCCESS, this.translate.instant('TOAST.PRICE_OK'));
          this.prices?.push(price);
          this.updateTable()
          this.recalculateAveragePrice();
          this.addPriceMode = false;
          this.statusService.setReloadListsPending(true);
        },
        error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.PRICE_KO')),
      });
  }

  handleEdit(): void {
    this.edditMode = !this.edditMode;
  }

  handleCancel(): void {
    this.modalService.close();
  }

  handleAddPrice(): void {
    this.addPriceMode = !this.addPriceMode;
  }

  setTab(tab: number): void {
    this.currentTab = tab;
  }

  getCategoryName(): string {
    if(!this.article) return STRING_EMPTY;
    const articleCategoriesNames = this.article.categories?.map(categoryId => this.getCategoryNameById(categoryId));
    return articleCategoriesNames?.join(', ') || STRING_EMPTY;
  }

  getFormattedPrice(price: number): string {
    return formatPrice(price);
  }

  private recalculateAveragePrice(): void {
    this.article.averagePrice = this.prices.reduce((acc, price) => acc + price.cost, NUMBERS.N_0) / this.prices.length;
  }

  private getCategoryNameById(categoryId: string): string {
    return this.categories.find(category => category.id === categoryId)?.name || STRING_EMPTY;
  }


  private getForm() {
    return new FormGroup({
      name: new FormControl({ value: STRING_EMPTY, disabled: false }),
      description: new FormControl({ value: STRING_EMPTY, disabled: false }),
      imageUrl: new FormControl({ value: STRING_EMPTY, disabled: false }),
      brand: new FormControl({ value: STRING_EMPTY, disabled: false }),
    });
  }

  private getPricesForm() {
    const literals = this.translate.instant('VALIDATORS');
    const max = NUMBERS.N_50;
    return new FormGroup({
      cost: new FormControl({ value: STRING_EMPTY, disabled: false}, [required(literals.REQUIRED)]),
      currency: new FormControl({ value: EURO_SYMBOL, disabled: true }),
      shop: new FormControl(STRING_EMPTY, [
        required(literals.REQUIRED),
        maxLength(this.translate.instant('VALIDATORS.MAX_LENGTH', { max }), max),
        noSpecialChars(literals.SPECIAL_CHARS),
      ]),
    });
  }

  private fetch(){
    if(!this.data) return;
    this.article = this.data['article'];
    this.publicMode = !!this.data['publicMode'];
    this.categories = this.data['categories'];
    this.form.patchValue(this.article);
    this.getArticlePrices();
    this.loadCategoriesTableData();
  }

  private loadCategoriesTableData(): void {
    this.categoriesTableData = this.categories.map(category => ({
      ...category,
      style: this.article.categories?.includes(category.id) ? 'font-weight: bold;' : STRING_EMPTY,
      class: this.publicMode ? 'disabled' : '',
    }));
    this.categoriesTableConfig = this.getCategoriesTableConfig();
  }

  private getArticlePrices(): void {
    this.loading.show();
    this.cartService.getPricesByArticle(this.article.id)
      .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => this.loading.hide()))
      .subscribe({
        next: (prices) => {
          this.prices = prices;
          this.pricesTableData = prices?.map(price => ({
            ...price,
            price: `${price.cost} ${price.currency}`
          })) || [];
          this.pricesTableConfig = this.getPricesTableConfig();
        },
        error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.PRICES_KO')),
    });
  }

  private updateTable(): void {
    this.pricesTableData = this.prices.map(price => ({...price, price: `${price.cost} ${price.currency}`}));
    this.pricesTableConfig = this.getPricesTableConfig();
  }

  private getPricesTableConfig(): TableConfig {
    const literals = this.translate.instant('ARTICLE');
    return {
      columns: [
        {
          key: 'priceDate',
          label: literals.DATE,
          type: TableColumnTypeEnum.TEXT,
        },
        {
          key: 'shop',
          label: literals.SHOP,
          type: TableColumnTypeEnum.TEXT,
        },
        {
          key: 'price',
          label: literals.PRICE,
          type: TableColumnTypeEnum.NUMBER,
          aling: TableAlingEnum.CENTER,
        },
      ],
      pagination: {
        actualPage: this.pricesTableConfig ? this.pricesTableConfig.pagination.actualPage : NUMBERS.N_1,
        itemsPerPage: this.pricesTableConfig ? this.pricesTableConfig.pagination.itemsPerPage : NUMBERS.N_10,
        totalItems: this.pricesTableData.length,
      }
    };
  }

  private addCategory(row: TableRow): void{
    if(this.article.categories?.includes(row['id'])) return;
    row['style'] = 'font-weight: bold;';
    this.article.categories?.push(row['id']);
    this.save(this.article);
    this.statusService.setReloadListsPending(true);
  }

  private removeCategory(row: TableRow): void{
    // If we are trying to remove the last category, we show a toast and interrupt the process
    if(this.article.categories?.length === NUMBERS.N_1) {
      this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.REMOVE_LAST_CATEGORY'));
      return;
    };

    // If the category is not in the article, we interrupt the process
    if(!this.article.categories?.includes(row['id'])) {
      this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.REMOVE_UNSELECTED_CATEGORY'));
      return
    };


    row['style'] = STRING_EMPTY;
    this.article.categories = this.article.categories?.filter(categoryId => categoryId !== row['id']);
    this.save(this.article);
    this.statusService.setReloadListsPending(true);

  }

  private getCategoriesTableConfig(): TableConfig {
    return {
      columns: [
        {
          key: 'name',
          label: this.translate.instant('NAME'),
          type: TableColumnTypeEnum.TEXT,
        },
        {
          key: 'detail',
          label: this.translate.instant('ADD'),
          type: TableColumnTypeEnum.ACTIONS,
          action: (row: TableRow) => this.addCategory(row),
          actionIcon: IconEmum.PLUS,
          aling: TableAlingEnum.CENTER,
        },
        {
          key: 'detail',
          label: this.translate.instant('REMOVE'),
          type: TableColumnTypeEnum.ACTIONS,
          action: (row: TableRow) => this.removeCategory(row),
          actionIcon: IconEmum.TRASH,
        },

      ],
      pagination: {
        actualPage: this.categoriesTableConfig ? this.categoriesTableConfig.pagination.actualPage : NUMBERS.N_1,
        itemsPerPage: this.categoriesTableConfig ? this.categoriesTableConfig.pagination.itemsPerPage : NUMBERS.N_10,
        totalItems: this.categoriesTableData.length,
      }
    };
  }

  isImageURL(url: string | undefined): boolean {
    if(!url) return false;
    const hasPrefix = url.startsWith('http');
    const hasExtension = url.endsWith('.jpg') || url.endsWith('.png');
    const hasSize = url.length < NUMBERS.N_200 && url.length > NUMBERS.N_10;
    return hasPrefix && hasExtension && hasSize;
  }

}
