import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { PhoneNumberDirective } from '../../../../../../projects/dynamic-form/src/lib/directives/phone.directive';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-company-registration',
  imports: [CommonModule, ReactiveFormsModule, PhoneNumberDirective, TranslateModule],
  templateUrl: './company-registration.component.html',
  styleUrl: './company-registration.component.scss'
})
export class CompanyRegistrationComponent implements OnInit {
  @Output() nextStep = new EventEmitter<void>();
  
  companyForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService
  ) {}
  
  ngOnInit() {
    this.initializeForm();
  }
  
  private initializeForm() {
    this.companyForm = this.fb.group({
      companyType: ['private', [Validators.required]],
      companyName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(100),
        Validators.pattern(/^[a-zA-Z0-9\s\-&.,()]+$/)
      ]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{9}$/),
        Validators.minLength(9),
        Validators.maxLength(9)
      ]]
    });
  }
  
  isSelected(type: string): boolean {
    return this.companyForm.get('companyType')?.value === type;
  }
  
  onCompanyTypeChange(type: string) {
    this.companyForm.patchValue({ companyType: type });
  }
  
  onNextStep() {
    if (this.companyForm.valid) {
      this.nextStep.emit();
    } else {
      this.markFormGroupTouched();
    }
  }
  
  private markFormGroupTouched() {
    Object.keys(this.companyForm.controls).forEach(key => {
      const control = this.companyForm.get(key);
      control?.markAsTouched();
    });
  }
  
  getFieldError(fieldName: string): string {
    const control = this.companyForm.get(fieldName);
    if (control?.errors && control.dirty) {
      if (control.errors['required']) {
        return this.translate.instant('VALIDATION.REQUIRED', { field: this.getFieldLabel(fieldName) });
      }
      if (control.errors['email']) {
        return this.translate.instant('VALIDATION.EMAIL_INVALID');
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
        if (fieldName === 'companyName') {
          return this.translate.instant('VALIDATION.COMPANY_NAME_PATTERN');
        }
        return this.translate.instant('VALIDATION.INVALID_FORMAT');
      }
    }
    return '';
  }
  
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      companyType: this.translate.instant('FIELDS.COMPANY_TYPE'),
      companyName: this.translate.instant('FIELDS.COMPANY_NAME'),
      email: this.translate.instant('FIELDS.EMAIL'),
      phoneNumber: this.translate.instant('FIELDS.PHONE_NUMBER')
    };
    return labels[fieldName] || fieldName;
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const control = this.companyForm.get(fieldName);
    return !!(control?.invalid && control?.dirty);
  }
}
