import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunityListDetailComponent } from './comunity-list-detail.component';

describe('ComunityListDetailComponent', () => {
  let component: ComunityListDetailComponent;
  let fixture: ComponentFixture<ComunityListDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComunityListDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComunityListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
