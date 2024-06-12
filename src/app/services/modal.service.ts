import { ApplicationRef, ComponentRef, EnvironmentInjector, Injectable, TemplateRef, Type, ViewContainerRef, createComponent } from "@angular/core";
import { DialogComponent } from "app/components/dialog/dialog.component";
import { ModalComponent } from "app/components/modal/modal.component";
import { ModalOptions, ModalDataGet, DialogOptions } from "app/models/modal.model";

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  // Create a reference to our modal component
  newModalComponent!: ComponentRef<ModalComponent>;
  // Optional content passed at the creation : animation, size, ...
  options!: ModalOptions | undefined;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  // To get clean function call signatures, I will use typescript function overloading
  // Signature of the first approach
  open(
    vcrOrComponent: ViewContainerRef,
    content: TemplateRef<Element>,
    options?: ModalOptions
  ): void;

  // Signature of the second approach
  open<C>(vcrOrComponent: Type<C>, options?: ModalOptions): void;

  // Function implementation
  open<C>(
    vcrOrComponent: ViewContainerRef | Type<C>,
    param2?: TemplateRef<Element> | ModalOptions,
    options?: ModalOptions
  ) {
    if (vcrOrComponent instanceof ViewContainerRef) {
      // For the first approach, we know that the second param will be of type TemplateRef, so we have to cast it
      this.openWithTemplate(vcrOrComponent, param2 as TemplateRef<Element>);
      this.options = options;
    } else {
      this.options = param2 as ModalOptions | undefined;
      this.openWithComponent(vcrOrComponent);
      // Same story here : for the second approach, the second param will be of type Options or undefined, since optional

    }
  }

  easyDialog(dialog: DialogOptions) {
    this.open(DialogComponent, { dialog });
  }

  private openWithTemplate(vcr: ViewContainerRef, content: TemplateRef<Element>) {
    // We first start to clear previous views
    vcr.clear();
    // We create a view with the template content
    const innerContent = vcr.createEmbeddedView(content);

    // We create the modal component, and project the template content in the ng-content of the modal component
    this.newModalComponent = vcr.createComponent(ModalComponent, {
      environmentInjector: this.injector,
      projectableNodes: [innerContent.rootNodes],
    });
  }

  private openWithComponent(component: Type<unknown>) {
    // create the desired component, the content of the modal box
    const newComponent = createComponent(component, {
      environmentInjector: this.injector,
    });
    if(newComponent.instance instanceof DialogComponent && this.options?.dialog) {
      // newComponent.options = this.options.dialog;
      newComponent.instance.options = this.options.dialog;
    }
    else if (newComponent.instance instanceof ModalDataGet && this.options?.data) {
      newComponent.instance.data = this.options.data;
    }
    // create the modal component and project the instance of the desired component in the ng-content
    this.newModalComponent = createComponent(ModalComponent, {
      environmentInjector: this.injector,
      projectableNodes: [[newComponent.location.nativeElement]],
    });

    document.body.appendChild(this.newModalComponent.location.nativeElement);

    // Attach views to the changeDetection cycle
    this.appRef.attachView(newComponent.hostView);
    this.appRef.attachView(this.newModalComponent.hostView);
  }

  // Close the modal
  close() {
    this.newModalComponent.instance.close();
  }
}
