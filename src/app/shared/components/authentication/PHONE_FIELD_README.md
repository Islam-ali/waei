# Phone Field Component

مكون حقل الهاتف المتقدم مع اختيار الدولة وأعلام الدول، مصمم للعمل مع مكتبة `dynamic-form` المحلية.

## الميزات

### 🏳️ اختيار الدولة
- قائمة منسدلة تحتوي على أعلام الدول
- رموز الاتصال الدولية
- أسماء الدول باللغة الإنجليزية

### 📱 تنسيق تلقائي
- تنسيق رقم الهاتف تلقائياً مع رمز الدولة
- دعم أرقام الهواتف من مختلف الدول
- تنسيق موحد للعرض

### ✅ التحقق من صحة البيانات
- تحقق من صحة تنسيق رقم الهاتف
- رسائل خطأ واضحة باللغة العربية
- دعم التحقق المخصص

### 🌍 دعم متعدد اللغات
- دعم RTL للغة العربية
- تصميم متجاوب
- واجهة سهلة الاستخدام

## الدول المدعومة

| الدولة | العلم | رمز الاتصال |
|--------|--------|-------------|
| الولايات المتحدة | 🇺🇸 | +1 |
| المملكة المتحدة | 🇬🇧 | +44 |
| أستراليا | 🇦🇺 | +61 |
| ألمانيا | 🇩🇪 | +49 |
| فرنسا | 🇫🇷 | +33 |
| السعودية | 🇸🇦 | +966 |
| مصر | 🇪🇬 | +20 |
| الإمارات | 🇦🇪 | +971 |
| الكويت | 🇰🇼 | +965 |
| قطر | 🇶🇦 | +974 |

## كيفية الاستخدام

### 1. في FormField Configuration

```typescript
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
}
```

### 2. في FormGroup

```typescript
this.formGroup = this.fb.group({
  phone: ['', [
    Validators.required, 
    Validators.pattern(/^\+[0-9]{1,4}\s[0-9]{6,15}$/)
  ]]
});
```

### 3. في Template

```html
<lib-dynamic-form 
  [fields]="formFields" 
  [config]="formConfig"
  (formSubmit)="onSubmit($event)">
</lib-dynamic-form>
```

## التخصيص

### 1. إضافة دول جديدة

```typescript
// في PhoneFieldComponent
countries: CountryCode[] = [
  // الدول الحالية...
  { name: 'New Country', code: 'NC', flag: '🏳️', dialCode: '+123' }
];
```

### 2. تخصيص التصميم

```scss
// تخصيص ألوان القائمة المنسدلة
.phone-dropdown {
  @apply bg-blue-50 border-blue-200;
}

// تخصيص ألوان الأزرار
.phone-button {
  @apply bg-blue-600 hover:bg-blue-700;
}
```

### 3. تخصيص التحقق

```typescript
validations: [
  { type: 'required', message: 'رسالة مخصصة' },
  { type: 'pattern', value: 'regex-pattern', message: 'رسالة خطأ مخصصة' }
]
```

## القيم المُرجعة

المكون يرجع القيمة بالتنسيق التالي:
```
+966 501234567
```

حيث:
- `+966` هو رمز الدولة
- `501234567` هو رقم الهاتف

## التحقق من صحة البيانات

### Regex Pattern
```regex
^\+[0-9]{1,4}\s[0-9]{6,15}$
```

### أمثلة على الأرقام الصحيحة
- `+1 5551234567` (الولايات المتحدة)
- `+44 7911123456` (المملكة المتحدة)
- `+966 501234567` (السعودية)
- `+20 1012345678` (مصر)

### أمثلة على الأرقام الخاطئة
- `1234567890` (بدون رمز الدولة)
- `+966123456789` (بدون مسافة)
- `+966 123` (رقم قصير جداً)

## الأحداث

### onChange
يتم إطلاقه عند تغيير قيمة حقل الهاتف:
```typescript
onChange(value: string) {
  console.log('Phone number changed:', value);
  // +966 501234567
}
```

### onBlur
يتم إطلاقه عند فقدان التركيز:
```typescript
onBlur() {
  console.log('Phone field lost focus');
}
```

## التصميم المتجاوب

المكون مصمم ليعمل على جميع أحجام الشاشات:

- **Desktop**: عرض كامل للقائمة المنسدلة
- **Tablet**: عرض محسن للشاشات المتوسطة
- **Mobile**: عرض مخصص للشاشات الصغيرة

## الدعم التقني

### المتطلبات
- Angular 17+
- Tailwind CSS
- مكتبة dynamic-form المحلية

### المتصفحات المدعومة
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## أمثلة على الاستخدام

### 1. نموذج تسجيل مستخدم جديد
```typescript
formFields: FormField[] = [
  {
    type: 'control',
    name: 'phone',
    label: 'رقم الهاتف',
    controlType: 'phone',
    placeholder: 'أدخل رقم الهاتف',
    validations: [
      { type: 'required', message: 'رقم الهاتف مطلوب' }
    ]
  }
];
```

### 2. نموذج معلومات الاتصال
```typescript
formFields: FormField[] = [
  {
    type: 'control',
    name: 'contactPhone',
    label: 'رقم الهاتف للتواصل',
    controlType: 'phone',
    description: 'سيتم استخدام هذا الرقم للتواصل معك',
    validations: [
      { type: 'required', message: 'رقم الهاتف مطلوب للتواصل' }
    ]
  }
];
```

## استكشاف الأخطاء

### المشكلة: لا تظهر القائمة المنسدلة
**الحل**: تأكد من أن المكون مُسجل في dynamic-field.directive.ts

### المشكلة: لا يعمل التحقق من صحة البيانات
**الحل**: تأكد من صحة regex pattern في validations

### المشكلة: لا تظهر الأعلام
**الحل**: تأكد من دعم المتصفح لـ emoji flags

## المساهمة

لإضافة دول جديدة أو تحسين المكون:

1. أضف الدولة إلى مصفوفة `countries`
2. اختبر المكون مع الأرقام الجديدة
3. حدث التوثيق
4. أرسل pull request

## الدعم

للمساعدة أو الاستفسارات، يرجى التواصل مع فريق التطوير. 