import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationService, Language } from '../../../core/services/translation.service';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="language-switcher">
      <button 
        *ngFor="let lang of supportedLanguages" 
        (click)="switchLanguage(lang)"
        [class.active]="currentLanguage === lang"
        class="lang-btn"
        [attr.dir]="lang === 'ar' ? 'rtl' : 'ltr'">
        {{ lang === 'ar' ? 'العربية' : 'English' }}
      </button>
    </div>
  `
  styles: [`
    .language-switcher {
      display: flex;
      gap: 8px;
    }
    
    .lang-btn {
      padding: 8px 16px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
    }
    
    .lang-btn:hover {
      background: #f5f5f5;
    }
    
    .lang-btn.active {
      background: #007bff;
      color: white;
      border-color: #007bff;
    }
  `]
})
export class LanguageSwitcherComponent {
  currentLanguage: Language = 'ar';
  supportedLanguages: Language[] = ['ar', 'en'];

  constructor(private translationService: TranslationService) {
    this.translationService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
  }

  switchLanguage(language: Language): void {
    this.translationService.setLanguage(language);
  }
} 