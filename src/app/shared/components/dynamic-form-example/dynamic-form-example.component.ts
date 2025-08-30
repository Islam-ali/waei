import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormComponent } from '../../../../../projects/dynamic-form/src/lib/dynamic-form.component';
import { DynamicFormConfig, FormChangeEvent, FormSubmitEvent, FormField } from '../../../../../projects/dynamic-form/src/lib/dynamic-form.types';

@Component({
  selector: 'app-dynamic-form-example',
  standalone: true,
  imports: [CommonModule, DynamicFormComponent],
  template: `
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Dynamic Form Example - جميع أنواع الحقول</h1>
      
      <!-- Calendar Examples -->
      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-800 mb-6">Calendar Examples - أمثلة التقويم المحدث</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <!-- Single Date Calendar -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-4">Single Date Calendar - تقويم تاريخ واحد</h3>
            <lib-dynamic-form
              [config]="singleDateConfig"
              (formSubmit)="onCalendarSubmit($event, 'single')"
              (formChange)="onCalendarChange($event, 'single')">
            </lib-dynamic-form>
          </div>

                    <!-- Date Range Calendar -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-4">Date Range Calendar - تقويم نطاق التواريخ</h3>
            <lib-dynamic-form
            ngSkipHydration
              [fields]="formFieldsDateRangeCalendar"
              [config]="formConfig"
              (formSubmit)="onFormSubmit($event)"
          (formChange)="onFormChange($event)"
          (formReset)="onFormReset()"
          (buttonClick)="onButtonClick($event)">
              </lib-dynamic-form>
            </div>

          <!-- Advanced Date Range Picker -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-4">Advanced Date Range Picker - مكون النطاق المتقدم</h3>
            <lib-dynamic-form
            ngSkipHydration
              [fields]="formFieldsAdvancedDateRange"
              [config]="formConfig"
              (formSubmit)="onFormSubmit($event)"
          (formChange)="onFormChange($event)"
          (formReset)="onFormReset()"
          (buttonClick)="onButtonClick($event)">
              </lib-dynamic-form>
            </div>

          <!-- English Calendar -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-4">English Calendar - التقويم الإنجليزي</h3>
            <lib-dynamic-form
              [config]="englishCalendarConfig"
              (formSubmit)="onCalendarSubmit($event, 'english')"
              (formChange)="onCalendarChange($event, 'english')">
            </lib-dynamic-form>
          </div>

          <!-- Restricted Date Calendar -->
          <div class="bg-white p-6 rounded-lg shadow-md">
            <h3 class="text-lg font-semibold mb-4">Restricted Date Calendar - تقويم محدود</h3>
            <lib-dynamic-form
              [config]="restrictedDateConfig"
              (formSubmit)="onCalendarSubmit($event, 'restricted')"
              (formChange)="onCalendarChange($event, 'restricted')">
            </lib-dynamic-form>
          </div>
        </div>

        <!-- Calendar Values -->
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-4">Calendar Values - قيم التقويم</h3>
          <pre class="bg-gray-100 p-4 rounded text-sm overflow-auto">{{ safeJsonStringify(calendarValues) }}</pre>
        </div>
      </div>

      <!-- Original Form Configuration -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Original Form Configuration</h2>
        <pre class="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">{{ getFormFieldsForDisplay() | json }}</pre>
      </div>
      
      <!-- Dynamic Form -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Dynamic Form</h2>
        <lib-dynamic-form
        ngSkipHydration
          [fields]="formFields"
          [config]="formConfig"
          (formSubmit)="onFormSubmit($event)"
          (formChange)="onFormChange($event)"
          (formReset)="onFormReset()"
          (buttonClick)="onButtonClick($event)">
        </lib-dynamic-form>
      </div>

      <!-- Form Values -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Form Values</h2>
        <pre class="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">{{ safeJsonStringify(formValues) }}</pre>
      </div>

      <!-- Form Events -->
      <div class="mb-6">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Form Events</h2>
        <div class="space-y-2">
          @for (event of formEvents; track event.timestamp) {
            <div class="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
              <div class="font-medium text-blue-800">{{ event.type }}</div>
              <div class="text-blue-600 text-sm">{{ event.timestamp | date:'medium' }}</div>
              <pre class="text-xs mt-1">{{ safeJsonStringify(event.data) }}</pre>
            </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class DynamicFormExampleComponent {
  formValues: any = {};
  formEvents: any[] = [];
  calendarValues: any = {};

  // Calendar configurations
  singleDateConfig: DynamicFormConfig = {
    fields: [
      {
        name: 'birthDate',
        type: 'control',
        controlType: 'calendar',
        label: 'تاريخ الميلاد',
        placeholder: 'اختر التاريخ',
        dateType: 'gregorian',
        language: 'ar',
        prefixIcon: 'fas fa-birthday-cake',
        description: 'يرجى اختيار تاريخ الميلاد الصحيح',
        validations: [
          {
            type: 'required',
            message: 'تاريخ الميلاد مطلوب'
          },
          {
            type: 'max',
            value: new Date().toISOString(),
            message: 'لا يمكن أن يكون تاريخ الميلاد في المستقبل'
          }
        ]
      },
      {
        name: 'submit',
        type: 'button',
        action: 'submit',
        label: 'إرسال',
        color: 'primary',
        fullWidth: true
      }
    ],
    showLabels: true,
    showValidationMessages: true
  };

  dateRangeConfig: DynamicFormConfig = {
    fields: [],
    showLabels: true,
    showValidationMessages: true
  };

  englishCalendarConfig: DynamicFormConfig = {
    fields: [
      {
        name: 'appointmentDate',
        type: 'control',
        controlType: 'calendar',
        label: 'Appointment Date',
        placeholder: 'Select date',
        dateType: 'gregorian',
        language: 'en',
        prefixIcon: 'fas fa-calendar-check',
        description: 'Please select your preferred appointment date',
        validations: [
          {
            type: 'required',
            message: 'Appointment date is required'
          },
          {
            type: 'min',
            value: new Date().toISOString(),
            message: 'Appointment date cannot be in the past'
          }
        ]
      },
      {
        name: 'submit',
        type: 'button',
        action: 'submit',
        label: 'Submit',
        color: 'primary',
        fullWidth: true
      }
    ],
    showLabels: true,
    showValidationMessages: true
  };

  restrictedDateConfig: DynamicFormConfig = {
    fields: [
      {
        name: 'eventDate',
        type: 'control',
        controlType: 'calendar',
        label: 'تاريخ الحدث',
        placeholder: 'اختر التاريخ',
        dateType: 'gregorian',
        language: 'ar',
        prefixIcon: 'fas fa-calendar-day',
        description: 'يمكن اختيار تاريخ من 1 يناير إلى 31 ديسمبر 2024',
        validations: [
          {
            type: 'required',
            message: 'تاريخ الحدث مطلوب'
          },
          {
            type: 'min',
            value: '2024-01-01',
            message: 'التاريخ يجب أن يكون بعد 1 يناير 2024'
          },
          {
            type: 'max',
            value: '2024-12-31',
            message: 'التاريخ يجب أن يكون قبل 31 ديسمبر 2024'
          }
        ]
      },
      {
        name: 'submit',
        type: 'button',
        action: 'submit',
        label: 'إرسال',
        color: 'primary',
        fullWidth: true
      }
    ],
    showLabels: true,
    showValidationMessages: true
  };

  // Form configuration
  formConfig: DynamicFormConfig = {
    direction: 'rtl',
    showLabels: true,
    showValidationMessages: true,
    class: 'max-w-4xl mx-auto',
    fields: []
  };

  // Safe JSON serialization method to handle circular references
  safeJsonStringify(obj: any): string {
    try {
      const seen = new WeakSet();
      return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular Reference]';
          }
          seen.add(value);
        }
        // Remove RxJS-specific properties that cause circular references
        if (value && typeof value === 'object') {
          const cleanValue = { ...value };
          delete cleanValue['_parentage'];
          delete cleanValue['_finalizers'];
          delete cleanValue['_subscriptions'];
          delete cleanValue['_isScalar'];
          delete cleanValue['_value'];
          delete cleanValue['_error'];
          delete cleanValue['_complete'];
          delete cleanValue['_unsubscribe'];
          delete cleanValue['_parent'];
          delete cleanValue['_parentSub'];
          delete cleanValue['_destination'];
          delete cleanValue['_source'];
          delete cleanValue['_observers'];
          delete cleanValue['_closed'];
          delete cleanValue['_isStopped'];
          delete cleanValue['_error'];
          delete cleanValue['_value'];
          delete cleanValue['_complete'];
          delete cleanValue['_unsubscribe'];
          delete cleanValue['_parent'];
          delete cleanValue['_parentSub'];
          delete cleanValue['_destination'];
          delete cleanValue['_source'];
          delete cleanValue['_observers'];
          delete cleanValue['_closed'];
          delete cleanValue['_isStopped'];
          return cleanValue;
        }
        return value;
      }, 2);
    } catch (error) {
      return `Error serializing object: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  formFieldsDateRangeCalendar: FormField[] = [
    {
      type: 'control',
      name: 'firstName',
      label: 'الاسم الأول',
      controlType: 'input',
      placeholder: 'أدخل الاسم الأول',
      prefixIcon: 'fas fa-user',
      validations: [
        { type: 'required', message: 'الاسم الأول مطلوب' },
        { type: 'minLength', value: 2, message: 'يجب أن يكون على الأقل حرفين' }
      ]
    },
    {
      type: 'control',
      name: 'birthDate',
      controlType: 'calendar',
      label: 'تاريخ الميلاد',
      placeholder: 'اختر التاريخ',
      multiple: true,
      dateType: 'gregorian',
      language: 'ar',
      prefixIcon: 'fas fa-calendar-alt',
      description: 'اختر تاريخ بداية ونهاية الإجازة',
      validations: [
        { type: 'required', message: 'تواريخ الإجازة مطلوبة' }
      ]
    }
  ];

  formFieldsAdvancedDateRange: FormField[] = [
    {
      type: 'control',
      name: 'advancedRange',
      controlType: 'daterangepicker',
      label: 'نطاق التواريخ المتقدم',
      placeholder: 'اختر نطاق التاريخ',
      dateType: 'gregorian',
      language: 'ar',
      prefixIcon: 'fas fa-calendar-week',
      description: 'اختر نطاق متقدم مع فترات سريعة',
      validations: [
        { type: 'required', message: 'نطاق التواريخ مطلوب' }
      ]
    },
    {
      type: 'control',
      name: 'englishRange',
      controlType: 'daterangepicker',
      label: 'English Date Range',
      placeholder: 'Select date range',
      dateType: 'gregorian',
      language: 'en',
      prefixIcon: 'fas fa-calendar-days',
      description: 'Advanced date range picker in English',
      validations: [
        { type: 'required', message: 'Date range is required' }
      ]
    }
  ];
  // Form fields configuration - جميع أنواع الحقول
  formFields: FormField[] = [
    // ====================
    // Control Fields - جميع أنواع الحقول
    // ====================
    
    // Input Field
    {
      type: 'control',
      name: 'firstName',
      label: 'الاسم الأول',
      controlType: 'input',
      placeholder: 'أدخل الاسم الأول',
      prefixIcon: 'fas fa-user',
      validations: [
        { type: 'required', message: 'الاسم الأول مطلوب' },
        { type: 'minLength', value: 2, message: 'يجب أن يكون على الأقل حرفين' }
      ]
    },

    // Email Field
    {
      type: 'control',
      name: 'email',
      label: 'البريد الإلكتروني',
      controlType: 'email',
      placeholder: 'أدخل البريد الإلكتروني',
      prefixIcon: 'fas fa-envelope',
      validations: [
        { type: 'required', message: 'البريد الإلكتروني مطلوب' },
        { type: 'email', message: 'البريد الإلكتروني غير صحيح' }
      ]
    },

    // Password Field
    {
      type: 'control',
      name: 'password',
      label: 'كلمة المرور',
      controlType: 'password',
      placeholder: 'أدخل كلمة المرور',
      prefixIcon: 'fas fa-lock',
      validations: [
        { type: 'required', message: 'كلمة المرور مطلوبة' },
        { type: 'minLength', value: 6, message: 'يجب أن تكون على الأقل 6 أحرف' }
      ]
    },

    // Number Field
    {
      type: 'control',
      name: 'age',
      label: 'العمر',
      controlType: 'number',
      placeholder: 'أدخل العمر',
      min: 18,
      max: 100,
      validations: [
        { type: 'required', message: 'العمر مطلوب' },
        { type: 'min', value: 18, message: 'يجب أن يكون العمر 18 أو أكثر' },
        { type: 'max', value: 100, message: 'يجب أن يكون العمر 100 أو أقل' }
      ]
    },

    // Date Field
    {
      type: 'control',
      name: 'birthDate',
      label: 'تاريخ الميلاد',
      controlType: 'date',
      validations: [
        { type: 'required', message: 'تاريخ الميلاد مطلوب' }
      ]
    },
    // calendar
    {
      type: 'control',
      name: 'birthDate1',
      label: 'تاريخ الميلاد',
      controlType: 'calendar',
      multiple: true,
      dateType: 'gregorian',
      language: 'ar',
      prefixIcon: 'fas fa-calendar-alt',
      description: 'اختر تاريخ بداية ونهاية الإجازة',
      validations: [
        { type: 'required', message: 'تاريخ الميلاد مطلوب' }
      ]
    },

    // Select Field
    {
      type: 'control',
      name: 'country',
      label: 'الدولة',
      controlType: 'select',
      placeholder: 'اختر الدولة',
      searchable: true,
      options: [
        { label: 'مصر', value: 'egypt' },
        { label: 'السعودية', value: 'saudi' },
        { label: 'الإمارات', value: 'uae' },
        { label: 'الكويت', value: 'kuwait' },
        { label: 'قطر', value: 'qatar' }
      ],
      validations: [
        { type: 'required', message: 'الدولة مطلوبة' }
      ]
    },

    // Multi Select Field
    {
      type: 'control',
      name: 'skills',
      label: 'المهارات',
      controlType: 'select',
      placeholder: 'اختر المهارات',
      multiple: true,
      searchable: true,
      options: [
        { label: 'JavaScript', value: 'js', description: 'لغة البرمجة الأساسية للويب' },
        { label: 'TypeScript', value: 'ts', description: 'JavaScript مع أنواع البيانات' },
        { label: 'Angular', value: 'angular', description: 'إطار عمل للويب' },
        { label: 'React', value: 'react', description: 'مكتبة واجهة المستخدم' },
        { label: 'Vue.js', value: 'vue', description: 'إطار عمل تقدمي' }
      ],
      validations: [
        { type: 'required', message: 'المهارات مطلوبة' }
      ]
    },

    // Checkbox Field
    {
      type: 'control',
      name: 'agree',
      label: 'أوافق على الشروط والأحكام',
      controlType: 'checkbox',
      validations: [
        { type: 'required', message: 'يجب الموافقة على الشروط' }
      ]
    },

    // Radio Field
    {
      type: 'control',
      name: 'gender',
      label: 'الجنس',
      controlType: 'radio',
      options: [
        { label: 'ذكر', value: 'male' },
        { label: 'أنثى', value: 'female' },
        { label: 'آخر', value: 'other' }
      ],
      validations: [
        { type: 'required', message: 'الجنس مطلوب' }
      ]
    },

    // Switch Field
    {
      type: 'control',
      name: 'notifications',
      label: 'تفعيل الإشعارات',
      controlType: 'switch'
    },

    // Slider Field
    {
      type: 'control',
      name: 'experience',
      label: 'سنوات الخبرة',
      controlType: 'slider',
      min: 0,
      max: 20,
      validations: [
        { type: 'min', value: 0, message: 'يجب أن تكون الخبرة 0 أو أكثر' },
        { type: 'max', value: 20, message: 'يجب أن تكون الخبرة 20 أو أقل' }
      ]
    },

    // Textarea Field
    {
      type: 'control',
      name: 'bio',
      label: 'نبذة شخصية',
      controlType: 'textarea',
      placeholder: 'اكتب نبذة عن نفسك...',
      rows: 4,
      description: 'اكتب نبذة مختصرة عن خبراتك ومهاراتك',
      validations: [
        { type: 'maxLength', value: 500, message: 'يجب أن لا تتجاوز النبذة 500 حرف' }
      ]
    },

    // File Upload Field
    {
      type: 'control',
      name: 'cv',
      label: 'السيرة الذاتية',
      controlType: 'file',
      accept: '*/*',
      multiple: true,
      description: 'قم برفع ملف PDF أو Word',
      validations: [
        { type: 'required', message: 'السيرة الذاتية مطلوبة' }
      ]
    },

    // ====================
    // Group Fields - مجموعات الحقول
    // ====================
    
    {
      type: 'group',
      name: 'personalInfo',
      label: 'المعلومات الشخصية',
      class: 'grid grid-cols-2 gap-4',
      children: [
        {
          type: 'control',
          name: 'fullName',
          label: 'الاسم الكامل',
          controlType: 'input',
          placeholder: 'أدخل الاسم الكامل',
          prefixIcon: 'fas fa-user',
          validations: [
            { type: 'required', message: 'الاسم الكامل مطلوب' }
          ]
        },
        {
          type: 'control',
          name: 'phone',
          label: 'رقم الهاتف',
          controlType: 'input',
          placeholder: 'أدخل رقم الهاتف',
          prefixIcon: 'fas fa-phone',
          validations: [
            { type: 'required', message: 'رقم الهاتف مطلوب' },
            { type: 'pattern', value: '^[0-9+\\-\\s()]+$', message: 'رقم الهاتف غير صحيح' }
          ]
        },
        {
          type: 'control',
          name: 'address',
          label: 'العنوان',
          controlType: 'textarea',
          placeholder: 'أدخل العنوان الكامل',
          rows: 3,
          validations: [
            { type: 'required', message: 'العنوان مطلوب' }
          ]
        }
      ]
    },

    {
      type: 'group',
      name: 'workInfo',
      label: 'معلومات العمل',
      children: [
        {
          type: 'control',
          name: 'company',
          label: 'الشركة',
          controlType: 'input',
          placeholder: 'أدخل اسم الشركة',
          validations: [
            { type: 'required', message: 'اسم الشركة مطلوب' }
          ]
        },
        {
          type: 'control',
          name: 'position',
          label: 'المنصب',
          controlType: 'input',
          placeholder: 'أدخل المنصب الوظيفي',
          validations: [
            { type: 'required', message: 'المنصب مطلوب' }
          ]
        },
        {
          type: 'control',
          name: 'salary',
          label: 'الراتب',
          controlType: 'number',
          placeholder: 'أدخل الراتب',
          min: 0,
          validations: [
            { type: 'required', message: 'الراتب مطلوب' },
            { type: 'min', value: 0, message: 'يجب أن يكون الراتب 0 أو أكثر' }
          ]
        }
      ]
    },

    // ====================
    // Array Fields - مصفوفات الحقول
    // ====================
    
    {
      type: 'array',
      name: 'education',
      label: 'التعليم',
      itemTemplate: {
        type: 'group',
        name: 'educationItem',
        children: [
          {
            type: 'control',
            name: 'degree',
            label: 'الدرجة العلمية',
            controlType: 'input',
            placeholder: 'أدخل الدرجة العلمية',
            validations: [
              { type: 'required', message: 'الدرجة العلمية مطلوبة' }
            ]
          },
          {
            type: 'control',
            name: 'institution',
            label: 'المؤسسة التعليمية',
            controlType: 'input',
            placeholder: 'أدخل اسم المؤسسة',
            validations: [
              { type: 'required', message: 'اسم المؤسسة مطلوب' }
            ]
          },
          {
            type: 'control',
            name: 'year',
            label: 'سنة التخرج',
            controlType: 'number',
            placeholder: 'أدخل سنة التخرج',
            min: 1950,
            max: new Date().getFullYear(),
            validations: [
              { type: 'required', message: 'سنة التخرج مطلوبة' },
              { type: 'min', value: 1950, message: 'يجب أن تكون سنة التخرج 1950 أو أكثر' },
              { type: 'max', value: new Date().getFullYear(), message: 'يجب أن تكون سنة التخرج ' + new Date().getFullYear() + ' أو أقل' }
            ]
          }
        ]
      }
    },

    // ====================
    // HTML Fields - محتوى HTML مخصص
    // ====================
    
    {
      type: 'html',
      name: 'info',
      content: `
        <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-blue-700">
                <strong>معلومات مهمة:</strong> يرجى التأكد من صحة جميع المعلومات المدخلة قبل إرسال النموذج.
              </p>
            </div>
          </div>
        </div>
      `,
      safe: true
    },

    // ====================
    // Button Fields - أزرار الإجراءات
    // ====================
    
    {
      type: 'button',
      name: 'submit',
      label: 'إرسال النموذج',
      action: 'submit',
      color: 'primary',
      fullWidth: true,
      icon: 'fas fa-paper-plane'
    },

    {
      type: 'button',
      name: 'reset',
      label: 'إعادة تعيين',
      action: 'reset',
      color: 'secondary',
      icon: 'fas fa-undo'
    },

    {
      type: 'button',
      name: 'custom',
      label: 'إجراء مخصص',
      action: 'custom',
      color: 'success',
      icon: 'fas fa-magic',
      onClick: () => {
        console.log('Custom action clicked!');
        alert('تم تنفيذ الإجراء المخصص!');
      }
    }
  ];

  // ====================
  // Methods
  // ====================

  getFormFieldsForDisplay() {
    return this.formFields.map(field => {
      if (field.type === 'control') {
        return {
          ...field,
          validations: field.validations?.map((v: any) => ({
            type: v.type,
            message: v.message,
            value: v.value
          }))
        };
      }
      return field;
    });
  }

  onFormSubmit(event: FormSubmitEvent) {
    console.log('Form submitted:', event);
    this.formValues = event.value;
    this.addFormEvent('Form Submit', event);
  }

  onFormChange(event: FormChangeEvent) {
    console.log('Form changed:', event);
    this.formValues[event.field] = event.value;
    this.addFormEvent('Form Change', event);
  }

  onFormReset() {
    console.log('Form reset');
    this.formValues = {};
    this.addFormEvent('Form Reset', {});
  }

  onButtonClick(event: any) {
    console.log('Button clicked:', event);
    this.addFormEvent('Button Click', event);
  }

  private addFormEvent(type: string, data: any) {
    this.formEvents.unshift({
      type,
      data,
      timestamp: new Date()
    });

    // Keep only last 10 events
    if (this.formEvents.length > 10) {
      this.formEvents = this.formEvents.slice(0, 10);
    }
  }

  // Calendar event handlers
  onCalendarSubmit(event: FormSubmitEvent, type: string) {
    console.log(`Calendar ${type} submitted:`, event);
    this.calendarValues[type] = event.value;
    this.addFormEvent(`Calendar ${type} Submit`, event);
  }

  onCalendarChange(event: FormChangeEvent, type: string) {
    console.log(`Calendar ${type} changed:`, event);
    if (!this.calendarValues[type]) {
      this.calendarValues[type] = {};
    }
    this.calendarValues[type][event.field] = event.value;
    this.addFormEvent(`Calendar ${type} Change`, event);
  }
} 