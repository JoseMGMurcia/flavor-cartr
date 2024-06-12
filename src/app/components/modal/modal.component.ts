import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ModalOptions } from 'app/models/modal.model';
import { ModalService } from 'app/services/modal.service';
import { Observable, fromEvent, zip } from 'rxjs';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
// This component is used to display a modal with a template or a component
export class ModalComponent implements AfterViewInit {
  @ViewChild('modal') modal!: ElementRef<HTMLDivElement>;
  @ViewChild('overlay') overlay!: ElementRef<HTMLDivElement>;
  options!: ModalOptions | undefined;
  modalAnimationEnd!: Observable<Event>;
  modalLeaveAnimation!: string;
  overlayLeaveAnimation!: string;
  overlayAnimationEnd!: Observable<Event>;
  modalLeaveTiming!: number;
  overlayLeaveTiming!: number;

  constructor(
    private modalService: ModalService,
    private element: ElementRef
  ) {}

  // Close the modal on escape key press
  @HostListener('document:keydown.escape')
  onEscape() {
    // closing modal on escape
    if (!this.options?.preventCloseOnEsc) {
      this.modalService.close();
    }
  }

  onClose() {
    // closing modal when clicking on the overlay ( outside the modal ).
    if (!this.options?.prevenCloseOutside) {
      this.modalService.close();
    }
  }

  ngAfterViewInit() {
    this.options = this.modalService.options;
    this.addOptions();
    this.addEnterAnimations();
  }

  // Add enter animations to the modal and overlay
  addEnterAnimations() {
    this.modal.nativeElement.style.animation =
      this.options?.animations?.modal?.enter || '';
    this.overlay.nativeElement.style.animation =
      this.options?.animations?.overlay?.enter || '';
  }

  addOptions() {
    // Applying desired styles
    this.modal.nativeElement.style.minWidth =
      this.options?.size?.minWidth || 'auto';
    this.modal.nativeElement.style.width = this.options?.size?.width || 'auto';
    this.modal.nativeElement.style.maxWidth =
      this.options?.size?.maxWidth || 'auto';
    this.modal.nativeElement.style.minHeight =
      this.options?.size?.minHeight || 'auto';
    this.modal.nativeElement.style.height =
      this.options?.size?.height || 'auto';
    this.modal.nativeElement.style.maxHeight =
      this.options?.size?.maxHeight || 'auto';

    // Storing ending animation in variables
    this.modalLeaveAnimation = this.options?.animations?.modal?.leave || '';
    this.overlayLeaveAnimation = this.options?.animations?.overlay?.leave || '';
    // Adding an animationend event listener to know when animations ends
    this.modalAnimationEnd = this.animationendEvent(this.modal.nativeElement);
    this.overlayAnimationEnd = this.animationendEvent(
      this.overlay.nativeElement
    );
    // Get to know how long animations are
    this.modalLeaveTiming = this.getAnimationTime(this.modalLeaveAnimation);
    this.overlayLeaveTiming = this.getAnimationTime(this.overlayLeaveAnimation);
  }

  // Create an observable from the animationend event
  animationendEvent(element: HTMLDivElement) {
    return fromEvent(element, 'animationend');
  }

  // Remove element if no animation
  removeElementIfNoAnimation(element: HTMLDivElement, animation: string) {
    if (!animation) {
      element.remove();
    }
  }

  // Close the modal
  close() {
    this.modal.nativeElement.style.animation = this.modalLeaveAnimation;
    this.overlay.nativeElement.style.animation = this.overlayLeaveAnimation;

    // Goal here is to clean up the DOM to not keep unnecessary <app-modal> element
    // No animations on both elements:
    if (
      !this.options?.animations?.modal?.leave &&
      !this.options?.animations?.overlay?.leave
    ) {
      this.modalService.options = undefined;
      this.element.nativeElement.remove();
      return;
    }

    // Remove element if not animated
    this.removeElementIfNoAnimation(
      this.modal.nativeElement,
      this.modalLeaveAnimation
    );
    this.removeElementIfNoAnimation(
      this.overlay.nativeElement,
      this.overlayLeaveAnimation
    );

    // Both elements are animated, remove modal as soon as longest one ends
    if (this.modalLeaveTiming > this.overlayLeaveTiming) {
      this.modalAnimationEnd.subscribe(() => {
        this.element.nativeElement.remove();
      });
    } else if (this.modalLeaveTiming < this.overlayLeaveTiming) {
      this.overlayAnimationEnd.subscribe(() => {
        this.element.nativeElement.remove();
      });
    } else {
      zip(this.modalAnimationEnd, this.overlayAnimationEnd).subscribe(() => {
        this.element.nativeElement.remove();
      });
    }

    this.modalService.options = undefined;
  }

  // Get animation time from the animation string
  getAnimationTime(animation: string) {
    // Example animation = 'fade-in 0.8s'
    let animationTime = 0;
    const splittedAnimation = animation.split(' ');
    for (const expression of splittedAnimation) {
      const currentValue = +expression.replace(/s$/, '');
      if (!isNaN(currentValue)) {
        animationTime = currentValue;
        break;
      }
    }
    return animationTime;
  }
}

// ----- USAGE TIPS -----

/* Usage

<div class="container">
  <!-- Add a TemplateRef on ng-template  -->
  <ng-template #view>
    <div class="modal-container">
      <!-- elements here -->
    </div>
  </ng-template>

  <!-- Pass the TemplateRef to the method we will create -->
  <button class="template" (click)="openModalTemplate(view)">
    Open modal with TemplateRef
  </button>
  <!-- Second approach -->
  <button (click)="openModalComponent()">Open modal with a component</button>
</div>

////---    TS FILE    ---////


 // Query the #view element in the template, expecting it to be of type ViewContainerRef
  // and store the reference in the variable vcr.
  @ViewChild('view', { static: true, read: ViewContainerRef })
  vcr!: ViewContainerRef;



  openModalTemplate(view: TemplateRef<Element>) {
    this.modalService.open(this.vcr, view, {
      animations: {
        modal: {
          enter: 'enter-scaling 0.4s',
        },
        overlay: {
          enter: 'fade-in 0.8s',
          leave: 'fade-out 0.3s forwards',
        },
      },
      size: {
        width: '40rem',
      },
    });
  }

  openModalComponent() {
    const options: ModalOptions = {
      animations: {
        modal: {
          enter: 'enter-slide-down 0.8s',
        },
        overlay: {
          enter: 'fade-in 0.8s',
          leave: 'fade-out 0.3s forwards',
        },
      },
      size: {
        minWidth: '800px'
      }
    };
    this.modalService.open(LocationsComponent, options);
  }

  close() {
    this.modalService.close();
  }


*/
