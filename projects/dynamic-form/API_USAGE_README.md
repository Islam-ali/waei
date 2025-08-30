# دليل استخدام مكون رفع الملفات مع API

هذا الدليل يوضح كيفية استخدام مكون رفع الملفات مع API لإرسال الملفات إلى الخادم.

## الميزات الجديدة

### 🚀 **دعم API الكامل**
- **`isApi`**: تفعيل/إلغاء تفعيل رفع الملفات إلى API
- **`apiUrl`**: عنوان URL للـ API
- **`apiHeaders`**: Headers إضافية للـ API
- **`uploadData`**: بيانات إضافية للرفع

### 📊 **أحداث API**
- **`onUploadStart`**: حدث بداية الرفع
- **`onUploadProgress`**: حدث تقدم الرفع
- **`onUploadComplete`**: حدث اكتمال الرفع
- **`onUploadError`**: حدث خطأ في الرفع
- **`onExportFiles`**: حدث تصدير الملفات

## الاستخدام الأساسي

### 1. إعداد API بسيط

```typescript
// في المكون الأب
export class MyComponent {
  apiConfig = {
    apiUrl: 'https://api.example.com/upload',
    apiHeaders: {
      'Authorization': 'Bearer your-token-here'
    },
    uploadData: {
      category: 'documents',
      userId: 'USER-001'
    }
  };

  fileConfig: DynamicFormConfig = {
    fields: [
      {
        type: 'control',
        name: 'document',
        label: 'رفع المستند',
        controlType: 'file',
        accept: '.pdf,.doc,.docx',
        validations: [
          { type: 'required', message: 'يجب رفع مستند' }
        ]
      }
    ]
  };
}
```

### 2. استخدام المكون في القالب

```html
<lib-dynamic-form
  [config]="fileConfig"
  [isApi]="true"
  [apiUrl]="apiConfig.apiUrl"
  [apiHeaders]="apiConfig.apiHeaders"
  [uploadData]="apiConfig.uploadData"
  (onUploadStart)="handleUploadStart($event)"
  (onUploadProgress)="handleUploadProgress($event)"
  (onUploadComplete)="handleUploadComplete($event)"
  (onUploadError)="handleUploadError($event)"
  (formSubmit)="handleFormSubmit($event)"
></lib-dynamic-form>
```

### 3. معالجة الأحداث

```typescript
handleUploadStart(data: any) {
  console.log('بداية الرفع:', data);
  // data يحتوي على:
  // {
  //   file: FileWithProgress,
  //   timestamp: '2024-01-15T10:30:00Z'
  // }
}

handleUploadProgress(data: any) {
  console.log('تقدم الرفع:', data);
  // data يحتوي على:
  // {
  //   file: FileWithProgress,
  //   progress: 50,
  //   loaded: 1024000,
  //   total: 2048000,
  //   timestamp: '2024-01-15T10:30:00Z'
  // }
}

handleUploadComplete(data: any) {
  console.log('اكتمال الرفع:', data);
  // data يحتوي على:
  // {
  //   file: FileWithProgress,
  //   result: {
  //     id: 'file-1',
  //     originalFileName: 'document.pdf',
  //     mimeType: 'application/pdf',
  //     fileSize: 2048000,
  //     filePath: 'uploads/documents/document.pdf',
  //     uploadedAt: '2024-01-15T10:30:00Z',
  //     serverResponse: { success: true, fileId: '123' }
  //   },
  //   response: { success: true, fileId: '123' },
  //   timestamp: '2024-01-15T10:30:00Z'
  // }
}

handleUploadError(data: any) {
  console.error('خطأ في الرفع:', data);
  // data يحتوي على:
  // {
  //   file: FileWithProgress,
  //   error: 'Network error',
  //   timestamp: '2024-01-15T10:30:00Z'
  // }
}
```

## أمثلة متقدمة

### مثال 1: رفع صور المنتج مع API

```typescript
export class ProductUploadComponent {
  productApiConfig = {
    apiUrl: 'https://api.example.com/products/upload-images',
    apiHeaders: {
      'Authorization': 'Bearer product-token',
      'X-Product-ID': 'PROD-001',
      'Content-Type': 'multipart/form-data'
    },
    uploadData: {
      productId: 'PROD-001',
      category: 'product-images',
      maxSize: '5MB',
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
    }
  };

  productImagesConfig: DynamicFormConfig = {
    fields: [
      {
        type: 'control',
        name: 'productImages',
        label: 'صور المنتج',
        controlType: 'file',
        multiple: true,
        accept: 'image/*',
        description: 'يمكن رفع عدة صور للمنتج (حد أقصى 5MB لكل صورة)',
        validations: [
          { type: 'required', message: 'يجب رفع صورة واحدة على الأقل' }
        ]
      }
    ]
  };

  onProductImageUploadComplete(data: any) {
    console.log('تم رفع صورة المنتج:', data);
    
    // حفظ معلومات الصورة في قاعدة البيانات
    this.productService.saveImageInfo({
      productId: data.result.serverResponse.productId,
      imageUrl: data.result.filePath,
      imageId: data.result.serverResponse.imageId,
      uploadedAt: data.result.uploadedAt
    }).subscribe(response => {
      console.log('تم حفظ معلومات الصورة:', response);
    });
  }
}
```

