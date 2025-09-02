import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageSwitcherComponent } from "../../shared/components/language-switcher/language-switcher.component";

@Component({
  selector: 'app-signup',
  imports: [CommonModule, RouterModule, LanguageSwitcherComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

}
