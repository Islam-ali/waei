# Calendar Field Component

مكون التقويم المحدث يدعم اختيار تاريخ واحد أو نطاق من التواريخ مع دعم اللغة العربية والإنجليزية.

## المميزات

- ✅ اختيار تاريخ واحد
- ✅ اختيار نطاق من التواريخ (Range)
- ✅ دعم اللغة العربية والإنجليزية
- ✅ إصلاح مشكلة عرض التاريخ (تجنب مشكلة الـ timezone)
- ✅ واجهة مستخدم محسنة مع تأثيرات بصرية
- ✅ دعم التحقق من صحة البيانات
- ✅ أزرار "اليوم" و "مسح"

## الاستخدام

### 1. تاريخ واحد

```typescript
const calendarField: ControlField = {
  name: 'birthDate',
  type: 'control',
  controlType: 'calendar',
  label: 'تاريخ الميلاد',
  placeholder: 'اختر التاريخ',
  dateType: 'gregorian', // أو 'hijri'
  language: 'ar', // أو 'en'
  validations: [
    {
      type: 'required',
      message: 'تاريخ الميلاد مطلوب'
    }
  ]
};
```

### 2. نطاق من التواريخ (Range)

```typescript
const dateRangeField: ControlField = {
  name: 'vacationDates',
  type: 'control',
  controlType: 'calendar',
  label: 'تواريخ الإجازة',
  placeholder: 'اختر نطاق التاريخ',
  multiple: true, // هذا يفعل وضع الـ range
  dateType: 'gregorian',
  language: 'ar',
  validations: [
    {
      type: 'required',
      message: 'تواريخ الإجازة مطلوبة'
    }
  ]
};
```

### 3. مع حد أدنى وأعلى للتاريخ

```typescript
const restrictedDateField: ControlField = {
  name: 'appointmentDate',
  type: 'control',
  controlType: 'calendar',
  label: 'موعد الحجز',
  dateType: 'gregorian',
  language: 'en',
  validations: [
    {
      type: 'required',
      message: 'موعد الحجز مطلوب'
    },
    {
      type: 'min',
      value: '2024-01-01',
      message: 'التاريخ يجب أن يكون بعد 1 يناير 2024'
    },
    {
      type: 'max',
      value: '2024-12-31',
      message: 'التاريخ يجب أن يكون قبل 31 ديسمبر 2024'
    }
  ]
};
```

## القيم المُرجعة

### تاريخ واحد
```typescript
// القيمة المُرجعة
"2024-08-10" // ISO date string (YYYY-MM-DD)
```

### نطاق من التواريخ
```typescript
// القيمة المُرجعة
["2024-08-10", "2024-08-15"] // Array of ISO date strings
```

## خصائص إضافية

### `dateType`
- `'gregorian'`: التقويم الميلادي
- `'hijri'`: التقويم الهجري

### `language`
- `'ar'`: العربية (افتراضي)
- `'en'`: الإنجليزية

### `multiple`
- `true`: تفعيل وضع نطاق التواريخ
- `false`: وضع التاريخ الواحد (افتراضي)

## الكشف التلقائي للغة

المكون يكشف اللغة تلقائياً من:
1. خاصية `dateType` في الحقل
2. اتجاه المستند (`dir="rtl"`)
3. لغة المستند (`lang="ar"`)
4. لغة المتصفح

## إصلاح مشكلة عرض التاريخ

تم إصلاح مشكلة عرض التاريخ التي كانت تظهر تاريخ مختلف عن المحدد بسبب مشاكل الـ timezone:

```typescript
// قبل الإصلاح
date.toISOString() // قد يعطي تاريخ مختلف

// بعد الإصلاح
date.toISOString().split('T')[0] // يعطي التاريخ الصحيح YYYY-MM-DD
```

## التنسيق المعروض

### العربية
```
١٠ أغسطس ٢٠٢٤
```

### الإنجليزية
```
August 10, 2024
```

### نطاق التواريخ
```
١٠ أغسطس ٢٠٢٤ - ١٥ أغسطس ٢٠٢٤
```

## الأحداث

المكون يدعم جميع الأحداث القياسية:
- `valueChanges`: عند تغيير القيمة
- `statusChanges`: عند تغيير حالة التحقق
- `blur`: عند فقدان التركيز
- `focus`: عند الحصول على التركيز

## التخصيص

يمكن تخصيص المظهر باستخدام CSS:

```scss
.calendar-dropdown {
  // تخصيص مظهر القائمة المنسدلة
}

.calendar-day {
  // تخصيص مظهر أيام التقويم
}

.calendar-day.selected {
  // تخصيص مظهر اليوم المحدد
}

.calendar-day.in-range {
  // تخصيص مظهر الأيام في النطاق
}
``` 