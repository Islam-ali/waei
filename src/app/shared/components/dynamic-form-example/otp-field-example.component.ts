import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OtpFieldComponent } from 'projects/dynamic-form/src/lib/components/otp-field.component';
import { ControlField } from 'projects/dynamic-form/src/lib/dynamic-form.types';

@Component({
  selector: 'app-otp-field-example',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OtpFieldComponent],
  template: `
    <div class="container mx-auto p-6 max-w-2xl">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Dynamic OTP Field Examples</h1>
      
      <!-- Basic OTP Field -->
      <div class="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Basic OTP Field (4 digits)</h2>
        <form [formGroup]="basicOtpForm" (ngSubmit)="onBasicOtpSubmit()">
          <lib-otp-field
            [field]="basicOtpField"
            [control]="basicOtpForm.get('basicOtp')!"
            [showLabels]="true"
            [showValidationMessages]="true"
          ></lib-otp-field>
          <button type="submit" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Verify OTP
          </button>
        </form>
        <div class="mt-4 p-3 bg-gray-100 rounded">
          <p class="text-sm text-gray-600">Current value: {{ basicOtpForm.get('basicOtp')?.value || 'Not entered' }}</p>
        </div>
      </div>

      <!-- OTP with Countdown Timer -->
      <div class="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">OTP with Countdown Timer (6 digits)</h2>
        <form [formGroup]="countdownOtpForm" (ngSubmit)="onCountdownOtpSubmit()">
          <lib-otp-field
            [field]="countdownOtpField"
            [control]="countdownOtpForm.get('countdownOtp')!"
            [showLabels]="true"
            [showValidationMessages]="true"
          ></lib-otp-field>
          <button type="submit" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Verify OTP
          </button>
        </form>
        <div class="mt-4 p-3 bg-gray-100 rounded">
          <p class="text-sm text-gray-600">Current value: {{ countdownOtpForm.get('countdownOtp')?.value || 'Not entered' }}</p>
        </div>
      </div>

      <!-- OTP with Auto-submit Disabled -->
      <div class="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">OTP with Manual Submit (5 digits)</h2>
        <form [formGroup]="manualOtpForm" (ngSubmit)="onManualOtpSubmit()">
          <lib-otp-field
            [field]="manualOtpField"
            [control]="manualOtpForm.get('manualOtp')!"
            [showLabels]="true"
            [showValidationMessages]="true"
          ></lib-otp-field>
          <button type="submit" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Verify OTP
          </button>
        </form>
        <div class="mt-4 p-3 bg-gray-100 rounded">
          <p class="text-sm text-gray-600">Current value: {{ manualOtpForm.get('manualOtp')?.value || 'Not entered' }}</p>
        </div>
      </div>

      <!-- Complete OTP Form -->
      <div class="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 class="text-xl font-semibold mb-4 text-gray-700">Complete OTP Verification Form</h2>
        <form [formGroup]="completeOtpForm" (ngSubmit)="onCompleteOtpSubmit()">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              formControlName="phone"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
            />
          </div>
          
          <lib-otp-field
            [field]="completeOtpField"
            [control]="completeOtpForm.get('otp')!"
            [showLabels]="true"
            [showValidationMessages]="true"
          ></lib-otp-field>
          
          <button type="submit" class="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Verify Account
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .container {
      background-color: #f8fafc;
      min-height: 100vh;
    }
  `]
})
export class OtpFieldExampleComponent {
  basicOtpForm: FormGroup;
  countdownOtpForm: FormGroup;
  manualOtpForm: FormGroup;
  completeOtpForm: FormGroup;

  // Basic OTP Field Configuration
  basicOtpField: ControlField = {
    name: 'basicOtp',
    type: 'control',
    controlType: 'otp',
    label: 'Enter OTP Code',
    description: 'Please enter the 4-digit code sent to your phone',
    otpLength: 4,
    autoSubmit: true,
    validations: [
      { type: 'required', message: 'OTP is required' },
      { type: 'minLength', value: 4, message: 'OTP must be 4 digits' }
    ]
  };

  // Countdown OTP Field Configuration
  countdownOtpField: ControlField = {
    name: 'countdownOtp',
    type: 'control',
    controlType: 'otp',
    label: 'Verification Code',
    description: 'Enter the 6-digit code sent to your phone',
    otpLength: 6,
    countdown: 300, // 5 minutes
    canResend: false,
    onResend: () => {
      console.log('Resending OTP...');
      // Simulate API call
      setTimeout(() => {
        console.log('OTP resent successfully');
      }, 1000);
    },
    onComplete: (otp: string) => {
      console.log('OTP completed:', otp);
      // Auto-verify logic here
    },
    validations: [
      { type: 'required', message: 'Verification code is required' },
      { type: 'minLength', value: 6, message: 'Code must be 6 digits' }
    ]
  };

  // Manual OTP Field Configuration
  manualOtpField: ControlField = {
    name: 'manualOtp',
    type: 'control',
    controlType: 'otp',
    label: 'Security Code',
    description: 'Enter the 5-digit security code',
    otpLength: 5,
    autoSubmit: false, // Disable auto-submit
    validations: [
      { type: 'required', message: 'Security code is required' },
      { type: 'minLength', value: 5, message: 'Code must be 5 digits' }
    ]
  };

  // Complete OTP Field Configuration
  completeOtpField: ControlField = {
    name: 'otp',
    type: 'control',
    controlType: 'otp',
    label: 'Verification Code',
    description: 'Enter the 4-digit code sent to your phone',
    otpLength: 4,
    countdown: 180, // 3 minutes
    canResend: false,
    onResend: () => {
      console.log('Resending verification code...');
      // Simulate API call
      setTimeout(() => {
        console.log('Verification code resent');
      }, 1000);
    },
    onComplete: (otp: string) => {
      console.log('Verification completed:', otp);
      // Auto-verify logic here
    },
    validations: [
      { type: 'required', message: 'Verification code is required' },
      { type: 'minLength', value: 4, message: 'Code must be 4 digits' }
    ]
  };

  constructor(private fb: FormBuilder) {
    this.basicOtpForm = this.fb.group({
      basicOtp: ['', [Validators.required, Validators.minLength(4)]]
    });

    this.countdownOtpForm = this.fb.group({
      countdownOtp: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.manualOtpForm = this.fb.group({
      manualOtp: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.completeOtpForm = this.fb.group({
      phone: ['', [Validators.required]],
      otp: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onBasicOtpSubmit(): void {
    if (this.basicOtpForm.valid) {
      const value = this.basicOtpForm.get('basicOtp')?.value;
      console.log('Basic OTP verified:', value);
    } else {
      console.log('Basic OTP validation failed');
    }
  }

  onCountdownOtpSubmit(): void {
    if (this.countdownOtpForm.valid) {
      const value = this.countdownOtpForm.get('countdownOtp')?.value;
      console.log('Countdown OTP verified:', value);
    } else {
      console.log('Countdown OTP validation failed');
    }
  }

  onManualOtpSubmit(): void {
    if (this.manualOtpForm.valid) {
      const value = this.manualOtpForm.get('manualOtp')?.value;
      console.log('Manual OTP verified:', value);
    } else {
      console.log('Manual OTP validation failed');
    }
  }

  onCompleteOtpSubmit(): void {
    if (this.completeOtpForm.valid) {
      const phone = this.completeOtpForm.get('phone')?.value;
      const otp = this.completeOtpForm.get('otp')?.value;
      console.log('Phone:', phone);
      console.log('OTP:', otp);
      console.log('Account verification successful!');
    } else {
      console.log('Complete OTP form validation failed');
    }
  }
} 