import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-account-type',
  imports: [NgClass, RouterModule],
  templateUrl: './account-type.component.html',
  styleUrl: './account-type.component.scss'
})
export class AccountTypeComponent {
  selectedAccountType: 'individual' | 'company' | null = null;

  onSelectAccountType(type: 'individual' | 'company') {
    this.selectedAccountType = type;
  }
}
