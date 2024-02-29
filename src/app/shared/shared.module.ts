import { NgModule } from '@angular/core';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputComponent } from './components/input/input.component';
import { SelectComponent } from './components/select/select.component';
import { ModalComponent } from './components/modal/modal.component';
import { DialogComponent } from './components/dialog/dialog.component';

const components = [
  InputComponent,
  SelectComponent,
];

@NgModule({
  declarations: [
    ...components,
    ModalComponent,
    DialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [],
  exports: [
    ...components,
  ]
})
export class SharedModule { }

