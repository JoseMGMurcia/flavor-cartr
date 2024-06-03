import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComunityMainComponent } from './comunity-main.component';

describe('ComunityMainComponent', () => {
  let component: ComunityMainComponent;
  let fixture: ComponentFixture<ComunityMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComunityMainComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComunityMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
