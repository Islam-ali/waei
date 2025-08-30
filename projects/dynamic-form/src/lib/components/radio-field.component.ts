import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';

@Component({
  selector: 'lib-radio-field',
  standalone: true,
  imports: [],
  template: `
    <div [class]="getClassString(field.class)" [style]="getStyleString(field.style)" class="form-field">
      
      @if (showLabels && field.label) {
        <label class="field-label">
          {{ field.label }}
          @if (isRequired()) {
            <span class="required-indicator">*</span>
          }
        </label>
      }

      @if (field.description) {
        <p class="field-description">{{ field.description }}</p>
      }

      <div class="radio-group">
        @for (option of field.options || []; track option.value) {
          <div class="radio-item">
            <input
              type="radio"
              [id]="field.name + '_' + option.value"
              [name]="field.name"
              [value]="option.value"
              [checked]="value === option.value"
              (change)="onInputChange($event)"
              (blur)="onBlur()"
              class="radio-input"
            />
            <label [for]="field.name + '_' + option.value" class="radio-label">
              {{ option.label }}
            </label>
          </div>
        }
      </div>

      @if (showValidationMessages && hasError('required')) {
        <div class="field-error">{{ getErrorMessage('required') }}</div>
      }
    </div>
  `
 ,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioFieldComponent),
      multi: true
    }
  ]
})
export class RadioFieldComponent extends BaseFieldComponent {
  // Form control validation is handled by the base class
} 