### مثال 2: رفع مستندات المستخدم مع API

```typescript
export class UserDocumentUploadComponent {
  userApiConfig = {
    apiUrl: 'https://api.example.com/users/upload-documents',
    apiHeaders: {
      'Authorization': 'Bearer user-token',
      'X-User-ID': 'USER-001'
    },
    uploadData: {
      userId: 'USER-001',
      documentType: 'cv',
      maxSize: '10MB',
      allowedTypes: ['.pdf', '.doc', '.docx']
    }
  };

  userDocumentsConfig: DynamicFormConfig = {
    fields: [
      {
        type: 'control',
        name: 'cv',
        label: 'السيرة الذاتية',
        controlType: 'file',
        accept: '.pdf,.doc,.docx',
        description: 'رفع السيرة الذاتية بصيغة PDF أو Word',
        validations: [
          { type: 'required', message: 'يجب رفع السيرة الذاتية' }
        ]
      },
      {
        type: 'control',
        name: 'certificates',
        label: 'الشهادات',
        controlType: 'file',
        multiple: true,
        accept: '.pdf,.jpg,.png',
        description: 'رفع الشهادات والوثائق'
      }
    ]
  };

  onUserDocumentUploadProgress(data: any) {
    // عرض شريط التقدم
    this.updateProgressBar(data.progress);
    
    // إرسال تحديث إلى الخادم
    this.uploadService.updateProgress({
      userId: 'USER-001',
      fileId: data.file.id,
      progress: data.progress
    }).subscribe();
  }
}
```

### مثال 3: رفع ملفات المشروع مع API

```typescript
export class ProjectFileUploadComponent {
  projectApiConfig = {
    apiUrl: 'https://api.example.com/projects/upload-files',
    apiHeaders: {
      'Authorization': 'Bearer project-token',
      'X-Project-ID': 'PROJ-001'
    },
    uploadData: {
      projectId: 'PROJ-001',
      projectName: 'تطوير تطبيق ويب',
      clientId: 'CLIENT-001',
      maxFileSize: '50MB'
    }
  };

  projectFilesConfig: DynamicFormConfig = {
    fields: [
      {
        type: 'control',
        name: 'requirements',
        label: 'متطلبات المشروع',
        controlType: 'file',
        accept: '.pdf,.doc,.docx,.xlsx',
        description: 'مستند متطلبات المشروع'
      },
      {
        type: 'control',
        name: 'designs',
        label: 'تصاميم المشروع',
        controlType: 'file',
        multiple: true,
        accept: '.psd,.ai,.fig,.sketch',
        description: 'ملفات التصميم'
      },
      {
        type: 'control',
        name: 'sourceCode',
        label: 'الكود المصدري',
        controlType: 'file',
        multiple: true,
        accept: '.zip,.rar,.tar.gz',
        description: 'أرشيف الكود المصدري'
      }
    ]
  };

  onProjectFileUploadStart(data: any) {
    // تسجيل بداية الرفع
    this.auditService.logUploadStart({
      projectId: 'PROJ-001',
      fileName: data.file.name,
      fileSize: data.file.sizeBytes,
      uploadedBy: 'USER-001',
      timestamp: data.timestamp
    });
  }
}
```

## بنية البيانات المرسلة إلى API

### FormData المرسل إلى الخادم

```typescript
// البيانات المرسلة في FormData
{
  file: File,                    // الملف الفعلي
  fileName: 'document.pdf',      // اسم الملف
  fileType: 'application/pdf',   // نوع الملف
  fileSize: '2048000',          // حجم الملف
  description: 'مستند مهم',     // وصف الملف
  
  // البيانات الإضافية من uploadData
  category: 'documents',
  userId: 'USER-001',
  timestamp: '2024-01-15T10:30:00Z',
  
  // أي بيانات إضافية أخرى
  customField1: 'value1',
  customField2: 'value2'
}
```

### استجابة API المتوقعة

