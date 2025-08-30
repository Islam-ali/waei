import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';

@Component({
  selector: 'lib-switch-field',
  standalone: true,
  imports: [],
  template: `
    <div [class]="getClassString(field.class)" [style]="getStyleString(field.style)" class="form-field">
      
      <div class="switch-item">
        <button
          type="button"
          [id]="field.name"
          [name]="field.name"
          (click)="toggleSwitch()"
          (blur)="onBlur()"
          class="switch-button"
          [class.checked]="value"
        >
          <span class="switch-slider"></span>
        </button>
        
        @if (showLabels && field.label) {
          <label [for]="field.name" class="switch-label">
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
      useExisting: forwardRef(() => SwitchFieldComponent),
      multi: true
    }
  ]
})
export class SwitchFieldComponent extends BaseFieldComponent {
  toggleSwitch(): void {
    this.value = !this.value;
    this.onChange(this.value);
    this.onTouched();
    this.dirty = true;
  }
} 