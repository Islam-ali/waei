# Dynamic Form Library - مكتبة النماذج الديناميكية

مكتبة Angular 19 شاملة لإنشاء نماذج ديناميكية قابلة للتخصيص باستخدام Reactive Forms.

## 🚀 المميزات

- ✅ **دعم كامل للـ Reactive Forms**
- ✅ **أنواع حقول متعددة**: input, textarea, select, radio, checkbox, date, password, email, number, file, switch, slider
- ✅ **مجموعات متداخلة**: FormGroup للتنظيم
- ✅ **مصفوفات ديناميكية**: FormArray مع إضافة/حذف عناصر
- ✅ **محتوى HTML مخصص**: مع دعم DomSanitizer
- ✅ **أزرار قابلة للتخصيص**: submit, reset, custom actions
- ✅ **تحقق من صحة البيانات**: validations شاملة
- ✅ **دعم RTL/LTR**: للغات العربية والإنجليزية
- ✅ **تصميم متجاوب**: يعمل على جميع الأجهزة
- ✅ **دعم Dark Mode**: تلقائي
- ✅ **Tailwind CSS**: دعم كامل للـ classes

## 📦 التثبيت

```bash
# تثبيت المكتبة
npm install @your-org/dynamic-form

# أو استخدام المكتبة المحلية
ng build dynamic-form
```

## 🎯 الاستخدام الأساسي

### 1. استيراد المكتبة

```typescript
import { DynamicFormComponent } from '@your-org/dynamic-form';
import { DynamicFormConfig } from '@your-org/dynamic-form';

@Component({
  selector: 'app-my-form',
  standalone: true,
  imports: [DynamicFormComponent],
  template: `
    <lib-dynamic-form
      [config]="formConfig"
      [initialValue]="initialData"
      (formSubmit)="onSubmit($event)"
      (formChange)="onChange($event)">
    </lib-dynamic-form>
  `
})
export class MyFormComponent {
  // تكوين النموذج
  formConfig: DynamicFormConfig = {
    direction: 'rtl',
    showLabels: true,
    showValidationMessages: true,
    fields: [
      // تعريف الحقول هنا
    ]
  };

  // البيانات الأولية
  initialData = {
    name: 'أحمد',
    email: 'ahmed@example.com'
  };

  // معالجة الإرسال
  onSubmit(event: any) {
    console.log('Form submitted:', event.value);
  }

  // معالجة التغييرات
  onChange(event: any) {
    console.log('Form changed:', event.value);
  }
}
```

### 2. تكوين الحقول

```typescript
const formConfig: DynamicFormConfig = {
  direction: 'rtl', // أو 'ltr'
  showLabels: true,
  showValidationMessages: true,
  fields: [
    // حقل نص عادي
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

    // حقل بريد إلكتروني
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

    // حقل اختيار
    {
      type: 'control',
      name: 'country',
      label: 'البلد',
      controlType: 'select',
      placeholder: 'اختر البلد',
      options: [
        { label: 'السعودية', value: 'SA' },
        { label: 'الإمارات', value: 'UAE' },
        { label: 'الكويت', value: 'KW' }
      ],
      validations: [
        { type: 'required', message: 'البلد مطلوب' }
      ]
    },

    // مجموعة من الحقول
    {
      type: 'group',
      name: 'address',
      label: 'العنوان',
      class: 'bg-gray-50 p-4 rounded-lg',
      children: [
        {
          type: 'control',
          name: 'street',
          label: 'الشارع',
          controlType: 'input',
          validations: [
            { type: 'required', message: 'الشارع مطلوب' }
          ]
        },
        {
          type: 'control',
          name: 'city',
          label: 'المدينة',
          controlType: 'input',
          validations: [
            { type: 'required', message: 'المدينة مطلوبة' }
          ]
        }
      ]
    },

    // مصفوفة ديناميكية
    {
      type: 'array',
      name: 'phoneNumbers',
      label: 'أرقام الهاتف',
      itemTemplate: {
        type: 'group',
        name: 'phoneNumber',
        children: [
          {
            type: 'control',
            name: 'type',
            label: 'نوع الهاتف',
            controlType: 'select',
            options: [
              { label: 'جوال', value: 'mobile' },
              { label: 'منزل', value: 'home' }
            ]
          },
          {
            type: 'control',
            name: 'number',
            label: 'رقم الهاتف',
            controlType: 'input',
            validations: [
              { type: 'required', message: 'رقم الهاتف مطلوب' }
            ]
          }
        ]
      }
    },

    // محتوى HTML
    {
      type: 'html',
      name: 'info',
      content: '<div class="alert alert-info">معلومات مهمة</div>',
      safe: true
    },

    // أزرار
    {
      type: 'button',
      name: 'submit',
      action: 'submit',
      label: 'إرسال النموذج',
      icon: 'fas fa-paper-plane',
      color: 'primary',
      fullWidth: true
    }
  ]
};
```

