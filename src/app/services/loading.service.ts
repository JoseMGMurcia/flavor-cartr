import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})

// This service is used to show and hide the loading spinner component that is used in the app root component
export class LoadingService {

  public get loading$(): Observable<boolean> { return this.loading.asObservable();}
  private loading: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public show(): void {
    this.loading.next(true);
  }

  public hide(): void {
    this.loading.next(false);
  }
}
