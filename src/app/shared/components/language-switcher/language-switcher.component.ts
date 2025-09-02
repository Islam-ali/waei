import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService, Language } from '../../../core/services/translation.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="language-switcher">
      <button 
        *ngFor="let lang of supportedLanguages" 
        (click)="switchLanguage(lang)"
        [class.active]="currentLanguage === lang"
        class="lang-btn"
        [attr.dir]="lang === 'ar' ? 'rtl' : 'ltr'">
        {{ lang === 'ar' ? 'ar' : 'en' }}
      </button>
    </div>
  `,
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
export class LanguageSwitcherComponent implements OnDestroy {
  currentLanguage: Language = 'ar';
  supportedLanguages: Language[] = ['ar', 'en'];
  private destroy$ = new Subject<void>();

  constructor(private translationService: TranslationService) {
    this.translationService.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        this.currentLanguage = lang;
      });
  }

  switchLanguage(language: Language): void {
    this.translationService.setLanguage(language);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 