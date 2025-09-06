import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { ControlField } from '../../../../projects/dynamic-form/src';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { isPlatformBrowser } from '@angular/common';
import { OtpFieldComponent } from "../../../../projects/dynamic-form/src/public-api";
import { CommonModule } from '@angular/common';
import { CountdownComponent } from "../../shared/components/countdown/countdown.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-verify-code',
  imports: [OtpFieldComponent, CommonModule, ReactiveFormsModule, CountdownComponent, TranslateModule],
  templateUrl: './verify-code.component.html',
  styleUrl: './verify-code.component.scss'
})
export class VerifyCodeComponent {
  // required inputs title
  @Input({required: true}) title = '';
  @Input({required: true}) subtitle: string = '';
  @Input({required: true}) buttonText: string = '';
  @Input() otpLength: number = 4;
  @Input() countdown: number = 5 * 60;
  @Input() maxAttempts: number = 3;
  @Input() onResend: () => void = () => { };
  @Input() onComplete: (otp: string) => void = () => { };
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();
  @ViewChild(OtpFieldComponent) otpFieldComponent!: OtpFieldComponent;

  isBrowser: boolean;
  otpControl: FormControl;
  isError: boolean = false;
  isVerified: boolean = false;
  isLoading: boolean = false;
  isResending: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  attempts: number = 0;
  // Dynamic OTP Field Configuration
  otpField: ControlField = {
    name: 'otp',
    type: 'control',
    controlType: 'otp',
    label: this.title,
    description: this.subtitle,
    otpLength: this.otpLength,
    countdown: this.countdown, // 5 minutes
    canResend: false,
    autoSubmit: true,
    onResend: () => {
      this.resendOtp();
    },
    onComplete: (otp: string) => {
      this.verifyOtp(otp);
    },
    validations: [
      { type: 'required', message: '' },
      { type: 'minLength', value: this.otpLength, message: '' }
    ]
  };
  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private translate: TranslateService
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.otpControl = new FormControl('', [Validators.required, Validators.minLength(4)]);
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
    // Clear OTP field errors
    if (this.otpFieldComponent) {
      this.otpFieldComponent.clearError();
    }
  }

  /** Resend OTP handler */
  public async resendOtp(): Promise<void> {
    if (this.isResending) return;

    this.isResending = true;
    this.clearMessages();

    try {
      // TODO: API call here
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      this.successMessage = this.translate.instant('VERIFY_CODE.OTP_SENT_SUCCESS');

      // Reset attempts on successful resend
      this.attempts = 0;

    } catch (error) {
      this.isError = true;
      this.otpControl.setErrors({ 'otp-failed': true });
      this.otpControl.updateValueAndValidity();
      this.errorMessage = this.translate.instant('VERIFY_CODE.OTP_SEND_FAILED');
      // Set error on OTP field
      if (this.otpFieldComponent) {
        setTimeout(() => {
          this.otpFieldComponent.setError(this.translate.instant('VERIFY_CODE.OTP_SEND_FAILED'));
        }, 0);
      }
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
      this.errorMessage = this.translate.instant('VERIFY_CODE.MAX_ATTEMPTS_REACHED');
      // Set error on OTP field
      if (this.otpFieldComponent) {
        setTimeout(() => {
          this.otpFieldComponent.setError(this.translate.instant('VERIFY_CODE.MAX_ATTEMPTS_REACHED'));
        }, 0);
      }
      return;
    }
    this.otpControl.setValue(otp);
    const otpValue = otp || this.otpControl.value || '';

    if (otpValue.length === 4) {
      this.isLoading = true;
      this.clearMessages();
      this.attempts++;
      try {
        // TODO: API call here
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (otpValue === '1234') {
          // TODO: Navigate to next page or show success message
          this.isError = false;
          this.isVerified = true;
          this.successMessage = this.translate.instant('VERIFY_CODE.ACCOUNT_VERIFIED');
          this.otpFieldComponent.isSuccess = true;
          this.otpFieldComponent.isError = false;
          setTimeout(() => {
            // Navigate to dashboard or next step
            this.onNextStep();
          }, 1000);

        } else {
          // Set error on OTP field
          if (this.otpFieldComponent) {
            // Use setTimeout to ensure the error is set after the current change detection cycle
            this.isError = true;
            this.isVerified = false;
            this.errorMessage = this.translate.instant('VERIFY_CODE.OTP_INCORRECT', { remaining: this.maxAttempts - this.attempts });
            this.otpFieldComponent.isSuccess = false;
            this.otpFieldComponent.isError = true;
            this.otpFieldComponent.setError(this.translate.instant('VERIFY_CODE.OTP_INCORRECT', { remaining: this.maxAttempts - this.attempts }));
          }

          // Clear the form for retry

          if (this.attempts >= this.maxAttempts) {
            this.errorMessage = this.translate.instant('VERIFY_CODE.MAX_ATTEMPTS_REACHED');
            if (this.otpFieldComponent) {
              setTimeout(() => {
                this.otpFieldComponent.setError(this.translate.instant('VERIFY_CODE.MAX_ATTEMPTS_REACHED'));
              }, 0);
            }
          }
        }
      } catch (error) {
        this.isError = true;
        this.errorMessage = this.translate.instant('VERIFY_CODE.VERIFICATION_ERROR');
        // Set error on OTP field
        if (this.otpFieldComponent) {
          setTimeout(() => {
            this.otpFieldComponent.setError(this.translate.instant('VERIFY_CODE.VERIFICATION_ERROR'));
          }, 0);
        }
      } finally {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    } else {
      this.isError = true;
      this.errorMessage = this.translate.instant('VERIFY_CODE.ENTER_4_DIGIT_OTP');
      // Set error on OTP field
      if (this.otpFieldComponent) {
        setTimeout(() => {
          this.otpFieldComponent.setError(this.translate.instant('VERIFY_CODE.ENTER_4_DIGIT_OTP'));
        }, 0);
      }
    }
  }

  /** Manual verify button handler */
  public onVerifyClick(): void {
    const otpValue = this.otpControl.value;
    if (otpValue && otpValue.length === 4) {
      this.verifyOtp(otpValue);
    } else {
      this.isError = true;
      this.errorMessage = this.translate.instant('VERIFY_CODE.ENTER_4_DIGIT_OTP');
      // Set error on OTP field
      if (this.otpFieldComponent) {
        setTimeout(() => {
          this.otpFieldComponent.setError(this.translate.instant('VERIFY_CODE.ENTER_4_DIGIT_OTP'));
        }, 0);
      }
    }
  }

  /** Handle form submission */
  public onSubmit(): void {
    if (this.otpControl.valid) {
      this.verifyOtp();
    } else {
      this.isError = true;
      // this.errorMessage = this.translate.instant('VERIFY_CODE.ENTER_CORRECT_OTP');
      // // Set error on OTP field
      // if (this.otpFieldComponent) {
      //   setTimeout(() => {
      //     this.otpFieldComponent.setError(this.translate.instant('VERIFY_CODE.ENTER_CORRECT_OTP'));
      //   }, 0);
      // }
    }
  }

  /**
   * Example method to demonstrate setting custom errors on OTP field
   * This can be called from anywhere in the component
   */
  public setOtpError(message: string): void {
    if (this.otpFieldComponent) {
      this.otpFieldComponent.setError(message);
    }
  }

  /**
   * Example method to clear OTP field errors
   */
  public clearOtpError(): void {
    if (this.otpFieldComponent) {
      this.otpFieldComponent.clearError();
    }
  }

  /**
   * Example method to reset the entire OTP field
   */
  public resetOtpField(): void {
    if (this.otpFieldComponent) {
      this.otpFieldComponent.resetField();
    }
  }

  /**
   * Test method to verify error handling is working
   * You can call this method to test the error functionality
   */
  public testOtpError(): void {
    if (this.otpFieldComponent) {
      setTimeout(() => {
        this.otpFieldComponent.setError('This is a test error message');
        setTimeout(() => {
        }, 100);
      }, 0);
    }
  }
}
