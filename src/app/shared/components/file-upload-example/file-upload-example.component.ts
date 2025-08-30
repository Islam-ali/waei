import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicFormComponent } from '../../../../../projects/dynamic-form/src/lib/dynamic-form.component';
import { JsonPipe } from '@angular/common';
import { DynamicFormConfig } from '../../../../../projects/dynamic-form/src/lib/dynamic-form.types';

@Component({
  selector: 'app-file-upload-example',
  standalone: true,
  imports: [DynamicFormComponent, JsonPipe],
  template: `
    <div class="example-container">
      <h2>Enhanced File Upload Component Examples</h2>
      
      <div class="form-section">
        <h3>Basic File Upload with API</h3>
        <lib-dynamic-form
          [fields]="basicFileConfig.fields"
          [config]="basicFileConfig"
          [isApi]="true"
          [apiUrl]="apiConfig.apiUrl"
          [apiHeaders]="apiConfig.apiHeaders"
          [uploadData]="apiConfig.uploadData"
          (formSubmit)="onBasicFileSubmit($event)"
          (onUploadStart)="onUploadStart($event)"
          (onUploadProgress)="onUploadProgress($event)"
          (onUploadComplete)="onUploadComplete($event)"
          (onUploadError)="onUploadError($event)"
        ></lib-dynamic-form>
      </div>

      <div class="form-section">
        <h3>Image Upload with API</h3>
        <lib-dynamic-form
          [config]="imageFileConfig"
          [initialValue]="imageFileForm"
          [isApi]="true"
          [apiUrl]="'https://api.example.com/upload/images'"
          [apiHeaders]="apiConfig.apiHeaders"
          [uploadData]="apiConfig.uploadData"
          (formSubmit)="onImageFileSubmit($event)"
          (onUploadStart)="onUploadStart($event)"
          (onUploadProgress)="onUploadProgress($event)"
          (onUploadComplete)="onUploadComplete($event)"
          (onUploadError)="onUploadError($event)"
        ></lib-dynamic-form>
      </div>

      <div class="form-section">
        <h3>Document Upload with API</h3>
        <lib-dynamic-form
          [config]="documentFileConfig"
          [isApi]="true"
          [apiUrl]="'https://api.example.com/upload/documents'"
          [apiHeaders]="apiConfig.apiHeaders"
          [uploadData]="apiConfig.uploadData"
          (formSubmit)="onDocumentFileSubmit($event)"
          (onUploadStart)="onUploadStart($event)"
          (onUploadProgress)="onUploadProgress($event)"
          (onUploadComplete)="onUploadComplete($event)"
          (onUploadError)="onUploadError($event)"
        ></lib-dynamic-form>
      </div>

      <div class="form-section">
        <h3>Multiple Files Upload with API</h3>
        <lib-dynamic-form
          [config]="multipleFileConfig"
          [initialValue]="multipleFileForm"
          [isApi]="true"
          [apiUrl]="'https://api.example.com/upload/multiple'"
          [apiHeaders]="apiConfig.apiHeaders"
          [uploadData]="apiConfig.uploadData"
          (formSubmit)="onMultipleFileSubmit($event)"
          (onUploadStart)="onUploadStart($event)"
          (onUploadProgress)="onUploadProgress($event)"
          (onUploadComplete)="onUploadComplete($event)"
          (onUploadError)="onUploadError($event)"
        ></lib-dynamic-form>
      </div>

      <div class="form-section">
        <h3>API Configuration</h3>
        <div class="bg-gray-100 p-4 rounded-lg">
          <h4 class="font-semibold mb-2">Current API Settings:</h4>
          <pre class="text-sm overflow-auto">{{ safeJsonStringify(apiConfig) }}</pre>
        </div>
      </div>

      <div class="form-section">
        <h3>Example Models</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <h4 class="font-semibold mb-2">Product Model:</h4>
            <pre class="bg-gray-100 p-2 rounded text-xs overflow-auto">{{ safeJsonStringify(productModel) }}</pre>
          </div>
          <div>
            <h4 class="font-semibold mb-2">User Model:</h4>
            <pre class="bg-gray-100 p-2 rounded text-xs overflow-auto">{{ safeJsonStringify(userModel) }}</pre>
          </div>
          <div>
            <h4 class="font-semibold mb-2">Basic Model:</h4>
            <pre class="bg-gray-100 p-2 rounded text-xs overflow-auto">{{ safeJsonStringify(exampleModel) }}</pre>
          </div>
        </div>
      </div>

      <div class="results">
        <h3>Results:</h3>
        <pre>{{ safeJsonStringify(results) }}</pre>
      </div>
    </div>
  `,
  styles: [`
    .example-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      font-family: var(--font-family-sans);
    }

    h2 {
      color: var(--color-primary-600);
      margin-bottom: 2rem;
      text-align: center;
    }

    .form-section {
      margin-bottom: 3rem;
      padding: 1.5rem;
      border: 1px solid var(--color-secondary-200);
      border-radius: var(--border-radius-lg);
      background-color: var(--color-secondary-50);
    }

    h3 {
      color: var(--color-secondary-700);
      margin-bottom: 1rem;
      font-size: var(--font-size-lg);
    }

    .results {
      margin-top: 2rem;
      padding: 1rem;
      background-color: var(--color-neutral-100);
      border-radius: var(--border-radius-md);
    }

    pre {
      background-color: var(--color-neutral-200);
      padding: 1rem;
      border-radius: var(--border-radius-sm);
      overflow-x: auto;
      font-size: var(--font-size-sm);
    }
  `]
})
export class FileUploadExampleComponent {
  basicFileForm: FormGroup;
  imageFileForm: FormGroup;
  documentFileForm: FormGroup;
  multipleFileForm: FormGroup;
  results: any = {};

