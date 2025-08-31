import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HtmlField } from '../dynamic-form.types';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lib-html-field',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <div [class]="field.class" [style]="field.style" class="html-field">
      @if (field.safe && field.content) {
        <div [innerHTML]="getSafeHtml(field.content)"></div>
      } @else {
        <div [innerHTML]="field.content"></div>
      }
      @if (field.template) {
        <ng-container [ngTemplateOutlet]="field.template"></ng-container>
      } 
    </div>
  `
 
})
export class HtmlFieldComponent {
  @Input() field!: HtmlField;

  constructor(private sanitizer: DomSanitizer) {}

  // getClassString(classes: string | string[] | undefined): string {
  //   if (!classes) return '';
  //   if (Array.isArray(classes)) {
  //     return classes.join(' ');
  //   }
  //   return classes;
  // }

  // getStyleString(styles: { [key: string]: string } | undefined): string {
  //   if (!styles) return '';
  //   return Object.entries(styles)
  //     .map(([key, value]) => `${key}: ${value}`)
  //     .join('; ');
  // }

  getSafeHtml(content: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(content);
  }
} 