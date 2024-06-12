import { GoogleSigninButtonModule, SocialAuthService, SocialLoginModule } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { socialAuthServiceConfigProvider } from 'app/constants/social.constants';
import { ModalService } from 'app/services/modal.service';

@Component({
  standalone: true,
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrl: './logger.component.scss',
  imports: [
    SocialLoginModule,
    GoogleSigninButtonModule,
    TranslateModule
  ],
  providers: [
    socialAuthServiceConfigProvider,
    SocialAuthService,
  ]
})

// This component is used to display the login buttons
export class LoggerComponent implements OnInit{

  constructor(
    private authService: SocialAuthService,
    private modalService: ModalService,
  ) { }

  ngOnInit() {
    this.authService.authState.subscribe(() => {
      this.modalService.close();
    });
  }
}
