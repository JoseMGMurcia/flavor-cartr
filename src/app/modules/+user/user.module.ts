import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { UserRoutingModule } from "./user-routing.module";
import { UserDetailComponentComponent } from './containers/user-detail-component/user-detail-component.component';

@NgModule({
  declarations: [
    UserDetailComponentComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    UserRoutingModule,
  ],
  providers: [],
})
export class UserModule { }
