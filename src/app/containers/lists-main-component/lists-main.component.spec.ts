import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsMainComponent } from './lists-main.component';
import { TranslateModule } from '@ngx-translate/core';
import { cartServiceMock } from 'app/services/mocks/cart.service.mock';

describe('ListsMainComponent', () => {
  let component: ListsMainComponent;
  let fixture: ComponentFixture<ListsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ListsMainComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        cartServiceMock
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.user = { id: '1', name: 'User 1', nickname: '', email: '', language: '' };
  });

  it('should create', () => {
    component.handleNewList();
    component.handleListChange('list');
    component['statusService'].setAddedArticle('article');
    expect(component).toBeTruthy();

    component['_lists']= [
      { id: '1', name: 'List 1', articleList: [], totalPrice: 0, userId: '1' },
    ];
    component.handleListChange('1');
    component['loadData']();
    component['handleLists'](component['_lists']);
  });
});
