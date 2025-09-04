import { Routes } from '@angular/router';
import { SignupComponent } from './signup/signup.component';


// Example Routes Configuration
export const AUTHENTICATION_ROUTES: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'account-type',
        pathMatch: 'full'
      },
      {
        path: 'account-type',
        loadComponent: () => import('./account-type/account-type.component').then(m => m.AccountTypeComponent),
      },
      {
        path: 'signup',
        loadComponent: () => import('./signup/signup.component').then(m => m.SignupComponent),
        title: 'create account',
        children: [
          {
            path: '',
            redirectTo: 'individual',
            pathMatch: 'full'
          },
          {
            path: 'individual',
            loadComponent: () => import('./signup/signup-individual/signup-individual.component').then(m => m.SignupIndividualComponent),
            title: 'create individual account'
          },
          {
            path: 'company',
            loadComponent: () => import('./signup/signup-company/signup-company.component').then(m => m.SignupCompanyComponent),
            title: 'create company account'
          }
        ]

      },
      {
        path: 'login',
        loadComponent: () => import('./login/login-individual.component').then(m => m.LoginIndividualComponent),
        title: 'login individual'
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
        title: 'forgot password'
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