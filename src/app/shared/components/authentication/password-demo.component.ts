import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormField, DynamicFormComponent, DynamicFormConfig } from '../../../../../projects/dynamic-form/src';

@Component({
  selector: 'app-password-demo',
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header -->
        <div class="text-center mb-12">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
          </div>
          <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Password Field Component Demo
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300">
            تجربة مكون كلمة المرور المحسن مع مؤشر قوة كلمة المرور
          </p>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Form Section -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">نموذج كلمة المرور</h2>
            
            <lib-dynamic-form 
              [fields]="formFields" 
              [config]="formConfig"
              (formSubmit)="onSubmit($event)">
            </lib-dynamic-form>
          </div>

          <!-- Features Section -->
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">الميزات الجديدة</h2>
            
            <div class="space-y-6">
              <!-- Password Strength Indicator -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">مؤشر قوة كلمة المرور</h3>
                  <p class="text-gray-600 dark:text-gray-300">شريط تقدم ملون يوضح قوة كلمة المرور مع النص التوضيحي</p>
                </div>
              </div>

              <!-- Toggle Visibility -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">إظهار/إخفاء كلمة المرور</h3>
                  <p class="text-gray-600 dark:text-gray-300">زر تفاعلي مع أيقونات SVG جميلة لإظهار أو إخفاء كلمة المرور</p>
                </div>
              </div>

              <!-- Validation Messages -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">رسائل التحقق المحسنة</h3>
                  <p class="text-gray-600 dark:text-gray-300">رسائل خطأ ونجاح مع أيقونات واضحة وألوان مميزة</p>
                </div>
              </div>

              <!-- Dark Mode Support -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">دعم الوضع المظلم</h3>
                  <p class="text-gray-600 dark:text-gray-300">تصميم متوافق مع الوضع المظلم مع ألوان محسنة</p>
                </div>
              </div>

              <!-- Responsive Design -->
              <div class="flex items-start space-x-4">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">تصميم متجاوب</h3>
                  <p class="text-gray-600 dark:text-gray-300">يعمل بشكل مثالي على جميع أحجام الشاشات</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Password Strength Guide -->
        <div class="mt-12 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">دليل قوة كلمة المرور</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="text-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
              <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div class="bg-red-500 h-2 rounded-full" style="width: 20%"></div>
              </div>
              <h3 class="font-semibold text-red-700 dark:text-red-300">ضعيفة جداً</h3>
              <p class="text-sm text-red-600 dark:text-red-400">أقل من 8 أحرف</p>
            </div>

            <div class="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
              <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div class="bg-orange-500 h-2 rounded-full" style="width: 40%"></div>
              </div>
              <h3 class="font-semibold text-orange-700 dark:text-orange-300">ضعيفة</h3>
              <p class="text-sm text-orange-600 dark:text-orange-400">8 أحرف أو أكثر</p>
            </div>

            <div class="text-center p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
              <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div class="bg-yellow-500 h-2 rounded-full" style="width: 60%"></div>
              </div>
              <h3 class="font-semibold text-yellow-700 dark:text-yellow-300">متوسطة</h3>
              <p class="text-sm text-yellow-600 dark:text-yellow-400">أحرف وأرقام</p>
            </div>

            <div class="text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
              <div class="w-full bg-gray-200 rounded-full h-2 mb-3">
                <div class="bg-green-500 h-2 rounded-full" style="width: 100%"></div>
              </div>
              <h3 class="font-semibold text-green-700 dark:text-green-300">قوية جداً</h3>
              <p class="text-sm text-green-600 dark:text-green-400">أحرف وأرقام ورموز</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  imports: [DynamicFormComponent],
  standalone: true
})
export class PasswordDemoComponent implements OnInit {
  formFields: FormField[] = [
    {
      type: 'control',
      name: 'password',
      label: 'كلمة المرور',
      controlType: 'password',
      placeholder: 'أدخل كلمة المرور',
      description: 'يجب أن تحتوي على 8 أحرف على الأقل مع أحرف كبيرة وصغيرة وأرقام',
      prefixIcon: 'fas fa-lock',
      validations: [
        { type: 'required', message: 'كلمة المرور مطلوبة' },
        { type: 'minLength', value: 8, message: 'يجب أن تكون كلمة المرور 8 أحرف على الأقل' },
        { type: 'pattern', value: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]', message: 'يجب أن تحتوي على أحرف كبيرة وصغيرة وأرقام ورموز' }
      ]
    },
    {
      type: 'control',
      name: 'confirmPassword',
      label: 'تأكيد كلمة المرور',
      controlType: 'password',
      placeholder: 'أعد إدخال كلمة المرور',
      description: 'أعد إدخال كلمة المرور للتأكيد',
      prefixIcon: 'fas fa-shield-alt',
      validations: [
        { type: 'required', message: 'تأكيد كلمة المرور مطلوب' }
      ]
    },
    {
      type: 'button',
      name: 'submit',
      label: 'إنشاء الحساب',
      action: 'submit',
      color: 'primary',
      fullWidth: true,
      icon: 'fas fa-user-plus'
    }
  ];

  formConfig: DynamicFormConfig = {
    direction: 'rtl',
    showLabels: true,
    showValidationMessages: true,
    class: 'space-y-6',
    fields: []
  };

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}

  onSubmit(formData: any): void {
    console.log('Password demo submitted:', formData);
    alert(`تم إنشاء الحساب بنجاح!\nكلمة المرور: ${formData.password ? 'تم إدخالها' : 'غير مدخلة'}`);
  }
} 