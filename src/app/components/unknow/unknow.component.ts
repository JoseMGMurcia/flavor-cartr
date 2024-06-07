import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-unknow',
  templateUrl: './unknow.component.html',
  styleUrl: './unknow.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
  ]
})
export class UnknowComponent {

}
