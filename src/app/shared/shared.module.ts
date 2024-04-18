import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from './components/input/input.component';
import { SelectComponent } from './components/select/select.component';
import { ModalComponent } from './components/modal/modal.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { TranslateModule } from '@ngx-translate/core';
import { UnknowComponent } from './components/unknow/unknow.component';
import { ForbiddenComponent } from './components/forbidden/forbidden.component';
import { TableComponent } from './components/table/table.component';

const components = [
  InputComponent,
  SelectComponent,
  UnknowComponent,
  TableComponent,
];

@NgModule({
  declarations: [
    ...components,
    ModalComponent,
    DialogComponent,
    ForbiddenComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule
  ],
  providers: [],
  bootstrap: [],
  exports: [
    ...components,
  ]
})
export class SharedModule { }

