import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { CartOption } from '@shared/components/select/select.component';
import { NUMBERS } from '@shared/constants/number.constants';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { List, Recipe } from '@shared/models/cart.models';
import { ModalDataGet } from '@shared/models/modal.model';
import { CartService } from '@shared/services/cart.service';
import { LoadingService } from '@shared/services/loading.service';
import { ModalService } from '@shared/services/modal.service';
import { StatusService } from '@shared/services/status.service';
import { TOAST_STATE, ToastService } from '@shared/services/toast.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-import-recipe',
  templateUrl: './import-recipe.component.html',
  styleUrl: './import-recipe.component.scss'
})
export class ImportRecipeComponent extends ModalDataGet implements OnInit {
  recipesOptions: CartOption[] = [];
  selectedRecipeId = STRING_EMPTY;
  control = new FormControl();

  private _destroyRef = inject(DestroyRef);
  private _userId = STRING_EMPTY;
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

  handleRecipeChange(recipeId: string): void {
    this.selectedRecipeId = recipeId;
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
    if(!this._list) return;
    this.cartService.putAddRecipeToList(this.selectedRecipeId, this._list)
    .pipe(
      takeUntilDestroyed(this._destroyRef),
      finalize(() => {
        this.loadingService.hide();
        this.modalService.close();
      })
    )
    .subscribe({
      next: () => {
        this.toastService.showToast(TOAST_STATE.SUCCESS, this.translate.instant('TOAST.ADD_RECIPE_ARTICLES'));
        this.statusService.setReloadListsPending(true);
      },
      error: () => this.toastService.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.ADD_RECIPE_ARTICLES_KO')),
    });
  }

  private fetch(): void {
    if (this.data && this.data['userId']) {
      this._userId = this.data['userId'];
    }

    if (this.data && this.data['list']) {
      this._list = this.data['list'];
    }

    this.loadingService.show();
    this.cartService.getRecipesByUser(this._userId)
    .pipe(
      takeUntilDestroyed(this._destroyRef),
      finalize(() => this.loadingService.hide())
    )
    .subscribe({
      next: (response: Recipe[]) => {
        if (!response || response.length === NUMBERS.N_0) {
          this.toastService.showToast(TOAST_STATE.SUCCESS, this.translate.instant('TOAST.NO_RECIPES'));
          this.modalService.close();
          return;
        }
        this.recipesOptions = response.map((recipe: Recipe) => ({ label: recipe.name, value: recipe.id }));
        this.selectedRecipeId = this.recipesOptions[NUMBERS.N_0].value;
        this.toastService.showToast(TOAST_STATE.SUCCESS, this.translate.instant('TOAST.GET_LISTS_KO'));
      },
      error: () => this.toastService.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.GET_RECIPES_KO')),
    });
  }
}
