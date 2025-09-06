import { Component, EventEmitter, Output, OnInit, inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-create-password',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './create-password.component.html',
  styleUrl: './create-password.component.scss'
})
export class CreatePasswordComponent implements OnInit {
  fb = inject(FormBuilder);
  translate = inject(TranslateService);
  @Input({required: true}) title = '';
  @Input({required: true}) subtitle = '';
  @Input({required: true}) buttonText = '';
  @Input() isShowPreviousButton = true;
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();
  
  passwordForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  // Password validation pattern
  private passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{6,}$/;

  constructor() {}

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.passwordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(this.passwordPattern)
      ]],
      confirmPassword: ['', [
        Validators.required,
        this.passwordMatchValidator.bind(this)
      ]]
    });
  }

  // Custom validator to check if passwords match
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = this.passwordForm?.get('password')?.value;
    const confirmPassword = control.value;
    
    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onNextStep() {
    if (this.passwordForm.valid) {
      this.nextStep.emit();
    } else {
      this.markFormGroupTouched();
    }
  }

  onPreviousStep() {
    this.previousStep.emit();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private markFormGroupTouched() {
    Object.keys(this.passwordForm.controls).forEach(key => {
      const control = this.passwordForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.passwordForm.get(fieldName);
    if (control?.errors && control.dirty) {
      if (control.errors['required']) {
        return this.translate.instant('VALIDATION.REQUIRED', { field: this.getFieldLabel(fieldName) });
      }
      if (control.errors['minlength']) {
        return this.translate.instant('VALIDATION.PASSWORD_MIN_LENGTH', { 
          length: control.errors['minlength'].requiredLength 
        });
      }
      if (control.errors['pattern']) {
        return this.translate.instant('VALIDATION.PASSWORD_PATTERN');
      }
      if (control.errors['passwordMismatch']) {
        return this.translate.instant('VALIDATION.PASSWORD_MISMATCH');
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      password: this.translate.instant('FIELDS.PASSWORD'),
      confirmPassword: this.translate.instant('FIELDS.CONFIRM_PASSWORD')
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.passwordForm.get(fieldName);
    return !!(control?.invalid && control?.dirty);
  }

  // Password strength indicator
  getPasswordStrength(): string {
    const password = this.passwordForm.get('password')?.value || '';
    if (!password) return '';
    
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*]/.test(password)) score++;
    
    if (score < 2) return 'weak';
    if (score < 4) return 'medium';
    return 'strong';
  }

  getPasswordStrengthColor(): string {
    const strength = this.getPasswordStrength();
    switch (strength) {
      case 'weak': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'strong': return 'text-green-500';
      default: return 'text-gray-500';
    }
  }

  getPasswordStrengthTranslation(): string {
    const strength = this.getPasswordStrength();
    if (!strength) return '';
    
    const strengthKey = strength.toUpperCase();
    return this.translate.instant(`CREATE_PASSWORD.STRENGTH_LEVELS.${strengthKey}`);
  }

  // Helper methods for template validation
  hasUppercase(): boolean {
    const password = this.passwordForm.get('password')?.value || '';
    return /[A-Z]/.test(password);
  }

  hasLowercase(): boolean {
    const password = this.passwordForm.get('password')?.value || '';
    return /[a-z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.passwordForm.get('password')?.value || '';
    return /[0-9]/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this.passwordForm.get('password')?.value || '';
    return /[!@#$%^&*]/.test(password);
  }

  hasMinLength(): boolean {
    const password = this.passwordForm.get('password')?.value || '';
    return password.length >= 6;
  }
}
