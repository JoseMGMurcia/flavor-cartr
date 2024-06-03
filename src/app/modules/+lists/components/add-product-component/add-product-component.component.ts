import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CartOption } from '@shared/components/select/select.component';
import { NUMBERS } from '@shared/constants/number.constants';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { Article, Category } from '@shared/models/cart.models';
import { ModalDataGet } from '@shared/models/modal.model';
import { CartService } from '@shared/services/cart.service';
import { LoadingService } from '@shared/services/loading.service';
import { ModalService } from '@shared/services/modal.service';
import { StatusService } from '@shared/services/status.service';
import { stringFrom } from '@shared/utils/string.utils';
import { maxLength, noSpecialChars, required } from '@shared/utils/validator.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { TOAST_STATE, ToastService } from '@shared/services/toast.service';

@Component({
  selector: 'app-add-product-component',
  templateUrl: './add-product-component.component.html',
  styleUrl: './add-product-component.component.scss'
})
export class AddProductComponentComponent extends ModalDataGet implements OnInit {

  form = this.getForm();
  articleOptions: CartOption[] = [];
  categoryOptions: CartOption[] = [];
  addingCategory: boolean = false;
  addingArticle: boolean = false;
  publicMode: boolean = false;

  get disableSavingButton(): boolean {
    const categoryKO = (!this.addingCategory && !this.form.get('category')?.value) || (this.addingCategory && !this.form.valid);
    const articleKO = (!this.addingArticle && !this._selectedArticleId) || (this.addingArticle && !this.form.valid);

    return articleKO || categoryKO;
  }

  private _articles: Article[] = [];
  private _categories: Category[] = [];
  private _selectedArticleId: string = STRING_EMPTY;
  private _selectedCategoryId: string = STRING_EMPTY;
  private _destroyRef = inject(DestroyRef);


  constructor(
    private modalService: ModalService,
    private statusService: StatusService,
    private translate: TranslateService,
    private cartService: CartService,
    private loading: LoadingService,
    private toast: ToastService,

  ) {
    super();
  }

  ngOnInit(): void {
    if (this.data) {
      this.publicMode = !!this.data['publicMode'];
      this._articles = this.data['articles'] ? [...this.data['articles']] : [];
      this._categories = this.data['categories'] ? [...this.data['categories']] : [];
      if (!this._categories.length ) {
        return;
      }

      this.categoryOptions = this._categories.map((category: Category) => {
        return {
          value: category.id,
          label: category.name,
        };
      });
      this.form.get('category')?.setValue(this.categoryOptions[NUMBERS.N_0].value);
      this.changeCategory(this.categoryOptions[NUMBERS.N_0].value);
    }
  }

  changeCategory(id: string): void {
    this._selectedCategoryId = id;
    this.articleOptions = this._articles.filter((article: Article) => article.categories?.includes(id)).map((article: Article) => {
      return {
        value: article.id,
        label: article.name,
      };
    });
    this._selectedArticleId = !!this.articleOptions.length ? this.articleOptions[NUMBERS.N_0].value : STRING_EMPTY;
  }

  changeArticle(id: string): void {
    this._selectedArticleId = id;
  }

  handleAdd() {
    if(this.addingCategory) {
      this.addCategory();
      return;
    }

    if(this.addingArticle) {
      this.addArticle(this._selectedCategoryId);
      return;
    }

    this.statusService.setAddedArticle(this._selectedArticleId);
    this.modalService.close();
  }

  addCategory(): void {
    const newCategory: Category = {
      id: STRING_EMPTY,
      name: stringFrom(this.form.get('newCategory')?.value),
    };
    this.loading.show();
    this.cartService.postCategory(newCategory)
      .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => this.loading.hide()))
      .subscribe({
        next: (category) => {
          this._categories.push(category);
          this.statusService.setAddedCategory(category);

          if(this.addingArticle) {
            this.addArticle(category.id);
            return;
          }

          this.statusService.setAddedArticle(this._selectedArticleId);
          this.modalService.close();
        },
        error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.CREATE_CATEGORY_KO')),
      });
  }

  addArticle(categoryId: string): void {
    const values = this.form.getRawValue();
    const newArticle: Article = {
      id: STRING_EMPTY,
      name: stringFrom(values.newArticle),
      description: stringFrom(values.newDescription),
      brand: stringFrom(values.newArticleBrand),
      imageUrl: stringFrom(values.newArticleURL),
      averagePrice: NUMBERS.N_0,
      categories: [categoryId],
    };
    this.loading.show();
    this.cartService.postArticle(newArticle)
      .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => this.loading.hide()))
      .subscribe({
        next: (article) => {
          this._articles.push(article);
          this.statusService.setAddedArticle(article.id);
          this.modalService.close();
        },
        error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.CREATE_ARTICLE_KO')),
      });
  }

  handleCancel(): void {
    this.modalService.close();
  }

  handleAddCategory(): void {
    this.addingCategory = !this.addingCategory;
    if (this.addingCategory) {
      const max = NUMBERS.N_50;
      this.form.get('newCategory')?.setValue(STRING_EMPTY);
      this.form.get('newCategory')?.setValidators(this.getValidators(max));
    } else {
      this.form.get('newCategory')?.clearValidators();
    }
    this.form.get('newCategory')?.updateValueAndValidity();
  }

  handleAddArticle(): void {
    this.addingArticle = !this.addingArticle;
    if (this.addingArticle) {
      const max = NUMBERS.N_40;
      this.form.get('newArticle')?.setValue(STRING_EMPTY);
      this.form.get('newArticle')?.setValidators(this.getValidators(max));
      this.form.get('newArticleBrand')?.setValue(STRING_EMPTY);
      this.form.get('newArticleBrand')?.setValidators(this.getValidators(max));
      this.form.get('newDescription')?.setValue(STRING_EMPTY);
      this.form.get('newDescription')?.setValidators(this.getValidators(NUMBERS.N_200));
      this.form.get('newArticleURL')?.setValue(STRING_EMPTY);
      this.form.get('newArticleURL')?.setValidators(this.getValidators(NUMBERS.N_200, false));
    } else {
      this.form.get('newArticle')?.clearValidators();
      this.form.get('newArticleBrand')?.clearValidators();
      this.form.get('newDescription')?.clearValidators();
      this.form.get('newArticleURL')?.clearValidators();
    }
    this.form.get('newArticle')?.updateValueAndValidity();
    this.form.get('newArticleBrand')?.updateValueAndValidity();
    this.form.get('newDescription')?.updateValueAndValidity();
    this.form.get('newArticleURL')?.updateValueAndValidity();
  }

  private getForm() {
    return new FormGroup({
      category: new FormControl({ value: STRING_EMPTY, disabled: false}),
      newCategory: new FormControl({ value: STRING_EMPTY, disabled: false}),
      article: new FormControl({ value: STRING_EMPTY, disabled: false}),
      newArticle: new FormControl({ value: STRING_EMPTY, disabled: false}),
      newArticleBrand: new FormControl({ value: STRING_EMPTY, disabled: false}),
      newDescription: new FormControl({ value: STRING_EMPTY, disabled: false}),
      newArticleURL: new FormControl({ value: STRING_EMPTY, disabled: false}),
    });
  }

  private getValidators(max: number, isRequired = true) {
    const literals = this.translate.instant('VALIDATORS');
    const validators = isRequired ? [required(literals.REQUIRED)] : [];
    return [
      ...validators,
      maxLength(this.translate.instant('VALIDATORS.MAX_LENGTH', { max }), max),
      noSpecialChars(literals.SPECIAL_CHARS),
    ];
  }
}
