import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NUMBERS } from 'app/constants/number.constants';
import { STRING_EMPTY } from 'app/constants/string.constants';
import { List } from "app/models/cart.models";
import { ModalDataGet } from 'app/models/modal.model';
import { CartService } from 'app/services/cart.service';
import { LoadingService } from 'app/services/loading.service';
import { ModalService } from 'app/services/modal.service';
import { StatusService } from 'app/services/status.service';
import { TOAST_STATE, ToastService } from 'app/services/toast.service';
import { getNewList } from 'app/utils/cart.utils';
import { stringFrom } from 'app/utils/string.utils';
import { maxLength, noSpecialChars, required } from 'app/utils/validator.utils';
import { finalize } from 'rxjs';
import { InputComponent } from 'app/components/input/input.component';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrl: './add-list.component.scss',
  standalone: true,
  imports: [
    TranslateModule,
    InputComponent,
    ReactiveFormsModule,
  ]
})
export class AddListComponent extends ModalDataGet implements OnInit{

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

  private getList(initialList: List): List {
    const values = this.form.getRawValue();
    return {
      ...initialList,
      name: stringFrom(values.name),
      isPublic: !!values.public,
    };
  }

  private editlist(): void {
    if (!this.data || !this.data['list']) {
      return;
    }
    const list = this.getList(this.data['list']);
    this.loadingService.show();
    this.cartService.putList(list)
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
          this.toastService.showToast(TOAST_STATE.SUCCESS, this.translate.instant('TOAST.EDIT_LIST_OK'));
        },
        error: () => this.toastService.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.EDIT_LIST_KO')),
      });
  }

  private savelist(): void {
    const list = this.getList(getNewList(this.translate, this._userId));
    this.loadingService.show();

    this.cartService.postList(list)
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
          this.toastService.showToast(TOAST_STATE.SUCCESS, this.translate.instant('TOAST.CREATE_RECIPE_OK'));
          this.modalService.close();
        },
        error: () => this.toastService.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.CREATE_RECIPE_KO')),
      });
  }

  private fetch(): void {
    if (this.data) {
      this._userId = this.data['userId'];
    }

    if (this.data && this.data['list']) {
      this.edditMode = true;
      this.form.patchValue({
        name: this.data['list'].name,
        public: this.data['list'].isPublic,
      });
    }
  }

  private getForm() {
    return new FormGroup({
     name: new FormControl({ value: STRING_EMPTY, disabled: false}, this.getValidators(NUMBERS.N_100)),
     public: new FormControl({ value: false, disabled: false}),
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
