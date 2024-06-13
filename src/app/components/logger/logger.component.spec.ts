import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerComponent } from './logger.component';
import { TranslateModule } from '@ngx-translate/core';

describe('LoggerComponent', () => {
  let component: LoggerComponent;
  let fixture: ComponentFixture<LoggerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoggerComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoggerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.ngOnInit();
    expect(component).toBeTruthy();
  });
});
