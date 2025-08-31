import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';

@Component({
  selector: 'lib-email-field',
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
          type="email"
          [id]="field.name"
          [name]="field.name"
          [placeholder]="field.placeholder || ''"
          [value]="value"
          [readonly]="field.readonly"
          (input)="onInputChange($event)"
          (blur)="onBlur()"
          class="field-input"
          [class.has-prefix]="field.prefixIcon"
          [class.has-suffix]="field.suffixIcon"
          [class.is-invalid]="isFieldInvalid()"
          [class.is-valid]="isFieldValid()"
          autocomplete="off"
        />
        
        @if (field.suffixIcon) {
          <i [class]="field.suffixIcon" class="suffix-icon"></i>
        }
      </div>

      @if (showValidationMessages && hasError('required')) {
        <div class="field-error">{{ getErrorMessage('required') }}</div>
      }
      @if (showValidationMessages && hasError('email')) {
        <div class="field-error">{{ getErrorMessage('email') }}</div>
      }
      @if (showValidationMessages && hasError('minlength')) {
        <div class="field-error">{{ getErrorMessage('minLength') }}</div>
      }
      @if (showValidationMessages && hasError('maxlength')) {
        <div class="field-error">{{ getErrorMessage('maxLength') }}</div>
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
      useExisting: forwardRef(() => EmailFieldComponent),
      multi: true
    }
  ]
})
export class EmailFieldComponent extends BaseFieldComponent {
  // Form control validation is handled by the base class
} 