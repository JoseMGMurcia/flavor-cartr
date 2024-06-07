import { AbstractControl, ValidatorFn } from "@angular/forms";
import { STRING_EMPTY } from "app/constants/string.constants";

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailRegex.test(email);
}

export const isEmail = (emailErrorString: string): ValidatorFn =>
  (control: AbstractControl) => {
    const value = control.value;
    if (!value) {
      return null;
    }
    return isValidEmail(value) ? null : { [emailErrorString]: true };
  };

export const required = (requiredErrorString: string): ValidatorFn =>
  (control: AbstractControl) => {
    const value = control.value;
    if (!value || value === STRING_EMPTY || value.trim() === STRING_EMPTY){
      return { [requiredErrorString]: true };
    }
    return null;
  };

export const minLength = (minLengthErrorString: string, minLength: number): ValidatorFn =>
  (control: AbstractControl) => {
    const value = control.value;
    if (!value) {
      return null;
    }
    return value.toString().length >= minLength ? null : { [minLengthErrorString]: true };
  };

export const maxLength = (maxLengthErrorString: string, maxLength: number): ValidatorFn =>
  (control: AbstractControl) => {
    const value = control.value;
    if (!value) {
      return null;
    }
    return value.toString().length <= maxLength ? null : { [maxLengthErrorString]: true };
  };

export const noSpecialChars = (noSpecialCharsErrorString: string): ValidatorFn =>
  (control: AbstractControl) => {
    const value = control.value;
    if (!value) {
      return null;
    }
    // Allow special characters: ñÑáéíóúÁÉÍÓÚüÜ.,'ºª/¿?¡!()~+%çÇ&€$@;:
    const specialCharsRegex = /^[a-zA-Z0-9 ñÑáéíóúÁÉÍÓÚüÜ.,'ºª/¿?¡!()~+%çÇ&€$@;:]*$/;
    return specialCharsRegex.test(value) ? null : { [noSpecialCharsErrorString]: true };
  };
