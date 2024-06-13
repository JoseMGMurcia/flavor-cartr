import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddListComponent } from './add-list.component';
import { cartServiceMock } from 'app/services/mocks/cart.service.mock';
import { TranslateModule } from '@ngx-translate/core';

describe('AddListComponent', () => {
  let component: AddListComponent;
  let fixture: ComponentFixture<AddListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddListComponent,
        TranslateModule.forRoot(),
      ],
      providers: [cartServiceMock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
