import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { PhoneNumberDirective } from '../../../../../../projects/dynamic-form/src/lib/directives/phone.directive';

@Component({
  selector: 'app-your-details',
  imports: [CommonModule, ReactiveFormsModule, PhoneNumberDirective, TranslateModule],
  templateUrl: './your-details.component.html',
  styleUrl: './your-details.component.scss'
})
export class YourDetailsComponent implements OnInit {
  @Output() nextStep = new EventEmitter<void>();
  
  detailsForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService
  ) {}
  
  ngOnInit() {
    this.initializeForm();
  }
  
  private initializeForm() {
    this.detailsForm = this.fb.group({
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-Z\u0600-\u06FF\s]+$/)
      ]],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{9}$/),
        Validators.minLength(9),
        Validators.maxLength(9)
      ]],
      acceptTerms: [false, [Validators.requiredTrue]]
    });
  }
  
  onNextStep() {
    if (this.detailsForm.valid) {
      this.nextStep.emit();
    } else {
      this.markFormGroupTouched();
    }
  }
  
  private markFormGroupTouched() {
    Object.keys(this.detailsForm.controls).forEach(key => {
      const control = this.detailsForm.get(key);
      control?.markAsTouched();
    });
  }
  
  getFieldError(fieldName: string): string {
    const control = this.detailsForm.get(fieldName);
    if (control?.errors && control.dirty) {
      if (control.errors['required']) {
        return this.translate.instant('VALIDATION.REQUIRED', { field: this.getFieldLabel(fieldName) });
      }
      if (control.errors['requiredTrue']) {
        return this.translate.instant('VALIDATION.ACCEPT_TERMS');
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
        if (fieldName === 'firstName' || fieldName === 'lastName') {
          return this.translate.instant('VALIDATION.NAME_PATTERN');
        }
        return this.translate.instant('VALIDATION.INVALID_FORMAT');
      }
    }
    return '';
  }
  
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: this.translate.instant('FIELDS.FIRST_NAME'),
      lastName: this.translate.instant('FIELDS.LAST_NAME'),
      phoneNumber: this.translate.instant('FIELDS.PHONE_NUMBER'),
      acceptTerms: this.translate.instant('FIELDS.TERMS_CONDITIONS')
    };
    return labels[fieldName] || fieldName;
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const control = this.detailsForm.get(fieldName);
    return !!(control?.invalid && control?.dirty);
  }
}
