import { Injectable } from '@angular/core';
import { STRING_EMPTY } from '@shared/constants/string.constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusService {
  public get reloadListsPending$(): BehaviorSubject<boolean> { return this.reloadListsPending; }
  public get addedarticle$(): BehaviorSubject<string> { return this.addedarticle; }
  private reloadListsPending: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private addedarticle: BehaviorSubject<string> = new BehaviorSubject(STRING_EMPTY);

  public setAddedArticle(value: string): void {
    this.addedarticle.next(value);
  }

  public setReloadListsPending(value: boolean): void {
    this.reloadListsPending.next(value);
  }
}
