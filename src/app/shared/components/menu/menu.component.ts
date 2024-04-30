import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '@shared/constants/routes.constants';
import { ModalOptions } from '@shared/models/modal.model';
import { ModalService } from '@shared/services/modal.service';
import { SocialService } from '@shared/services/social.service';
import { LoggerComponent } from '../logger/logger.component';
import { User } from '@shared/models/cart.models';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { CartService } from '@shared/services/cart.service';
import { LoadingService } from '@shared/services/loading.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';

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
    ) { }

  ngOnInit() {
    this.authService.authState
    .pipe(takeUntilDestroyed(this._destroyRef))
    .subscribe({
      next: (user) => this.handleGoogleResponse(user),
      error: (err) => {
        console.error('ERROR', err);
        this.loading.hide();
      },
    });
  }

  handleGoogleResponse(socialUser: SocialUser): void {
    this.loading.show();
    this.socialUser = socialUser;
    this.socialService.setSocialUser(socialUser);
    this.user = {
      id: socialUser.name,
      name: socialUser?.firstName,
      surname: socialUser?.lastName,
      email: socialUser?.email,
      nickname: `@${socialUser?.name}`,
      password: STRING_EMPTY,
    };
    this.socialService.setUser(this.user);
    this.cartService.setToken(socialUser.idToken);
    this.cartService.verifyUser(socialUser.email)
      .pipe(takeUntilDestroyed(this._destroyRef),
        finalize(() => this.loading.hide()))
      .subscribe((res) => {
        console.log('VERIFICATION RESPONSE', res);
      });

    // if we are in forbidden or unknow page, we redirect to home
    if (this.router.url === `/${ROUTES.FORBIDDEN.path}` || this.router.url === `/${ROUTES.UNKNOW.path}`) {
      this.router.navigate([ROUTES.HOME.path]);
    }
  }

  logIn(): void {
    const options: ModalOptions = {
      animations: {
        modal: {
          enter: 'enter-scaling 0.4s',
        },
      },
        };
    this.modalService.open(LoggerComponent, options);
  }

  goSection(section: string) {
    this.router.navigate([section], section === ROUTES.USER.path ? { state: { user: this.user } } : {});
  }

  signOut(): void {
    this.socialService.signOut(this.authService);
    this.user = undefined as unknown as User;
  }

}
