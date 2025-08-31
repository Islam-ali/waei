import { Component, Inject, OnInit, PLATFORM_ID, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { OtpFieldComponent } from '../../../../projects/dynamic-form/src/lib/components/otp-field.component';
import { ControlField } from '../../../../projects/dynamic-form/src/lib/dynamic-form.types';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, OtpFieldComponent]
})
export class OtpVerificationComponent implements OnInit, OnDestroy {
  attempts: number = 0;
  maxAttempts: number = 3;
  phone: string = '+966555555555';
  isError: boolean = false;
  isVerified: boolean = false;
  isLoading: boolean = false;
  isResending: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  otpForm: FormGroup;
  otpControl: FormControl;
  private isBrowser: boolean;

  // Dynamic OTP Field Configuration
  otpField: ControlField = {
    name: 'otp',
    type: 'control',
    controlType: 'otp',
    label: 'رمز التحقق',
    description: `تم إرسال رمز التحقق إلى رقم هاتفك ${this.phone}`,
    otpLength: 4,
    countdown: 5 * 60, // 5 minutes
    canResend: false,
    autoSubmit: true,
    onResend: () => {
      this.resendOtp();
    },
    onComplete: (otp: string) => {
      this.verifyOtp(otp);
    },
    validations: [
      { type: 'required', message: 'رمز التحقق مطلوب' },
      { type: 'minLength', value: 4, message: 'يجب أن يكون الرمز 4 أرقام' }
    ]
  };

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.otpControl = new FormControl('', [Validators.required, Validators.minLength(4)]);
    this.otpForm = this.fb.group({
      otp: this.otpControl
    });
  }

  ngOnInit(): void {
    // Update phone number in description
    this.updatePhoneDescription();
    
    // Listen to form changes for real-time validation
    this.otpControl.valueChanges.subscribe(value => {
      this.clearMessages();
      if (value && value.length === 4) {
        // Auto-verify when 4 digits are entered
        setTimeout(() => {
          this.verifyOtp(value);
        }, 100);
      }
    });
  }

  ngOnDestroy(): void {
    // Cleanup handled by the dynamic OTP component
  }

  /** Update phone number in OTP field description */
  private updatePhoneDescription(): void {
    this.otpField.description = `تم إرسال رمز التحقق إلى رقم هاتفك ${this.phone}`;
  }

  /** Clear error and success messages */
  private clearMessages(): void {
    this.isError = false;
    this.errorMessage = '';
    this.successMessage = '';
  }

  /** Resend OTP handler */
  public async resendOtp(): Promise<void> {
    if (this.isResending) return;
    
    this.isResending = true;
    this.clearMessages();
    
    try {
      console.log('إعادة إرسال رمز التحقق...');
      // TODO: API call here
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      this.successMessage = 'تم إرسال رمز التحقق بنجاح';
      console.log('تم إرسال رمز التحقق بنجاح');
      
      // Reset attempts on successful resend
      this.attempts = 0;
      
    } catch (error) {
      this.isError = true;
      this.errorMessage = 'فشل في إرسال رمز التحقق، يرجى المحاولة مرة أخرى';
      console.error('فشل في إرسال رمز التحقق:', error);
    } finally {
      this.isResending = false;
      this.cdr.detectChanges();
    }
  }

  /** Verify OTP */
  public async verifyOtp(otp?: string): Promise<void> {
    if (this.isLoading) return;
    
    if (this.attempts >= this.maxAttempts) {
      this.isError = true;
      this.errorMessage = 'تم تجاوز الحد الأقصى للمحاولات، يرجى طلب رمز جديد';
      console.log('❌ تم تجاوز الحد الأقصى للمحاولات');
      return;
    }

    const otpValue = otp || this.otpControl.value || '';
    
    if (otpValue.length === 4) {
      this.isLoading = true;
      this.clearMessages();
      this.attempts++;
      
      console.log('تم إرسال رمز التحقق:', otpValue);

      try {
        // TODO: API call here
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (otpValue === '1234') {
          console.log('✅ تم التحقق من رمز التحقق بنجاح');
          this.isError = false;
          this.isVerified = true;
          this.successMessage = 'تم التحقق من حسابك بنجاح!';
          
          // TODO: Navigate to next page or show success message
          setTimeout(() => {
            // Navigate to dashboard or next step
            console.log('الانتقال إلى الصفحة التالية...');
          }, 2000);
          
        } else {
          console.log('❌ رمز التحقق غير صحيح');
          this.isError = true;
          this.isVerified = false;
          this.errorMessage = `رمز التحقق غير صحيح. المحاولات المتبقية: ${this.maxAttempts - this.attempts}`;
          
          // Clear the form for retry
          this.otpControl.setValue('');
          
          if (this.attempts >= this.maxAttempts) {
            this.errorMessage = 'تم تجاوز الحد الأقصى للمحاولات، يرجى طلب رمز جديد';
          }
        }
      } catch (error) {
        this.isError = true;
        this.errorMessage = 'حدث خطأ أثناء التحقق، يرجى المحاولة مرة أخرى';
        console.error('خطأ في التحقق:', error);
      } finally {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    } else {
      this.isError = true;
      this.errorMessage = 'يرجى إدخال رمز التحقق المكون من 4 أرقام';
      console.log('❌ يرجى إدخال رمز التحقق الكامل');
    }
  }

  /** Manual verify button handler */
  public onVerifyClick(): void {
    const otpValue = this.otpControl.value;
    if (otpValue && otpValue.length === 4) {
      this.verifyOtp(otpValue);
    } else {
      this.isError = true;
      this.errorMessage = 'يرجى إدخال رمز التحقق المكون من 4 أرقام';
    }
  }

  /** Handle form submission */
  public onSubmit(): void {
    if (this.otpForm.valid) {
      this.verifyOtp();
    } else {
      this.isError = true;
      this.errorMessage = 'يرجى إدخال رمز التحقق الصحيح';
      console.log('النموذج غير صحيح');
    }
  }

  /** Get remaining attempts */
  public getRemainingAttempts(): number {
    return Math.max(0, this.maxAttempts - this.attempts);
  }

  /** Check if can resend */
  public canResendOtp(): boolean {
    return this.attempts >= this.maxAttempts || this.isResending;
  }
}
