import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogComponent } from './dialog.component';
import { DialogButton } from 'app/models/modal.model';
import { TEST } from 'app/constants/test.constant';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('doAction', () => {
    it('should call the button action and close the modal if preventClose is false', () => {
      const spy = spyOn(component['modalService'], 'close');
      const button: DialogButton = {
        label: TEST,
        action: jasmine.createSpy('action'),
        preventClose: false
      };

      component.doAction(button);

      expect(button.action).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
    });

    it('should call the button action and not close the modal if preventClose is true', () => {
      const spy = spyOn(component['modalService'], 'close');
      const button: DialogButton = {
        label: TEST,
        action: jasmine.createSpy('action'),
        preventClose: true
      };

      component.doAction(button);

      expect(button.action).toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
    });
  });
});
