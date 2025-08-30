# نظام التصميم الشامل - WAAI Design System

## نظرة عامة

نظام التصميم الشامل هو مجموعة من المكونات والأنماط المتناسقة التي تضمن تجربة مستخدم موحدة وجميلة عبر جميع أجزاء التطبيق. تم تصميمه ليكون مرناً وقابلاً للتخصيص مع دعم كامل للغة العربية والوضع المظلم.

## الملفات الرئيسية

### 1. `src/styles/design-system.scss`
يحتوي على المتغيرات الأساسية للنظام:
- نظام الألوان الكامل (Primary, Secondary, Success, Warning, Error, Info)
- نظام الخطوط (Sans, Heading, Mono, Arabic)
- نظام المسافات والأحجام
- زوايا الانحناء والظلال
- الانتقالات والحركات
- أحجام الشاشات و Z-Index

### 2. `src/styles/components.scss`
يحتوي على جميع مكونات التصميم:
- الأزرار (أحجام وأنواع مختلفة)
- البطاقات (أنواع متعددة)
- التنبيهات (معلومات، نجاح، تحذير، خطأ)
- الجداول (مع دعم التثبيت والخطوط المتبدلة)
- النماذج (حقول إدخال، قوائم منسدلة، مربعات اختيار)
- التنقل والشريط الجانبي
- التبويبات والمودال
- التحميل والشريط التقدمي
- الشارات والأدوات المساعدة

### 3. `projects/dynamic-form/src/lib/styles.scss`
يحتوي على أنماط خاصة بالنموذج الديناميكي:
- تصميم الحقول المختلفة
- حالات التحقق (صحيح، خطأ)
- الأيقونات والرسائل
- دعم الاتجاه (RTL/LTR)

## نظام الألوان

### الألوان الأساسية (Primary)
```scss
--color-primary-50: #eff6ff;   // فاتح جداً
--color-primary-100: #dbeafe;  // فاتح
--color-primary-200: #bfdbfe;  // فاتح متوسط
--color-primary-300: #93c5fd;  // متوسط فاتح
--color-primary-400: #60a5fa;  // متوسط
--color-primary-500: #3b82f6;  // أساسي
--color-primary-600: #2563eb;  // متوسط غامق
--color-primary-700: #1d4ed8;  // غامق
--color-primary-800: #1e40af;  // غامق جداً
--color-primary-900: #1e3a8a;  // غامق جداً جداً
--color-primary-950: #172554;  // أغمق
```

### الألوان الثانوية (Secondary)
```scss
--color-secondary-50: #f8fafc;   // فاتح جداً
--color-secondary-100: #f1f5f9;  // فاتح
--color-secondary-200: #e2e8f0;  // فاتح متوسط
--color-secondary-300: #cbd5e1;  // متوسط فاتح
--color-secondary-400: #94a3b8;  // متوسط
--color-secondary-500: #64748b;  // أساسي
--color-secondary-600: #475569;  // متوسط غامق
--color-secondary-700: #334155;  // غامق
--color-secondary-800: #1e293b;  // غامق جداً
--color-secondary-900: #0f172a;  // غامق جداً جداً
--color-secondary-950: #020617;  // أغمق
```

### ألوان الحالة
- **النجاح (Success)**: أخضر - للإشارة إلى العمليات الناجحة
- **التحذير (Warning)**: أصفر - للتنبيهات والتحذيرات
- **الخطأ (Error)**: أحمر - للأخطاء والمشاكل
- **المعلومات (Info)**: أزرق سماوي - للمعلومات الإضافية

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
--font-size-xs: 0.75rem;      // 12px - نص صغير جداً
--font-size-sm: 0.875rem;     // 14px - نص صغير
--font-size-base: 1rem;       // 16px - النص الأساسي
--font-size-lg: 1.125rem;     // 18px - نص كبير
--font-size-xl: 1.25rem;      // 20px - نص كبير جداً
--font-size-2xl: 1.5rem;      // 24px - عنوان صغير
--font-size-3xl: 1.875rem;    // 30px - عنوان متوسط
--font-size-4xl: 2.25rem;     // 36px - عنوان كبير
--font-size-5xl: 3rem;        // 48px - عنوان كبير جداً
--font-size-6xl: 3.75rem;     // 60px - عنوان ضخم
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
<button class="btn btn-info">زر معلومات</button>

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
<button class="btn btn-loading">تحميل</button>
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

