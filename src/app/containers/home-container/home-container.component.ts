import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home-container',
  templateUrl: './home-container.component.html',
  styleUrl: './home-container.component.scss',
  standalone: true,
  imports: [
    TranslateModule,
  ]
})
export class HomeContainerComponent{

}
