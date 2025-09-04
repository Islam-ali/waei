import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-username-and-email',
  imports: [CommonModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './username-and-email.component.html',
  styleUrl: './username-and-email.component.scss'
})
export class UsernameAndEmailComponent implements OnInit {
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();
  
  userForm!: FormGroup;
  
  constructor(
    private fb: FormBuilder,
    private translate: TranslateService
  ) {}
  
  ngOnInit() {
    this.initializeForm();
  }
  
  private initializeForm() {
    this.userForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(30),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      email: ['', [
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]]
    });
  }
  
  onNextStep() {
    if (this.userForm.valid) {
      this.nextStep.emit();
    } else {
      this.markFormGroupTouched();
    }
  }
  
  onPreviousStep() {
    this.previousStep.emit();
  }
  
  private markFormGroupTouched() {
    Object.keys(this.userForm.controls).forEach(key => {
      const control = this.userForm.get(key);
      control?.markAsTouched();
    });
  }
  
  getFieldError(fieldName: string): string {
    const control = this.userForm.get(fieldName);
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
        if (fieldName === 'username') {
          return this.translate.instant('VALIDATION.USERNAME_PATTERN');
        }
        if (fieldName === 'email') {
          return this.translate.instant('VALIDATION.EMAIL_INVALID');
        }
        return this.translate.instant('VALIDATION.INVALID_FORMAT');
      }
    }
    return '';
  }
  
  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      username: this.translate.instant('FIELDS.USERNAME'),
      email: this.translate.instant('FIELDS.EMAIL')
    };
    return labels[fieldName] || fieldName;
  }
  
  isFieldInvalid(fieldName: string): boolean {
    const control = this.userForm.get(fieldName);
    return !!(control?.invalid && control?.dirty);
  }
}
