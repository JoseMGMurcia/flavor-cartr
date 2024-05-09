import { APP_INITIALIZER, Injector, NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { GoogleSigninButtonModule, SocialLoginModule } from '@abacritt/angularx-social-login';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from '@shared/shared.module';
import { socialAuthServiceConfigProvider } from '@shared/constants/social.constants';
import { MenuComponent } from '@shared/components/menu/menu.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { LoggerComponent } from '@shared/components/logger/logger.component';
import { ToastComponent } from '@shared/components/toast/toast.component';

export const createTranslateLoader = (http: HttpClient) => {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
};

function appInitializerFactory(translateService: TranslateService) {
  return () => {
    translateService.setDefaultLang('es');
    return translateService.use('es').toPromise();
  };
}

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    FooterComponent,
    LoggerComponent,
    ToastComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
      }
    }),
    SocialLoginModule,
    GoogleSigninButtonModule,
  ],
  providers: [
    provideClientHydration(),
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService, Injector],
      multi: true
    },
    socialAuthServiceConfigProvider,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
