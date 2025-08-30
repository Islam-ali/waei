import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';

@Component({
  selector: 'lib-slider-field',
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

      <div class="slider-wrapper">
        <input
          type="range"
          [id]="field.name"
          [name]="field.name"
          [min]="getMinValue()"
          [max]="getMaxValue()"
          [step]="getStepValue()"
          [value]="value || getMinValue()"
          (input)="onInputChange($event)"
          (blur)="onBlur()"
          class="field-slider"
          [class.is-invalid]="isFieldInvalid()"
          [class.is-valid]="isFieldValid()"
        />
        
        <div class="slider-value">
          <span class="value-display">{{ value || getMinValue() }}</span>
        </div>
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
  `
 ,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SliderFieldComponent),
      multi: true
    }
  ]
})
export class SliderFieldComponent extends BaseFieldComponent {
  getMinValue(): number {
    const minValidation = this.field.validations?.find(v => v.type === 'min');
    return minValidation ? minValidation.value : 0;
  }

  getMaxValue(): number {
    const maxValidation = this.field.validations?.find(v => v.type === 'max');
    return maxValidation ? maxValidation.value : 100;
  }

  getStepValue(): number {
    return 1; // Default step value
  }
} 