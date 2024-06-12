import { Injectable } from '@angular/core';
import { STRING_EMPTY } from 'app/constants/string.constants';
import { Category } from "app/models/cart.models";
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// This service is used to manage the status of the app, like the lists reload, the added article and the added category
export class StatusService {
  // Observables to get the status of the lists reload, the added article and the added category
  public get reloadListsPending$(): BehaviorSubject<boolean> { return this.reloadListsPending; }
  public get addedarticle$(): BehaviorSubject<string> { return this.addedarticle; }
  public get addedCategory$(): BehaviorSubject<Category> { return this.addedCategory; }
  private reloadListsPending: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private addedarticle: BehaviorSubject<string> = new BehaviorSubject(STRING_EMPTY);
  private addedCategory: BehaviorSubject<Category> = new BehaviorSubject({} as Category);

  public setAddedArticle(value: string): void {
    this.addedarticle.next(value);
  }

  public setAddedCategory(category: Category): void {
    this.addedCategory.next(category);
  }

  public setReloadListsPending(value: boolean): void {
    this.reloadListsPending.next(value);
  }
}
