import {inject} from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateFn } from '@angular/router';
import { SocialService } from 'app/services/social.service';
import { ROUTES } from "app/constants/routes.constants";

export const AuthGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const socialService = inject(SocialService);

  const isLogged = socialService.isLogged();
  if (!isLogged) {
    const router = inject(Router);
    router.navigate([ROUTES.FORBIDDEN.path]);
  }

  return socialService.isLogged();
};
