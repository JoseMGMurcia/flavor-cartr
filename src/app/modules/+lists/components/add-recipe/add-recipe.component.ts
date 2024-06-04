import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NUMBERS } from '@shared/constants/number.constants';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { Recipe, RECIPE_DESCRIPTION_MAX_LENGTH } from '@shared/models/cart.models';
import { ModalDataGet } from '@shared/models/modal.model';
import { CartService } from '@shared/services/cart.service';
import { LoadingService } from '@shared/services/loading.service';
import { ModalService } from '@shared/services/modal.service';
import { StatusService } from '@shared/services/status.service';
import { TOAST_STATE, ToastService } from '@shared/services/toast.service';
import { getNewRecipe } from '@shared/utils/cart.utils';
import { stringFrom } from '@shared/utils/string.utils';
import { maxLength, noSpecialChars, required } from '@shared/utils/validator.utils';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrl: './add-recipe.component.scss'
})
export class AddRecipeComponent extends ModalDataGet implements OnInit {

  form = this.getForm();
  edditMode = false;
  private _userId = STRING_EMPTY;
  private _destroyRef = inject(DestroyRef);

  constructor(
    private cartService: CartService,
    private translate: TranslateService,
    private loadingService: LoadingService,
    private modalService: ModalService,
    private toastService: ToastService,
    private statusService: StatusService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.fetch();
  }

  handleSave(): void {
    if (this.edditMode) {
      this.editlist();
      return;
    }
    this.savelist();
  }

  handleCancel(): void {
    this.modalService.close();
  }

  private getList(initialList: Recipe): Recipe {
    const values = this.form.getRawValue();
    return {
      ...initialList,
      name: stringFrom(values.name),
      description: stringFrom(values.description),
    };
  }

  private editlist(): void {
    if (!this.data || !this.data['recipe']) {
      return;
    }
    const recipe = this.getList(this.data['recipe']);
    this.loadingService.show();
    this.cartService.putRecipe(recipe)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        finalize(() => {
          this.loadingService.hide();
          this.modalService.close();
        })
      )
      .subscribe({
        next: () => {
          this.statusService.setReloadListsPending(true)
          this.toastService.showToast(TOAST_STATE.SUCCESS, this.translate.instant('TOAST.EDIT_RECIPE_OK'));
        },
        error: () => this.toastService.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.EDIT_RECIPE_KO')),
      });
  }

  private savelist(): void {
    const recipe = this.getList(getNewRecipe(this.translate, this._userId));
    this.loadingService.show();

    this.cartService.postRecipe(recipe)
      .pipe(
        takeUntilDestroyed(this._destroyRef),
        finalize(() => {
          this.loadingService.hide();
          this.modalService.close();
        })
      )
      .subscribe({
        next: () => {
          this.statusService.setReloadListsPending(true)
          this.toastService.showToast(TOAST_STATE.SUCCESS, this.translate.instant('TOAST.CREATE_LIST_OK'));
          this.modalService.close();
        },
        error: () => this.toastService.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.CREATE_LIST_KO')),
      });
  }

  private fetch(): void {
    if (this.data) {
      this._userId = this.data['userId'];
    }

    if (this.data && this.data['recipe']) {
      this.edditMode = true;
      this.form.patchValue({
        name: this.data['recipe'].name,
        description: this.data['recipe'].description,
      });
    }
  }

  private getForm() {
    return new FormGroup({
     name: new FormControl({ value: STRING_EMPTY, disabled: false}, this.getValidators(NUMBERS.N_100)),
     description: new FormControl({ value: STRING_EMPTY, disabled: false}, this.getValidators(RECIPE_DESCRIPTION_MAX_LENGTH)),
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
