import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListsMainComponent } from './containers/lists-main-component/lists-main.component';

const routes: Routes = [
  {
    path: '',
    component: ListsMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListsRoutingModule {}
