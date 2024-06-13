import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRecipeComponent } from './add-recipe.component';
import { cartServiceMock } from 'app/services/mocks/cart.service.mock';
import { TranslateModule } from '@ngx-translate/core';

describe('AddRecipeComponent', () => {
  let component: AddRecipeComponent;
  let fixture: ComponentFixture<AddRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddRecipeComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        cartServiceMock
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
