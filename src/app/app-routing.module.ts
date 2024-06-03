import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from './shared/constants/routes.constants';
import { AuthGuard } from '@shared/services/auth-guard.service';
import { UnknowComponent } from '@shared/components/unknow/unknow.component';
import { ForbiddenComponent } from '@shared/components/forbidden/forbidden.component';

const routes: Routes = [
  {
    path: ROUTES.HOME.path,
    loadChildren: () => import('./modules/+home/home.module').then(m => m.HomeModule),
  },
  {
    path: ROUTES.UNKNOW.path,
    component: UnknowComponent,
  },
  {
    path: ROUTES.FORBIDDEN.path,
    component: ForbiddenComponent,
  },
  {
    path: ROUTES.USER.path,
    loadChildren: () => import('./modules/+user/user.module').then(m => m.UserModule),
    canActivate: [AuthGuard]
  },
  {
    path: ROUTES.LISTS.path,
    loadChildren: () => import('./modules/+lists/lists.module').then(m => m.ListModule),
    canActivate: [AuthGuard]
  },
  {
    path: ROUTES.COMUNITY.path,
    loadChildren: () => import('./modules/+comunity/comunity.module').then(m => m.ComunityModule),
  },
  { path: '**', redirectTo: ROUTES.UNKNOW.path }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
