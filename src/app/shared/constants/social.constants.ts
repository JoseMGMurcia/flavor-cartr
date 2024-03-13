import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig } from "@abacritt/angularx-social-login";

export const GOOGLE_CLIENT_ID = '';
export const FACEBBOK_CLIENT_ID = '';

export const socialAuthServiceConfigProvider =  {
  provide: 'SocialAuthServiceConfig',
  useValue: {
    autoLogin: false,
    providers: [
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider(GOOGLE_CLIENT_ID )
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
