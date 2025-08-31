import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MaxLengthDirective } from '../../../../../projects/dynamic-form/src';

@Component({
  selector: 'app-max-length-demo',
  template: `
    <div class="min-h-screen bg-gray-50 py-12 px-4">
      <div class="max-w-2xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Max Length Directive Demo</h1>
          <p class="text-gray-600">تجربة MaxLengthDirective مع عداد الأحرف</p>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-6">
          <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
            
            <!-- Username Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">اسم المستخدم</label>
              <input 
                type="text" 
                formControlName="username"
                [appMaxLength]="20"
                placeholder="أدخل اسم المستخدم (حد أقصى 20 حرف)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
            </div>

            <!-- Description Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">الوصف</label>
              <textarea 
                formControlName="description"
                [appMaxLength]="100"
                rows="3"
                placeholder="أدخل الوصف (حد أقصى 100 حرف)"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"></textarea>
            </div>

            <!-- Submit Button -->
            <div class="flex justify-end">
              <button 
                type="submit"
                [disabled]="form.invalid"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
                إرسال
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  imports: [MaxLengthDirective, ReactiveFormsModule],
  standalone: true
})
export class MaxLengthDemoComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(20)]],
      description: ['', [Validators.required, Validators.maxLength(100)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
      alert('تم إرسال النموذج بنجاح!');
    }
  }
} 