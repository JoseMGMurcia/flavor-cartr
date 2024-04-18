import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { STRING_EMPTY } from '@shared/constants/string.constants';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor {
  @Input() public label = STRING_EMPTY;
  @Input() public type = 'text';
  @Input() public placeholder = STRING_EMPTY;
  @Input() public value = STRING_EMPTY;
  @Input({required: true}) public control!: FormControl;

  // ControlValueAccessor interface methods
  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  getErrors(): string[] {
    const errors = this.control.errors;
    if (!errors) {
      return [];
    }
    return Object.keys(errors).map((key) => {
      return errors[key] ? key : STRING_EMPTY;
    });

  }
}
