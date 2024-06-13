import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticleDetailComponent } from './article-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { cartServiceMock } from 'app/services/mocks/cart.service.mock';
import { Article } from 'app/models/cart.models';
import { STRING_EMPTY } from 'app/constants/string.constants';

describe('ArticleDetailComponent', () => {
  let component: ArticleDetailComponent;
  let fixture: ComponentFixture<ArticleDetailComponent>;

  const article: Article = {
    id: '',
    name: '',
    averagePrice: 0
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        ArticleDetailComponent
      ],
      providers: [
        cartServiceMock,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticleDetailComponent);
    component = fixture.componentInstance;
    component.data = { article, categories: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should save the article', () => {
    const values = {
      name: 'Test Article',
      description: 'Test Description',
      imageUrl: 'https://example.com/image.jpg',
      brand: 'Test Brand'
    };
    component.form.patchValue(values);
    spyOn(component, 'save').and.callThrough();

    component.handleSave();

    expect(component.save).toHaveBeenCalledWith(
      {
        id: '', name: 'Test Article', averagePrice: 0,
        description: 'Test Description', imageUrl: 'https://example.com/image.jpg', brand: 'Test Brand'
      });
  });

  it('should change edit mode', () => {
    component['edditMode'] = false;

    component.handleEdit();

    expect(component['edditMode']).toBeTrue();
  });

  it('should close modal', () => {
    const spy = spyOn(component['modalService'], 'close');

    component.handleCancel();

    expect(spy).toHaveBeenCalled();
  });
});
