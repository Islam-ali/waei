# WAAI - Angular Generic Architecture & Dynamic Form Library

مشروع شامل يحتوي على:
1. **Angular Generic Architecture** - بنية عامة قابلة لإعادة الاستخدام
2. **Dynamic Form Library** - مكتبة نماذج ديناميكية شاملة
3. **Environment Configuration** - إعدادات البيئات المختلفة
4. **RTL/LTR Support** - دعم اللغتين العربية والإنجليزية

## 🚀 المميزات

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
waai/
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
```

## 🎯 الاستخدام

### 1. Generic Architecture

#### إنشاء خدمة جديدة
```typescript
import { Injectable } from '@angular/core';
import { GenericApiService } from './core/services/generic-api.service';
import { GenericStateService } from './core/services/generic-state.service';
import { User } from './core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiService: GenericApiService<User>;
  public stateService: GenericStateService<User>;

  constructor() {
    this.apiService = new GenericApiService<User>();
    this.stateService = new GenericStateService<User>();
  }

  getAll() {
    this.stateService.setLoading(true);
    return this.apiService.getAll('users').pipe(
      tap(users => this.stateService.setItems(users.data)),
      finalize(() => this.stateService.setLoading(false))
    );
  }
}
```

#### استخدام في المكون
```typescript
import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-users',
  template: `
    <div *ngIf="userService.stateService.loading$ | async">جاري التحميل...</div>
    <div *ngFor="let user of userService.stateService.items$ | async">
      {{ user.name }}
    </div>
  `
})
export class UsersComponent implements OnInit {
  constructor(public userService: UserService) {}

  ngOnInit() {
    this.userService.getAll().subscribe();
  }
}
```

### 2. Dynamic Form Library

#### استخدام بسيط
```typescript
import { Component } from '@angular/core';
import { DynamicFormComponent } from '@your-org/dynamic-form';

@Component({
  selector: 'app-user-form',
  template: `
    <lib-dynamic-form
      [fields]="formFields"
      [config]="formConfig"
      (formSubmit)="onSubmit($event)">
    </lib-dynamic-form>
  `,
  imports: [DynamicFormComponent],
  standalone: true
})
export class UserFormComponent {
  formConfig = {
    direction: 'rtl',
    showLabels: true,
    showValidationMessages: true
  };

  formFields = [
    {
      type: 'control',
      name: 'name',
      label: 'الاسم',
      controlType: 'input',
      placeholder: 'أدخل الاسم',
      validations: [
        { type: 'required', message: 'الاسم مطلوب' }
      ]
    },
    {
      type: 'control',
      name: 'email',
      label: 'البريد الإلكتروني',
      controlType: 'email',
      validations: [
        { type: 'required', message: 'البريد الإلكتروني مطلوب' },
        { type: 'email', message: 'البريد الإلكتروني غير صحيح' }
      ]
    }
  ];

  onSubmit(event: any) {
    console.log('Form submitted:', event.value);
  }
}
```

#### نموذج متقدم مع مجموعات ومصفوفات
```typescript
formFields = [
  // مجموعة المعلومات الشخصية
  {
    type: 'group',
    name: 'personalInfo',
    label: 'المعلومات الشخصية',
    children: [
      {
        type: 'control',
        name: 'firstName',
        label: 'الاسم الأول',
        controlType: 'input',
        validations: [{ type: 'required', message: 'الاسم الأول مطلوب' }]
      },
      {
        type: 'control',
        name: 'lastName',
        label: 'اسم العائلة',
        controlType: 'input',
        validations: [{ type: 'required', message: 'اسم العائلة مطلوب' }]
      }
    ]
  },
  
  // مصفوفة أرقام الهاتف
  {
    type: 'array',
    name: 'phoneNumbers',
    label: 'أرقام الهاتف',
    itemTemplate: {
      type: 'group',
      children: [
        {
          type: 'control',
          name: 'type',
          label: 'النوع',
          controlType: 'select',
          options: [
            { label: 'جوال', value: 'mobile' },
            { label: 'منزل', value: 'home' }
          ]
        },
        {
          type: 'control',
          name: 'number',
          label: 'الرقم',
          controlType: 'input'
        }
      ]
    }
  }
];
```

### 3. Environment Configuration

#### استخدام Environment Service
```typescript
import { Injectable } from '@angular/core';
import { EnvironmentService } from './core/services/environment.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private env: EnvironmentService) {}

  getApiUrl() {
    return this.env.api.baseUrl;
  }

  getTimeout() {
    return this.env.api.timeout;
  }
}
```

## 🎨 التخصيص

### 1. تخصيص النماذج الديناميكية

#### إضافة CSS مخصص
```scss
// styles.scss
.dynamic-form {
  .form-field {
    margin-bottom: 1rem;
    
    .field-label {
      font-weight: 600;
      color: #374151;
    }
    
    .field-input {
      border: 1px solid #d1d5db;
      border-radius: 0.375rem;
      padding: 0.5rem;
      
      &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    }
    
    .field-error {
      color: #dc2626;
      font-size: 0.875rem;
      margin-top: 0.25rem;
    }
  }
}
```

#### تخصيص الألوان
```typescript
formConfig = {
  direction: 'rtl',
  showLabels: true,
  showValidationMessages: true,
  class: 'custom-form-theme'
};
```

### 2. تخصيص الخدمات العامة

#### إضافة منطق مخصص
```typescript
export class CustomApiService<T extends BaseEntity> extends GenericApiService<T> {
  constructor() {
    super();
  }

  // إضافة منطق مخصص
  customMethod() {
    // منطق مخصص
  }
}
```

## 🔧 التطوير

### بناء المكتبة
```bash
# بناء المكتبة للتطوير
npm run build:lib:dev

# بناء المكتبة للإنتاج
npm run build:lib:prod

# مراقبة التغييرات
npm run watch:lib
```

### اختبار المكتبة
```bash
# تشغيل الاختبارات
npm run test:lib

# تشغيل الاختبارات مع التغطية
npm run test:lib:coverage
```

### نشر المكتبة
```bash
# بناء المكتبة للنشر
npm run build:lib:prod

# نشر إلى npm (اختياري)
npm publish dist/dynamic-form
```

## 📚 الوثائق

### Dynamic Form Library
- [أنواع الحقول المدعومة](./projects/dynamic-form/README.md#supported-field-types)
- [نظام التحقق](./projects/dynamic-form/README.md#validations)
- [التخصيص](./projects/dynamic-form/README.md#customization)
- [الأحداث](./projects/dynamic-form/README.md#events)

### Generic Architecture
- [النماذج العامة](./src/app/core/models/README.md)
- [الخدمات العامة](./src/app/core/services/README.md)
- [المعالجات](./src/app/core/interceptors/README.md)

## 🤝 المساهمة

1. Fork المشروع
2. إنشاء فرع للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push إلى الفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📄 الرخصة

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم

إذا كان لديك أي أسئلة أو تحتاج مساعدة، يرجى فتح issue في GitHub أو التواصل معنا.

---

**تم تطوير هذا المشروع باستخدام Angular 19 و TypeScript مع التركيز على قابلية إعادة الاستخدام والأداء العالي.**
