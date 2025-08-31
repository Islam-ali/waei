import { Routes } from '@angular/router';

// Import Authentication Components
import { SignupIndividualComponent } from '../../../auth/signup/signup-individual/signup-individual.component';
import { SignupCompanyComponent } from '../../../auth/signup/signup-company/signup-company.component';
import { LoginIndividualComponent } from '../../../auth/login/login-individual.component';
import { LoginCompanyComponent } from './login-company.component';
import { OtpVerificationComponent } from '../../../auth/otp/otp-verification.component';
import { ForgotPasswordComponent } from './forgot-password.component';
import { AuthenticationExampleComponent } from './authentication-example.component';
import { PhoneFieldExampleComponent } from './phone-field-example.component';
import { MaxLengthDemoComponent } from './max-length-demo.component';
import { PasswordDemoComponent } from './password-demo.component';
import { SignupComponent } from '../../../auth/signup/signup.component';

// Example Routes Configuration
export const AUTHENTICATION_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'demo',
        pathMatch: 'full'
      },
      {
        path: 'demo',
        component: AuthenticationExampleComponent,
        title: 'Authentication Components Demo'
      },
      {
        path: 'phone-demo',
        component: PhoneFieldExampleComponent,
        title: 'Phone Field Component Demo'
      },
      {
        path: 'max-length-demo',
        component: MaxLengthDemoComponent,
        title: 'Max Length Directive Demo'
      },
      {
        path: 'password-demo',
        component: PasswordDemoComponent,
        title: 'Password Field Component Demo'
      },
      {
        path: 'signup',
        component: SignupComponent,
        title: 'إنشاء حساب فردي',
        children: [
          {
            path: '',
            redirectTo: 'individual',
            pathMatch: 'full'
          },
          {
            path: 'individual',
            component: SignupIndividualComponent,
            title: 'إنشاء حساب فردي'
          },
          {
            path: 'company',
            component: SignupCompanyComponent,
            title: 'إنشاء حساب شركة'
          }
        ]

      },
      {
        path: 'login',
        component: LoginIndividualComponent,
        title: 'تسجيل دخول فردي'
      },
      {
        path: 'otp-verification',
        component: OtpVerificationComponent,
        title: 'التحقق من الرمز'
      },
      {
        path: 'forgot-password',
        component: ForgotPasswordComponent,
        title: 'استعادة كلمة المرور'
      }
    ]
  }
];

// Alternative: Add to main app routes
export const APP_ROUTES_WITH_AUTH: Routes = [
  {
    path: '',
    redirectTo: '/auth/demo',
    pathMatch: 'full'
  },
  // Include authentication routes
  ...AUTHENTICATION_ROUTES,
  // Other app routes...
  {
    path: '**',
    redirectTo: '/auth/demo'
  }
];

// Usage in app.routes.ts:
/*
import { AUTHENTICATION_ROUTES } from './shared/components/authentication/routes-example';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/auth/demo',
    pathMatch: 'full'
  },
  ...AUTHENTICATION_ROUTES,
  // Your other routes...
];
*/ 