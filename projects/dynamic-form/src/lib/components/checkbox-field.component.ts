import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';

@Component({
  selector: 'lib-checkbox-field',
  standalone: true,
  imports: [],
  template: `
    <div [class]="getClassString(field.class)" [style]="getStyleString(field.style)" class="form-field">
      
      <div class="checkbox-item">
        <input
          type="checkbox"
          [id]="field.name"
          [name]="field.name"
          [checked]="value"
          (change)="onInputChange($event)"
          (blur)="onBlur()"
          class="checkbox-input"
        />
        
        @if (showLabels && field.label) {
          <label [for]="field.name" class="checkbox-label">
            {{ field.label }}
            @if (isRequired()) {
              <span class="required-indicator">*</span>
            }
          </label>
        }
      </div>

      @if (field.description) {
        <p class="field-description">{{ field.description }}</p>
      }

      @if (showValidationMessages && hasError('required')) {
        <div class="field-error">{{ getErrorMessage('required') }}</div>
      }
    </div>
  `
 ,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxFieldComponent),
      multi: true
    }
  ]
})
export class CheckboxFieldComponent extends BaseFieldComponent {
  // Form control validation is handled by the base class
} 