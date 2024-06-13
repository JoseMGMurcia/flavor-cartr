import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDetailComponentComponent } from './user-detail-component.component';
import { TranslateModule } from '@ngx-translate/core';
import { cartServiceMock } from 'app/services/mocks/cart.service.mock';

describe('UserDetailComponentComponent', () => {
  let component: UserDetailComponentComponent;
  let fixture: ComponentFixture<UserDetailComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UserDetailComponentComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        cartServiceMock
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserDetailComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
