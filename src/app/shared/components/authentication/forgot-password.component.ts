import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Subject, interval } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  formGroup!: FormGroup;
  currentStep: 'email' | 'otp' | 'newPassword' = 'email';
  countdown: number = 300; // 5 minutes in seconds
  canResend: boolean = false;
  attempts: number = 0;
  maxAttempts: number = 3;
  userType: 'company' | 'individual' = 'individual'; // Default to individual
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // OTP fields for better UX
  otpFields: string[] = ['', '', '', ''];
  
  private destroy$ = new Subject<void>();
  private countdownInterval: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
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
        this.startCountdown();
        
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
  onOtpInput(event: any, index: number): void {
    const input = event.target;
    const value = input.value;
    
    // Allow only numbers and limit to 1 character
    const numericValue = value.replace(/[^0-9]/g, '').substring(0, 1);
    this.otpFields[index] = numericValue;
    input.value = numericValue;
    
    // Move to next field if a digit is entered
    if (numericValue.length === 1 && index < 3) {
      setTimeout(() => {
        const nextInput = document.querySelector(`input[name="otp${index + 2}"]`) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }, 10);
    }
    
    // Auto-submit when all fields are filled
    if (index === 3 && numericValue.length === 1) {
      setTimeout(() => {
        this.onVerifyOtp();
      }, 100);
    }
  }

  onOtpKeydown(event: any, index: number): void {
    if (event.key === 'Backspace') {
      const input = event.target;
      
      // If current field is empty and not the first field, move to previous
      if (input.value === '' && index > 0) {
        const prevInput = document.querySelector(`input[name="otp${index}"]`) as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
          prevInput.select();
        }
      }
      // If current field has value, clear it
      else if (input.value !== '') {
        input.value = '';
        this.otpFields[index] = '';
      }
    }
  }

  onVerifyOtp(): void {
    const otp = this.otpFields.join('');
    
    if (otp.length !== 4) {
      this.errorMessage = 'Verification code is required';
      return;
    }

    if (this.countdown <= 0) {
      this.errorMessage = 'The code has expired. Please request a new one.';
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
        this.clearOtpFields();
      }
    }, 1000);
  }

  private clearOtpFields(): void {
    this.otpFields = ['', '', '', ''];
    for (let i = 1; i <= 4; i++) {
      const field = document.querySelector(`input[name="otp${i}"]`) as HTMLInputElement;
      if (field) {
        field.value = '';
      }
    }
    // Focus on first field
    const firstField = document.querySelector('input[name="otp1"]') as HTMLInputElement;
    if (firstField) {
      firstField.focus();
    }
  }

  // Resend OTP
  onResendOtp(): void {
    if (!this.canResend) {
      this.errorMessage = 'Please wait before requesting a new OTP.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.attempts = 0;

    // Simulate resend API call
    setTimeout(() => {
      this.isLoading = false;
      this.countdown = 300;
      this.canResend = false;
      this.startCountdown();
      this.clearOtpFields();
      
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
    this.countdown = 300;
    this.canResend = false;
    this.otpFields = ['', '', '', ''];
    this.errorMessage = '';
    this.successMessage = '';
    
    // Stop countdown
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    
    // In a real app, you would redirect to login page here
    console.log('Redirecting to login page...');
  }

  // Countdown timer
  private startCountdown(): void {
    this.countdown = 300;
    this.canResend = false;
    
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
        this.canResend = true;
      }
    }, 1000);
  }

  // Format time for display
  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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
        return this.otpFields.join('').length === 4 && this.countdown > 0 && this.attempts < this.maxAttempts;
      case 'newPassword':
        return (this.formGroup.get('newPassword')?.valid || false) && 
               (this.formGroup.get('confirmPassword')?.valid || false) && 
               !this.formGroup.get('confirmPassword')?.errors?.['mismatch'];
      default:
        return false;
    }
  }
} 