import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormArray, FormBuilder, Validators, AbstractControl, ValidationErrors, FormControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { HtmlFieldComponent } from './components/html-field.component';
import { ButtonFieldComponent } from './components/button-field.component';

import {
  DynamicFormConfig,
  FormField,
  ControlField,
  GroupField,
  ArrayField,
  HtmlField,
  ButtonField,
  FormSubmitEvent,
  FormChangeEvent,
  ValidationRule
} from './dynamic-form.types';
import { DynamicFieldDirective } from "./dynamic-field.directive";

@Component({
  selector: 'lib-dynamic-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,

    HtmlFieldComponent,
    ButtonFieldComponent,
    DynamicFieldDirective
],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit, OnDestroy {
  @Input() fields: FormField[] = [];
  @Input() config: DynamicFormConfig = { fields: [] };
  @Input() initialValue?: any;
  @Input() disabled = false;
  
  // API-related inputs for file upload
  @Input() isApi: boolean = true;
  @Input() apiUrl: string = '/api/upload';
  @Input() apiHeaders: any = {};
  @Input() uploadData: any = {};

  @Output() formSubmit = new EventEmitter<FormSubmitEvent>();
  @Output() formChange = new EventEmitter<FormChangeEvent>();
  @Output() formReset = new EventEmitter<void>();
  @Output() buttonClick = new EventEmitter<{ field: ButtonField; event: any , form: FormGroup }>();
  
  // API-related outputs for file upload
  @Output() onUploadStart = new EventEmitter<any>();
  @Output() onUploadProgress = new EventEmitter<any>();
  @Output() onUploadComplete = new EventEmitter<any>();
  @Output() onUploadError = new EventEmitter<any>();
  @Output() onExportFiles = new EventEmitter<any>();

  form!: FormGroup;
  private destroy$ = new Subject<void>();
  // private translationService = inject(TranslationService);

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // this.config.direction = this.translationService.getCurrentLanguage() === 'ar' ? 'rtl' : 'ltr';
    this.initializeForm();
    if (this.initialValue) {
      this.form.patchValue(this.initialValue);
    }
    if (this.disabled) {
      this.form.disable();
    }
    this.setupFormListeners();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    if (!this.fields || this.fields.length === 0) {
      this.form = this.fb.group({});
      return;
    }
    
    this.form = this.fb.group({});
    this.fields.forEach(field => {
      this.addFieldToForm(this.form, field);
    });
    console.log(this.form);
  }

  private addFieldToForm(formGroup: FormGroup, field: FormField): void {
    switch (field.type) {
      case 'control':
        // Create FormControl with disabled state and validators
        const isDisabled = (field as ControlField).disabled || this.disabled;
        const validators = this.createValidators((field as ControlField).validations, formGroup.get(field.name) as FormControl);
        formGroup.addControl(field.name, this.fb.control({
          value: (field as ControlField).value || '',
          disabled: isDisabled
        }, validators));
        break;
      case 'group':
        const group = this.fb.group({});
        (field as GroupField).children.forEach(childField => {
          this.addFieldToForm(group, childField);
        });
        formGroup.addControl(field.name, group);
        break;
      case 'array':
        const array = this.fb.array([]);
        formGroup.addControl(field.name, array);
        // If initialValue has array data, populate it
        if (this.initialValue && this.initialValue[field.name] && Array.isArray(this.initialValue[field.name])) {
          this.initialValue[field.name].forEach((item: any) => {
            this.addArrayItem(field as ArrayField, item);
          });
        }
        break;
      case 'html':
      case 'button':
        // These fields don't need FormControl
        break;
    }
  }

  private setupFormListeners(): void {
    this.form.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.formChange.emit({
          value,
          field: 'form',
          valid: this.form.valid
        });
      });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const value = this.form.getRawValue();
      this.formSubmit.emit({
        value,
        valid: true,
        form: this.form
      });
    } else {
      this.markFormGroupTouched(this.form);
      this.formSubmit.emit({
        value: this.form.getRawValue(),
        valid: false,
        form: this.form
      });
    }
  }

  onFormSubmit(event: FormSubmitEvent): void { this.formSubmit.emit(event); }
  onFormChange(event: FormChangeEvent): void { this.formChange.emit(event); }
  onFormReset(): void { this.formReset.emit(); }
  onButtonClick(event: { field: ButtonField; event: any }): void
   { 
    if (event.field.action === 'custom') {
      event.field.onClick?.();
    } else {
      this.buttonClick.emit({...event , form: this.form});
    }
   }

  addArrayItem(field: ArrayField, initialItemValue?: any): void {
    const formArray = this.form.get(field.name) as FormArray;
    const group = this.fb.group({});

    field.itemTemplate.children.forEach(childField => {
      // Initialize control with value from initialItemValue if provided
      const value = initialItemValue ? initialItemValue[childField.name] : (childField as ControlField).value || '';
      const isDisabled = (childField as ControlField).disabled || this.disabled;
      const validators = this.createValidators((childField as ControlField).validations);
      group.addControl(childField.name, this.fb.control({
        value: value,
        disabled: isDisabled
      }, validators));
    });

    formArray.push(group);
    this.cdr.detectChanges();
  }

  removeArrayItem(field: ArrayField, index: number): void {
    const formArray = this.form.get(field.name) as FormArray;
    formArray.removeAt(index);
    this.cdr.detectChanges();
  }

  getFormArray(fieldName: string): FormArray { return this.form.get(fieldName) as FormArray; }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  hasSubmitButton(): boolean {
    if (!this.fields || this.fields.length === 0 || !this.form) {
      return false;
    }
    return this.fields.some(field =>
      field.type === 'button' && (field as ButtonField).action === 'submit'
    );
  }

  isControlField(field: FormField): field is ControlField { return field.type === 'control'; }
  isGroupField(field: FormField): field is GroupField { return field.type === 'group'; }
  isArrayField(field: FormField): field is ArrayField { return field.type === 'array'; }
  isHtmlField(field: FormField): field is HtmlField { return field.type === 'html'; }
  isButtonField(field: FormField): field is ButtonField { return field.type === 'button'; }

  getClassString(classes: string | string[] | undefined): string {
    if (!classes) return '';
    if (Array.isArray(classes)) { return classes.join(' '); }
    return classes;
  }

  getStyleString(styles: { [key: string]: string } | undefined): string {
    if (!styles) return '';
    return Object.entries(styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
  }

  private createValidators(validations: ValidationRule[] = [] , formControl: FormControl | null = null): any[] {
    const validators: any[] = [];

    validations.forEach(validation => {
      switch (validation.type) {
        case 'required':
          validators.push(Validators.required);
          break;
        case 'minLength':
          validators.push(Validators.minLength(validation.value));
          break;
        case 'maxLength':
          validators.push(Validators.maxLength(validation.value));
          break;
        case 'pattern':
          validators.push(Validators.pattern(validation.value));
          break;
        case 'email':
          validators.push(Validators.email);
          break;
        case 'min':
          validators.push(Validators.min(validation.value));
          break;
        case 'max':
          validators.push(Validators.max(validation.value));
          break;
        case 'mismatch':
          validators.push(this.matchOtherValidator(validation.formControlMatch as string));
          break;
      }
    });

    return validators;
  }

  private dateValidator(validation: any): any {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Let required validator handle empty values
      }

      try {
        const date = new Date(control.value);
        if (isNaN(date.getTime())) {
          return { invalidDate: { message: validation.message || 'Invalid date' } };
        }

        if (validation.min) {
          const minDate = new Date(validation.min);
          if (date < minDate) {
            return { minDate: { message: validation.message || 'Date is too early' } };
          }
        }

        if (validation.max) {
          const maxDate = new Date(validation.max);
          if (date > maxDate) {
            return { maxDate: { message: validation.message || 'Date is too late' } };
          }
        }

        return null;
      } catch (error) {
        return { invalidDate: { message: validation.message || 'Invalid date' } };
      }
    };
  }

  private matchOtherValidator(matchTo: string) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.parent) return null;
  
      const matchingControl = control.parent.get(matchTo);
      if (!matchingControl) return null;
  
      return control.value === matchingControl.value ? null : { mismatch: true };
    };
  }
  
}
