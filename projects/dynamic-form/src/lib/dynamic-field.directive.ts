import { Directive, Input, OnInit, ViewContainerRef, forwardRef, OnDestroy, Optional, Renderer2 } from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ControlField, ControlType } from './dynamic-form.types';
import { InputFieldComponent } from './components/input-field.component';
import { SelectFieldComponent } from './components/select-field.component';
import { DateFieldComponent } from './components/date-field.component';
import { TextareaFieldComponent } from './components/textarea-field.component';
import { CheckboxFieldComponent } from './components/checkbox-field.component';
import { RadioFieldComponent } from './components/radio-field.component';
import { FileFieldComponent } from './components/file-field.component';
import { HtmlFieldComponent } from './components/html-field.component';
import { ButtonFieldComponent } from './components/button-field.component';
import { CalendarFieldComponent } from '../public-api';
import { DateRangePickerComponent } from './components/date-range-picker.component';
import { NumberFieldComponent } from './components/number-field.component';
import { PasswordFieldComponent } from './components/password-field.component';
import { PhoneFieldComponent } from './components/phone-field.component';
import { OtpFieldComponent } from './components/otp-field.component';

@Directive({
  selector: '[appDynamicField]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicFieldDirective),
      multi: true
    }
  ]
})
export class DynamicFieldDirective implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() field!: ControlField;
  @Input() showLabels = true;
  @Input() showValidationMessages = true;
  @Input() direction: 'ltr' | 'rtl' = 'ltr';
  @Input() class: string = '';
  @Input() style: string = '';
  private componentRef: any;
  private onChange = (value: any) => {};
  private onTouched = () => {};

  constructor(
    private viewContainerRef: ViewContainerRef,
    @Optional() private controlContainer: ControlContainer,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.loadComponent();
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  private loadComponent() {
    if (!this.field || !this.field.controlType) return;

    const component = this.getComponentType(this.field.controlType);
    if (!component) return;

    this.componentRef = this.viewContainerRef.createComponent(component);
    const instance = this.componentRef.instance;
    
    if (instance) {
      // Set common inputs
      instance.field = this.field;
      instance.showLabels = this.showLabels;
      instance.showValidationMessages = this.showValidationMessages;
      instance.direction = this.direction;
      instance.control = this.controlContainer?.control?.get(this.field.name) as FormControl;

      const hostEl = this.componentRef.location.nativeElement;
      if (this.class) {
        this.class.split(' ').forEach(c =>
          this.renderer.addClass(hostEl, c)
        );
      }
      if (this.style) {
        this.renderer.setAttribute(hostEl, 'style', this.style);
      }
      // Connect ControlValueAccessor
      if (instance.registerOnChange && instance.registerOnTouched) {
        instance.registerOnChange(this.onChange);
        instance.registerOnTouched(this.onTouched);
      }
    }
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    if (this.componentRef?.instance?.writeValue) {
      this.componentRef.instance.writeValue(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
    if (this.componentRef?.instance?.registerOnChange) {
      this.componentRef.instance.registerOnChange(fn);
    }
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
    if (this.componentRef?.instance?.registerOnTouched) {
      this.componentRef.instance.registerOnTouched(fn);
    }
  }

  setDisabledState(isDisabled: boolean): void {
    if (this.componentRef?.instance?.setDisabledState) {
      this.componentRef.instance.setDisabledState(isDisabled);
    }
  }

  private getComponentType(type: ControlType): any {
    const componentMap: Record<string, any> = {
      input: InputFieldComponent,
      number: NumberFieldComponent,
      email: InputFieldComponent,
      password: PasswordFieldComponent,
      select: SelectFieldComponent,
      multiselect: SelectFieldComponent,
      date: CalendarFieldComponent,
      calendar: CalendarFieldComponent,
      daterangepicker: DateRangePickerComponent,
      textarea: TextareaFieldComponent,
      checkbox: CheckboxFieldComponent,
      radio: RadioFieldComponent,
      file: FileFieldComponent,
      html: HtmlFieldComponent,
      button: ButtonFieldComponent,
      phone: PhoneFieldComponent,
      otp: OtpFieldComponent,
    };

    return componentMap[type] || null;
  }
}

