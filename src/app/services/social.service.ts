import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from "@abacritt/angularx-social-login";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { STRING_EMPTY } from "app/constants/string.constants";
import { BehaviorSubject, Observable } from "rxjs";
import { ROUTES } from "app/constants/routes.constants";
import { User } from "app/models/cart.models";

@Injectable({
  providedIn: 'root',
})
export class SocialService {

  constructor(
    private router: Router,
  ) {}

  public get socialUser$(): Observable<SocialUser> { return this.socialUser.asObservable();}
  private socialUser: BehaviorSubject<SocialUser> = new BehaviorSubject(undefined as unknown as SocialUser);

  public get user$(): Observable<User> { return this.user.asObservable();}
  private user: BehaviorSubject<User> = new BehaviorSubject(undefined as unknown as User);

  public get loggedIn$(): Observable<boolean> { return this.loggedIn.asObservable();}
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject(false);

  public get accessToken$(): Observable<string> { return this.accessToken.asObservable();}
  private accessToken: BehaviorSubject<string> = new BehaviorSubject(STRING_EMPTY);

  public setSocialUser(socialUser: SocialUser): void {
    this.socialUser.next(socialUser);
    this.accessToken.next(socialUser.idToken);
    this.loggedIn.next(socialUser != null);
  }

  public setUser(user: User): void {
    this.user.next(user);
  }

  signInWithFB(authService: SocialAuthService): void {
    authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  signOut(authService: SocialAuthService): void {
    authService.signOut();
    this.loggedIn.next(false);
    this.user.next(undefined as unknown as User);
    this.router.navigate([ROUTES.HOME.path]);
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

  isLogged(): boolean {
    return this.loggedIn.value;
  }
}
