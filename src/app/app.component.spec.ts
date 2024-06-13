import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from './components/footer/footer.component';
import { MenuComponent } from './components/menu/menu.component';
import { ToastComponent } from './components/toast/toast.component';
import { cartServiceMock } from './services/mocks/cart.service.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        RouterOutlet,
        TranslateModule,
        FooterComponent,
        MenuComponent,
        ToastComponent,
        TranslateModule.forRoot(),
        BrowserAnimationsModule,
      ],
      providers: [
        cartServiceMock,
      ]
    }).compileComponents();

    component = TestBed.createComponent(AppComponent).componentInstance;
  });

  it('should create the app', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
});
