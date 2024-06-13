import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunityListDetailComponent } from './comunity-list-detail.component';
import { cartServiceMock } from 'app/services/mocks/cart.service.mock';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

describe('ComunityListDetailComponent', () => {
  let component: ComunityListDetailComponent;
  let fixture: ComponentFixture<ComunityListDetailComponent>;

  const ActivatedRouteStub = {
    snapshot: {
      params: {
        id: 1
      }
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ComunityListDetailComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        cartServiceMock,
        { provide: ActivatedRoute, useValue: ActivatedRouteStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComunityListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
