# WAIE - Angular Generic Architecture & Dynamic Form Library

مشروع شامل يحتوي على:
1. **Angular Generic Architecture** - بنية عامة قابلة لإعادة الاستخدام
2. **Dynamic Form Library** - مكتبة نماذج ديناميكية شاملة
3. **Environment Configuration** - إعدادات البيئات المختلفة
4. **RTL/LTR Support** - دعم اللغتين العربية والإنجليزية

### 1. Generic Architecture
- **Generic Models**: `BaseEntity`, `PaginationParams`, `PaginatedResponse`, `ApiResponse`
- **GenericApiService**: خدمة API عامة مع CRUD كامل
- **GenericStateService**: إدارة الحالة المحلية
- **HTTP Interceptors**: معالجة عالمية للطلبات
- **RxJS Integration**: برمجة تفاعلية متقدمة

### 2. Dynamic Form Library
- **12 نوع من الحقول**: input, textarea, select, radio, checkbox, date, password, email, number, file, switch, slider
- **ControlValueAccessor**: تكامل مثالي مع Reactive Forms
- **Validation System**: نظام تحقق شامل
- **RTL/LTR Support**: دعم كامل للغتين
- **Tailwind CSS**: تصميم جميل وحديث
- **Nested Forms**: نماذج متداخلة (groups & arrays)

### 3. Environment Configuration
- **Development**: بيئة التطوير
- **Production**: بيئة الإنتاج
- **Staging**: بيئة الاختبار
- **Environment Service**: خدمة مركزية للإعدادات

## 📦 التثبيت

```bash
# تثبيت التبعيات
npm install

# تشغيل بيئة التطوير
npm run start:dev

# تشغيل بيئة الإنتاج
npm run start:prod

# بناء المكتبة
npm run build:lib

# اختبار المكتبة
npm run test:lib
```

## 🏗️ هيكل المشروع

```
WAIE/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── models/           # النماذج العامة
│   │   │   ├── services/         # الخدمات العامة
│   │   │   └── interceptors/     # المعالجات
│   │   ├── shared/
│   │   │   └── components/       # المكونات المشتركة
│   │   └── features/             # الميزات
│   └── environments/             # إعدادات البيئات
├── projects/
│   └── dynamic-form/             # مكتبة النماذج الديناميكية
└── dist/                         # الملفات المبنية