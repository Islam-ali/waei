import { Routes } from '@angular/router';
import { DesignSystemComponent } from './shared/components/ui/design-system/design-system.component';
import { StorageDemoComponent } from './shared/components/storage-demo/storage-demo.component';
import { DynamicFormExampleComponent } from './shared/components/dynamic-form-example/dynamic-form-example.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'design-system',
    component: DesignSystemComponent
  },
  {
    path: 'storage-demo',
    component: StorageDemoComponent
  },
  {
    path: 'dynamic-form-example',
    component: DynamicFormExampleComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTHENTICATION_ROUTES)
  }

];
