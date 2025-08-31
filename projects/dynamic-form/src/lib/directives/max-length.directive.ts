import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appMaxLength]',
  standalone: true,
})
export class MaxLengthDirective {
  @Input('appMaxLength') maxLength!: number;

  @HostListener('input', ['$event']) onInput(event: Event) {
    const input = event.target as HTMLInputElement;

    if (this.maxLength && input.value.length > this.maxLength) {
      input.value = input.value.slice(0, this.maxLength);
      event.stopPropagation();
    }
  }
}
