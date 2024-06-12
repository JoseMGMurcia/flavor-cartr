import {inject} from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { SocialService } from 'app/services/social.service';
import { ROUTES } from "app/constants/routes.constants";

// This guard is used to check if the user is logged in and prevent them from accessing certain pages
export const AuthGuard: CanActivateFn = () => {
  const socialService = inject(SocialService);

  // If the user is not logged in, we redirect them to the forbidden page
  const isLogged = socialService.isLogged();
  if (!isLogged) {
    const router = inject(Router);
    router.navigate([ROUTES.FORBIDDEN.path]);
  }

  return socialService.isLogged();
};
