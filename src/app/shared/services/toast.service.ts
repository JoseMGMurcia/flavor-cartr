import { Injectable } from '@angular/core';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { BehaviorSubject } from 'rxjs';

// Add this constant ⤵
export const TOAST_STATE = {
  SUCCESS: 'success-toast',
  WARNING: 'warning-toast',
  ERROR: 'error-toast'
};

@Injectable({
  providedIn: 'root'
})

export class ToastService {
  // The boolean that drives the toast's 'open' vs. 'close' behavior
  public showsToast$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  // The message string that'll bind and display on the toast.
  public toastMessage$: BehaviorSubject<string> = new BehaviorSubject<string>(STRING_EMPTY);

  // The state that will add a style class to the component.
  public toastState$: BehaviorSubject<string> = new BehaviorSubject<string>(TOAST_STATE.SUCCESS);

  constructor() { }

  // Update the toastState, toastMessage, and showsToast behavioursubjects
  showToast(toastState: string, toastMsg: string): void {
    this.toastState$.next(toastState);
    this.toastMessage$.next(toastMsg);
    this.showsToast$.next(true);
  }

  // This updates the showsToast behavioursubject to 'false'
  dismissToast(): void {
    this.showsToast$.next(false);
  }
}
