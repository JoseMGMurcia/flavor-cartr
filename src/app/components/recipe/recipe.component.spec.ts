import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeComponent } from './recipe.component';
import { TranslateModule } from '@ngx-translate/core';
import { cartServiceMock } from 'app/services/mocks/cart.service.mock';
import { Article, Recipe, User } from 'app/models/cart.models';
import { AddRecipeComponent } from '../add-recipe/add-recipe.component';
import { DEFAULT_MODAL_OPTIONS } from 'app/models/modal.model';

describe('RecipeComponent', () => {
  let component: RecipeComponent;
  let fixture: ComponentFixture<RecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        cartServiceMock
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the ImportRecipeComponent modal', () => {
    // Arrange
    component['sortRecipe']();

    spyOn(component['modalService'], 'open');
    component.articles = [
      { id: '1', name: 'Article 1' } as Article,
      { id: '2', name: 'Article 2' } as Article,
    ]
    component['user'] = { id: '1', name: 'User 1' } as User;
    component.recipe = { id: '1', name: 'List 1', articleList:[
      { articleId: '1', amount: 2, unit: 'kg', isActive: true},
      { articleId: '2', amount: 2, unit: 'kg', isActive: true},
      { articleId: '3', amount: 2, unit: 'kg', isActive: true}
    ]} as Recipe;

    // Act
    component['sortRecipe']();
  });

  it('should open the AddListComponent modal', () => {
    // Arrange
    spyOn(component['modalService'], 'open');
    component['user'] = { id: '1', name: 'User 1' } as User;

    // Act
    component.handleEditRecipe();
  });
});
