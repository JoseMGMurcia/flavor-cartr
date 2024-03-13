import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { ModalService } from '@shared/services/modal.service';

@Component({
  selector: 'app-logger',
  templateUrl: './logger.component.html',
  styleUrl: './logger.component.scss'
})
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
