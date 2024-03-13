import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { STRING_EMPTY } from "@shared/constants/string.constants";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class SocialService {


  public get user$(): Observable<SocialUser> { return this.user.asObservable();}
  private user: BehaviorSubject<SocialUser> = new BehaviorSubject(undefined as unknown as SocialUser);

  public get loggedIn$(): Observable<boolean> { return this.loggedIn.asObservable();}
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public get accessToken$(): Observable<string> { return this.accessToken.asObservable();}
  private accessToken: BehaviorSubject<string> = new BehaviorSubject(STRING_EMPTY);

  public setUser(user: SocialUser): void {
    this.user.next(user);
    this.accessToken.next(user.idToken);
    this.loggedIn.next(user != null);
  }

  signInWithFB(authService: SocialAuthService): void {
    authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(authService: SocialAuthService): void {
    authService.signOut();
  }

  refreshToken(authService: SocialAuthService): void {
    authService.refreshAuthToken(GoogleLoginProvider.PROVIDER_ID);
  }

  getAccessToken(authService: SocialAuthService): void {
    authService.getAccessToken(GoogleLoginProvider.PROVIDER_ID).then(accessToken => this.accessToken.next(accessToken));
  }

  getGoogleCalendarData(httpClient: HttpClient): void {
    if (!this.accessToken) return;

    httpClient
      .get('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
        headers: { Authorization: `Bearer ${this.accessToken}` },
      })
      .subscribe((events) => {
        alert('Look at your console');
        console.log('events', events);
      });
  }
}
