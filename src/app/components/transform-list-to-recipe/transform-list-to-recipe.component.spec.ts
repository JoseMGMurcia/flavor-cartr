import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformListToRecipeComponent } from './transform-list-to-recipe.component';

describe('TransformListToRecipeComponent', () => {
  let component: TransformListToRecipeComponent;
  let fixture: ComponentFixture<TransformListToRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransformListToRecipeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TransformListToRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
