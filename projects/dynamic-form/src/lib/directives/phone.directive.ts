import { Directive, HostListener, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[appPhoneNumber]',
  standalone: true,
})
export class PhoneNumberDirective {

  @Input() maxlength: number | undefined;

  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event'])
  onInputChange(event: Event): void {
    const input = this.el.nativeElement;
    let value = input.value;

    // اسمح بالأرقام فقط
    value = value.replace(/[^0-9]/g, '');

    // طبّق الـ maxlength لو موجود
    if (this.maxlength && value.length > this.maxlength) {
      value = value.substring(0, this.maxlength);
    }

    input.value = value;
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    // امنع أي مفتاح غير رقم
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
    }
  }
}
