import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NUMBERS } from '@shared/constants/number.constants';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { CartService } from '@shared/services/cart.service';
import { LoadingService } from '@shared/services/loading.service';
import { ModalService } from '@shared/services/modal.service';
import { maxLength, noSpecialChars, required } from '@shared/utils/validator.utils';

@Component({
  selector: 'app-add-list',
  templateUrl: './add-list.component.html',
  styleUrl: './add-list.component.scss'
})
export class AddListComponent {

  form = this.getForm();

  constructor(
    private cartService: CartService,
    private translate: TranslateService,
    private loadingService: LoadingService,
    private modalService: ModalService,

  ) { }

  handleSave(): void {
    if (this.form.valid) {

    }
  }

  handleCancel(): void {
    this.modalService.close();
  }

  private getForm() {
    return new FormGroup({
     name: new FormControl({ value: STRING_EMPTY, disabled: false}, this.getValidators(NUMBERS.N_100)),
     public: new FormControl({ value: false, disabled: false}),
     receipt: new FormControl({ value: false, disabled: false}),
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
