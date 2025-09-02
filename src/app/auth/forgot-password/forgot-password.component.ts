import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { OtpFieldComponent } from '../../../../projects/dynamic-form/src/lib/components/otp-field.component';
import { ControlField } from '../../../../projects/dynamic-form/src';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OtpFieldComponent]
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup;
  currentStep: 'email' | 'otp' | 'newPassword' = 'email';
  attempts: number = 0;
  maxAttempts: number = 3;
  userType: 'company' | 'individual' = 'individual'; // Default to individual
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // OTP field configuration
  otpFieldConfig: ControlField = {
    type: 'control',
    controlType: 'otp',
    name: 'otp',
    label: 'Verification Code',
    description: 'Enter the 4-digit code sent to your device',
    otpLength: 4,
    countdown: 4, // 5 minutes
    onComplete: (value: string) => this.onVerifyOtp(value),
    onResend: () => this.onResendOtp(),
    canResend: false,
    autoSubmit: true,
    class: 'w-full'
  };
  
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.formGroup = this.fb.group({
      identifier: ['', [Validators.required, Validators.email]],
      otp: ['', [Validators.required, Validators.pattern(/^[0-9]{4}$/)]],
      newPassword: ['', [
        Validators.required, 
        Validators.minLength(8), 
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
      ]],
      confirmPassword: ['', Validators.required]
    });

    // Add custom validator for password confirmation
    this.formGroup.get('confirmPassword')?.setValidators([
      Validators.required,
      this.passwordMatchValidator.bind(this)
    ]);
  }

  private passwordMatchValidator(control: any) {
    const password = this.formGroup?.get('newPassword')?.value;
    const confirmPassword = control.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Step 1: Send Code
  onSendCode(): void {
    if (this.formGroup.get('identifier')?.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      const identifier = this.formGroup.get('identifier')?.value;
      
      // Determine user type based on identifier format
      this.userType = this.isEmail(identifier) ? 'company' : 'individual';
      
      // Simulate API call
      setTimeout(() => {
        this.isLoading = false;
        this.currentStep = 'otp';
        
        // Show success message based on user type
        if (this.userType === 'company') {
          this.successMessage = 'A verification code has been sent to your email.';
        } else {
          this.successMessage = 'A verification code has been sent to your Phone.';
        }
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      }, 1000);
    }
  }

  private isEmail(value: string): boolean {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(value);
  }

  // Step 2: OTP Verification
  onVerifyOtp(otp: string): void {
    if (otp.length !== 4) {
      this.errorMessage = 'Verification code is required';
      return;
    }

    if (this.attempts >= this.maxAttempts) {
      this.errorMessage = 'Maximum attempts reached. Please request a new code.';
      return;
    }

    this.attempts++;
    this.isLoading = true;
    this.errorMessage = '';

    // Simulate OTP verification
    setTimeout(() => {
      this.isLoading = false;
      
      if (otp === '1234') { // Replace with actual verification logic
        console.log('OTP verified successfully');
        this.currentStep = 'newPassword';
        this.successMessage = 'Code verified successfully. Please enter your new password.';
        
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      } else {
        this.errorMessage = 'Incorrect code. Please try again.';
      }
    }, 1000);
  }

  // Resend OTP
  onResendOtp(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.attempts = 0;

    // Simulate resend API call
    setTimeout(() => {
      this.isLoading = false;
      
      // Show success message based on user type
      if (this.userType === 'company') {
        this.successMessage = 'A new Code has been sent to your registered email.';
      } else {
        this.successMessage = 'A new Code has been sent to your Phone.';
      }
      
      setTimeout(() => {
        this.successMessage = '';
      }, 3000);
    }, 1000);
  }

  // Step 3: New Password
  onSavePassword(): void {
    if (this.formGroup.get('newPassword')?.valid && 
        this.formGroup.get('confirmPassword')?.valid) {
      
      this.isLoading = true;
      this.errorMessage = '';

      // Simulate password reset API call
      setTimeout(() => {
        this.isLoading = false;
        
        // Redirect to login page with success message
        this.successMessage = 'Your password has been reset successfully. Please log in with your new password.';
        
        // In a real app, you would redirect to login page here
        setTimeout(() => {
          // Navigate to login page
          console.log('Redirecting to login page...');
        }, 2000);
      }, 1000);
    }
  }

  // Cancel flow
  onCancel(): void {
    // Clear all data
    this.formGroup.reset();
    this.currentStep = 'email';
    this.attempts = 0;
    this.errorMessage = '';
    this.successMessage = '';
    
    // In a real app, you would redirect to login page here
    console.log('Redirecting to login page...');
  }

  // Get validation messages
  getValidationMessage(fieldName: string): string {
    const field = this.formGroup.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) {
        switch (fieldName) {
          case 'identifier': return 'Email/Username is required';
          case 'newPassword': return 'New Password is required';
          case 'confirmPassword': return 'Please confirm your password';
          default: return 'This field is required';
        }
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['minlength']) {
        return 'New Password must be at least 8 characters with upper, lower, numbers, and special characters.';
      }
      if (field.errors['pattern']) {
        if (fieldName === 'newPassword') {
          return 'New Password must be at least 8 characters with upper, lower, numbers, and special characters.';
        }
        if (fieldName === 'otp') {
          return 'Please enter a valid 4-digit code';
        }
      }
      if (field.errors['mismatch']) {
        return 'Passwords do not match.';
      }
    }
    return '';
  }

  // Check if form is valid for current step
  isStepValid(): boolean {
    switch (this.currentStep) {
      case 'email':
        return this.formGroup.get('identifier')?.valid || false;
      case 'otp':
        return this.attempts < this.maxAttempts;
      case 'newPassword':
        return (this.formGroup.get('newPassword')?.valid || false) && 
               (this.formGroup.get('confirmPassword')?.valid || false) && 
               !this.formGroup.get('confirmPassword')?.errors?.['mismatch'];
      default:
        return false;
    }
  }
} 