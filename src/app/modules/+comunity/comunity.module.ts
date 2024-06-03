import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { SharedModule } from "@shared/shared.module";
import { ComunityRoutingModule } from "./comunity-routing.module";
import { ComunityMainComponent } from "./containers/comunity-main/comunity-main.component";
import { ComunityListDetailComponent } from './containers/comunity-list-detail/comunity-list-detail.component';

@NgModule({
  declarations: [
    ComunityMainComponent,
    ComunityListDetailComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    ComunityRoutingModule,
  ],
  providers: [],
})
export class ComunityModule { }
