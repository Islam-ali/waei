# Max Length Directive

Directive متقدمة للتحكم في الحد الأقصى لطول النص مع عداد أحرف تفاعلي وميزات متقدمة.

## الميزات

### 📏 التحكم في الطول
- منع إدخال نصوص أطول من الحد المحدد
- قطع النص تلقائياً عند الوصول للحد
- دعم جميع أنواع حقول الإدخال (input, textarea)

### 🔢 عداد الأحرف
- عرض عدد الأحرف المدخلة والحد الأقصى
- تخصيص نص العداد
- تغيير موقع العداد (أعلى/أسفل)
- إخفاء العداد عند الحاجة

### 🎨 تحذيرات بصرية
- تغيير لون العداد عند الاقتراب من الحد
- تحذير أصفر عند 80% من الحد
- تحذير أحمر عند 95% من الحد
- تخصيص نسب التحذير

### ⌨️ منع الإدخال
- منع إدخال أحرف إضافية عند الوصول للحد
- السماح بمفاتيح التنقل والوظائف
- دعم اختصارات لوحة المفاتيح (Ctrl+A, Ctrl+C, إلخ)

### 📋 التحكم في اللصق
- التحكم في النص المُلصق ليتناسب مع الحد
- قطع النص المُلصق تلقائياً
- الحفاظ على النص الموجود

## كيفية الاستخدام

### 1. الاستخدام الأساسي

```html
<input 
  type="text" 
  [libMaxLength]="50"
  placeholder="أدخل النص هنا">
```

### 2. مع عداد مخصص

```html
<input 
  type="text" 
  [libMaxLength]="100"
  [showCounter]="true"
  [counterPosition]="'bottom'"
  [counterTemplate]="'{{current}}/{{max}} حرف'"
  placeholder="أدخل النص هنا">
```

### 3. مع تحذيرات مخصصة

```html
<textarea 
  [libMaxLength]="200"
  [showCounter]="true"
  [warningThreshold]="0.7"
  [errorThreshold]="0.9"
  placeholder="أدخل النص هنا"></textarea>
```

### 4. بدون عداد

```html
<input 
  type="text" 
  [libMaxLength]="30"
  [showCounter]="false"
  placeholder="أدخل النص هنا">
```

## الخصائص (Inputs)

| الخاصية | النوع | الافتراضي | الوصف |
|---------|-------|-----------|-------|
| `libMaxLength` | `number` | `0` | الحد الأقصى لعدد الأحرف |
| `showCounter` | `boolean` | `true` | إظهار عداد الأحرف |
| `counterPosition` | `'top' \| 'bottom'` | `'bottom'` | موقع العداد |
| `counterTemplate` | `string` | `'{{current}}/{{max}}'` | قالب نص العداد |
| `warningThreshold` | `number` | `0.8` | نسبة التحذير الأصفر |
| `errorThreshold` | `number` | `0.95` | نسبة التحذير الأحمر |

## قوالب العداد

يمكن تخصيص نص العداد باستخدام المتغيرات التالية:

- `{{current}}` - عدد الأحرف الحالي
- `{{max}}` - الحد الأقصى للأحرف

### أمثلة على القوالب:

```html
<!-- عداد بسيط -->
[counterTemplate]="'{{current}}/{{max}}'"

<!-- عداد باللغة العربية -->
[counterTemplate]="'{{current}} من {{max}} حرف'"

<!-- عداد بالأحرف المتبقية -->
[counterTemplate]="'الأحرف المتبقية: {{max}} - {{current}}'"

<!-- عداد بنسبة مئوية -->
[counterTemplate]="'{{current}}/{{max}} ({{(current/max*100).toFixed(0)}}%)'"
```

## الأحداث المدعومة

### input
يتم إطلاقه عند تغيير قيمة الحقل مع التحكم في الطول.

### paste
يتم إطلاقه عند لصق نص مع التحكم في الطول.

### keydown
يتم إطلاقه عند الضغط على المفاتيح مع منع الإدخال الزائد.

## الطرق العامة (Public Methods)

