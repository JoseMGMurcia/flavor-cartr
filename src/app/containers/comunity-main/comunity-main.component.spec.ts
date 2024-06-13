import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunityMainComponent } from './comunity-main.component';
import { cartServiceMock } from 'app/services/mocks/cart.service.mock';
import { TranslateModule } from '@ngx-translate/core';

describe('ComunityMainComponent', () => {
  let component: ComunityMainComponent;
  let fixture: ComponentFixture<ComunityMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ComunityMainComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        cartServiceMock
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComunityMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
