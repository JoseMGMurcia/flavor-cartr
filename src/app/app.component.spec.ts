import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { TranslateModule } from '@ngx-translate/core';
import { MenuComponent } from '@shared/components/menu/menu.component';
import { LoggerComponent } from '@shared/components/logger/logger.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { socialAuthServiceConfigProvider } from '@shared/constants/social.constants';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        RouterTestingModule
      ],
      declarations: [
        AppComponent,
        MenuComponent,
        LoggerComponent,
        FooterComponent,
      ],
      providers: [
        socialAuthServiceConfigProvider
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'carrito'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('carrito');
  });
});
