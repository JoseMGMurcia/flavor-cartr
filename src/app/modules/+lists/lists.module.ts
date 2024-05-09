import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ListsRoutingModule } from "./lists-routing.module";
import { ListsMainComponent } from "./containers/lists-main-component/lists-main.component";
import { AddListComponent } from './components/add-list/add-list.component';
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [
    ListsMainComponent,
    AddListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    ListsRoutingModule,
    SharedModule,
  ],
  providers: [],
})
export class ListModule { }
