import { Component, Input, forwardRef, Optional } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { ControlField, ValidationRule } from '../dynamic-form.types';

@Component({
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => BaseFieldComponent),
      multi: true
    }
  ]
})
export abstract class BaseFieldComponent implements ControlValueAccessor {
  @Input() field!: ControlField;
  @Input() disabled = false;
  @Input() showLabels = true;
  @Input() showValidationMessages = true;
  @Input() direction: 'ltr' | 'rtl' = 'ltr';
@Input() control!: FormControl;
  value: any;
  touched = false;
  dirty = false;

  onChange = (value: any) => { };
  onTouched = () => { };

  constructor() {}

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Helper methods
  getClassString(classes: string | string[] | undefined): string {
    if (!classes) return '';
    if (Array.isArray(classes)) {
      return classes.join(' ');
    }
    return classes;
  }

  getStyleString(styles: { [key: string]: string } | undefined): string {
    if (!styles) return '';
    return Object.entries(styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
  }

  getErrorMessage(errorType?: string): string {
    if (!this.field.validations) return '';

    if (errorType) {
      const validation = this.field.validations.find(v => v.type === errorType);
      if (validation) {
        return validation.message;
      }
    }

    // Fallback to required validation if no specific error type found
    const requiredValidation = this.field.validations.find(v => v.type === 'required');
    return requiredValidation?.message || '';
  }

  hasError(errorType: string): boolean {
    if (this.control && this.control.errors && this.control.dirty) {
      return !!this.control.errors[errorType];
    }
    return false;
  }

  isFieldValid(): boolean {
    if (this.control && this.control.errors && this.control.dirty) {
      return !this.control.invalid;
    }
    return false;
  }

  isFieldInvalid(): boolean {
    if (this.control && this.control.errors && this.control.dirty) {
      return this.control.invalid;
    }
    return false;
  }

  onInputChange(event: any): void {
    const value = event.target?.value || '';
    this.value = value;
    this.onChange(value);
    this.onTouched();
    this.dirty = true;
  }

  onBlur(): void {
    this.touched = true;
    this.onTouched();
    this.dirty = true;
  }

  isRequired(): boolean {
    return this.field.validations?.some(v => v.type === 'required') || false;
  }
} 