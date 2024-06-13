import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesMainComponent } from './recipes-main.component';
import { TranslateModule } from '@ngx-translate/core';
import { cartServiceMock } from 'app/services/mocks/cart.service.mock';
import { Recipe } from 'app/models/cart.models';

describe('RecipesMainComponent', () => {
  let component: RecipesMainComponent;
  let fixture: ComponentFixture<RecipesMainComponent>;
  const recipe: Recipe = {
    description: '',
    id: '2',
    name: '',
    articleList: [],
    totalPrice: 0,
    userId: ''
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RecipesMainComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        cartServiceMock
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipesMainComponent);
    component = fixture.componentInstance;
    component.user = { id: '1', name: 'User 1', nickname: '', email: '', language: '' };
    component['_recipes'] = [recipe];
    fixture.detectChanges();
  });

  it('should create', () => {
    component.handleNewRecipe();
    component.handleRecipeChange('recipe');
    component.handleRecipeChange('2');
    expect(component).toBeTruthy();
    component['loadData']();
    component['handleRecipes']([recipe]);
  });
});