## 🎨 أنواع الحقول المدعومة

### Control Fields

| النوع | الوصف | الخصائص |
|-------|-------|---------|
| `input` | حقل نص عادي | placeholder, prefixIcon, suffixIcon |
| `password` | حقل كلمة مرور | placeholder, prefixIcon |
| `email` | حقل بريد إلكتروني | placeholder, validations |
| `number` | حقل رقم | placeholder, min, max |
| `date` | حقل تاريخ | placeholder |
| `textarea` | منطقة نص متعددة الأسطر | placeholder, rows |
| `select` | قائمة منسدلة | options, placeholder |
| `radio` | أزرار راديو | options |
| `checkbox` | مربع اختيار | - |
| `switch` | مفتاح تبديل | - |
| `slider` | شريط تمرير | min, max |
| `file` | رفع ملف | - |

### Group Fields

```typescript
{
  type: 'group',
  name: 'personalInfo',
  label: 'المعلومات الشخصية',
  class: 'bg-blue-50 p-4 rounded-lg',
  children: [
    // حقول فرعية
  ]
}
```

### Array Fields

```typescript
{
  type: 'array',
  name: 'items',
  label: 'العناصر',
  itemTemplate: {
    type: 'group',
    name: 'item',
    children: [
      // قالب لكل عنصر
    ]
  }
}
```

### HTML Fields

```typescript
{
  type: 'html',
  name: 'content',
  content: '<div>محتوى HTML</div>',
  safe: true // استخدام DomSanitizer
}
```

### Button Fields

```typescript
{
  type: 'button',
  name: 'submit',
  action: 'submit', // 'submit' | 'reset' | 'custom'
  label: 'إرسال',
  icon: 'fas fa-paper-plane',
  color: 'primary', // 'primary' | 'secondary' | 'danger' | 'success'
  fullWidth: true,
  onClick: () => console.log('Custom action')
}
```

## ✅ التحقق من صحة البيانات

```typescript
validations: [
  { type: 'required', message: 'هذا الحقل مطلوب' },
  { type: 'minLength', value: 2, message: 'يجب أن يكون على الأقل حرفين' },
  { type: 'maxLength', value: 50, message: 'يجب أن يكون أقل من 50 حرف' },
  { type: 'pattern', value: '^[a-zA-Z]+$', message: 'يجب أن يحتوي على أحرف فقط' },
  { type: 'email', message: 'البريد الإلكتروني غير صحيح' },
  { type: 'min', value: 18, message: 'يجب أن يكون العمر 18 أو أكثر' },
  { type: 'max', value: 100, message: 'يجب أن يكون العمر 100 أو أقل' }
]
```

## 🎨 التخصيص

### CSS Classes

```typescript
{
  type: 'control',
  name: 'field',
  label: 'الحقل',
  class: 'my-custom-class', // أو array من classes
  controlType: 'input'
}
```

### Inline Styles

```typescript
{
  type: 'control',
  name: 'field',
  label: 'الحقل',
  style: {
    'background-color': '#f0f0f0',
    'border-radius': '8px'
  },
  controlType: 'input'
}
```

### Tailwind CSS

```typescript
{
  type: 'control',
  name: 'field',
  label: 'الحقل',
  class: 'bg-blue-50 border-blue-200 focus:border-blue-500',
  controlType: 'input'
}
```

## 📱 دعم RTL/LTR

```typescript
const formConfig: DynamicFormConfig = {
  direction: 'rtl', // أو 'ltr'
  // باقي التكوين
};
```

## 🌙 Dark Mode

المكتبة تدعم Dark Mode تلقائياً:

```scss
@media (prefers-color-scheme: dark) {
  .dynamic-form {
    // تخصيص الألوان للوضع المظلم
  }
}
```

## 📡 الأحداث

### formSubmit

```typescript
(formSubmit)="onSubmit($event)"

onSubmit(event: FormSubmitEvent) {
  console.log('Value:', event.value);
  console.log('Valid:', event.valid);
  console.log('Form:', event.form);
}
```

### formChange

```typescript
(formChange)="onChange($event)"

onChange(event: FormChangeEvent) {
  console.log('Value:', event.value);
  console.log('Field:', event.field);
  console.log('Valid:', event.valid);
}
```

### formReset

```typescript
(formReset)="onReset()"

onReset() {
  console.log('Form has been reset');
}
```

### buttonClick

```typescript
(buttonClick)="onButtonClick($event)"

onButtonClick(event: { field: ButtonField; event: any }) {
  console.log('Button clicked:', event.field.name);
  console.log('Action:', event.field.action);
}
```

## 🔧 الخصائص

### Inputs

| الخاصية | النوع | الوصف |
|---------|-------|-------|
| `config` | `DynamicFormConfig` | تكوين النموذج |
| `initialValue` | `any` | القيم الأولية |
| `disabled` | `boolean` | تعطيل النموذج |

