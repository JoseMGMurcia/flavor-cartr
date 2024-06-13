import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuComponent } from './menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { socialAuthServiceConfigProvider } from 'app/constants/social.constants';
import { User } from 'app/models/cart.models';
import { cartServiceMock } from 'app/services/mocks/cart.service.mock';
import { SocialUser } from '@abacritt/angularx-social-login';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  const user: User = {
    id: '1',
    name: 'User 1',
    nickname: '',
    email: '',
    language: ''
  };

  const socialUser: SocialUser = {
    provider: '',
    id: '',
    email: '',
    name: '',
    photoUrl: '',
    firstName: '',
    lastName: '',
    authToken: '',
    idToken: '',
    authorizationCode: '',
    response: undefined
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [
        MenuComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        socialAuthServiceConfigProvider,
        cartServiceMock,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    component.user = user;
    component.socialUser = socialUser;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    component.logIn();
    component.goSection('section');
    component.handleGoogleResponse(socialUser);
    expect(component).toBeTruthy();
    component.signOut();
  });
});
