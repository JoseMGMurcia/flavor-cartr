import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportRecipeComponent } from './import-recipe.component';
import { cartServiceMock } from 'app/services/mocks/cart.service.mock';
import { TranslateModule } from '@ngx-translate/core';

describe('ImportRecipeComponent', () => {
  let component: ImportRecipeComponent;
  let fixture: ComponentFixture<ImportRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ImportRecipeComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        cartServiceMock
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
