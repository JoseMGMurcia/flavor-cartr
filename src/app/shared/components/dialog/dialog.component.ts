import { Component, Input } from '@angular/core';
import { DialogButton, DialogOptions } from '@shared/models/modal.model';
import { ModalService } from '@shared/services/modal.service';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  @Input() options: DialogOptions = {}

  constructor( private modalService: ModalService) { }

  doAction(button: DialogButton) {
    button.action?.();
    button.preventClose || this.modalService.close();
  }
}
