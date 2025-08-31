import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormField, DynamicFormComponent, DynamicFormConfig } from '../../../../../projects/dynamic-form/src';

@Component({
  selector: 'app-login-company',
  templateUrl: './login-company.component.html',
  styleUrls: ['./login-company.component.scss'],
  imports: [DynamicFormComponent]
})
export class LoginCompanyComponent implements OnInit {
  formGroup!: FormGroup;
  
  formFields: FormField[] = [
    // Company Logo/Header
    {
      type: 'html',
      name: 'companyHeader',
      content: `
        <div class="text-center mb-6">
          <div class="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <i class="fas fa-building text-blue-600 text-xl"></i>
          </div>
          <h3 class="text-lg font-medium text-gray-900">تسجيل دخول الشركات</h3>
        </div>
      `,
      safe: true
    },

    // Username/Email Field
    {
      type: 'control',
      name: 'identifier',
      label: 'البريد الإلكتروني أو اسم المستخدم',
      controlType: 'input',
      placeholder: 'أدخل البريد الإلكتروني أو اسم المستخدم',
      prefixIcon: 'fas fa-user',
      validations: [
        { type: 'required', message: 'البريد الإلكتروني أو اسم المستخدم مطلوب' }
      ]
    },

    // Password
    {
      type: 'control',
      name: 'password',
      label: 'كلمة المرور',
      controlType: 'password',
      placeholder: 'أدخل كلمة المرور',
      prefixIcon: 'fas fa-lock',
      validations: [
        { type: 'required', message: 'كلمة المرور مطلوبة' }
      ]
    },

    // Remember Me
    {
      type: 'control',
      name: 'rememberMe',
      label: 'تذكرني',
      controlType: 'checkbox'
    },

    // 2FA Placeholder
    {
      type: 'html',
      name: 'twoFactorPlaceholder',
      content: `
        <div class="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <i class="fas fa-shield-alt text-blue-400"></i>
            </div>
            <div class="mr-3">
              <p class="text-sm text-blue-700">
                <strong>المصادقة الثنائية:</strong> متاحة للشركات لزيادة الأمان
              </p>
            </div>
          </div>
        </div>
      `,
      safe: true
    },

    // Submit Button
    {
      type: 'button',
      name: 'submit',
      label: 'تسجيل دخول الشركة',
      action: 'submit',
      color: 'primary',
      fullWidth: true,
      icon: 'fas fa-building'
    },

    // Forgot Password Link
    {
      type: 'html',
      name: 'forgotPasswordLink',
      content: `
        <div class="text-center mt-4">
          <a href="/forgot-password" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
            <i class="fas fa-key ml-1"></i>
            نسيت كلمة المرور؟
          </a>
        </div>
      `,
      safe: true
    },

    // Sign Up Link
    {
      type: 'html',
      name: 'signupLink',
      content: `
        <div class="text-center mt-6 pt-6 border-t border-gray-200">
          <p class="text-gray-600">
            ليس لديك حساب شركة؟ 
            <a href="/signup-company" class="text-blue-600 hover:text-blue-800 font-medium">إنشاء حساب شركة</a>
          </p>
        </div>
      `,
      safe: true
    },

    // Individual Login Link
    {
      type: 'html',
      name: 'individualLoginLink',
      content: `
        <div class="text-center mt-4">
          <a href="/login" class="text-sm text-gray-500 hover:text-gray-700">
            <i class="fas fa-user ml-1"></i>
            تسجيل دخول فردي
          </a>
        </div>
      `,
      safe: true
    }
  ];

  formConfig: DynamicFormConfig = {
    direction: 'rtl',
    showLabels: true,
    showValidationMessages: true,
    class: 'max-w-4xl mx-auto',
    fields: []
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      identifier: ['', Validators.required],
      password: ['', Validators.required],
      rememberMe: [false]
    });
  }

  onSubmit(formData: any): void {
    if (this.formGroup.valid) {
      console.log('Company login form submitted:', formData);
      // Handle form submission
    }
  }
} 