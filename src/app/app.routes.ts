import { Routes } from '@angular/router';
import { ForbiddenComponent } from 'app/components/forbidden/forbidden.component';
import { ROUTES } from "app/constants/routes.constants";
import { AuthGuard } from './services/auth-guard.service';
import { UserDetailComponentComponent } from './containers/user-detail-component/user-detail-component.component';
import { ComunityMainComponent } from './containers/comunity-main/comunity-main.component';
import { ComunityListDetailComponent } from './containers/comunity-list-detail/comunity-list-detail.component';
import { HomeContainerComponent } from './containers/home-container/home-container.component';
import { RecipesMainComponent } from './containers/receipts-main-component/recipes-main.component';
import { ListsMainComponent } from './containers/lists-main-component/lists-main.component';
import { UnknowComponent } from './components/unknow/unknow.component';

export const routes: Routes = [
  {
    path: ROUTES.HOME.path,
    component: HomeContainerComponent
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
    component: UserDetailComponentComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ROUTES.RECIPES.path,
    component: RecipesMainComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ROUTES.LISTS.path,
    component: ListsMainComponent,
    canActivate: [AuthGuard]
  },
  {
    path: ROUTES.COMUNITY.path,
    component: ComunityMainComponent,
  },
  {
    path: ROUTES.COMUNITY.DETAIL.path,
    component: ComunityListDetailComponent
  },
  { path: '**', redirectTo: ROUTES.UNKNOW.path }
];
