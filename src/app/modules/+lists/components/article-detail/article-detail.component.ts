import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NUMBERS } from '@shared/constants/number.constants';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { Article, Category } from '@shared/models/cart.models';
import { ModalDataGet } from '@shared/models/modal.model';
import { TableAlingEnum, TableColumnTypeEnum, TableConfig, TableRow } from '@shared/models/table.models';
import { CartService } from '@shared/services/cart.service';
import { LoadingService } from '@shared/services/loading.service';
import { ModalService } from '@shared/services/modal.service';
import { formatPrice } from '@shared/utils/cart.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { TOAST_STATE, ToastService } from '@shared/services/toast.service';

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

  tableData: TableRow[] = [];
  tableConfig: TableConfig = this.getTableConfig();

  private _destroyRef = inject(DestroyRef);

  constructor(
    private loading: LoadingService,
    private modalService: ModalService,
    private translate: TranslateService,
    private cartService: CartService,
    private toast: ToastService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetch();
  }

  handleSave(): void {
    this.edditMode = false;
    // if (this._edditMode) {
    //   this.editlist();
    //   return;
    // }
    // this.savelist();
  }

  handleEdit(): void {
    this.edditMode = true;
    this.form.enable();
  }

  handleCancel(): void {
    this.modalService.close();
  }

  handleAddPrice(): void {
    this.addPriceMode = !this.addPriceMode;
  }

  getCategoryName(): string {
    if(!this.article) return STRING_EMPTY;
    const articleCategoriesNames = this.article.categories?.map(categoryId => this.getCategoryNameById(categoryId));
    return articleCategoriesNames?.join(', ') || STRING_EMPTY;
  }

  getFormattedPrice(price: number): string {
    return formatPrice(price);
  }

  private getCategoryNameById(categoryId: string): string {
    return this.categories.find(category => category.id === categoryId)?.name || STRING_EMPTY;
  }


  private getForm() {
    return new FormGroup({
      name: new FormControl({ value: STRING_EMPTY, disabled: true }),
      description: new FormControl({ value: STRING_EMPTY, disabled: true }),
      imageUrl: new FormControl({ value: STRING_EMPTY, disabled: true }),
      brand: new FormControl({ value: STRING_EMPTY, disabled: true }),
    });
  }

  private getPricesForm() {
    return new FormGroup({
      cost: new FormControl(STRING_EMPTY),
      currency: new FormControl(STRING_EMPTY),
      shop: new FormControl(STRING_EMPTY),
    });
  }

  private fetch(){
    if(!this.data) return;
    this.article = this.data['article'];
    this.categories = this.data['categories'];
    console.log(this.article);
    this.form.patchValue(this.article);
    this.getArticlePrices();
  }

  getArticlePrices(): void {
    this.loading.show();
    this.cartService.getPricesByArticle(this.article.id)
      .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => this.loading.hide()))
      .subscribe({
        next: (prices) => {
          this.tableData = prices?.map(price => price) || [];
          this.tableConfig = this.getTableConfig();
        },
        error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.PRICES_KO')),
    });
  }

  getTableConfig(): TableConfig {
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
          key: 'cost',
          label: literals.PRICE,
          type: TableColumnTypeEnum.NUMBER,
          aling: TableAlingEnum.RIGHT,
        },
        {
          key: 'currency',
          label: literals.CURRENCY,
          type: TableColumnTypeEnum.TEXT,
        },

      ],
      pagination: {
        actualPage: NUMBERS.N_1,
        itemsPerPage: NUMBERS.N_10,
        totalItems: this.tableData.length,
      }
    };
  }

}