```typescript
// استجابة API الناجحة
{
  success: true,
  id: 'file-123',
  filePath: 'uploads/documents/document.pdf',
  url: 'https://cdn.example.com/uploads/documents/document.pdf',
  fileSize: 2048000,
  mimeType: 'application/pdf',
  uploadedAt: '2024-01-15T10:30:00Z',
  metadata: {
    originalName: 'document.pdf',
    description: 'مستند مهم',
    category: 'documents'
  }
}

// استجابة API في حالة الخطأ
{
  success: false,
  error: 'File size exceeds limit',
  code: 'FILE_TOO_LARGE',
  details: {
    maxSize: 10485760,
    actualSize: 20971520
  }
}
```

## إعدادات API المتقدمة

### 1. إعداد Headers مخصصة

```typescript
const customHeaders = {
  'Authorization': 'Bearer ' + this.authService.getToken(),
  'X-API-Key': this.configService.getApiKey(),
  'X-Client-Version': '1.0.0',
  'X-Request-ID': this.generateRequestId(),
  'Accept': 'application/json',
  'Cache-Control': 'no-cache'
};
```

### 2. إعداد بيانات الرفع المتقدمة

```typescript
const advancedUploadData = {
  // معلومات المستخدم
  userId: this.userService.getCurrentUserId(),
  userRole: this.userService.getCurrentUserRole(),
  
  // معلومات الجلسة
  sessionId: this.sessionService.getSessionId(),
  requestId: this.generateRequestId(),
  
  // معلومات الملف
  category: 'user-documents',
  subcategory: 'personal',
  tags: ['important', 'personal'],
  
  // إعدادات الأمان
  encryption: 'AES-256',
  compression: 'gzip',
  
  // معلومات إضافية
  metadata: {
    uploadedFrom: 'web-app',
    browser: navigator.userAgent,
    timestamp: new Date().toISOString()
  }
};
```

### 3. معالجة الأخطاء المتقدمة

```typescript
handleUploadError(data: any) {
  const error = data.error;
  
  switch (error) {
    case 'Network error':
      this.showNotification('خطأ في الاتصال بالشبكة', 'error');
      this.retryUpload(data.file.id);
      break;
      
    case 'File size exceeds limit':
      this.showNotification('حجم الملف أكبر من المسموح', 'warning');
      break;
      
    case 'Invalid file type':
      this.showNotification('نوع الملف غير مسموح', 'warning');
      break;
      
    case 'Authentication failed':
      this.showNotification('فشل في المصادقة، يرجى إعادة تسجيل الدخول', 'error');
      this.authService.logout();
      break;
      
    default:
      this.showNotification('حدث خطأ غير متوقع', 'error');
      this.logError(error);
  }
}
```

## أفضل الممارسات

### 1. التحقق من صحة الملفات

```typescript
validateFile(file: File): boolean {
  // التحقق من حجم الملف
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    this.showError('حجم الملف أكبر من 10MB');
    return false;
  }
  
  // التحقق من نوع الملف
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (!allowedTypes.includes(file.type)) {
    this.showError('نوع الملف غير مسموح');
    return false;
  }
  
  return true;
}
```

### 2. إدارة الحالة

```typescript
export class FileUploadState {
  uploading: boolean = false;
  progress: number = 0;
  uploadedFiles: any[] = [];
  failedFiles: any[] = [];
  totalFiles: number = 0;
  
  updateProgress(fileId: string, progress: number) {
    // تحديث التقدم
  }
  
  addUploadedFile(file: any) {
    this.uploadedFiles.push(file);
    this.updateState();
  }
  
  addFailedFile(file: any) {
    this.failedFiles.push(file);
    this.updateState();
  }
  
  private updateState() {
    // تحديث الحالة العامة
  }
}
```

### 3. إعادة المحاولة التلقائية

```typescript
retryUploadWithBackoff(fileId: string, maxRetries: number = 3) {
  let retryCount = 0;
  
  const retry = () => {
    if (retryCount >= maxRetries) {
      this.handleFinalFailure(fileId);
      return;
    }
    
    retryCount++;
    const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
    
    setTimeout(() => {
      this.retryUpload(fileId);
    }, delay);
  };
  
  retry();
}
```

## الخلاصة

مكون رفع الملفات الآن يدعم API بشكل كامل مع:

- **رفع حقيقي إلى الخادم** مع تتبع التقدم
- **معالجة الأخطاء** المتقدمة
- **أحداث شاملة** لمراقبة العملية
- **إعدادات مرنة** للـ API
- **دعم البيانات الإضافية** للرفع
- **إعادة المحاولة** التلقائية
- **إدارة الحالة** المتقدمة

هذا يجعل المكون مناسباً للاستخدام في تطبيقات الإنتاج مع API حقيقي! 🚀 