### getCurrentLength(): number
إرجاع عدد الأحرف الحالي.

### getMaxLength(): number
إرجاع الحد الأقصى للأحرف.

### getRemainingLength(): number
إرجاع عدد الأحرف المتبقية.

### getPercentage(): number
إرجاع النسبة المئوية للأحرف المستخدمة.

### isNearLimit(): boolean
إرجاع `true` إذا كان النص قريب من الحد.

### isAtLimit(): boolean
إرجاع `true` إذا كان النص وصل للحد الأقصى.

## أمثلة على الاستخدام

### 1. نموذج تعليق

```html
<div class="form-group">
  <label for="comment">التعليق</label>
  <textarea 
    id="comment"
    formControlName="comment"
    [libMaxLength]="500"
    [showCounter]="true"
    [counterPosition]="'bottom'"
    [counterTemplate]="'{{current}}/{{max}} حرف'"
    placeholder="اكتب تعليقك هنا..."
    rows="4"></textarea>
</div>
```

### 2. حقل اسم المستخدم

```html
<div class="form-group">
  <label for="username">اسم المستخدم</label>
  <input 
    type="text"
    id="username"
    formControlName="username"
    [libMaxLength]="20"
    [showCounter]="true"
    [counterPosition]="'top'"
    [counterTemplate]="'الأحرف المتبقية: {{max}} - {{current}}'"
    placeholder="أدخل اسم المستخدم">
</div>
```

### 3. حقل الوصف

```html
<div class="form-group">
  <label for="description">الوصف</label>
  <textarea 
    id="description"
    formControlName="description"
    [libMaxLength]="200"
    [showCounter]="true"
    [warningThreshold]="0.7"
    [errorThreshold]="0.9"
    [counterTemplate]="'{{current}}/{{max}}'"
    placeholder="أدخل الوصف هنا..."
    rows="3"></textarea>
</div>
```

## التخصيص

### 1. تخصيص ألوان العداد

```scss
// تخصيص ألوان العداد
.max-length-counter {
  &.text-gray-500 {
    @apply text-gray-500;
  }
  
  &.text-yellow-600 {
    @apply text-yellow-600;
  }
  
  &.text-red-600 {
    @apply text-red-600;
  }
}
```

### 2. تخصيص موقع العداد

```scss
// تخصيص موقع العداد
.counter-top {
  @apply mb-2 text-left;
}

.counter-bottom {
  @apply mt-2 text-right;
}
```

### 3. تخصيص الرسائل

```typescript
// تخصيص رسائل التحذير
@Component({
  template: `
    <input 
      [libMaxLength]="100"
      [warningThreshold]="0.8"
      [errorThreshold]="0.95"
      placeholder="أدخل النص هنا">
  `
})
```

## التكامل مع Reactive Forms

```typescript
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-example',
  template: `
    <form [formGroup]="form" (ngSubmit)="onSubmit()">
      <input 
        type="text"
        formControlName="username"
        [libMaxLength]="20"
        [showCounter]="true"
        placeholder="اسم المستخدم">
      
      <textarea 
        formControlName="comment"
        [libMaxLength]="500"
        [showCounter]="true"
        placeholder="التعليق"></textarea>
      
      <button type="submit">إرسال</button>
    </form>
  `
})
export class ExampleComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.maxLength(20)]],
      comment: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

## استكشاف الأخطاء

### المشكلة: لا يعمل العداد
**الحل**: تأكد من أن `showCounter` مُعيّن على `true`.

### المشكلة: لا يتم قطع النص
**الحل**: تأكد من أن `libMaxLength` أكبر من صفر.

### المشكلة: لا تظهر التحذيرات
**الحل**: تأكد من صحة قيم `warningThreshold` و `errorThreshold`.

### المشكلة: لا يعمل مع Reactive Forms
**الحل**: تأكد من أن الحقل مُسجل في FormGroup.

## المتطلبات

- Angular 17+
- Reactive Forms
- Tailwind CSS (اختياري للتخصيص)

## الدعم

للمساعدة أو الاستفسارات، يرجى التواصل مع فريق التطوير. 