import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';

@Component({
  selector: 'lib-number-field',
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
          type="number"
          [id]="field.name"
          [name]="field.name"
          [placeholder]="field.placeholder || ''"
          [min]="getMinValue()"
          [max]="getMaxValue()"
          [step]="getStepValue()"
          [value]="value"
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
      @if (showValidationMessages && hasError('pattern')) {
        <div class="field-error">{{ getErrorMessage('pattern') }}</div>
      }
    </div>
  `
 ,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberFieldComponent),
      multi: true
    }
  ]
})
export class NumberFieldComponent extends BaseFieldComponent {
  getMinValue(): number | undefined {
    const minValidation = this.field.validations?.find(v => v.type === 'min');
    return minValidation ? minValidation.value : undefined;
  }

  getMaxValue(): number | undefined {
    const maxValidation = this.field.validations?.find(v => v.type === 'max');
    return maxValidation ? maxValidation.value : undefined;
  }

  getStepValue(): number {
    return 1; // Default step value
  }
} 