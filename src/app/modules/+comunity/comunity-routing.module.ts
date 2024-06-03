import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { STRING_EMPTY } from "@shared/constants/string.constants";
import { ComunityMainComponent } from "./containers/comunity-main/comunity-main.component";
import { ROUTES } from "@shared/constants/routes.constants";
import { ComunityListDetailComponent } from "./containers/comunity-list-detail/comunity-list-detail.component";

const routes: Routes = [
  {
    path: STRING_EMPTY,
    component: ComunityMainComponent
  },
  {
    path: ROUTES.COMUNITY.DETAIL.path,
    component: ComunityListDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComunityRoutingModule {}
