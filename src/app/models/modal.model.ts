/* eslint-disable */
export interface ModalOptions {
  animations?: {
    modal?: {
      enter?: string;
      leave?: string;
    };
    overlay?: {
      enter?: string;
      leave?: string;
    };
  };
  size?: {
    minWidth?: string;
    width?: string;
    maxWidth?: string;
    minHeight?: string;
    height?: string;
    maxHeight?: string;
  };
  dialog?: DialogOptions;
  data?: { [key: string]: any}
  prevenCloseOutside?: boolean;
  preventCloseOnEsc?: boolean;
}

// for the modal options, we can set the default options
export const DEFAULT_MODAL_OPTIONS: ModalOptions = {
  animations: {
    modal: {
      enter: 'enter-scaling 0.4s',
    },
  },
};

export interface DialogOptions {
  title?: string;
  message?: string;
  buttons?: DialogButton[];
}

export interface DialogButton {
  label: string;
  action?: () => void;
  icon?: string;
  preventClose?: boolean;
  className?: string;
}

export class ModalDataGet {

  data?: { [key: string]: any};
  constructor(data?: { [key: string]: any}) {
    this.data = data;
  }
}
