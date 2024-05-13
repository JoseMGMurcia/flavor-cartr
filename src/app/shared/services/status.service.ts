import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusService {

  public get reloadListsPending$(): BehaviorSubject<boolean> { return this.reloadListsPending; }
  private reloadListsPending: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public setReloadListsPending(value: boolean): void {
    this.reloadListsPending.next(value);
  }
}
