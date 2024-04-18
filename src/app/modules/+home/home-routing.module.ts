import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeContainerComponent } from './containers/home-container/home-container.component';
import { STRING_EMPTY } from '@shared/constants/string.constants';


const routes: Routes = [
  {
    path: STRING_EMPTY,
    component: HomeContainerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
