import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CartOption } from '@shared/components/select/select.component';
import { NUMBERS } from '@shared/constants/number.constants';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { Article, Category } from '@shared/models/cart.models';
import { ModalDataGet } from '@shared/models/modal.model';
import { ModalService } from '@shared/services/modal.service';
import { StatusService } from '@shared/services/status.service';

@Component({
  selector: 'app-add-product-component',
  templateUrl: './add-product-component.component.html',
  styleUrl: './add-product-component.component.scss'
})
export class AddProductComponentComponent extends ModalDataGet implements OnInit {

  form = this.getForm();
  articleOptions: CartOption[] = [];
  categoryOptions: CartOption[] = [];
  private _articles: Article[] = [];
  private _categories: Category[] = [];
  private _selectedArticleId: string = STRING_EMPTY;

  get bothSelected(): boolean {
    return !!this.form.get('category')?.value && !!this._selectedArticleId;
  }

  constructor(
    private modalService: ModalService,
    private statusService: StatusService,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.data) {
      this._articles = [...this.data['articles']];
      this._categories = [...this.data['categories']];

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

  private getForm() {
    return new FormGroup({
     category: new FormControl({ value: STRING_EMPTY, disabled: false}),
     article: new FormControl({ value: STRING_EMPTY, disabled: true}),
   });
 }
}
