import { Component, Input, forwardRef, Optional } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';
import { ControlField, ValidationRule } from '../dynamic-form.types';
import { CommonModule } from '@angular/common';
import { MaxLengthDirective } from '../directives/max-length.directive';
import { PhoneNumberDirective } from '../directives/phone.directive';

interface CountryCode {
  name: string;
  code: string;
  flag: string;
  dialCode: string;
  length: number;
}

@Component({
  selector: 'lib-phone-field',
  template: `
    <div class="relative">
        @if (showLabels && field.label) {
      <label 
             [for]="field.name" 
             class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">

        {{ field.label }}
        @if (isRequired()) {
          <span class="text-red-500">*</span>
        }
      </label>
      }
      <div class="flex items-center relative field-input group p-0">
        <!-- Country Code Dropdown Button -->
        <button 
          type="button"
          (click)="toggleDropdown()"
          class="shrink-0 w-[100px] cursor-default z-10 inline-flex items-center py-2 px-4 text-sm font-medium text-center text-gray-900 border rounded-s-lg dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
          [ngClass]="{'cursor-pointer hover:bg-gray-200': !field.isViewOnly}"
          [disabled]="disabled">
          <span class="inline-flex items-center">
            <span class="text-lg">{{ selectedCountry.flag }}</span>
            <span class="ms-2">{{ selectedCountry.dialCode }}</span>
            @if (!field.isViewOnly) {
            <svg   class="w-2.5 h-2.5 ms-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
              <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/>
            </svg>
            }
          </span>
        </button>

        <!-- Country Codes Dropdown -->
        @if (isDropdownOpen) {
        <div 
             class="absolute top-full start-0 max-h-40 overflow-y-auto z-20 bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-52 dark:bg-gray-700 mt-1">
          <ul class="py-2 text-sm text-gray-700 dark:text-gray-200">
            @for (country of countries; track country.code) {
            <li>
              <button 
                type="button" 
                (click)="selectCountry(country)"
                class="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600 dark:hover:text-white">
                <span class="inline-flex items-center">
                  <span class="text-sm me-2">{{ country.flag }}</span>
                  <span>{{ country.name }} ({{ country.dialCode }})</span>
                </span>
              </button>
            </li>
            }
          </ul>
        </div>
        }

        <!-- Phone Input -->
        <div class="relative w-full h-full p-0">
          <input 
            type="text" 
            [id]="field.name"
            [name]="field.name"
            [placeholder]="field.placeholder || 'Enter phone number'"
            [value]="phoneNumber"
            (input)="onPhoneInput($event)"
            (blur)="onBlur()"
            [appMaxLength]="selectedCountry.length"
            [disabled]="disabled"
            class="w-full h-full py-2 px-2 outline-none"
            [class.border-red-500]="isFieldInvalid()"
            [class.focus:border-red-500]="isFieldInvalid()"
            [class.focus:ring-red-500]="isFieldInvalid()" />
        </div>
      </div>

      <!-- Validation Messages -->
      @if (showValidationMessages && isFieldInvalid()) {        
      <div class="mt-1">
        @if (hasError('required')) {
        <p class="text-red-600 text-sm">
          {{ getErrorMessage('required') }}
        </p>
        }
        @if (hasError('pattern')) {
        <p class="text-red-600 text-sm">
          {{ getErrorMessage('pattern') }}
        </p>
        }
        @if (hasError('invalidPhone')) {
        <p class="text-red-600 text-sm">
          {{ getErrorMessage('invalidPhone') }}
        </p>
        }
      </div>
      }
      <!-- Description -->
      @if (field.description) { 
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        {{ field.description }}
      </p>
      }
    </div>
  `,
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaxLengthDirective
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PhoneFieldComponent),
      multi: true
    }
  ]
})
export class PhoneFieldComponent implements ControlValueAccessor {
  @Input() field!: ControlField;
  @Input() disabled = false;
  @Input() showLabels = true;
  @Input() showValidationMessages = true;
  @Input() direction: 'ltr' | 'rtl' = 'ltr';
  @Input() control!: FormControl;

  value: string = '';
  phoneNumber: string = '';
  isDropdownOpen = false;
  selectedCountry: CountryCode;

  countries: CountryCode[] = [
    { name: 'Saudi Arabia', code: 'SA', flag: '🇸🇦', dialCode: '+966' , length: 9 },
    { name: 'Egypt', code: 'EG', flag: '🇪🇬', dialCode: '+20' , length: 9 },
    { name: 'UAE', code: 'AE', flag: '🇦🇪', dialCode: '+971' , length: 9 },
    { name: 'Kuwait', code: 'KW', flag: '🇰🇼', dialCode: '+965' , length: 9 },
    { name: 'Qatar', code: 'QA', flag: '🇶🇦', dialCode: '+974' , length: 9 },
    { name: 'United States', code: 'US', flag: '🇺🇸', dialCode: '+1' , length: 9 },
    { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', dialCode: '+44' , length: 9 },
    { name: 'Australia', code: 'AU', flag: '🇦🇺', dialCode: '+61' , length: 9 },
    { name: 'Germany', code: 'DE', flag: '🇩🇪', dialCode: '+49' , length: 9 },
    { name: 'France', code: 'FR', flag: '🇫🇷', dialCode: '+33' , length: 9 },
  ];

  onChange = (value: string) => { };
  onTouched = () => { };

  constructor() {
    this.selectedCountry = this.countries[0]; // Default to US
  }

  ngOnInit() {
    // Set default country based on field configuration
    if (this.field.value) {
      const country = this.countries.find(c => c.dialCode === this.field.value);
      if (country) {
        this.selectedCountry = country;
      }
    }
  }

  writeValue(value: string): void {
    this.value = value || '';
    this.parsePhoneNumber(value);
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

  toggleDropdown(): void {
    if (this.field.isViewOnly) {
      return;
    }
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectCountry(country: CountryCode): void {
    this.selectedCountry = country;
    this.isDropdownOpen = false;
    this.updateValue();
  }

  onPhoneInput(event: any): void {
    const input = event.target.value;
    this.phoneNumber = input;
    this.updateValue();
  }

  onBlur(): void {
    this.onTouched();
  }

  private updateValue(): void {
    const fullPhoneNumber = `${this.selectedCountry.dialCode} ${this.phoneNumber}`.trim();
    this.value = fullPhoneNumber;
    this.onChange(fullPhoneNumber);
  }

  private parsePhoneNumber(value: string): void {
    if (!value) {
      this.phoneNumber = '';
      return;
    }

    // Try to find country code in the value
    const country = this.countries.find(c => value.startsWith(c.dialCode));
    if (country) {
      this.selectedCountry = country;
      this.phoneNumber = value.replace(country.dialCode, '').trim();
    } else {
      this.phoneNumber = value;
    }
  }

  // Helper methods from BaseFieldComponent
  getErrorMessage(errorType?: string): string {
    if (!this.field.validations) return '';

    if (errorType) {
      const validation = this.field.validations.find(v => v.type === errorType);
      if (validation) {
        return validation.message;
      }
    }

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

  isRequired(): boolean {
    return this.field.validations?.some(v => v.type === 'required') || false;
  }
} 