import { Routes } from '@angular/router';
import { DesignSystemComponent } from './shared/components/ui/design-system/design-system.component';
import { StorageDemoComponent } from './shared/components/storage-demo/storage-demo.component';
import { DynamicFormExampleComponent } from './shared/components/dynamic-form-example/dynamic-form-example.component';
import { FileUploadExampleComponent } from './shared/components/file-upload-example/file-upload-example.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dynamic-form-example',
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
    path: 'file-upload-example',
    component: FileUploadExampleComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./shared/components/authentication/routes-example').then(m => m.AUTHENTICATION_ROUTES)
  }

];
