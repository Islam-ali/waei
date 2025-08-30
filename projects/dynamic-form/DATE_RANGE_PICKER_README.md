# Date Range Picker Component

مكون اختيار نطاق التواريخ المتقدم مشابه لـ `ngx-datepicker/daterangepicker` مع واجهة مستخدم محسنة ودعم كامل للغة العربية والإنجليزية.

## المميزات

- ✅ **تقويمان جنباً إلى جنب** - عرض شهرين في نفس الوقت
- ✅ **فترات سريعة** - أزرار للفترات الشائعة (اليوم، أمس، آخر 7 أيام، إلخ)
- ✅ **تأثيرات hover** - عرض النطاق أثناء التحديد
- ✅ **دعم العربية والإنجليزية** - واجهة كاملة باللغتين
- ✅ **أزرار تطبيق ومسح** - تحكم كامل في النطاق
- ✅ **تحقق من صحة البيانات** - دعم القيود والتحقق
- ✅ **تصميم متجاوب** - يعمل على جميع الأجهزة
- ✅ **دعم RTL** - دعم كامل للاتجاه من اليمين لليسار

## الاستخدام

### الاستخدام الأساسي

```typescript
const dateRangeField: ControlField = {
  name: 'vacationDates',
  type: 'control',
  controlType: 'daterangepicker',
  label: 'تواريخ الإجازة',
  placeholder: 'اختر نطاق التاريخ',
  dateType: 'gregorian',
  language: 'ar',
  prefixIcon: 'fas fa-calendar-alt',
  description: 'اختر تاريخ بداية ونهاية الإجازة',
  validations: [
    {
      type: 'required',
      message: 'تواريخ الإجازة مطلوبة'
    }
  ]
};
```

### مع فترات مخصصة

```typescript
const customDateRangeField: ControlField = {
  name: 'customRange',
  type: 'control',
  controlType: 'daterangepicker',
  label: 'فترة مخصصة',
  dateType: 'gregorian',
  language: 'en',
  validations: [
    {
      type: 'required',
      message: 'Custom range is required'
    },
    {
      type: 'min',
      value: '2024-01-01',
      message: 'Start date must be after 2024-01-01'
    },
    {
      type: 'max',
      value: '2024-12-31',
      message: 'End date must be before 2024-12-31'
    }
  ]
};
```

## الفترات السريعة الافتراضية

المكون يأتي مع الفترات السريعة التالية:

### العربية
- اليوم
- أمس
- آخر 7 أيام
- آخر 30 يوم
- هذا الشهر
- الشهر الماضي

### الإنجليزية
- Today
- Yesterday
- Last 7 Days
- Last 30 Days
- This Month
- Last Month

## القيم المُرجعة

```typescript
// القيمة المُرجعة
["2024-08-10", "2024-08-15"] // Array of ISO date strings (YYYY-MM-DD)
```

## الواجهة

### الأجزاء الرئيسية

1. **حقل الإدخال** - يعرض النطاق المحدد
2. **الفترات السريعة** - أزرار للفترات الشائعة
3. **التقويمان** - تقويمان جنباً إلى جنب لعرض شهرين
4. **عرض النطاق** - يعرض تاريخ البداية والنهاية
5. **أزرار التحكم** - تطبيق ومسح

### التفاعل

1. **اختيار تاريخ البداية** - انقر على التاريخ الأول
2. **اختيار تاريخ النهاية** - انقر على التاريخ الثاني
3. **تأثيرات hover** - عرض النطاق أثناء التحديد
4. **الفترات السريعة** - انقر على أي فترة سريعة
5. **التطبيق** - انقر على "تطبيق" لتأكيد النطاق

## التخصيص

### تخصيص الفترات السريعة

```typescript
// يمكن تخصيص الفترات السريعة عبر Input
@Input() presetRanges: PresetRange[] = [
  {
    label: 'آخر أسبوع',
    start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    end: new Date()
  },
  {
    label: 'آخر شهر',
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    end: new Date()
  }
];
```

### تخصيص الألوان

```scss
.date-range-dropdown {
  --primary-color: #3b82f6;
  --secondary-color: #6b7280;
  --hover-color: #dbeafe;
  --selected-color: #3b82f6;
  --range-color: #dbeafe;
}
```

## الأحداث

المكون يدعم جميع الأحداث القياسية:

- `valueChanges`: عند تغيير النطاق
- `statusChanges`: عند تغيير حالة التحقق
- `blur`: عند فقدان التركيز
- `focus`: عند الحصول على التركيز

## التحقق من صحة البيانات

```typescript
validations: [
  {
    type: 'required',
    message: 'النطاق مطلوب'
  },
  {
    type: 'min',
    value: '2024-01-01',
    message: 'تاريخ البداية يجب أن يكون بعد 2024-01-01'
  },
  {
    type: 'max',
    value: '2024-12-31',
    message: 'تاريخ النهاية يجب أن يكون قبل 2024-12-31'
  }
]
```

## الكشف التلقائي للغة

المكون يكشف اللغة تلقائياً من:

1. خاصية `dateType` في الحقل
2. خاصية `language` في الحقل
3. اتجاه المستند (`dir="rtl"`)
4. لغة المستند (`lang="ar"`)
5. لغة المتصفح

## التنسيق المعروض

### العربية
```
١٠ أغسطس ٢٠٢٤ - ١٥ أغسطس ٢٠٢٤
```

### الإنجليزية
```
August 10, 2024 - August 15, 2024
```

## الفروق عن مكون التقويم العادي

| الميزة | التقويم العادي | Date Range Picker |
|--------|----------------|-------------------|
| عدد التقويمات | 1 | 2 |
| الفترات السريعة | ❌ | ✅ |
| تأثيرات hover | ❌ | ✅ |
| أزرار تطبيق/مسح | ❌ | ✅ |
| عرض النطاق | ❌ | ✅ |
| حجم الواجهة | صغير | كبير |

## الأمثلة المتقدمة

### مع فترات مخصصة

```typescript
const advancedDateRangeField: ControlField = {
  name: 'advancedRange',
  type: 'control',
  controlType: 'daterangepicker',
  label: 'نطاق متقدم',
  dateType: 'gregorian',
  language: 'ar',
  prefixIcon: 'fas fa-calendar-week',
  description: 'اختر نطاق متقدم مع فترات مخصصة',
  validations: [
    {
      type: 'required',
      message: 'النطاق المتقدم مطلوب'
    }
  ]
};
```

### مع قيود زمنية

```typescript
const restrictedDateRangeField: ControlField = {
  name: 'restrictedRange',
  type: 'control',
  controlType: 'daterangepicker',
  label: 'نطاق محدود',
  dateType: 'gregorian',
  language: 'en',
  validations: [
    {
      type: 'required',
      message: 'Restricted range is required'
    },
    {
      type: 'min',
      value: '2024-06-01',
      message: 'Start date must be after June 1, 2024'
    },
    {
      type: 'max',
      value: '2024-08-31',
      message: 'End date must be before August 31, 2024'
    }
  ]
};
```

## الملاحظات

- المكون مصمم ليكون بديلاً كاملاً لـ `ngx-datepicker/daterangepicker`
- يدعم جميع الميزات المتقدمة مع واجهة مستخدم محسنة
- متوافق مع جميع المتصفحات الحديثة
- يدعم التخصيص الكامل للألوان والأنماط
- يعمل بشكل مثالي مع النماذج الديناميكية 