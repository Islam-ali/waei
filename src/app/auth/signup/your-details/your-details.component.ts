import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-your-details',
  imports: [],
  templateUrl: './your-details.component.html',
  styleUrl: './your-details.component.scss'
})
export class YourDetailsComponent {
  @Output() nextStep = new EventEmitter<void>();
  onNextStep() {
    this.nextStep.emit();
  }
}