### Outputs

| الحدث | النوع | الوصف |
|-------|-------|-------|
| `formSubmit` | `FormSubmitEvent` | عند إرسال النموذج |
| `formChange` | `FormChangeEvent` | عند تغيير أي حقل |
| `formReset` | `void` | عند إعادة تعيين النموذج |
| `buttonClick` | `{ field: ButtonField; event: any }` | عند النقر على زر |

## 🎯 أمثلة متقدمة

### نموذج تسجيل مستخدم

```typescript
const userRegistrationForm: DynamicFormConfig = {
  direction: 'rtl',
  fields: [
    {
      type: 'group',
      name: 'personalInfo',
      label: 'المعلومات الشخصية',
      class: 'bg-blue-50 p-4 rounded-lg',
      children: [
        {
          type: 'control',
          name: 'firstName',
          label: 'الاسم الأول',
          controlType: 'input',
          prefixIcon: 'fas fa-user',
          validations: [
            { type: 'required', message: 'الاسم الأول مطلوب' }
          ]
        },
        {
          type: 'control',
          name: 'lastName',
          label: 'اسم العائلة',
          controlType: 'input',
          validations: [
            { type: 'required', message: 'اسم العائلة مطلوب' }
          ]
        },
        {
          type: 'control',
          name: 'email',
          label: 'البريد الإلكتروني',
          controlType: 'email',
          prefixIcon: 'fas fa-envelope',
          validations: [
            { type: 'required', message: 'البريد الإلكتروني مطلوب' },
            { type: 'email', message: 'البريد الإلكتروني غير صحيح' }
          ]
        },
        {
          type: 'control',
          name: 'password',
          label: 'كلمة المرور',
          controlType: 'password',
          prefixIcon: 'fas fa-lock',
          validations: [
            { type: 'required', message: 'كلمة المرور مطلوبة' },
            { type: 'minLength', value: 8, message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' }
          ]
        }
      ]
    },
    {
      type: 'control',
      name: 'agreeToTerms',
      label: 'أوافق على الشروط والأحكام',
      controlType: 'checkbox',
      validations: [
        { type: 'required', message: 'يجب الموافقة على الشروط' }
      ]
    },
    {
      type: 'button',
      name: 'register',
      action: 'submit',
      label: 'تسجيل',
      icon: 'fas fa-user-plus',
      color: 'primary',
      fullWidth: true
    }
  ]
};
```

### نموذج طلب وظيفة

```typescript
const jobApplicationForm: DynamicFormConfig = {
  direction: 'rtl',
  fields: [
    {
      type: 'html',
      name: 'header',
      content: '<h2 class="text-2xl font-bold mb-4">طلب توظيف</h2>',
      safe: true
    },
    {
      type: 'group',
      name: 'personalInfo',
      label: 'المعلومات الشخصية',
      children: [
        // معلومات شخصية
      ]
    },
    {
      type: 'group',
      name: 'education',
      label: 'المؤهلات التعليمية',
      children: [
        // مؤهلات تعليمية
      ]
    },
    {
      type: 'array',
      name: 'experience',
      label: 'الخبرات العملية',
      itemTemplate: {
        type: 'group',
        name: 'job',
        children: [
          {
            type: 'control',
            name: 'company',
            label: 'الشركة',
            controlType: 'input'
          },
          {
            type: 'control',
            name: 'position',
            label: 'المنصب',
            controlType: 'input'
          },
          {
            type: 'control',
            name: 'duration',
            label: 'المدة',
            controlType: 'input'
          }
        ]
      }
    },
    {
      type: 'control',
      name: 'resume',
      label: 'السيرة الذاتية',
      controlType: 'file',
      description: 'PDF أو Word فقط'
    },
    {
      type: 'control',
      name: 'coverLetter',
      label: 'خطاب التقديم',
      controlType: 'textarea',
      placeholder: 'اكتب خطاب التقديم هنا...'
    }
  ]
};
```

## 🚀 أفضل الممارسات

1. **استخدم مجموعات للحقول المرتبطة**
2. **أضف validations مناسبة لكل حقل**
3. **استخدم icons لتحسين UX**
4. **اختبر النموذج على أجهزة مختلفة**
5. **استخدم Tailwind CSS للتخصيص**
6. **أضف descriptions للحقول المعقدة**
7. **استخدم HTML fields للمحتوى الثابت**

## 🔧 التطوير

```bash
# بناء المكتبة
ng build dynamic-form

# تشغيل الاختبارات
ng test dynamic-form

# نشر المكتبة
npm publish
```

## 📄 الترخيص

MIT License

## 🤝 المساهمة

نرحب بالمساهمات! يرجى قراءة دليل المساهمة قبل البدء.

## 📞 الدعم

للدعم والاستفسارات، يرجى فتح issue في GitHub أو التواصل عبر البريد الإلكتروني.

