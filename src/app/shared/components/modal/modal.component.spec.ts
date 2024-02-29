import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalComponent } from './modal.component';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal on escape key press', () => {
    const spy = spyOn(component['modalService'], 'close');
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should apply desired styles on addOptions', () => {
    const modalElement = fixture.nativeElement.querySelector('.modal');
    component.options = {
      size: {
        minWidth: '300px',
        width: '500px',
        maxWidth: '800px',
        minHeight: '200px',
        height: '400px',
        maxHeight: '600px'
      }
    };
    component.addOptions();
    expect(modalElement.style.minWidth).toBe('300px');
    expect(modalElement.style.width).toBe('500px');
    expect(modalElement.style.maxWidth).toBe('800px');
    expect(modalElement.style.minHeight).toBe('200px');
    expect(modalElement.style.height).toBe('400px');
    expect(modalElement.style.maxHeight).toBe('600px');
  });

  it('should get animation time from animation string', () => {
    const animation = 'fade-in 0.8s';
    const animationTime = component.getAnimationTime(animation);
    expect(animationTime).toBe(0.8);
  });

  it('should remove element if no animation', () => {
    const element: HTMLDivElement = document.createElement('div');
    const animation = '';
    const spy = spyOn(element, 'remove');

    component.removeElementIfNoAnimation(element, animation);

    expect(spy).toHaveBeenCalled();
  });

  it('should close the modal', () => {
    const spy = spyOn(component['modalService'], 'close');
    component.options = {
      preventCloseOnEsc: false,
      prevenCloseOutside: false
    }

    component.onClose();

    expect(spy).toHaveBeenCalled();
  });

  it('should close the modal and remove element', () => {
    const spy = spyOn(component['element'].nativeElement, 'remove');
    component.options = {
      preventCloseOnEsc: false,
      prevenCloseOutside: false
    }

    component.close();

    expect(spy).toHaveBeenCalled();
  });

  it('should close the modal and remove element finally without animations', () => {
    component.options = {
      preventCloseOnEsc: false,
      prevenCloseOutside: false,
      animations: {
        modal: {
          leave: 'fade-in 0.8s'
        },
        overlay: {
          leave: 'fade-in 0.8s'
        }
      }
    };
    component.close();

    expect(component['modalService'].options).toBeUndefined();
  });

  it('should close the modal and remove element finally without animations when modal time is lesser then overlay', () => {
    component.options = {
      preventCloseOnEsc: false,
      prevenCloseOutside: false,
      animations: {
        modal: {
          leave: 'fade-in 0.8s'
        },
        overlay: {
          leave: 'fade-in 0.8s'
        }
      }
    };
    component.modalLeaveTiming = 1;
    component.overlayLeaveTiming = 0;

    component.close();

    expect(component['modalService'].options).toBeUndefined();
  });

  it('should close the modal and remove element finally without animations when modal time is lesser then overlay', () => {
    component.options = {
      preventCloseOnEsc: false,
      prevenCloseOutside: false,
      animations: {
        modal: {
          leave: 'fade-in 0.8s'
        },
        overlay: {
          leave: 'fade-in 0.8s'
        }
      }
    };
    component.modalLeaveTiming = 0;
    component.overlayLeaveTiming = 1;

    component.close();

    expect(component['modalService'].options).toBeUndefined();
  });


});
