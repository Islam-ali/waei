# دليل استخدام مكون رفع الملفات مع النموذج

هذا الدليل يوضح كيفية استخدام مكون رفع الملفات مع بيانات النموذج لإرسال الملفات مع معلومات النموذج.

## الميزات الجديدة

### 🎯 **دعم النموذج**
- إرسال بيانات النموذج مع الملفات
- ربط الملفات بنوع معين من النماذج
- تتبع الملفات حسب النموذج

### 📊 **بيانات النموذج**
- `model`: بيانات النموذج الكاملة
- `modelId`: معرف النموذج
- `modelType`: نوع النموذج
- `uploadedAt`: تاريخ الرفع

## الاستخدام الأساسي

### 1. إعداد المكون مع النموذج

```typescript
// في المكون الأب
export class MyComponent {
  productModel = {
    id: 'PROD-001',
    name: 'Smartphone',
    brand: 'TechCorp',
    price: 599.99
  };

  fileConfig: DynamicFormConfig = {
    fields: [
      {
        type: 'control',
        name: 'productImages',
        label: 'صور المنتج',
        controlType: 'file',
        multiple: true,
        accept: 'image/*',
        validations: [
          { type: 'required', message: 'يجب رفع صور للمنتج' }
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
  [model]="productModel"
  [modelId]="productModel.id"
  [modelType]="'product'"
  (onModelUpdate)="handleModelUpdate($event)"
  (onExportFiles)="handleFileExport($event)"
></lib-dynamic-form>
```

### 3. معالجة الأحداث

```typescript
handleModelUpdate(data: any) {
  console.log('تحديث النموذج:', data);
  // data يحتوي على:
  // {
  //   model: productModel,
  //   modelId: 'PROD-001',
  //   modelType: 'product',
  //   files: [...],
  //   selectedFiles: [...]
  // }
}

handleFileExport(data: any) {
  console.log('تصدير الملفات:', data);
  // إرسال البيانات إلى الخادم
  this.uploadService.exportFiles(data).subscribe(response => {
    console.log('تم التصدير بنجاح:', response);
  });
}
```

## أمثلة عملية

### مثال 1: رفع صور المنتج

```typescript
// نموذج المنتج
const productModel = {
  id: 'PROD-001',
  name: 'هاتف ذكي',
  category: 'الإلكترونيات',
  price: 1500
};

// إعداد المكون
const productImagesConfig: DynamicFormConfig = {
  fields: [
    {
      type: 'control',
      name: 'productImages',
      label: 'صور المنتج',
      controlType: 'file',
      multiple: true,
      accept: 'image/*',
      description: 'يمكن رفع عدة صور للمنتج',
      validations: [
        { type: 'required', message: 'يجب رفع صورة واحدة على الأقل' }
      ]
    }
  ]
};
```

### مثال 2: رفع مستندات المستخدم

```typescript
// نموذج المستخدم
const userModel = {
  id: 'USER-001',
  firstName: 'أحمد',
  lastName: 'محمد',
  email: 'ahmed@example.com',
  department: 'تقنية المعلومات'
};

// إعداد المكون
const userDocumentsConfig: DynamicFormConfig = {
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
```

### مثال 3: رفع ملفات المشروع

```typescript
// نموذج المشروع
const projectModel = {
  id: 'PROJ-001',
  name: 'تطوير تطبيق ويب',
  client: 'شركة التقنية',
  startDate: '2024-01-01',
  endDate: '2024-06-30',
  budget: 50000
};

// إعداد المكون
const projectFilesConfig: DynamicFormConfig = {
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
```

## بنية البيانات المرسلة

### عند تحديث النموذج (onModelUpdate)

```typescript
{
  model: {
    id: 'PROD-001',
    name: 'Smartphone',
    // ... باقي بيانات النموذج
  },
  modelId: 'PROD-001',
  modelType: 'product',
  files: [
    {
      id: 'file-1',
      originalFileName: 'product-image-1.jpg',
      mimeType: 'image/jpeg',
      fileSize: 1024000,
      filePath: 'uploads/products/product-image-1.jpg',
      description: 'صورة أمامية للمنتج',
      model: { /* بيانات النموذج */ },
      modelId: 'PROD-001',
      modelType: 'product',
      uploadedAt: '2024-01-15T10:30:00Z'
    }
  ],
  selectedFiles: [
    {
      id: 'file-1',
      name: 'product-image-1.jpg',
      type: 'image/jpeg',
      size: '1.0 MB',
      sizeBytes: 1024000,
      description: 'صورة أمامية للمنتج',
      uploaded: true,
      uploading: false,
      error: null,
      progress: 100
    }
  ]
}
```

### عند تصدير الملفات (onExportFiles)

```typescript
{
  model: { /* بيانات النموذج */ },
  modelId: 'PROD-001',
  modelType: 'product',
  files: [ /* قائمة الملفات */ ],
  selectedFiles: [ /* قائمة الملفات المحددة */ ],
  exportDate: '2024-01-15T10:30:00Z'
}
```

## طرق إضافية

### الحصول على بيانات النموذج الكاملة

```typescript
// في المكون الأب
@ViewChild('fileField') fileField!: FileFieldComponent;

getCompleteModelData() {
  const modelData = this.fileField.getModelData();
  console.log('بيانات النموذج الكاملة:', modelData);
  
  // modelData يحتوي على:
  // {
  //   model: {...},
  //   modelId: '...',
  //   modelType: '...',
  //   files: [...],
  //   selectedFiles: [...],
  //   totalFiles: 5,
  //   uploadedFiles: 3,
  //   uploadingFiles: 1,
  //   errorFiles: 1
  // }
}
```

### تصدير الملفات يدوياً

```typescript
// تصدير الملفات مع بيانات النموذج
exportFilesWithModel() {
  this.fileField.exportFiles();
}
```

## أفضل الممارسات

### 1. تنظيم النماذج
```typescript
// استخدام أنواع محددة للنماذج
enum ModelType {
  PRODUCT = 'product',
  USER = 'user',
  PROJECT = 'project',
  ORDER = 'order'
}
```

### 2. معالجة الأخطاء
```typescript
handleModelUpdate(data: any) {
  try {
    if (data.errorFiles > 0) {
      console.warn(`هناك ${data.errorFiles} ملفات فشل رفعها`);
    }
    
    if (data.uploadingFiles > 0) {
      console.log(`جاري رفع ${data.uploadingFiles} ملفات`);
    }
    
    // معالجة البيانات
    this.processModelData(data);
  } catch (error) {
    console.error('خطأ في معالجة بيانات النموذج:', error);
  }
}
```

### 3. التحقق من صحة البيانات
```typescript
validateModelData(data: any): boolean {
  return data.model && 
         data.modelId && 
         data.modelType && 
         Array.isArray(data.files);
}
```

## الخلاصة

مكون رفع الملفات الآن يدعم إرسال البيانات مع النموذج بشكل كامل، مما يتيح:

- ربط الملفات بنماذج محددة
- تتبع الملفات حسب النموذج
- إرسال بيانات شاملة مع الملفات
- معالجة الأحداث بشكل منظم
- دعم أنواع مختلفة من النماذج

هذا يجعل المكون مناسباً للاستخدام في تطبيقات إدارة المحتوى، أنظمة إدارة الملفات، وتطبيقات الأعمال المختلفة. 