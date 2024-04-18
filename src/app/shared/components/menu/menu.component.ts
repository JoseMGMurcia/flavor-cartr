import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '@shared/constants/routes.constants';
import { ModalOptions } from '@shared/models/modal.model';
import { ModalService } from '@shared/services/modal.service';
import { SocialService } from '@shared/services/social.service';
import { LoggerComponent } from '../logger/logger.component';
import { User } from '@shared/models/cart.models';
import { STRING_EMPTY } from '@shared/constants/string.constants';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit{
  socialUser!: SocialUser;
  user!: User;

  ROUTES = ROUTES;

  constructor(
    private router: Router,
    private authService: SocialAuthService,
    private socialService: SocialService,
    private modalService: ModalService,
    ) { }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.socialUser = user;
      this.socialService.setSocialUser(user);
      this.user = {
        id: user.name,
        name: user?.firstName,
        surname: user?.lastName,
        email: user?.email,
        nickname: `@${user?.name}`,
        password: STRING_EMPTY,
      };
      this.socialService.setUser(this.user);

      // if we are in forbidden or unknow page, we redirect to home
      if (this.router.url === `/${ROUTES.FORBIDDEN.path}` || this.router.url === `/${ROUTES.UNKNOW.path}`) {
        this.router.navigate([ROUTES.HOME.path]);
      }
    });
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
