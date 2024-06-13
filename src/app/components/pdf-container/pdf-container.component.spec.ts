import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfContainerComponent } from './pdf-container.component';
import { TranslateModule } from '@ngx-translate/core';

describe('PdfContainerComponent', () => {
  let component: PdfContainerComponent;
  let fixture: ComponentFixture<PdfContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PdfContainerComponent,
        TranslateModule.forRoot(),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PdfContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
