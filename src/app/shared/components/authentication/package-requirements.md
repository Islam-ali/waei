# متطلبات الحزم للـ Authentication Components

## الحزم المطلوبة

### 1. الحزم الأساسية (Angular)
```json
{
  "@angular/core": "^17.0.0",
  "@angular/common": "^17.0.0",
  "@angular/forms": "^17.0.0",
  "@angular/router": "^17.0.0"
}
```

### 2. مكتبة Dynamic Form المحلية
```json
{
  "dynamic-form": "file:../../projects/dynamic-form"
}
```

### 3. Tailwind CSS
```json
{
  "tailwindcss": "^3.3.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0"
}
```

### 4. FontAwesome
```json
{
  "@fortawesome/fontawesome-free": "^6.4.0"
}
```

## تكوين Tailwind CSS

### 1. tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['Cairo', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 2. styles.scss
```scss
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

// FontAwesome
@import '@fortawesome/fontawesome-free/css/all.css';

// Arabic font
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@200;300;400;500;600;700;800;900&display=swap');

// RTL support
[dir="rtl"] {
  .text-left {
    text-align: right;
  }
  
  .text-right {
    text-align: left;
  }
}
```

## تكوين Angular

### 1. angular.json
```json
{
  "projects": {
    "your-app": {
      "architect": {
        "build": {
          "options": {
            "styles": [
              "src/styles.scss"
            ],
            "stylePreprocessorOptions": {
              "includePaths": [
                "src/styles"
              ]
            }
          }
        }
      }
    }
  }
}
```

### 2. app.config.ts
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations()
  ]
};
```

## خطوات التثبيت

### 1. تثبيت الحزم
```bash
# تثبيت Tailwind CSS
npm install -D tailwindcss postcss autoprefixer

# تهيئة Tailwind CSS
npx tailwindcss init

# تثبيت FontAwesome
npm install @fortawesome/fontawesome-free

# تثبيت مكتبة dynamic-form المحلية
npm install file:./projects/dynamic-form
```

### 2. تكوين PostCSS
```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 3. إضافة المكونات إلى app.module.ts
```typescript
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Import Authentication Components
import { SignupIndividualComponent } from './shared/components/authentication/signup-individual.component';
import { SignupCompanyComponent } from './shared/components/authentication/signup-company.component';
import { LoginIndividualComponent } from './shared/components/authentication/login-individual.component';
import { LoginCompanyComponent } from './shared/components/authentication/login-company.component';
import { OtpVerificationComponent } from './shared/components/authentication/otp-verification.component';
import { ForgotPasswordComponent } from './shared/components/authentication/forgot-password.component';
import { AuthenticationExampleComponent } from './shared/components/authentication/authentication-example.component';

// Import Dynamic Form Module
import { DynamicFormModule } from 'dynamic-form';

@NgModule({
  declarations: [
    SignupIndividualComponent,
    SignupCompanyComponent,
    LoginIndividualComponent,
    LoginCompanyComponent,
    OtpVerificationComponent,
    ForgotPasswordComponent,
    AuthenticationExampleComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule,
    DynamicFormModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## التحقق من التثبيت

### 1. تشغيل التطبيق
```bash
ng serve
```

### 2. فتح المتصفح
```
http://localhost:4200/auth/demo
```

### 3. التحقق من المكونات
- يجب أن تظهر جميع مكونات Authentication
- يجب أن تعمل النماذج بشكل صحيح
- يجب أن تظهر الأيقونات والتصميم بشكل صحيح

## استكشاف الأخطاء

### 1. مشاكل Tailwind CSS
```bash
# إعادة بناء التطبيق
ng build --watch

# مسح الكاش
npm run clean
```

### 2. مشاكل FontAwesome
```bash
# إعادة تثبيت FontAwesome
npm uninstall @fortawesome/fontawesome-free
npm install @fortawesome/fontawesome-free
```

### 3. مشاكل Dynamic Form
```bash
# إعادة بناء مكتبة dynamic-form
cd projects/dynamic-form
npm run build
cd ../..
```

## الدعم

للمساعدة في التثبيت أو استكشاف الأخطاء، يرجى التواصل مع فريق التطوير. 