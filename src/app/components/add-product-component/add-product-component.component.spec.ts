import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductComponentComponent } from './add-product-component.component';
import { TranslateModule } from '@ngx-translate/core';
import { cartServiceMock } from 'app/services/mocks/cart.service.mock';
import { Category } from 'app/models/cart.models';
import { throwError } from 'rxjs';

describe('AddProductComponentComponent', () => {
  let component: AddProductComponentComponent;
  let fixture: ComponentFixture<AddProductComponentComponent>;
  const catagery: Category = {
    id: '1',
    name: ''
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddProductComponentComponent,
        TranslateModule.forRoot(),
      ],
      providers: [cartServiceMock],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddProductComponentComponent);
    component = fixture.componentInstance;
    component.data = { publicMode: true, categories: [catagery] };
    fixture.detectChanges();
  });

  it('should create', () => {
    spyOn(component['modalService'], 'close');
    component.changeArticle('')
    component.handleCancel();
    component.handleAddCategory();
    component.handleAddCategory();
    component.addArticle('1')
    spyOn(component['cartService'], 'postArticle').and.returnValue(throwError({error: 'error'}));
    component.addArticle('1')
    component.addingArticle = true;
    component.addCategory();
    component.addingArticle = false;
    component.addCategory();
    component.handleAdd();
    component.addingArticle = true;
    component.handleAdd();
    component.addingCategory = true;
    component.handleAdd();

    spyOn(component['cartService'], 'postCategory').and.returnValue(throwError({error: 'error'}));
    component.addCategory();
    expect(component).toBeTruthy();
    component.handleAddArticle();
    component.handleAddArticle();

  });
});
