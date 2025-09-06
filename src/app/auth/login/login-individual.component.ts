import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { LanguageSwitcherComponent } from "../../shared/components";
import { PhoneNumberDirective } from "../../../../projects/dynamic-form/src/lib/directives/phone.directive";
import { VerifyCodeComponent } from "../verify-code/verify-code.component";

@Component({
    selector: 'app-login-individual',
    templateUrl: './login-individual.component.html',
    styleUrls: ['./login-individual.component.scss'],
    imports: [TranslateModule,
    CommonModule,
    LanguageSwitcherComponent,
    RouterModule,
    PhoneNumberDirective,
    ReactiveFormsModule, VerifyCodeComponent]
})
export class LoginIndividualComponent implements OnInit {
    translate = inject(TranslateService);
    loginMethod: 'phone' | 'email' = 'phone';
    isVerifyPassword = false;
    showPassword = false;
    router = inject(Router);
    fb = inject(FormBuilder);
    loginFormUsernameAndEmail = this.fb.group({
        usernameOrEmail: ['', [Validators.required]],
        password: ['', [Validators.required]],
    });
    loginFormPhoneNumber = this.fb.group({
        phoneNumber: ['', [Validators.required , Validators.minLength(9) , Validators.maxLength(9)]],
    });
    titleVerifyCode = 'VERIFY_PASSWORD.TITLE';
    subtitleVerifyCode = 'VERIFY_PASSWORD.SUBTITLE';
    constructor() { }

    ngOnInit(): void { }

    switchLoginMethod(method: 'phone' | 'email'): void {
        this.loginMethod = method;
    }

    isSelected(method: 'phone' | 'email'): boolean {
        return this.loginMethod === method;
    }

    get isLoginFormInvalid() {
        return this.loginForm.invalid;
    }

    get loginForm(): FormGroup {
        return this.loginMethod === 'phone' ? this.loginFormPhoneNumber : this.loginFormUsernameAndEmail;
    }

    isFieldInvalid(fieldName: string): boolean {
        const control = this.loginForm.get(fieldName);
        return !!(control?.invalid && control?.dirty);
    }

    getFieldLabel(fieldName: string): string {
        const labels: { [key: string]: string } = {
            usernameOrEmail: this.translate.instant('FIELDS.USERNAME_OR_EMAIL'),
            phoneNumber: this.translate.instant('FIELDS.PHONE_NUMBER'),
        };
        return labels[fieldName] || fieldName;
    }
  
    getFieldError(fieldName: string): string {
        const control = this.loginForm.get(fieldName);
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
          if (control.errors['pattern']) {
            if (fieldName === 'phoneNumber') {
              return this.translate.instant('VALIDATION.PHONE_PATTERN');
            }
            if (fieldName === 'usernameOrEmail') {
              return this.translate.instant('VALIDATION.USERNAME_OR_EMAIL_PATTERN');
            }
            return this.translate.instant('VALIDATION.INVALID_FORMAT');
          }
        }
        return '';
      }

    onSubmit(): void {
        if (this.loginMethod === 'phone') {
            this.isVerifyPassword = true;
        } else {
            // this.router.navigate(['/auth/signin']);
        }
        console.log(this.isVerifyPassword);
    }
} 