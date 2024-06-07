import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { STRING_EMPTY } from 'app/constants/string.constants';

@Component({
  selector: 'app-select',
  standalone: true,
  templateUrl: './select.component.html',
  styleUrl: './select.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ],
  imports: [CommonModule, FormsModule],
})
export class SelectComponent implements ControlValueAccessor{
  @Input() public label = STRING_EMPTY;
  @Input() public options: CartOption[] = [];
  @Input() public value = STRING_EMPTY;
  @Input({required: true}) public control!: FormControl;

  @Output() public valueChanges = new EventEmitter<string>();

  writeValue(obj: any): void {
    this.value = obj;
    this.options.forEach((option) => {
      option.selected = option.value === obj;
    });
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  propagateChange = (_: any) => {};
  propagateTouched = () => {};

  onchange(event: any): void {

    this.valueChanges.emit(event.target.value);
  }

  getLabelClass(): string {
    return this.label === STRING_EMPTY ? 'no-label' : STRING_EMPTY;
  }
}

export class CartOption {
  label = STRING_EMPTY;
  value = STRING_EMPTY;
  selected? = false;
}
