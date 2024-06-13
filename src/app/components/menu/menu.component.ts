import { GoogleSigninButtonModule, SocialAuthService, SocialLoginModule, SocialUser } from '@abacritt/angularx-social-login';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from "app/constants/routes.constants";
import { DEFAULT_MODAL_OPTIONS } from 'app/models/modal.model';
import { ModalService } from 'app/services/modal.service';
import { SocialService } from 'app/services/social.service';
import { LoggerComponent } from '../logger/logger.component';
import { User } from "app/models/cart.models";
import { STRING_EMPTY } from 'app/constants/string.constants';
import { CartService } from 'app/services/cart.service';
import { LoadingService } from 'app/services/loading.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { TOAST_STATE, ToastService } from 'app/services/toast.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { socialAuthServiceConfigProvider } from 'app/constants/social.constants';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  standalone: true,
  imports: [
    TranslateModule,
    GoogleSigninButtonModule,
  ],
  providers: [
    socialAuthServiceConfigProvider,
    SocialAuthService,
   ]
})

// This component is used to display the header menu
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
      error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.USER_TOKEN')),

    });
  }

  // Handles the response from google authentification ands sets the user
  handleGoogleResponse(socialUser: SocialUser): void {
    this.socialUser = socialUser;
    this.socialService.setSocialUser(socialUser);
    this.cartService.setToken(socialUser.idToken);

    this.cartService.getUserByEmail(socialUser.email)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe({
        next: (user: User) => this.handleUserResponse(user, socialUser),
        error: () => this.toast.showToast(TOAST_STATE.ERROR, this.translate.instant('TOAST.USER_TOKEN')),
      });

    // if we are in forbidden or unknow page, we redirect to home
    if (this.router.url === `/${ROUTES.FORBIDDEN.path}` || this.router.url === `/${ROUTES.UNKNOW.path}`) {
      this.router.navigate([ROUTES.HOME.path]);
    }
  }

  // Handles the user response and sets the user
  handleUserResponse(user: User, socialUser: SocialUser): void {
    this.user = {
      id: user.id,
      email: user.email,
      name: socialUser.name,
      language: user.language,
      nickname: user.nickname,
    };
    this.translate.use(user.language?.toLowerCase() ?? this.translate.getDefaultLang());
    this.socialService.setUser(this.user);
  }

  // Opens the login modal
  logIn(): void {
    this.modalService.open(LoggerComponent, DEFAULT_MODAL_OPTIONS);
  }

  // Navigates to the selected section
  goSection(section: string) {
    this.router.navigate([section], section === ROUTES.USER.path ? { state: { user: this.user } } : {});
  }

  // Signs out the user
  signOut(): void {
    this.cartService.setToken(STRING_EMPTY);
    this.socialService.signOut(this.authService);
    this.user = undefined as unknown as User;
  }

}
