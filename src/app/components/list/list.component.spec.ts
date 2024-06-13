import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListComponent } from './list.component';
import { TranslateModule } from '@ngx-translate/core';
import { TableComponent } from '../table/table.component';
import { cartServiceMock } from 'app/services/mocks/cart.service.mock';
import { Article, ArticleList, Category, List, User } from 'app/models/cart.models';
import { DEFAULT_MODAL_OPTIONS } from 'app/models/modal.model';
import { AddProductComponentComponent } from '../add-product-component/add-product-component.component';
import { TransformListToRecipeComponent } from '../transform-list-to-recipe/transform-list-to-recipe.component';
import { TableRow } from 'app/models/table.models';
import { ArticleDetailComponent } from '../article-detail/article-detail.component';
import { AddListComponent } from '../add-list/add-list.component';
import { ImportRecipeComponent } from '../import-recipe/import-recipe.component';


describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ListComponent,
        TableComponent,
        TranslateModule.forRoot(),
      ],
      providers: [cartServiceMock]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the data of the list', () => {
    // Arrange
    const articles: Article[] = [{ id: '1', name: 'Article 1' } as Article, { id: '2', name: 'Article 2' } as Article];
    const articleList: ArticleList = {
      articleId: '',
      amount: 0,
      unit: '',
      isActive: false
    };
    const list: List = { id: '1', name: 'Test List', isPublic: true, articleList: [articleList]  } as List;
    const categories: Category[] = [{ id: '1', name: 'Category 1' }, { id: '2', name: 'Category 2' }];

    // Act
    component.setData(list, articles, categories);

    // Assert
    expect(component.articles).toEqual(articles);
    expect(component.categories).toEqual(categories);
    expect(component.list).toEqual(list);
  });

  it('should open the AddProductComponentComponent modal', () => {
    // Arrange
    spyOn(component['modalService'], 'open');

    // Act
    component.handleAddArticle();

    // Assert
    expect(component['modalService'].open).toHaveBeenCalledWith(AddProductComponentComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { articles: component.articles, categories: component.categories },
      prevenCloseOutside: true,
    });
  });it('should open the AddProductComponentComponent modal', () => {
    // Arrange
    spyOn(component['modalService'], 'open');

    // Act
    component.handleAddArticle();

    // Assert
    expect(component['modalService'].open).toHaveBeenCalledWith(AddProductComponentComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { articles: component.articles, categories: component.categories },
      prevenCloseOutside: true,
    });
  });

  it('should open the TransformListToRecipeComponent modal', () => {
    // Arrange
    spyOn(component['modalService'], 'open');

    // Act
    component.handleTransforToReceipt();

    // Assert
    expect(component['modalService'].open).toHaveBeenCalledWith(TransformListToRecipeComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { list: component.list },
      prevenCloseOutside: true,
    });
  });


  it('should open the ArticleDetailComponent modal', () => {
    // Arrange
    component.articles = [];
    spyOn(component['modalService'], 'open');

    // Act
    const row: TableRow = { id: '1', name: 'Article 1' };
    component.handleDetail(row);

    // Assert
    expect(component['modalService'].open).toHaveBeenCalledWith(ArticleDetailComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { article: component.articles.find(a => a.id === row.id), categories: component.categories },
      prevenCloseOutside: true,
    });
  });


  it('should return a table row with the article details', () => {
    // Arrange
    const articleList: ArticleList = {
      articleId: '1',
      amount: 2,
      unit: 'kg',
      isActive: true
    };
    const article: Article = {
      id: '1',
      name: 'Article 1',
      categories: ['1'],
      brand: 'Brand 1',
      averagePrice: 10.99
    };
    const categories: Category[] = [
      { id: '1', name: 'Category 1' },
      { id: '2', name: 'Category 2' }
    ];

    component.articles = [article];
    component.categories = categories;

    // Act
    const result = component.getTableRow(articleList);

    // Assert
    expect(result.id).toEqual('1');
  });


  it('should open the AddListComponent modal', () => {
    // Arrange
    spyOn(component['modalService'], 'open');
    component['user'] = { id: '1', name: 'User 1' } as User;

    // Act
    component.handleEditList();

    // Assert
    expect(component['modalService'].open).toHaveBeenCalledWith(AddListComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { userId: component.user.id, list: component.list },
      prevenCloseOutside: true,
    });
  });

  it('should open the ImportRecipeComponent modal', () => {
    // Arrange
    component['sortList']();

    spyOn(component['modalService'], 'open');
    component.articles = [
      { id: '1', name: 'Article 1' } as Article,
      { id: '2', name: 'Article 2' } as Article,
    ]
    component['user'] = { id: '1', name: 'User 1' } as User;
    component.list = { id: '1', name: 'List 1', articleList:[
      { articleId: '1', amount: 2, unit: 'kg', isActive: true},
      { articleId: '2', amount: 2, unit: 'kg', isActive: true},
      { articleId: '3', amount: 2, unit: 'kg', isActive: true}
    ]} as List;

    // Act
    component.handleImportReceit();
    component['sortList']();

    // Assert
    expect(component['modalService'].open).toHaveBeenCalledWith(ImportRecipeComponent, {
      ...DEFAULT_MODAL_OPTIONS,
      data: { userId: component.user.id, list: component.list },
      prevenCloseOutside: true,
    });
  });


});
