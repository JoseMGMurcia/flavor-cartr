import { animate, state, style, transition, trigger } from '@angular/animations';
import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { STRING_EMPTY } from 'app/constants/string.constants';
import { ToastService } from 'app/services/toast.service';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
  ],
  animations: [
    trigger('toastTrigger', [ // This refers to the @trigger we created in the template
      state('open', style({ transform: 'translateY(0%)' })), // This is how the 'open' state is styled
      state('close', style({ transform: 'translateY(-450%)' })), // This is how the 'close' state is styled
      transition('open <=> close', [ // This is how they're expected to transition from one to the other
        animate('400ms ease-in-out')
      ])
    ])
  ]
})

export class ToastComponent {
  toastClass = ['toast-class'];
  toastMessage = STRING_EMPTY;
  showsToast = false;

  constructor(public toast: ToastService ) { }

  // This function is used to display the toast
  dismiss(): void {
    this.toast.dismissToast();
  }
}
