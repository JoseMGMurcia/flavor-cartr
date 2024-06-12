import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CartService } from 'app/services/cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { User } from "app/models/cart.models";
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { isEmail, maxLength, noSpecialChars, required } from 'app/utils/validator.utils';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NUMBERS } from 'app/constants/number.constants';
import { STRING_EMPTY } from 'app/constants/string.constants';
import { SocialService } from 'app/services/social.service';
import { LoadingService } from 'app/services/loading.service';
import { finalize } from 'rxjs';
import { TOAST_STATE, ToastService } from 'app/services/toast.service';
import { getLanguageOption } from 'app/utils/cart.utils';
import { LanguageEnum } from 'app/models/language.models';
import { InputComponent } from 'app/components/input/input.component';
import { CartOption, SelectComponent } from 'app/components/select/select.component';

const imports = [
  TranslateModule,
  InputComponent,
  ReactiveFormsModule,
  SelectComponent,
];

@Component({
  selector: 'app-user-detail-component',
  templateUrl: './user-detail-component.component.html',
  styleUrl: './user-detail-component.component.scss',
  standalone: true,
  imports,
})

// This component is used to display the user details in a form
export class UserDetailComponentComponent implements OnInit {

  form = this.getForm();
  languageOptions: CartOption[] = getLanguageOption(this.translate);
  private _destroyRef = inject(DestroyRef);
  private _user!: User;
  private _selecteLanguage!: string;

  constructor(
    private cartService: CartService,
    private translate: TranslateService,
    private socialService: SocialService,
    private loadingService: LoadingService,
    private toast: ToastService,
  ) { }

  ngOnInit() {

    // If the user is logged in, we get the user details and set them in the form
    this.socialService.user$
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((user: User) => {
        this._user = user;
        this.form.patchValue(user);
        this._selecteLanguage = user.language ?? this.translate.currentLang;
      });
  }

  changeLanguaje(language: string) {
    this._selecteLanguage = language;
  }

  editionMode() {
    this.form.controls.nickname.enable();
    this.form.controls.language.enable();
  }

  // Save the user details ( ninckname and language )
  saveUser() {
    if (this.form.controls.nickname.valid) {
      this._user.nickname = this.form.controls.nickname.value!;
      this._user.language = this._selecteLanguage ?? LanguageEnum.SPANISH;
      this.socialService.setUser(this._user);
      this.form.controls.nickname.disable();
      this.form.controls.language.disable();
      this.loadingService.show();
      this.cartService.putUser(this._user)
        .pipe(takeUntilDestroyed(this._destroyRef),
          finalize(() => this.loadingService.hide()))
        .subscribe({
          next: () =>{
            this.toast.showToast(TOAST_STATE.SUCCESS, this.translate.instant('TOAST.SAVE_USER_OK'));
            this.translate.use(this._selecteLanguage);
          },
          error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.SAVE_USER_KO')),
        });
    }
  }

  private getForm() {
     return new FormGroup({
      name: new FormControl({ value: STRING_EMPTY, disabled: true}, this.getValidators(NUMBERS.N_30)),
      language: new FormControl({ value: STRING_EMPTY, disabled: true}),
      nickname: new FormControl({ value: STRING_EMPTY, disabled: true}, this.getValidators(NUMBERS.N_20)),
      email: new FormControl({ value: STRING_EMPTY, disabled: true}, this.getValidators(NUMBERS.N_80, true)),
    });
  }

  // This function is used to get the validators for the form
  private getValidators(max: number, includeMail = false) {
    const literals = this.translate.instant('VALIDATORS');
    return [
      required(literals.REQUIRED),
      maxLength(this.translate.instant('VALIDATORS.MAX_LENGTH', { max }), max),
      noSpecialChars(literals.SPECIAL_CHARS),
      ...(includeMail ? [isEmail(literals.IS_MAIL)] : []),
    ];
  }
}
