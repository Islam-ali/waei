import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';

@Component({
  selector: 'lib-date-field',
  standalone: true,
  imports: [],
  template: `
    <div [class]="getClassString(field.class)" [style]="getStyleString(field.style)" class="form-field">
      
      @if (showLabels && field.label) {
        <label [for]="field.name" class="field-label">
          {{ field.label }}
          @if (isRequired()) {
            <span class="required-indicator">*</span>
          }
        </label>
      }

      @if (field.description) {
        <p class="field-description">{{ field.description }}</p>
      }

      <div class="input-wrapper">
        @if (field.prefixIcon) {
          <i [class]="field.prefixIcon" class="prefix-icon"></i>
        }
        
        <input
          type="date"
          [id]="field.name"
          [name]="field.name"
          [value]="getDateValue()"
          [min]="getMinDate()"
          [max]="getMaxDate()"
          [readonly]="field.readonly"
          (input)="onInputChange($event)"
          (blur)="onBlur()"
          class="field-input"
          [class.has-prefix]="field.prefixIcon"
          [class.has-suffix]="field.suffixIcon"
          [class.is-invalid]="isFieldInvalid()"
          [class.is-valid]="isFieldValid()"
        />
        
        @if (field.suffixIcon) {
          <i [class]="field.suffixIcon" class="suffix-icon"></i>
        }
      </div>

      @if (showValidationMessages && hasError('required')) {
        <div class="field-error">{{ getErrorMessage('required') }}</div>
      }
      @if (showValidationMessages && hasError('min')) {
        <div class="field-error">{{ getErrorMessage('min') }}</div>
      }
      @if (showValidationMessages && hasError('max')) {
        <div class="field-error">{{ getErrorMessage('max') }}</div>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateFieldComponent),
      multi: true
    }
  ]
})
export class DateFieldComponent extends BaseFieldComponent {
  getDateValue(): string {
    if (!this.value) return '';
    
    try {
      const date = new Date(this.value);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return '';
      }
      // Return date in YYYY-MM-DD format for HTML date input
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.warn('Invalid date value:', this.value);
      return '';
    }
  }

  getMinDate(): string | undefined {
    const minValidation = this.field.validations?.find(v => v.type === 'min');
    if (!minValidation) return undefined;
    
    try {
      const date = new Date(minValidation.value);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return undefined;
      }
      // Return date in YYYY-MM-DD format for HTML date input
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.warn('Invalid min date value:', minValidation.value);
      return undefined;
    }
  }

  getMaxDate(): string | undefined {
    const maxValidation = this.field.validations?.find(v => v.type === 'max');
    if (!maxValidation) return undefined;
    
    try {
      const date = new Date(maxValidation.value);
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        return undefined;
      }
      // Return date in YYYY-MM-DD format for HTML date input
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.warn('Invalid max date value:', maxValidation.value);
      return undefined;
    }
  }

  override onInputChange(event: any): void {
    const value = event.target?.value || '';
    
    if (value) {
      try {
        // Convert date string to ISO format for consistency
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          this.value = date.toISOString();
        } else {
          this.value = value;
        }
      } catch (error) {
        this.value = value;
      }
    } else {
      this.value = value;
    }
    
    this.onChange(this.value);
    this.onTouched();
    this.dirty = true;
  }

  override writeValue(value: any): void {
    if (value) {
      try {
        // If value is already a date string, use it as is
        if (typeof value === 'string' && value.includes('T')) {
          this.value = value;
        } else {
          // Convert to ISO string format
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            this.value = date.toISOString();
          } else {
            this.value = value;
          }
        }
      } catch (error) {
        this.value = value;
      }
    } else {
      this.value = value;
    }
  }
} 