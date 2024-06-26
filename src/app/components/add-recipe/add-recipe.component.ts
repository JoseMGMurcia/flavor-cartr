import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NUMBERS } from 'app/constants/number.constants';
import { STRING_EMPTY } from 'app/constants/string.constants';
import { Recipe, RECIPE_DESCRIPTION_MAX_LENGTH } from "app/models/cart.models";
import { ModalDataGet } from 'app/models/modal.model';
import { CartService } from 'app/services/cart.service';
import { LoadingService } from 'app/services/loading.service';
import { ModalService } from 'app/services/modal.service';
import { StatusService } from 'app/services/status.service';
import { TOAST_STATE, ToastService } from 'app/services/toast.service';
import { getNewRecipe } from 'app/utils/cart.utils';
import { stringFrom } from 'app/utils/string.utils';
import { maxLength, noSpecialChars, required } from 'app/utils/validator.utils';
import { finalize } from 'rxjs';
import { InputComponent } from 'app/components/input/input.component';

@Component({
  selector: 'app-add-recipe',
  templateUrl: './add-recipe.component.html',
  styleUrl: './add-recipe.component.scss',
  standalone: true,
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    InputComponent,
  ]
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

  // Get the list from the form
  private getList(initialList: Recipe): Recipe {
    const values = this.form.getRawValue();
    return {
      ...initialList,
      name: stringFrom(values.name),
      description: stringFrom(values.description),
    };
  }

  // Edit the list if it already exists in the database
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

  // Save the list in the database
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

  // Get the form with the validators
  private getForm() {
    return new FormGroup({
     name: new FormControl({ value: STRING_EMPTY, disabled: false}, this.getValidators(NUMBERS.N_100)),
     description: new FormControl({ value: STRING_EMPTY, disabled: false}, this.getValidators(RECIPE_DESCRIPTION_MAX_LENGTH)),
   });
 }

 // Get the validators for the form
 private getValidators(max: number) {
    const literals = this.translate.instant('VALIDATORS');
    return [
      required(literals.REQUIRED),
      maxLength(this.translate.instant('VALIDATORS.MAX_LENGTH', { max }), max),
      noSpecialChars(literals.SPECIAL_CHARS),
    ];
  }
}
