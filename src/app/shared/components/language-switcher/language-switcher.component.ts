import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslationService, Language } from '../../../core/services/translation.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
                          <button
                          (click)="switchLanguage(currentLanguage === 'ar' ? 'en' : 'ar')"
                            class="flex gap-2 items-center justify-center px-3 py-2.5 rounded-lg hover:bg-gray-100 transition-colors">
                            <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 14 14">
                                <g clip-path="url(#clip0_1_9566)">
                                    <path d="M2.91667 4.66667L6.41667 8.16667" stroke="#1F2937" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                    <path d="M2.33333 8.16667L5.83333 4.66667L7 2.91667" stroke="#1F2937"
                                        stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M1.16667 2.91667H8.16667" stroke="black" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                    <path d="M4.08333 1.16667H4.66667" stroke="black" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                    <path d="M12.8333 12.8333L9.91667 7L7 12.8333" stroke="black" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                    <path d="M8.16667 10.5H11.6667" stroke="black" stroke-linecap="round"
                                        stroke-linejoin="round" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_1_9566">
                                        <rect fill="white" height="14" width="14" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <span class="font-semibold text-[15px] text-gray-800">{{currentLanguage === 'ar' ? 'ar' : 'en'}}</span>
                        </button>

  `,
  styles: []
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
    console.log('switchLanguage', language);
    this.translationService.setLanguage(language);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
} 