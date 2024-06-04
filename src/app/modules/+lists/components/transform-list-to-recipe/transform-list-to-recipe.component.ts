import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { List, RECIPE_DESCRIPTION_MAX_LENGTH } from '@shared/models/cart.models';
import { ModalDataGet } from '@shared/models/modal.model';
import { CartService } from '@shared/services/cart.service';
import { LoadingService } from '@shared/services/loading.service';
import { ModalService } from '@shared/services/modal.service';
import { StatusService } from '@shared/services/status.service';
import { TOAST_STATE, ToastService } from '@shared/services/toast.service';
import { stringFrom } from '@shared/utils/string.utils';
import { maxLength, noSpecialChars, required } from '@shared/utils/validator.utils';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-transform-list-to-recipe',
  templateUrl: './transform-list-to-recipe.component.html',
  styleUrl: './transform-list-to-recipe.component.scss'
})
export class TransformListToRecipeComponent extends ModalDataGet implements OnInit {
  form = this.getForm();

  private _destroyRef = inject(DestroyRef);
  private _list!: List;

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
    this.savelist();
  }

  handleCancel(): void {
    this.modalService.close();
  }

  private savelist(): void {
    if (!this._list) return;
    this.loadingService.show();
    const description = this.form.controls.description.value;

    this.cartService.postListToRecipe(this._list, stringFrom(description))
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
          this.toastService.showToast(TOAST_STATE.SUCCESS, this.translate.instant('TOAST.TRANSFOR_TO_RECIPE_OK'));
          this.modalService.close();
        },
        error: () => this.toastService.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.TRANSFOR_TO_RECIPE_KO')),
      });
  }

  private fetch(): void {
    if (this.data && this.data['list']) {
      this._list = this.data['list'];
    }
  }

  private getForm() {
    return new FormGroup({
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
