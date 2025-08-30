// ====================
// Base Types
// ====================

export type FieldType =
  | 'control'   // input, select, checkbox...
  | 'group'     // nested FormGroup
  | 'array'     // FormArray of groups
  | 'html'      // custom html content
  | 'button';   // actions (submit, reset, custom)

export type ControlType =
  | 'input'
  | 'textarea'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'switch'
  | 'slider'
  | 'password'
  | 'email'
  | 'number'
  | 'date'
  | 'calendar'
  | 'daterangepicker'
  | 'file'
  | 'html'
  | 'button';

export interface BaseField {
  name: string;
  label?: string;
  class?: string | string[];
  style?: { [key: string]: string };
}

// ====================
// Controls
// ====================

export interface ControlField extends BaseField {
  type: FieldType;
  controlType: ControlType;
  placeholder?: string;
  prefixIcon?: string;
  suffixIcon?: string;
  options?: Array<{ label: string; value: any; disabled?: boolean; icon?: string; description?: string }>;
  rows?: number;
  min?: number;
  max?: number;
  step?: number;
  accept?: string;
  multiple?: boolean;
  searchable?: boolean;
  content?: string;
  safe?: boolean;
  action?: 'submit' | 'reset' | 'custom';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
  fullWidth?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  readonly?: boolean;
  description?: string;
  validations?: ValidationRule[];
  value?: any;
  minDate?: Date;
  maxDate?: Date;
  dateType?: 'hijri' | 'gregorian';
  language?: 'ar' | 'en';
}

// ====================
// Groups
// ====================

export interface GroupField extends BaseField {
  type: 'group';
  children: FormField[];
}

// ====================
// Arrays
// ====================

export interface ArrayField extends BaseField {
  type: 'array';
  itemTemplate: GroupField; // كل عنصر في الـ array عبارة عن Group فيه Controls
}

// ====================
// HTML
// ====================

export interface HtmlField extends BaseField {
  type: 'html';
  content: string; // HTML string
  safe?: boolean;  // هل أستخدم DomSanitizer ولا innerHTML مباشرة
}

// ====================
// Buttons
// ====================

export interface ButtonField extends BaseField {
  type: 'button';
  action: 'submit' | 'reset' | 'custom';
  label: string;
  icon?: string;
  color?: 'primary' | 'secondary' | 'danger' | 'success' | string;
  fullWidth?: boolean;
  onClick?: () => void; // لو custom action
}

// ====================
// Union
// ====================

export type FormField =
  | ControlField
  | GroupField
  | ArrayField
  | HtmlField
  | ButtonField;

// ====================
// Validation
// ====================

export interface ValidationRule {
  type:
    | 'required'
    | 'minLength'
    | 'maxLength'
    | 'pattern'
    | 'email'
    | 'min'
    | 'max';
  value?: any;
  message: string;
}

// ====================
// Form Configuration
// ====================

export interface DynamicFormConfig {
  fields: FormField[];
  class?: string | string[];
  style?: { [key: string]: string };
  direction?: 'ltr' | 'rtl';
  showLabels?: boolean;
  showValidationMessages?: boolean;
}

// ====================
// Form Events
// ====================

export interface FormSubmitEvent {
  value: any;
  valid: boolean;
  form: any;
}

export interface FormChangeEvent {
  value: any;
  field: string;
  valid: boolean;
} 