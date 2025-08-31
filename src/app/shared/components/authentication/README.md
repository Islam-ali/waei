# Authentication Components

هذا المجلد يحتوي على جميع مكونات Authentication المستخدمة في التطبيق، وتم بناؤها باستخدام مكتبة `dynamic-form` المحلية.

## المكونات المتاحة

### 1. Sign Up Individual (`signup-individual.component`)
- **الوصف**: نموذج إنشاء حساب للفرد
- **الحقول**:
  - نوع الحساب (dropdown)
  - الاسم الأول والاسم الأخير
  - البريد الإلكتروني (اختياري)
  - رقم الهاتف (مطلوب، تنسيق سعودي)
  - اسم المستخدم (اختياري)
  - كلمة المرور وتأكيدها
  - كيف عرفت عنا (dropdown مع خيار "أخرى")
- **التحقق**: كلمة مرور قوية، تطابق كلمة المرور، إما البريد الإلكتروني أو اسم المستخدم

### 2. Sign Up Company (`signup-company.component`)
- **الوصف**: نموذج إنشاء حساب للشركة
- **الحقول**:
  - نوع الحساب
  - الاسم الأول والاسم الأخير
  - نوع الشركة (خاصة/حكومية)
  - اسم الشركة
  - رقم السجل التجاري
  - البريد الإلكتروني (مطلوب)
  - رقم الهاتف (تنسيق سعودي)
  - عنوان الشركة
  - اسم المستخدم
  - كلمة المرور وتأكيدها
  - الموافقة على الشروط

### 3. Login Individual (`login-individual.component`)
- **الوصف**: نموذج تسجيل الدخول للفرد
- **الميزات**:
  - تبديل بين تسجيل الدخول بالهاتف أو البريد الإلكتروني
  - كلمة المرور
  - تذكرني
  - رابط نسيان كلمة المرور
  - رابط إنشاء حساب جديد

### 4. Login Company (`login-company.component`)
- **الوصف**: نموذج تسجيل الدخول للشركة
- **الحقول**:
  - البريد الإلكتروني أو اسم المستخدم
  - كلمة المرور
  - تذكرني
  - رابط نسيان كلمة المرور
  - رابط إنشاء حساب شركة

### 5. OTP Verification (`otp-verification.component`)
- **الوصف**: نموذج التحقق من رمز OTP
- **الميزات**:
  - إدخال رمز 4 أرقام
  - عداد تنازلي (5 دقائق)
  - عداد المحاولات (3 محاولات كحد أقصى)
  - زر إعادة إرسال الرمز
  - رابط العودة لتسجيل الدخول

### 6. Forgot Password (`forgot-password.component`)
- **الوصف**: نموذج استعادة كلمة المرور
- **الخطوات**:
  1. إدخال البريد الإلكتروني أو اسم المستخدم
  2. التحقق من رمز OTP
  3. إدخال كلمة المرور الجديدة
- **الميزات**:
  - عداد تنازلي
  - عداد المحاولات
  - زر إلغاء للعودة للخطوة الأولى

## كيفية الاستخدام

### 1. استيراد المكونات

```typescript
import { SignupIndividualComponent } from './shared/components/authentication/signup-individual.component';
import { LoginIndividualComponent } from './shared/components/authentication/login-individual.component';
// ... باقي المكونات
```

### 2. إضافة المكونات إلى Routes

```typescript
const routes: Routes = [
  { path: 'signup', component: SignupIndividualComponent },
  { path: 'signup-company', component: SignupCompanyComponent },
  { path: 'login', component: LoginIndividualComponent },
  { path: 'login-company', component: LoginCompanyComponent },
  { path: 'otp-verification', component: OtpVerificationComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent }
];
```

### 3. استخدام المكونات في Templates

```html
<!-- في أي صفحة -->
<app-signup-individual></app-signup-individual>
<app-login-individual></app-login-individual>
```

## الميزات المشتركة

### 1. التصميم المتجاوب
- جميع المكونات تستخدم Tailwind CSS
- تصميم متجاوب يعمل على جميع الأجهزة
- دعم RTL للغة العربية

### 2. التحقق من صحة البيانات
- تحقق من صحة البريد الإلكتروني
- تحقق من قوة كلمة المرور
- تحقق من تطابق كلمة المرور
- تحقق من تنسيق رقم الهاتف السعودي

### 3. تجربة المستخدم
- رسائل خطأ واضحة باللغة العربية
- أيقونات FontAwesome
- تأثيرات بصرية عند التفاعل
- عداد تنازلي للـ OTP

## التخصيص

### 1. تغيير الألوان
يمكن تخصيص الألوان من خلال تعديل ملفات SCSS:

```scss
.btn-primary {
  @apply bg-blue-600 hover:bg-blue-700; // تغيير اللون الأزرق
}
```

### 2. إضافة حقول جديدة
يمكن إضافة حقول جديدة من خلال تعديل `formFields` في كل مكون:

```typescript
formFields: FormField[] = [
  // إضافة حقل جديد
  {
    type: 'control',
    name: 'newField',
    label: 'حقل جديد',
    controlType: 'input',
    validations: [
      { type: 'required', message: 'هذا الحقل مطلوب' }
    ]
  }
];
```

### 3. تخصيص الرسائل
يمكن تخصيص رسائل التحقق من خلال تعديل `validations`:

```typescript
validations: [
  { type: 'required', message: 'رسالة مخصصة' }
]
```

## المتطلبات

### 1. المكتبات المطلوبة
- `@angular/forms`
- `@angular/common`
- `dynamic-form` (المكتبة المحلية)
- `tailwindcss`
- `@fortawesome/fontawesome-free`

### 2. التكوين المطلوب
- تكوين Tailwind CSS
- تكوين FontAwesome
- تكوين مكتبة dynamic-form

## الدعم

للمساعدة أو الاستفسارات، يرجى التواصل مع فريق التطوير. 