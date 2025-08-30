import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonField } from '../dynamic-form.types';

@Component({
  selector: 'lib-button-field',
  standalone: true,
  imports: [],
  template: `
    <div [class]="getClassString(field.class)" [style]="getStyleString(field.style)" class="button-field">
      <button 
        type="button"
        (click)="onButtonClick($event)"
        [class]="getButtonColorClass(field.color)"
        [class.full-width]="field.fullWidth"
        [disabled]="disabled"
        class="form-button"
      >
        @if (field.icon) {
          <i [class]="field.icon" class="button-icon"></i>
        }
        {{ field.label }}
      </button>
    </div>
  `
 
})
export class ButtonFieldComponent {
  @Input() field!: ButtonField;
  @Input() disabled = false;
  @Output() buttonClick = new EventEmitter<{ field: ButtonField; event: any }>();

  onButtonClick(event: any): void {
    this.buttonClick.emit({ field: this.field, event });
  }

  getClassString(classes: string | string[] | undefined): string {
    if (!classes) return '';
    if (Array.isArray(classes)) {
      return classes.join(' ');
    }
    return classes;
  }

  getStyleString(styles: { [key: string]: string } | undefined): string {
    if (!styles) return '';
    return Object.entries(styles)
      .map(([key, value]) => `${key}: ${value}`)
      .join('; ');
  }

  getButtonColorClass(color: string | undefined): string {
    switch (color) {
      case 'primary': return 'bg-primary';
      case 'secondary': return 'bg-secondary';
      case 'success': return 'bg-success';
      case 'danger': return 'bg-danger';
      case 'warning': return 'bg-warning';
      case 'info': return 'bg-info';
      case 'light': return 'bg-light';
      case 'dark': return 'bg-dark';
      default: return 'bg-primary';
    }
  }
} 