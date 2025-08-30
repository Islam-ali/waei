import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

export type Language = 'ar' | 'en';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<Language>('ar');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(
    private translateService: TranslateService,
    private storageService: StorageService
  ) {
    this.initializeTranslation();
  }

  private initializeTranslation(): void {
    // اللغات المدعومة
    this.translateService.addLangs(['ar', 'en']);
    
    // اللغة الافتراضية
    this.translateService.setDefaultLang('ar');
    
    // محاولة استخدام اللغة المحفوظة أو لغة المتصفح
    const savedLanguage = this.storageService.getLocalItem<Language>('language');
    const browserLanguage = this.translateService.getBrowserLang();
    
    const languageToUse = savedLanguage || 
                         (browserLanguage && ['ar', 'en'].includes(browserLanguage) ? browserLanguage as Language : 'ar');
    
    this.setLanguage(languageToUse);
  }

  public setLanguage(language: Language): void {
    this.translateService.use(language);
    this.currentLanguageSubject.next(language);
    this.storageService.setLocalItem('language', language);
    
    // تعيين اتجاه النص
    if (typeof document !== 'undefined') {
      document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = language;
    }
  }

  public getCurrentLanguage(): Language {
    return this.currentLanguageSubject.value;
  }

  public toggleLanguage(): void {
    const currentLang = this.getCurrentLanguage();
    const newLang: Language = currentLang === 'ar' ? 'en' : 'ar';
    this.setLanguage(newLang);
  }

  public translate(key: string, params?: any): Observable<string> {
    return this.translateService.get(key, params);
  }

  public instant(key: string, params?: any): string {
    return this.translateService.instant(key, params);
  }

  public getSupportedLanguages(): Language[] {
    return ['ar', 'en'];
  }
} 