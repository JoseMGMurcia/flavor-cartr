import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserDetailComponentComponent } from './containers/user-detail-component/user-detail-component.component';

const routes: Routes = [
  {
    path: '',
    component: UserDetailComponentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
