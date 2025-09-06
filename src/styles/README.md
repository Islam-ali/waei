# نظام التصميم الشامل - WAIE Design System

## نظرة عامة

نظام التصميم الشامل هو مجموعة من المكونات والأنماط المتناسقة التي تضمن تجربة مستخدم موحدة وجميلة عبر جميع أجزاء التطبيق.

## الملفات الرئيسية

### 1. `design-system.scss`
يحتوي على المتغيرات الأساسية للنظام:
- نظام الألوان الكامل
- نظام الخطوط
- نظام المسافات
- زوايا الانحناء
- الظلال
- الانتقالات
- أحجام الشاشات
- Z-Index

### 2. `components.scss`
يحتوي على جميع مكونات التصميم:
- الأزرار
- البطاقات
- التنبيهات
- الجداول
- النماذج
- التنقل
- الشريط الجانبي
- التبويبات
- المودال
- التحميل
- الشريط التقدمي
- الشارات

## نظام الألوان

### الألوان الأساسية (Primary)
```scss
--color-primary-50: #eff6ff;
--color-primary-100: #dbeafe;
--color-primary-200: #bfdbfe;
--color-primary-300: #93c5fd;
--color-primary-400: #60a5fa;
--color-primary-500: #3b82f6;  // اللون الأساسي
--color-primary-600: #2563eb;
--color-primary-700: #1d4ed8;
--color-primary-800: #1e40af;
--color-primary-900: #1e3a8a;
--color-primary-950: #172554;
```

### الألوان الثانوية (Secondary)
```scss
--color-secondary-50: #f8fafc;
--color-secondary-100: #f1f5f9;
--color-secondary-200: #e2e8f0;
--color-secondary-300: #cbd5e1;
--color-secondary-400: #94a3b8;
--color-secondary-500: #64748b;  // اللون الثانوي
--color-secondary-600: #475569;
--color-secondary-700: #334155;
--color-secondary-800: #1e293b;
--color-secondary-900: #0f172a;
--color-secondary-950: #020617;
```

### ألوان الحالة
- **النجاح (Success)**: أخضر
- **التحذير (Warning)**: أصفر
- **الخطأ (Error)**: أحمر
- **المعلومات (Info)**: أزرق سماوي

## نظام الخطوط

### عائلات الخطوط
```scss
--font-family-sans: "Inter", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", sans-serif;
--font-family-heading: "Poppins", "Inter", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", sans-serif;
--font-family-mono: "JetBrains Mono", "Fira Code", "Monaco", "Consolas", monospace;
--font-family-arabic: "Cairo", "Noto Sans Arabic", "Segoe UI", sans-serif;
```

### أحجام الخطوط
```scss
--font-size-xs: 0.75rem;      // 12px
--font-size-sm: 0.875rem;     // 14px
--font-size-base: 1rem;       // 16px
--font-size-lg: 1.125rem;     // 18px
--font-size-xl: 1.25rem;      // 20px
--font-size-2xl: 1.5rem;      // 24px
--font-size-3xl: 1.875rem;    // 30px
--font-size-4xl: 2.25rem;     // 36px
--font-size-5xl: 3rem;        // 48px
--font-size-6xl: 3.75rem;     // 60px
```

## المكونات

### الأزرار
```html
<!-- الأزرار الأساسية -->
<button class="btn btn-primary">زر أساسي</button>
<button class="btn btn-secondary">زر ثانوي</button>
<button class="btn btn-success">زر نجاح</button>
<button class="btn btn-warning">زر تحذير</button>
<button class="btn btn-error">زر خطأ</button>

<!-- أحجام الأزرار -->
<button class="btn btn-primary btn-xs">صغير جداً</button>
<button class="btn btn-primary btn-sm">صغير</button>
<button class="btn btn-primary btn-md">متوسط</button>
<button class="btn btn-primary btn-lg">كبير</button>
<button class="btn btn-primary btn-xl">كبير جداً</button>

<!-- أنواع الأزرار -->
<button class="btn btn-outline">إطار</button>
<button class="btn btn-ghost">شبح</button>
<button class="btn btn-link">رابط</button>
<button class="btn btn-rounded">مستدير</button>
<button class="btn btn-block">كامل العرض</button>
```

### البطاقات
```html
<div class="card">
  <div class="card-body">
    <h3 class="card-title">عنوان البطاقة</h3>
    <p class="card-subtitle">وصف البطاقة</p>
    <p>محتوى البطاقة</p>
    <div class="card-actions">
      <button class="btn btn-primary">إجراء</button>
    </div>
  </div>
</div>

<!-- أنواع البطاقات -->
<div class="card card-compact">مدمجة</div>
<div class="card card-bordered">إطار سميك</div>
<div class="card card-side">جانبية</div>
<div class="card card-image-full">صورة كاملة</div>
```

