import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransformListToRecipeComponent } from './transform-list-to-recipe.component';
import { cartServiceMock } from 'app/services/mocks/cart.service.mock';
import { TranslateModule } from '@ngx-translate/core';
import { ModalService } from 'app/services/modal.service';
import { List } from 'app/models/cart.models';
import { throwError } from 'rxjs';

describe('TransformListToRecipeComponent', () => {
  let component: TransformListToRecipeComponent;
  let fixture: ComponentFixture<TransformListToRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TransformListToRecipeComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        cartServiceMock,
        ModalService,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransformListToRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.handleSave();
    spyOn(component['modalService'], 'close');
    const list: List = {
      id: '',
      name: '',
      articleList: [],
      totalPrice: 0,
      userId: ''
    };
    component['_list'] = list;
    component.handleCancel();
    component.handleSave();

    spyOn(component['cartService'], 'postListToRecipe').and.returnValue(throwError({error: 'error'}));
    component.handleSave();
    expect(component).toBeTruthy();
    component.data = { list: list, articles: [] };
    component.ngOnInit();
  });

});
