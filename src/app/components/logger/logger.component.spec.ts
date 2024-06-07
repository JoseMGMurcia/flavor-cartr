import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggerComponent } from './logger.component';
import { GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { socialAuthServiceConfigProvider } from 'app/constants/social.constants';
import { TranslateModule } from '@ngx-translate/core';

describe('LoggerComponent', () => {
  let component: LoggerComponent;
  let fixture: ComponentFixture<LoggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoggerComponent],
      imports: [
        TranslateModule.forRoot(),
        GoogleSigninButtonModule,
      ],
      providers: [
        socialAuthServiceConfigProvider
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
