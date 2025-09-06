import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { LanguageSwitcherComponent } from "../../shared/components";
import { PhoneNumberDirective } from "../../../../projects/dynamic-form/src/lib/directives/phone.directive";
import { VerifyCodeComponent } from "../verify-code/verify-code.component";
import { CreatePasswordComponent } from "../signup/signup-individual/create-password/create-password.component";

enum ForgotPassword {
  forgotPassword = 'forgotPassword',
  verifyCode = 'verifyCode',
  createPassword = 'createPassword',
}
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: true,
  imports: [TranslateModule,
    CommonModule,
    LanguageSwitcherComponent,
    RouterModule,
    PhoneNumberDirective,
    ReactiveFormsModule, VerifyCodeComponent, CreatePasswordComponent]
})
export class ForgotPasswordComponent implements OnInit {
  translate = inject(TranslateService);
  ForgotPassword: ForgotPassword = ForgotPassword.forgotPassword;
  forgotType: 'phone' | 'email' = 'phone';
  isVerifyPassword = false;
  showPassword = false;
  router = inject(Router);
  fb = inject(FormBuilder);
  ForgotPasswordFormUsernameAndEmail = this.fb.group({
      email: ['', [Validators.required , Validators.email]],
  });
  ForgotPasswordFormPhoneNumber = this.fb.group({
      phoneNumber: ['', [Validators.required , Validators.minLength(9) , Validators.maxLength(9)]],
  });
  titleVerifyCode = 'FORGOT_PASSWORD.PASSWORD_RECOVERY_CODE';
  subtitleVerifyCode = 'FORGOT_PASSWORD.PASSWORD_RECOVERY_SUBTITLE';
  titlePassword = 'FORGOT_PASSWORD.CREATE_NEW_PASSWORD';
  subtitlePassword = 'FORGOT_PASSWORD.NEW_PASSWORD_DIFFERENT';
  constructor() { }

  ngOnInit(): void { }

  switchforgotType(method: 'phone' | 'email'): void {
      this.forgotType = method;
  }

  isSelected(method: 'phone' | 'email'): boolean {
      return this.forgotType === method;
  }

  get isForgotPasswordFormInvalid() {
      return this.ForgotPasswordForm.invalid;
  }

  get ForgotPasswordForm(): FormGroup {
      return this.forgotType === 'phone' ? this.ForgotPasswordFormPhoneNumber : this.ForgotPasswordFormUsernameAndEmail;
  }

  isFieldInvalid(fieldName: string): boolean {
      const control = this.ForgotPasswordForm.get(fieldName);
      return !!(control?.invalid && control?.dirty);
  }

  getFieldLabel(fieldName: string): string {
      const labels: { [key: string]: string } = {
          email: this.translate.instant('FIELDS.EMAIL'),
          phoneNumber: this.translate.instant('FIELDS.PHONE_NUMBER'),
      };
      return labels[fieldName] || fieldName;
  }

  getFieldError(fieldName: string): string {
      const control = this.ForgotPasswordForm.get(fieldName);
      if (control?.errors && control.dirty) {
        if (control.errors['required']) {
          return this.translate.instant('VALIDATION.REQUIRED', { field: this.getFieldLabel(fieldName) });
        }
        if (control.errors['minlength']) {
          return this.translate.instant('VALIDATION.MIN_LENGTH', { 
            field: this.getFieldLabel(fieldName),
            length: control.errors['minlength'].requiredLength 
          });
        }
        if (control.errors['maxlength']) {
          return this.translate.instant('VALIDATION.MAX_LENGTH', { 
            field: this.getFieldLabel(fieldName),
            length: control.errors['maxlength'].requiredLength 
          });
        }
        if (control.errors['email']) {
          return this.translate.instant('VALIDATION.EMAIL', { 
            field: this.getFieldLabel(fieldName) 
          });
        }
      }
      return '';
    }

  onSubmit(): void {
      this.ForgotPassword = ForgotPassword.verifyCode;
  }

  onCreatePassword(): void {
    this.ForgotPassword = ForgotPassword.createPassword;
  }

  onPreviousStep(): void {
    this.ForgotPassword = ForgotPassword.forgotPassword;
  }
} 