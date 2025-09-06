import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'design-system',
    loadComponent: () => import('./shared/components/ui/design-system/design-system.component').then(m => m.DesignSystemComponent)
  },
  {
    path: 'storage-demo',
    loadComponent: () => import('./shared/components/storage-demo/storage-demo.component').then(m => m.StorageDemoComponent)
  },
  {
    path: 'dynamic-form-example',
    loadComponent: () => import('./shared/components/dynamic-form-example/dynamic-form-example.component').then(m => m.DynamicFormExampleComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTHENTICATION_ROUTES)
  }

];
