import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsMainComponent } from './lists-main.component';

describe('ListsMainComponentComponent', () => {
  let component: ListsMainComponent;
  let fixture: ComponentFixture<ListsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListsMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
