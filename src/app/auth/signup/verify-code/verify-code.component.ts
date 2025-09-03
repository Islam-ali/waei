import { ChangeDetectorRef, Component, EventEmitter, Inject, Output, PLATFORM_ID } from '@angular/core';
import { ControlField } from '../../../../../projects/dynamic-form/src';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { OtpFieldComponent } from "../../../../../projects/dynamic-form/src/public-api";
import { CommonModule } from '@angular/common';
import { CountdownComponent } from "../../../shared/components/countdown/countdown.component";

@Component({
  selector: 'app-verify-code',
  imports: [OtpFieldComponent, CommonModule, ReactiveFormsModule, CountdownComponent],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.scss'
})
export class VerifyCodeComponent {
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();
  isBrowser: boolean;
  otpControl: FormControl;
  otpForm: FormGroup;
  isError: boolean = false;
  isVerified: boolean = false;
  isLoading: boolean = false;
  isResending: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  attempts: number = 0;
  maxAttempts: number = 3;
  // Dynamic OTP Field Configuration
  otpField: ControlField = {
    name: 'otp',
    type: 'control',
    controlType: 'otp',
    label: 'رمز التحقق',
    description: '',
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
    this.otpControl.valueChanges.subscribe(value => {
      console.log('value', value);
      this.clearMessages();
      if (value && value.length === 4) {
        // Auto-verify when 4 digits are entered
        setTimeout(() => {
          this.verifyOtp(value);
        }, 100);
      }
    });
  }
  onNextStep() {
    this.nextStep.emit();
  }
  onPreviousStep() {
    this.previousStep.emit();
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
}
