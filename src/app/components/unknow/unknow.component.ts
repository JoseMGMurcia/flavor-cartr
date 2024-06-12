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
// This component is used to display a message when the user tries to access an unknown route
export class UnknowComponent { }
