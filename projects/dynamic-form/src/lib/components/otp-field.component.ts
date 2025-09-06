// otp-field.component.ts
import {
  Component,
  forwardRef,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ElementRef,
  ViewChildren,
  QueryList,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';
import { NgClass, CommonModule } from '@angular/common';
import { Subject, BehaviorSubject } from 'rxjs';
import {
  takeUntil,
} from 'rxjs/operators';

@Component({
  selector: 'lib-otp-field',
  standalone: true,
  imports: [NgClass , CommonModule],
  template: `
    <div class="form-field">
      @if (field.description) {
        <p class="field-description text-center w-full">{{ field.description }}</p>
      }

      <!-- Countdown Timer -->
      <!-- @if (field.countdown) {
        <div class="flex justify-between items-center mb-8">
            <span class="text-green-500 font-semibold">{{ formatTime((countdown$ | async) || 0) }}</span>
            <span class="text-gray-500">Didn't receive code? <a
                    class="text-indigo-600 hover:text-indigo-500 font-semibold" href="#">Resend Code</a></span>
        </div>
      } -->

      <!-- OTP Input Fields -->
      <div class="otp-container text-center my-4" [ngClass]="field.class">
        <div class="otp-inputs">
          @for (digit of otpArray; track $index) {
            @if ($index == 2) {
              <span class="w-8 flex justify-center items-center"> <span class="w-4 h-[1px] bg-gray-400"></span> </span>
            }
            <input
              #otpInput
              type="text"
              [name]="'otp' + ($index + 1)"
              maxlength="1"
              inputmode="numeric"
              pattern="[0-9]"
              [disabled]="disabled || countdown$.value == 0"
              [placeholder]="'0'"
              [value]="digit"
              (input)="onOtpInput($event, $index)"
              (keydown)="onOtpKeydown($event, $index)"
              (paste)="onPaste($event)"
              class="otp-input"
              [class.is-invalid]="hasCustomErrorMessage() || isError"
              [class.is-valid]="(isFieldValid() && !hasCustomErrorMessage() && isSuccess)"
              [class.is-disabled]="disabled "
            />
          }
        </div>
      </div>

      <!-- Resend Button -->
      <!-- @if (field.onResend && field.canResend !== undefined) {
        <button
          type="button"
          (click)="resendOtp()"
          [disabled]="!(canResend$ | async) || disabled"
          class="resend-button text-center w-full"
        >
          Resend Code
        </button>
      } -->

      <!-- Validation Messages -->
      <!-- @if (showValidationMessages && hasError('required')) {
        <div class="field-error">{{ getErrorMessage('required') }}</div>
      }
      @if (showValidationMessages && hasError('pattern')) {
        <div class="field-error">{{ getErrorMessage('pattern') }}</div>
      }
      @if (showValidationMessages && hasError('minlength')) {
        <div class="field-error">{{ getErrorMessage('minLength') }}</div>
      } -->
      <!-- @if (showValidationMessages && hasCustomErrorMessage()) {
        <div class="field-error">{{ getErrorMessage('custom') }}</div>
      } -->
    </div>
  `,
  styles: [
    `
      .otp-container {
        width: 100%;
      }

      .otp-inputs {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
      }

      .otp-input {
        width: 5rem;
        height: 3rem;
        text-align: center;
        font-size: 1.25rem;
        border: 1px solid #d1d5db;
        border-radius: 0.5rem;
        outline: none;
        transition: all 0.2s ease;
        @media (max-width: 768px) {
          width: 4rem;
          height: 3rem;
        }
      }

      .otp-input:focus {
        border-color: #3b82f6;
      }

      .otp-input.is-invalid {
        border-color: #ef4444;
      }

      .otp-input.is-valid {
        border-color: #10b981;
      }

      .otp-input.is-disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .countdown-timer {
        text-align: center;
        margin-bottom: 1rem;
      }

      .resend-button {
        margin-top: 1rem;
        padding: 0.5rem 1rem;
        background: none;
        border: none;
        color: #3b82f6;
        cursor: pointer;
        font-size: 0.875rem;
        transition: color 0.2s ease;
      }

      .resend-button:hover:not(:disabled) {
        color: #1d4ed8;
      }

      .resend-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .field-error {
        color: #ef4444;
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpFieldComponent),
      multi: true,
    },
  ],
})
export class OtpFieldComponent extends BaseFieldComponent implements OnInit, OnDestroy {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  otpArray: string[] = [];
  countdown$ = new BehaviorSubject<number>(0);
  canResend$ = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();
  private reset$ = new Subject<number>();
  private cdr = inject(ChangeDetectorRef);
  private countdownTimer?: any;
  // Error handling properties
  private customError: string = '';
  private hasCustomError: boolean = false;

  constructor() {
    super();
  }

  ngOnInit(): void {
    const otpLength = this.field.otpLength || 4;
    this.otpArray = new Array(otpLength).fill('');

    if (this.field.countdown) {
      this.bindCountdownStream();
      this.resetCountdown(this.field.countdown);
    }

    // Focus first input after view init
    setTimeout(() => {
      this.focusInput(0);
    }, 100);
  }

  ngOnDestroy(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = undefined;
    }
    this.destroy$.next();
    this.destroy$.complete();
    this.reset$.complete();
  }

  private bindCountdownStream(): void {
    // Subscribe to reset$ directly
    this.reset$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((startSeconds) => {
      this.startCountdown(startSeconds);
    });
  }

  private startCountdown(startSeconds: number): void {
    // Clear any existing timer
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = undefined;
    }
    
    let currentValue = startSeconds;
    this.countdown$.next(currentValue);
    
    this.countdownTimer = setInterval(() => {
      currentValue--;
      
      if (currentValue >= 0) {
        this.countdown$.next(currentValue);
        this.cdr.detectChanges();
        
        if (currentValue === 0) {
          this.canResend$.next(true);
          clearInterval(this.countdownTimer);
          this.countdownTimer = undefined;
        }
      } else {
        clearInterval(this.countdownTimer);
        this.countdownTimer = undefined;
      }
    }, 1000);
  }

  private resetCountdown(seconds: number): void {
    // Clear existing timer first
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = undefined;
    }
    
    this.canResend$.next(false);
    this.reset$.next(seconds);
  }

  onOtpInput(event: any, fieldIndex: number): void {
    const input = event.target;
    const value = input.value;

    const numericValue = value.replace(/[^0-9]/g, '').substring(0, 1);
    input.value = numericValue;
    this.otpArray[fieldIndex] = numericValue;

    // Clear custom error when user starts typing
    if (this.hasCustomError) {
      this.clearError();
    }

    if (numericValue && fieldIndex < this.otpArray.length - 1) {
      setTimeout(() => this.focusInput(fieldIndex + 1), 10);
    }

    if (fieldIndex === this.otpArray.length - 1 && numericValue) {
      if (this.field.autoSubmit !== false) {
        setTimeout(() => this.onComplete(), 100);
      }
    }

    this.updateValue();
  }

  onOtpKeydown(event: any, fieldIndex: number): void {
    if (event.key === 'Backspace') {
      const input = event.target;

      if (input.value === '' && fieldIndex > 0) {
        this.focusInput(fieldIndex - 1);
        const prevInput = this.otpInputs.get(fieldIndex - 1)?.nativeElement;
        if (prevInput) {
          prevInput.select();
        }
      } else if (input.value !== '') {
        input.value = '';
        this.otpArray[fieldIndex] = '';
        this.updateValue();
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text/plain') || '';
    const numbers = pastedData.replace(/[^0-9]/g, '').split('');

    for (let i = 0; i < Math.min(numbers.length, this.otpArray.length); i++) {
      this.otpArray[i] = numbers[i];
      const input = this.otpInputs.get(i)?.nativeElement;
      if (input) {
        input.value = numbers[i];
      }
    }

    this.updateValue();

    if (this.otpArray.every((digit) => digit !== '') && this.field.autoSubmit !== false) {
      setTimeout(() => this.onComplete(), 100);
    }
  }

  private focusInput(index: number): void {
    const input = this.otpInputs.get(index)?.nativeElement;
    input?.focus();
  }

  private updateValue(): void {
    const otpValue = this.otpArray.join('');
    this.value = otpValue;
    this.onChange(otpValue);
    this.onTouched();
    this.control.setValue(otpValue);
    this.control.updateValueAndValidity();
    this.control.markAsDirty();
  }

  private onComplete(): void {
    const otpValue = this.otpArray.join('');
    if (otpValue.length === this.otpArray.length && this.field.onComplete) {
      this.field.onComplete(otpValue);
    }
  }

  resendOtp(): void {
    if (!(this.canResend$.value) || this.disabled) return;

    if (this.field.onResend) {
      this.field.onResend();
    }

    if (this.field.countdown) {
      this.resetCountdown(this.field.countdown);
    }

    this.otpArray = new Array(this.field.otpLength || 4).fill('');
    this.otpInputs.forEach((inputRef) => {
      inputRef.nativeElement.value = '';
    });
    this.updateValue();
    this.focusInput(0);
  }

  override writeValue(value: any): void {
    if (value && typeof value === 'string') {
      const digits = value.split('');
      for (let i = 0; i < Math.min(digits.length, this.otpArray.length); i++) {
        this.otpArray[i] = digits[i];
      }
    } else {
      this.otpArray = new Array(this.field.otpLength || 4).fill('');
    }
    this.value = value;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Error handling methods
  /**
   * Set a custom error message on the OTP field
   * @param errorMessage - The error message to display
   */
  setError(errorMessage: string): void {
    this.customError = errorMessage;
    this.hasCustomError = true;
    
    // Force change detection
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  /**
   * Clear any custom error messages
   */
  clearError(): void {
    this.customError = '';
    this.hasCustomError = false;
    
    // Force change detection
    this.cdr.markForCheck();
    this.cdr.detectChanges();
  }

  /**
   * Check if there's a custom error
   */
  hasCustomErrorMessage(): boolean {
    const hasError = this.hasCustomError && !!this.customError && this.customError.length > 0;  
    return hasError;
  }

  /**
   * Get the custom error message
   */
  getCustomErrorMessage(): string {
    return this.customError;
  }

  /**
   * Override the base field invalid check to include custom errors
   */
  override isFieldInvalid(): boolean {
    return super.isFieldInvalid() || this.hasCustomError;
  }

  /**
   * Override the base field error check to include custom errors
   */
  override hasError(errorType: string): boolean {
    if (errorType === 'custom' && this.hasCustomError) {
      return true;
    }
    return super.hasError(errorType);
  }

  /**
   * Override the base field error message to include custom errors
   */
  override getErrorMessage(errorType: string): string {
    if (errorType === 'custom' && this.hasCustomError) {
      return this.customError;
    }
    return super.getErrorMessage(errorType);
  }

  /**
   * Clear the OTP field and reset to initial state
   */
  clearField(): void {
    this.otpArray = new Array(this.field.otpLength || 4).fill('');
    this.otpInputs.forEach((inputRef) => {
      inputRef.nativeElement.value = '';
    });
    this.updateValue();
    this.clearError();
    this.focusInput(0);
  }

  /**
   * Reset the field to its initial state
   */
  resetField(): void {
    this.clearField();
    this.dirty = false;
    this.touched = false;
  }
}