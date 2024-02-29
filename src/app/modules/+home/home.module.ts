import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { HomeContainerComponent } from "./containers/home-container/home-container.component";
import { TranslateModule } from "@ngx-translate/core";
import { HomeRoutingModule } from "./home-routing.module";


@NgModule({
  declarations: [
    HomeContainerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    TranslateModule,
    HomeRoutingModule,
  ],
  providers: [],
})
export class HomeModule { }
