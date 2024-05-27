import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "@shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ListsRoutingModule } from "./lists-routing.module";
import { ListsMainComponent } from "./containers/lists-main-component/lists-main.component";
import { AddListComponent } from './components/add-list/add-list.component';
import { AddProductComponentComponent } from './components/add-product-component/add-product-component.component';
import { PdfContainerComponent } from './components/pdf-container/pdf-container.component';
import { RecipesMainComponent } from "./containers/receipts-main-component/recipes-main.component";
import { AddRecipeComponent } from './components/add-recipe/add-recipe.component';
import { TransformListToRecipeComponent } from './components/transform-list-to-recipe/transform-list-to-recipe.component';

@NgModule({
  declarations: [
    ListsMainComponent,
    AddListComponent,
    AddProductComponentComponent,
    PdfContainerComponent,
    RecipesMainComponent,
    AddRecipeComponent,
    TransformListToRecipeComponent
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
