import { Component, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';

@Component({
  selector: 'lib-password-field',
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

      <div class="input-wrapper relative">
        @if (field.prefixIcon) {
          <i [class]="field.prefixIcon" class="prefix-icon"></i>
        }
        
        <input
          [type]="showPassword ? 'text' : 'password'"
          [id]="field.name"
          [name]="field.name"
          [placeholder]="field.placeholder || ''"
          [value]="value"
          [readonly]="field.readonly"
          (input)="onInputChange($event)"
          (blur)="onBlur()"
          class="field-input pe-8"
          [class.has-prefix]="field.prefixIcon"
          [class.px-4]="true"
          [class.is-invalid]="isFieldInvalid()"
          [class.is-valid]="isFieldValid()"
        />
        
        <button
          type="button"
          (click)="togglePasswordVisibility()"
          class="text-gray-400 absolute top-1/2 p-2 end-0 translate-y-[-50%]"
        >
          <!-- showPassword ? 'fas fa-eye-slash' : 'fas fa-eye' -->
           <!-- svg eye slash -->
           @if (showPassword) {
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye-slash"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle><path d="M2 2l20 20"></path></svg>
           <!-- svg eye -->
           }@else {
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
           }
        </button>
      </div>
    </div>
    <ul class="max-w-md space-y-1 text-gray-500 list-disc list-inside dark:text-gray-400">
      @if (showValidationMessages && hasError('required')) {
        <li class="field-error">{{ getErrorMessage('required') }}</li>
      }
      @if (showValidationMessages && hasError('minlength')) {
        <li class="field-error">{{ getErrorMessage('minLength') }}</li>
      }
      @if (showValidationMessages && hasError('maxlength')) {
        <li class="field-error">{{ getErrorMessage('maxLength') }}</li>
      }
      @if (showValidationMessages && hasError('pattern')) {
        <li class="field-error">{{ getErrorMessage('pattern') }}</li>
      }
      @if (showValidationMessages && hasError('mismatch')) {
        <li class="field-error">{{ getErrorMessage('mismatch') }}</li>
      }
  </ul>
  `
  ,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PasswordFieldComponent),
      multi: true
    }
  ]
})
export class PasswordFieldComponent extends BaseFieldComponent {
  showPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
} 