<!-- أنواع الجداول -->
<table class="table table-pin-rows">صفوف مثبتة</table>
<table class="table table-pin-cols">أعمدة مثبتة</table>
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

## النموذج الديناميكي

النموذج الديناميكي يستخدم نظام التصميم الشامل ويوفر:

### أنواع الحقول المدعومة
- **Input**: حقل نص عادي
- **Textarea**: منطقة نص متعددة الأسطر
- **Select**: قائمة منسدلة
- **Radio**: أزرار راديو
- **Checkbox**: مربعات اختيار
- **Switch**: مفتاح تبديل
- **Slider**: شريط تمرير
- **Password**: حقل كلمة مرور
- **Email**: حقل بريد إلكتروني
- **Number**: حقل رقمي
- **Date**: حقل تاريخ
- **File**: رفع ملفات
- **HTML**: محتوى HTML
- **Button**: أزرار

### الميزات
- دعم الاتجاه (RTL/LTR)
- التحقق من صحة البيانات
- رسائل خطأ مخصصة
- أيقونات قبلية وبعدية
- مجموعات ومصفوفات من الحقول
- تخصيص كامل للألوان والأنماط

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
- خطوط عربية مخصصة (Cairo, Noto Sans Arabic)
- تعديل المسافات والهوامش للغة العربية
- دعم الأرقام العربية والإنجليزية

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
- دعم الشاشات الصغيرة

## الاستخدام

### في ملف SCSS
```scss
@import './styles/design-system.scss';
@import './styles/components.scss';

.my-component {
  background-color: var(--color-primary-500);
  padding: var(--spacing-4);
  border-radius: var(--border-radius-md);
  font-family: var(--font-family-sans);
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

### في النموذج الديناميكي
```typescript
const fields = [
  {
    name: 'username',
    label: 'اسم المستخدم',
    controlType: 'input',
    validations: [
      { type: 'required', message: 'اسم المستخدم مطلوب' }
    ]
  },
  {
    name: 'email',
    label: 'البريد الإلكتروني',
    controlType: 'email',
    validations: [
      { type: 'required', message: 'البريد الإلكتروني مطلوب' },
      { type: 'email', message: 'البريد الإلكتروني غير صحيح' }
    ]
  }
];
```

## الممارسات الجيدة

1. **استخدم المتغيرات**: دائماً استخدم متغيرات CSS بدلاً من القيم المباشرة
2. **اتبع التسلسل الهرمي**: استخدم أحجام الخطوط والمسافات المحددة
3. **حافظ على التناسق**: استخدم نفس الألوان والأنماط في جميع أنحاء التطبيق
4. **اختبر الاستجابة**: تأكد من أن التصميم يعمل على جميع أحجام الشاشات
5. **راعي إمكانية الوصول**: تأكد من أن التصميم يمكن الوصول إليه لجميع المستخدمين
6. **اختبر الوضع المظلم**: تأكد من أن التصميم يبدو جيداً في الوضع المظلم
7. **اختبر اللغة العربية**: تأكد من أن التصميم يعمل بشكل صحيح مع النص العربي

## التحديثات المستقبلية

- إضافة المزيد من المكونات
- تحسين دعم الوضع المظلم
- إضافة المزيد من الرسوم المتحركة
- تحسين الأداء
- إضافة المزيد من السمات
- دعم المزيد من اللغات
- تحسين إمكانية الوصول

## المساهمة

للمساهمة في تطوير نظام التصميم:
1. اتبع الممارسات الجيدة المذكورة أعلاه
2. تأكد من أن التغييرات تعمل مع جميع أحجام الشاشات
3. اختبر التغييرات في الوضع المظلم
4. تأكد من دعم اللغة العربية
5. اكتب توثيقاً للتغييرات الجديدة 