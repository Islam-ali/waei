import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonField } from '../dynamic-form.types';

@Component({
  selector: 'lib-button-field',
  standalone: true,
  imports: [],
  template: `
      <button 
        type="button"
        (click)="onButtonClick($event)"
        [class]="field.class"
        [class.full-width]="field.fullWidth"
        [disabled]="disabled"
        class="disabled:opacity-50 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        @if (field.icon) {
          <i [class]="field.icon" class="button-icon"></i>
        }
        {{ field.label }}
      </button>
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
      case 'primary': return 'bg-primary-600';
      case 'secondary': return 'bg-secondary-600';
      case 'success': return 'bg-success-600';
      case 'danger': return 'bg-danger-600';
      case 'warning': return 'bg-warning-600';
      case 'info': return 'bg-info-600';
      case 'light': return 'bg-light-600';
      case 'dark': return 'bg-dark-600';
      default: return 'bg-primary-600';
    }
  }
} 