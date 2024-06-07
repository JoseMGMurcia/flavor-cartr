import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DialogButton, DialogOptions } from 'app/models/modal.model';
import { ModalService } from 'app/services/modal.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [CommonModule],
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
