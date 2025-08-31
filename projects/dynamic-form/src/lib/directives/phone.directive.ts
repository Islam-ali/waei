import { CommonModule } from '@angular/common';
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appPhoneNumber]',
  standalone: true,
})
export class PhoneNumberDirective {
  @Input('appPhoneNumber') prefix: string = ''; // يجي من بره الديناميكية

  constructor(private el: ElementRef<HTMLInputElement>, private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInput(event: Event) {
    const input = this.el.nativeElement;

    // ناخد اللي المستخدم كتبه
    let digits = input.value.replace(/\D/g, '');

    // ممكن تضيف شروط خاصة (مثلاً السعودية لازم تبدأ بـ 5)
    if (this.prefix === '+966' && digits && !digits.startsWith('5')) {
      digits = '5' + digits.replace(/^5*/, '');
    }

    // حد أقصى 9 أرقام للسعودية (تقدر تخصص حسب الدولة)
    if (this.prefix === '+966' && digits.length > 9) {
      digits = digits.slice(0, 9);
    }

    // نخلي الـ input يعرض بس الأرقام بدون prefix
    input.value = digits;

    // نخزن في الـ FormControl القيمة كاملة بالـ prefix
    if (this.control?.control) {
      this.control.control.setValue(digits ? this.prefix + digits : '');
    }
  }
}
