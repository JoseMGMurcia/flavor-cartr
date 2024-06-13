import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnknowComponent } from './unknow.component';
import { TranslateModule } from '@ngx-translate/core';

describe('UnknowComponent', () => {
  let component: UnknowComponent;
  let fixture: ComponentFixture<UnknowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        UnknowComponent,
        TranslateModule.forRoot(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnknowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
