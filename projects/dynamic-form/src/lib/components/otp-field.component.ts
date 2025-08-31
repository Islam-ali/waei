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
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';
import { NgClass, AsyncPipe, CommonModule } from '@angular/common';
import { Subject, interval, Observable, BehaviorSubject, of } from 'rxjs';
import {
  switchMap,
  startWith,
  map,
  takeWhile,
  takeUntil,
  shareReplay,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'lib-otp-field',
  standalone: true,
  imports: [NgClass, AsyncPipe , CommonModule],
  template: `
    <div class="form-field">
      @if (field.description) {
        <p class="field-description text-center w-full">{{ field.description }}</p>
      }

      <!-- Countdown Timer -->
      @if (field.countdown) {
        <div class="countdown-timer">
          <p class="text-sm text-gray-600">
            Time remaining:
            <span class="font-medium text-primary-600">{{ (countdown$ | async) }}</span>
          </p>
        </div>
      }

      <!-- OTP Input Fields -->
      <div class="otp-container text-center mt-4" [ngClass]="field.class">
        <div class="otp-inputs" [style.grid-template-columns]="'repeat(' + (field.otpLength || 4) + ', 58px)'">
          @for (digit of otpArray; track $index) {
            <input
              #otpInput
              type="text"
              [name]="'otp' + ($index + 1)"
              maxlength="1"
              inputmode="numeric"
              pattern="[0-9]"
              [disabled]="disabled || (field.countdown && (countdown$ | async) || 0 > 0)"
              [placeholder]="'0'"
              [value]="digit"
              (input)="onOtpInput($event, $index)"
              (keydown)="onOtpKeydown($event, $index)"
              (paste)="onPaste($event)"
              class="otp-input"
              [class.is-invalid]="isFieldInvalid()"
              [class.is-valid]="isFieldValid()"
              [class.is-disabled]="disabled || (field.countdown && (countdown$ | async) || 0 > 0)"
            />
          }
        </div>
      </div>

      <!-- Resend Button -->
      @if (field.onResend && field.canResend !== undefined) {
        <button
          type="button"
          (click)="resendOtp()"
          [disabled]="!(canResend$ | async) || disabled"
          class="resend-button text-center w-full"
        >
          Resend Code
        </button>
      }

      <!-- Validation Messages -->
      @if (showValidationMessages && hasError('required')) {
        <div class="field-error">{{ getErrorMessage('required') }}</div>
      }
      @if (showValidationMessages && hasError('pattern')) {
        <div class="field-error">{{ getErrorMessage('pattern') }}</div>
      }
      @if (showValidationMessages && hasError('minlength')) {
        <div class="field-error">{{ getErrorMessage('minLength') }}</div>
      }
    </div>
  `,
  styles: [
    `
      .otp-container {
        width: 100%;
      }

      .otp-inputs {
        display: grid;
        gap: 0.5rem;
        justify-content: center;
      }

      .otp-input {
        width: 3rem;
        height: 3rem;
        text-align: center;
        font-size: 1.25rem;
        border: 2px solid #d1d5db;
        border-radius: 0.5rem;
        outline: none;
        transition: all 0.2s ease;
      }

      .otp-input:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
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
  countdown$: Observable<number> = of(0);
  canResend$ = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();
  private reset$ = new Subject<number>();

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
    this.destroy$.next();
    this.destroy$.complete();
    this.reset$.complete();
  }

  private bindCountdownStream(): void {
    this.countdown$ = this.reset$.pipe(
      switchMap((startSeconds) =>
        interval(1000).pipe(
          startWith(0),
          map((i) => startSeconds - i),
          takeWhile((v) => v >= 0, true),
          tap((value) => {
            if (value === 0) {
              this.canResend$.next(true);
            }
          }),
          shareReplay(1) // Ensures value is shared and replayed to new subscribers
        )
      ),
      takeUntil(this.destroy$)
    );
  }

  private resetCountdown(seconds: number): void {
    this.canResend$.next(false);
    this.reset$.next(seconds);
  }

  onOtpInput(event: any, fieldIndex: number): void {
    const input = event.target;
    const value = input.value;

    const numericValue = value.replace(/[^0-9]/g, '').substring(0, 1);
    input.value = numericValue;
    this.otpArray[fieldIndex] = numericValue;

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
    this.dirty = true;
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
}