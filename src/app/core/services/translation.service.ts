import { Injectable, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { StorageService } from './storage.service';
import { TranslateService } from '@ngx-translate/core';

export type Language = 'ar' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<Language | null>(null);
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private storageService: StorageService,
    private translate: TranslateService
  ) {
    this.initializeTranslation();
  }

  private initializeTranslation(): void {
    // محاولة استخدام اللغة المحفوظة أو لغة المتصفح
    const savedLanguage = this.storageService.getLocalItem<Language>('language');
    
    let browserLanguage: string | null = null;
    if (isPlatformBrowser(this.platformId)) {
      browserLanguage = navigator.language?.split('-')[0];
    }

    const languageToUse = savedLanguage ||
      (browserLanguage && ['ar', 'en'].includes(browserLanguage) ? browserLanguage as Language : 'ar');

    this.setLanguage(languageToUse);
  }

  public setLanguage(language: Language): void {
    if (this.currentLanguageSubject.value !== language) {
      this.currentLanguageSubject.next(language);
    }
    this.storageService.setLocalItem('language', language);
    this.translate.setDefaultLang(language); // أضف دي
    this.translate.use(language);
    
    if (isPlatformBrowser(this.platformId) && typeof document !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }
  

  public getCurrentLanguage(): Language | null {
    return this.currentLanguageSubject.value;
  }

  public toggleLanguage(): void {
    const currentLang = this.getCurrentLanguage();
    const newLang: Language = currentLang === 'ar' ? 'en' : 'ar';
    this.setLanguage(newLang);
  }


  public getSupportedLanguages(): Language[] {
    return ['ar', 'en'];
  }
} 