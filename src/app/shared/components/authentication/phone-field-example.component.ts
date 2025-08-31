import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormField, DynamicFormComponent, DynamicFormConfig } from '../../../../../projects/dynamic-form/src';

@Component({
  selector: 'app-phone-field-example',
  templateUrl: './phone-field-example.component.html',
  styleUrls: ['./phone-field-example.component.scss'],
  imports: [DynamicFormComponent]
})
export class PhoneFieldExampleComponent implements OnInit {
  formGroup!: FormGroup;
  
  formFields: FormField[] = [
    // Phone Field with Country Selection
    {
      type: 'control',
      name: 'phone',
      label: 'رقم الهاتف',
      controlType: 'phone',
      placeholder: 'أدخل رقم الهاتف',
      description: 'اختر الدولة وأدخل رقم الهاتف',
      validations: [
        { type: 'required', message: 'رقم الهاتف مطلوب' },
        { type: 'pattern', value: '^\\+[0-9]{1,4}\\s[0-9]{6,15}$', message: 'تنسيق رقم الهاتف غير صحيح' }
      ]
    },

    // Regular Input Field for Comparison
    {
      type: 'control',
      name: 'email',
      label: 'البريد الإلكتروني',
      controlType: 'email',
      placeholder: 'أدخل البريد الإلكتروني',
      validations: [
        { type: 'required', message: 'البريد الإلكتروني مطلوب' },
        { type: 'email', message: 'البريد الإلكتروني غير صحيح' }
      ]
    },

    // Submit Button
    {
      type: 'button',
      name: 'submit',
      label: 'إرسال',
      action: 'submit',
      color: 'primary',
      fullWidth: true,
      icon: 'fas fa-paper-plane'
    }
  ];

  formConfig: DynamicFormConfig = {
    direction: 'rtl',
    showLabels: true,
    showValidationMessages: true,
    class: 'max-w-md mx-auto',
    fields: []
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(/^\+[0-9]{1,4}\s[0-9]{6,15}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(formData: any): void {
    if (this.formGroup.valid) {
      console.log('Phone field example submitted:', formData);
      alert(`تم إرسال البيانات بنجاح!\nرقم الهاتف: ${formData.phone}\nالبريد الإلكتروني: ${formData.email}`);
    }
  }
} 