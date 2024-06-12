import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig } from "@abacritt/angularx-social-login";

// Google Client ID
export const GOOGLE_CLIENT_ID = '945913043267-lsp0ge3lufrghgfnc950qv8qmgjo9u6m.apps.googleusercontent.com';
export const FACEBBOK_CLIENT_ID = '365580963065987';

export const socialAuthServiceConfigProvider =  {
  provide: 'SocialAuthServiceConfig',
  useValue: {
    autoLogin: false,
    providers: [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(GOOGLE_CLIENT_ID)
      },
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider(FACEBBOK_CLIENT_ID)
      }
    ],
    onError: (err) => {
      console.error(err);
    }
  } as SocialAuthServiceConfig,
}