### التنبيهات
```html
<div class="alert alert-info">
  <div class="alert-title">معلومات</div>
  <div class="alert-message">رسالة معلومات</div>
</div>

<div class="alert alert-success">
  <div class="alert-title">نجح</div>
  <div class="alert-message">تمت العملية بنجاح</div>
</div>

<div class="alert alert-warning">
  <div class="alert-title">تحذير</div>
  <div class="alert-message">تحذير مهم</div>
</div>

<div class="alert alert-error">
  <div class="alert-title">خطأ</div>
  <div class="alert-message">حدث خطأ ما</div>
</div>
```

### النماذج
```html
<div class="form-control">
  <label class="form-label required">اسم المستخدم</label>
  <input type="text" class="form-input" placeholder="أدخل اسم المستخدم">
  <div class="form-error">هذا الحقل مطلوب</div>
</div>

<div class="form-control">
  <label class="form-label">الوصف</label>
  <textarea class="form-textarea" placeholder="أدخل الوصف"></textarea>
  <div class="form-help">أدخل وصفاً مفصلاً</div>
</div>

<div class="form-control">
  <label class="form-label">البلد</label>
  <select class="form-select">
    <option>اختر البلد</option>
    <option>مصر</option>
    <option>السعودية</option>
  </select>
</div>
```

### الجداول
```html
<table class="table table-zebra">
  <thead>
    <tr>
      <th>الاسم</th>
      <th>البريد الإلكتروني</th>
      <th>الدور</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>أحمد محمد</td>
      <td>ahmed@example.com</td>
      <td>مدير</td>
    </tr>
  </tbody>
</table>
```

### الشارات
```html
<span class="badge badge-primary">جديد</span>
<span class="badge badge-success">مكتمل</span>
<span class="badge badge-warning">قيد المراجعة</span>
<span class="badge badge-error">مرفوض</span>
<span class="badge badge-outline">إطار</span>
```

### التحميل
```html
<div class="loading"></div>
<div class="loading loading-lg"></div>
<div class="loading loading-xl"></div>
```

### الشريط التقدمي
```html
<div class="progress">
  <div class="progress-bar progress-primary" style="width: 75%"></div>
</div>
```

## الاستجابة للشاشات

النظام يدعم جميع أحجام الشاشات:
- **شاشات صغيرة جداً**: أقل من 480px
- **شاشات صغيرة**: أقل من 640px
- **شاشات متوسطة**: 768px - 1023px
- **شاشات كبيرة**: 1280px وأكثر
- **شاشات كبيرة جداً**: 1920px وأكثر

## دعم اللغة العربية

النظام يدعم اللغة العربية بشكل كامل:
- اتجاه النص من اليمين إلى اليسار (RTL)
- خطوط عربية مخصصة
- تعديل المسافات والهوامش للغة العربية

## الوضع المظلم

النظام يدعم الوضع المظلم تلقائياً:
```scss
@media (prefers-color-scheme: dark) {
  :root {
    // تعديل الألوان للوضع المظلم
  }
}
```

## إمكانية الوصول

النظام يتبع معايير إمكانية الوصول:
- دعم لوحة المفاتيح
- تباين عالي
- تقليل الحركة
- شاشات القراءة

## الاستخدام

### في ملف SCSS
```scss
@import './styles/design-system.scss';
@import './styles/components.scss';

.my-component {
  background-color: var(--color-primary-500);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-md);
}
```

### في Angular Components
```typescript
@Component({
  selector: 'app-my-component',
  template: `
    <button class="btn btn-primary">زر</button>
    <div class="card">
      <div class="card-body">محتوى</div>
    </div>
  `
  styleUrls: ['./my-component.scss']
})
```

## الممارسات الجيدة

1. **استخدم المتغيرات**: دائماً استخدم متغيرات CSS بدلاً من القيم المباشرة
2. **اتبع التسلسل الهرمي**: استخدم أحجام الخطوط والمسافات المحددة
3. **حافظ على التناسق**: استخدم نفس الألوان والأنماط في جميع أنحاء التطبيق
4. **اختبر الاستجابة**: تأكد من أن التصميم يعمل على جميع أحجام الشاشات
5. **راعي إمكانية الوصول**: تأكد من أن التصميم يمكن الوصول إليه لجميع المستخدمين

## التحديثات المستقبلية

- إضافة المزيد من المكونات
- تحسين دعم الوضع المظلم
- إضافة المزيد من الرسوم المتحركة
- تحسين الأداء
- إضافة المزيد من السمات 