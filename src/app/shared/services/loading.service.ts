import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class LoadingService {

  public get character$(): Observable<boolean> { return this.loading.asObservable();}
  private loading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public show(): void {
    this.loading.next(true);
  }

  public hide(): void {
    this.loading.next(false);
  }
}
