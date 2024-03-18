import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ROUTES } from '@shared/constants/routes.constants';
import { ModalOptions } from '@shared/models/modal.model';
import { ModalService } from '@shared/services/modal.service';
import { SocialService } from '@shared/services/social.service';
import { LoggerComponent } from '../logger/logger.component';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit{
  user!: SocialUser;

  ROUTES = ROUTES;

  constructor(
    private router: Router,
    private authService: SocialAuthService,
    private socialService: SocialService,
    private modalService: ModalService,
    ) { }

  ngOnInit() {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.socialService.setUser(user);
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
    this.router.navigate([section]);
  }

  signOut(): void {
    this.authService.signOut();
  }

}