  // Example model data
  exampleModel = {
    id: 1,
    name: 'Example Product',
    category: 'Electronics',
    price: 99.99,
    description: 'This is an example product for file upload testing'
  };

  // Product model example
  productModel = {
    id: 'PROD-001',
    name: 'Smartphone',
    brand: 'TechCorp',
    model: 'X1',
    price: 599.99,
    category: 'Mobile Devices',
    specifications: {
      screen: '6.1 inch OLED',
      processor: 'Snapdragon 888',
      storage: '128GB',
      camera: '48MP + 12MP + 8MP'
    }
  };

  // User model example
  userModel = {
    id: 'USER-001',
    firstName: 'أحمد',
    lastName: 'محمد',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    department: 'IT',
    role: 'Developer'
  };

  // API Configuration
  apiConfig = {
    apiUrl: 'https://api.example.com/upload',
    apiHeaders: {
      'Authorization': 'Bearer your-token-here',
      'X-API-Key': 'your-api-key'
    },
    uploadData: {
      category: 'products',
      userId: 'USER-001',
      timestamp: new Date().toISOString()
    }
  };

  constructor(private fb: FormBuilder) {
    this.basicFileForm = this.fb.group({
      file: [null, Validators.required]
    });

    this.imageFileForm = this.fb.group({
      image: [null, Validators.required]
    });

    this.documentFileForm = this.fb.group({
      document: [null, Validators.required]
    });

    this.multipleFileForm = this.fb.group({
      files: [[], Validators.required]
    });
  }

  // Safe JSON serialization method to handle circular references
  safeJsonStringify(obj: any): string {
    try {
      const seen = new WeakSet();
      return JSON.stringify(obj, (key, value) => {
        if (typeof value === 'object' && value !== null) {
          if (seen.has(value)) {
            return '[Circular Reference]';
          }
          seen.add(value);
        }
        // Remove RxJS-specific properties that cause circular references
        if (value && typeof value === 'object') {
          const cleanValue = { ...value };
          delete cleanValue['_parentage'];
          delete cleanValue['_finalizers'];
          delete cleanValue['_subscriptions'];
          delete cleanValue['_isScalar'];
          delete cleanValue['_value'];
          delete cleanValue['_error'];
          delete cleanValue['_complete'];
          delete cleanValue['_unsubscribe'];
          delete cleanValue['_parent'];
          delete cleanValue['_parentSub'];
          delete cleanValue['_destination'];
          delete cleanValue['_source'];
          delete cleanValue['_observers'];
          delete cleanValue['_closed'];
          delete cleanValue['_isStopped'];
          return cleanValue;
        }
        return value;
      }, 2);
    } catch (error) {
      return `Error serializing object: ${error instanceof Error ? error.message : String(error)}`;
    }
  }

  basicFileConfig: DynamicFormConfig = {
    fields: [
      {
        type: 'control',
        name: 'file',
        label: 'Upload File',
        controlType: 'file',
        description: 'Choose any file type up to 2MB',
        accept: '*',
        validations: [
          { type: 'required', message: 'File is required' }
        ]
      }
    ]
  };

  imageFileConfig: DynamicFormConfig = {
    fields: [
      {
        type: 'control',
        name: 'image',
        label: 'Upload Image',
        controlType: 'file',
        description: 'Upload profile picture or any image file',
        accept: 'image/*',
        validations: [
          { type: 'required', message: 'Image is required' }
        ]
      }
    ]
  };

  documentFileConfig: DynamicFormConfig = {
    fields: [
      {
        type: 'control',
        name: 'document',
        label: 'Upload Document',
        controlType: 'file',
        description: 'Upload PDF, CSV, or Word documents',
        accept: '.pdf,.csv,.doc,.docx',
        validations: [
          { type: 'required', message: 'Document is required' }
        ]
      }
    ]
  };

  multipleFileConfig: DynamicFormConfig = {
    fields: [
      {
        type: 'control',
        name: 'files',
        label: 'Upload Multiple Files',
        controlType: 'file',
        description: 'Upload multiple files at once',
        accept: '*',
        multiple: true,
        validations: [
          { type: 'required', message: 'At least one file is required' }
        ]
      }
    ]
  };

  onBasicFileSubmit(data: any) {
    this.results.basicFile = data;
    console.log('Basic File Upload Result:', data);
  }

  onImageFileSubmit(data: any) {
    this.results.imageFile = data;
    console.log('Image File Upload Result:', data);
  }

  onDocumentFileSubmit(data: any) {
    this.results.documentFile = data;
    console.log('Document File Upload Result:', data);
  }

  onMultipleFileSubmit(data: any) {
    this.results.multipleFile = data;
    console.log('Multiple File Upload Result:', data);
  }

  // API Event Handlers
  onUploadStart(data: any) {
    console.log('Upload Started:', data);
    this.results.uploadStart = data;
  }

  onUploadProgress(data: any) {
    console.log('Upload Progress:', data);
    this.results.uploadProgress = data;
  }

  onUploadComplete(data: any) {
    console.log('Upload Complete:', data);
    this.results.uploadComplete = data;
  }

  onUploadError(data: any) {
    console.error('Upload Error:', data);
    this.results.uploadError = data;
  }

  // Handle file exports
  onFileExport(data: any) {
    console.log('File Export:', data);
    this.results.fileExport = data;
  }
} 