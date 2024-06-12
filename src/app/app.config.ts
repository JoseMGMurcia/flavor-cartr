import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { LanguageEnum } from './models/language.models';

// This function is used to provide the translation configuration to the whole app
export const provideTranslation = () => ({
  defaultLanguage: LanguageEnum.SPANISH,
  loader: {
    provide: TranslateLoader,
    useFactory: HttpLoaderFactory,
    deps: [HttpClient],
  },
});

// This function is used to provide the translation loader to the app
export function HttpLoaderFactory(http: HttpClient) {
  return  new  TranslateHttpLoader(http, './assets/i18n/', '.json');
}

// This is the main configuration of the app
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom([TranslateModule.forRoot(provideTranslation())]),
  ],
};
