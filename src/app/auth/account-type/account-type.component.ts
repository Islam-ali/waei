import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LanguageSwitcherComponent } from "../../shared/components";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-account-type',
  imports: [NgClass, RouterModule, LanguageSwitcherComponent, TranslateModule],
  templateUrl: './account-type.component.html',
  styleUrl: './account-type.component.scss'
})
export class AccountTypeComponent {
  selectedAccountType: 'individual' | 'company' | null = 'individual';

  onSelectAccountType(type: 'individual' | 'company') {
    this.selectedAccountType = type;
  }
}
