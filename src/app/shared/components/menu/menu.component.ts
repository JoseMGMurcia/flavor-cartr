import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '@shared/constants/routes.constants';
import { DEFAULT_MODAL_OPTIONS, ModalOptions } from '@shared/models/modal.model';
import { ModalService } from '@shared/services/modal.service';
import { SocialService } from '@shared/services/social.service';
import { LoggerComponent } from '../logger/logger.component';
import { TokenUser, User } from '@shared/models/cart.models';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { CartService } from '@shared/services/cart.service';
import { LoadingService } from '@shared/services/loading.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { TOAST_STATE, ToastService } from '@shared/services/toast.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit{
  socialUser!: SocialUser;
  user!: User;

  ROUTES = ROUTES;

  private _destroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private authService: SocialAuthService,
    private socialService: SocialService,
    private modalService: ModalService,
    private cartService: CartService,
    private loading: LoadingService,
    private toast: ToastService,
    private translate: TranslateService,
    ) { }

  ngOnInit() {
    this.authService.authState
    .pipe(takeUntilDestroyed(this._destroyRef),
      finalize(() => this.loading.hide()))
    .subscribe({
      next: (user) => this.handleGoogleResponse(user),
      error: (err) => {
        console.error('ERROR', err);
      },
    });
  }

  handleGoogleResponse(socialUser: SocialUser): void {
    this.loading.show();
    this.socialUser = socialUser;
    this.socialService.setSocialUser(socialUser);
    this.cartService.setToken(socialUser.idToken);
    this.user = {
      id: STRING_EMPTY,
      email: socialUser.email,
      name: socialUser.firstName,
      surname: socialUser.lastName,
      password: STRING_EMPTY,
      nickname: socialUser.name,
    };

    this.socialService.setUser(this.user);
    console.log('Social User', socialUser);

    this.cartService.getUserByEmail(socialUser.email)
      .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => this.loading.hide()))
      .subscribe({
        next: (tokenUser: TokenUser) => this.handleUserResponse(tokenUser),
        error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.USER_TOKEN')),
      });

    // if we are in forbidden or unknow page, we redirect to home
    if (this.router.url === `/${ROUTES.FORBIDDEN.path}` || this.router.url === `/${ROUTES.UNKNOW.path}`) {
      this.router.navigate([ROUTES.HOME.path]);
    }
  }

  handleUserResponse(user: TokenUser): void {
    //TODO: handle user response
  }

  logIn(): void {
    this.modalService.open(LoggerComponent, DEFAULT_MODAL_OPTIONS);
  }

  goSection(section: string) {
    this.router.navigate([section], section === ROUTES.USER.path ? { state: { user: this.user } } : {});
  }

  signOut(): void {
    this.socialService.signOut(this.authService);
    this.user = undefined as unknown as User;
  }

}
