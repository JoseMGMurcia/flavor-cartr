import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicListComponent } from './public-list.component';
import { TranslateModule } from '@ngx-translate/core';
import { cartServiceMock } from 'app/services/mocks/cart.service.mock';

describe('PublicListComponent', () => {
  let component: PublicListComponent;
  let fixture: ComponentFixture<PublicListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PublicListComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        cartServiceMock
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
