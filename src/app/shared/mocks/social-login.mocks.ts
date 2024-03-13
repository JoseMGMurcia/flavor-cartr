import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialAuthServiceConfig } from "@abacritt/angularx-social-login";
import { FACEBBOK_CLIENT_ID, GOOGLE_CLIENT_ID } from "@shared/constants/social.constants";

export const socialLoginMock = {
  provide: SocialAuthService,
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
};
