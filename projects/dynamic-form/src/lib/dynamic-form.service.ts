import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, AbstractControl } from '@angular/forms';
import { 
  FormField, 
  ControlField, 
  GroupField, 
  ArrayField, 
  ValidationRule,
  DynamicFormConfig 
} from './dynamic-form.types';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormService {

  constructor(private fb: FormBuilder) { }

  /**
   * إنشاء FormGroup من تكوين Dynamic Form
   */
  createForm(config: DynamicFormConfig): FormGroup {
    const formGroup = this.fb.group({});
    
    config.fields.forEach(field => {
      this.addFieldToForm(formGroup, field);
    });

    return formGroup;
  }

  /**
   * إضافة حقل إلى FormGroup
   */
  private addFieldToForm(formGroup: FormGroup, field: FormField): void {
    switch (field.type) {
      case 'control':
        this.addControlField(formGroup, field);
        break;
      case 'group':
        this.addGroupField(formGroup, field as GroupField);
        break;
      case 'array':
        this.addArrayField(formGroup, field as ArrayField);
        break;
      case 'html':
      case 'button':
        // هذه الحقول لا تحتاج إلى FormControl
        break;
    }
  }

  /**
   * إضافة Control Field
   */
  private addControlField(formGroup: FormGroup, field: ControlField): void {
    const validators = this.createValidators(field.validations || []);
    const control = new FormControl(field.value || '', validators);
    
    if (field.disabled) {
      control.disable();
    }
    
    formGroup.addControl(field.name, control);
  }

  /**
   * إضافة Group Field
   */
  private addGroupField(formGroup: FormGroup, field: GroupField): void {
    const group = this.fb.group({});
    
    field.children.forEach(childField => {
      this.addFieldToForm(group, childField);
    });
    
    formGroup.addControl(field.name, group);
  }

  /**
   * إضافة Array Field
   */
  private addArrayField(formGroup: FormGroup, field: ArrayField): void {
    const array = this.fb.array([]);
    formGroup.addControl(field.name, array);
  }

  /**
   * إضافة عنصر إلى FormArray
   */
  addArrayItem(formArray: FormArray, itemTemplate: GroupField): void {
    const group = this.fb.group({});
    
    itemTemplate.children.forEach(childField => {
      this.addFieldToForm(group, childField);
    });
    
    formArray.push(group);
  }

  /**
   * إزالة عنصر من FormArray
   */
  removeArrayItem(formArray: FormArray, index: number): void {
    formArray.removeAt(index);
  }

  /**
   * إنشاء Validators من ValidationRules
   */
  private createValidators(validations: ValidationRule[]): any[] {
    return validations.map(validation => {
      switch (validation.type) {
        case 'required':
          return Validators.required;
        case 'minLength':
          return Validators.minLength(validation.value);
        case 'maxLength':
          return Validators.maxLength(validation.value);
        case 'pattern':
          return Validators.pattern(validation.value);
        case 'email':
          return Validators.email;
        case 'min':
          return Validators.min(validation.value);
        case 'max':
          return Validators.max(validation.value);
        default:
          return null;
      }
    }).filter(validator => validator !== null);
  }

  /**
   * الحصول على رسالة الخطأ للحقل
   */
  getErrorMessage(control: AbstractControl, validations: ValidationRule[]): string {
    if (!control.errors || !validations) return '';

    for (const validation of validations) {
      if (control.hasError(validation.type)) {
        return validation.message;
      }
    }

    return '';
  }

  /**
   * التحقق من صحة الحقل
   */
  isFieldValid(control: AbstractControl): boolean {
    return control.valid && (control.dirty || control.touched);
  }

  /**
   * التحقق من عدم صحة الحقل
   */
  isFieldInvalid(control: AbstractControl): boolean {
    return control.invalid && (control.dirty || control.touched);
  }

  /**
   * إعادة تعيين النموذج
   */
  resetForm(form: FormGroup, config: DynamicFormConfig): void {
    const resetValue: any = {};
    
    config.fields.forEach(field => {
      this.setResetValue(resetValue, field);
    });
    
    form.reset(resetValue);
  }

  /**
   * تعيين قيم إعادة التعيين
   */
  private setResetValue(resetValue: any, field: FormField): void {
    switch (field.type) {
      case 'control':
        resetValue[field.name] = field.value || '';
        break;
      case 'group':
        resetValue[field.name] = {};
        (field as GroupField).children.forEach(child => {
          this.setResetValue(resetValue[field.name], child);
        });
        break;
      case 'array':
        resetValue[field.name] = [];
        break;
    }
  }

  /**
   * الحصول على قيمة النموذج
   */
  getFormValue(form: FormGroup): any {
    return form.getRawValue();
  }

  /**
   * تعيين قيمة النموذج
   */
  setFormValue(form: FormGroup, value: any): void {
    form.patchValue(value);
  }

  /**
   * التحقق من صحة النموذج
   */
  isFormValid(form: FormGroup): boolean {
    return form.valid;
  }

  /**
   * الحصول على جميع الأخطاء في النموذج
   */
  getFormErrors(form: FormGroup): any {
    const errors: any = {};
    this.collectErrors(form, errors);
    return errors;
  }

  /**
   * جمع جميع الأخطاء من النموذج
   */
  private collectErrors(control: AbstractControl, errors: any, path: string = ''): void {
    if (control instanceof FormGroup) {
      Object.keys(control.controls).forEach(key => {
        const childControl = control.get(key);
        const childPath = path ? `${path}.${key}` : key;
        this.collectErrors(childControl!, errors, childPath);
      });
    } else if (control instanceof FormArray) {
      control.controls.forEach((childControl, index) => {
        const childPath = `${path}[${index}]`;
        this.collectErrors(childControl, errors, childPath);
      });
    } else if (control.errors) {
      errors[path] = control.errors;
    }
  }

  /**
   * تحويل class إلى string
   */
  getClassString(classes: string | string[] | undefined): string {
    if (!classes) return '';
    if (Array.isArray(classes)) {
      return classes.join(' ');
    }
    return classes;
  }

  /**
   * تحويل style object إلى string
   */
  getStyleString(styles: { [key: string]: string } | undefined): string {
    if (!styles) return '';
    return Object.entries(styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
  }
}
