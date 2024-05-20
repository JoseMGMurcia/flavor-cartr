import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CartOption } from '@shared/components/select/select.component';
import { NUMBERS } from '@shared/constants/number.constants';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { Article, Category } from '@shared/models/cart.models';
import { ModalDataGet } from '@shared/models/modal.model';
import { ModalService } from '@shared/services/modal.service';
import { StatusService } from '@shared/services/status.service';
import { maxLength, noSpecialChars, required } from '@shared/utils/validator.utils';

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
  private _articles: Article[] = [];
  private _categories: Category[] = [];
  private _selectedArticleId: string = STRING_EMPTY;

  get disableSavingButton(): boolean {
    return !!this.form.get('category')?.value && !!this._selectedArticleId;
  }

  constructor(
    private modalService: ModalService,
    private statusService: StatusService,
    private translate: TranslateService,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.data) {
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

  async handleAdd() {
    this.statusService.setAddedArticle(this._selectedArticleId);
    this.modalService.close();
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
    } else {
      this.form.get('newArticle')?.clearValidators();
      this.form.get('newArticleBrand')?.clearValidators();
      this.form.get('newDescription')?.clearValidators();
    }
    this.form.get('newArticle')?.updateValueAndValidity();
    this.form.get('newArticleBrand')?.updateValueAndValidity();
    this.form.get('newDescription')?.updateValueAndValidity();
  }

  private getForm() {
    return new FormGroup({
      category: new FormControl({ value: STRING_EMPTY, disabled: false}),
      newCategory: new FormControl({ value: STRING_EMPTY, disabled: false}),
      article: new FormControl({ value: STRING_EMPTY, disabled: false}),
      newArticle: new FormControl({ value: STRING_EMPTY, disabled: false}),
      newArticleBrand: new FormControl({ value: STRING_EMPTY, disabled: false}),
      newDescription: new FormControl({ value: STRING_EMPTY, disabled: false}),
    });
  }

  private getValidators(max: number) {
    const literals = this.translate.instant('VALIDATORS');
    return [
      required(literals.REQUIRED),
      maxLength(this.translate.instant('VALIDATORS.MAX_LENGTH', { max }), max),
      noSpecialChars(literals.SPECIAL_CHARS),
    ];
  }
}
