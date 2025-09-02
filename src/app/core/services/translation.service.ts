import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { StorageService } from './storage.service';

export type Language = 'ar' | 'en';

// Simple translations object
const translations: Record<Language, Record<string, string>> = {
  ar: {
    'LOGIN.WELCOME': 'مرحباً بك',
    'LOGIN.EMAIL': 'البريد الإلكتروني',
    'LOGIN.PASSWORD': 'كلمة المرور',
    'LOGIN.SUBMIT': 'تسجيل الدخول',
    'LOGIN.FORGOT_PASSWORD': 'نسيت كلمة المرور؟',
    'LOGIN.CREATE_ACCOUNT': 'إنشاء حساب',
    'COMMON.REQUIRED': 'هذا الحقل مطلوب',
    'COMMON.INVALID_EMAIL': 'البريد الإلكتروني غير صحيح',
    'COMMON.MIN_LENGTH': 'يجب أن يكون الطول على الأقل {0} أحرف'
  },
  en: {
    'LOGIN.WELCOME': 'Welcome',
    'LOGIN.EMAIL': 'Email',
    'LOGIN.PASSWORD': 'Password',
    'LOGIN.SUBMIT': 'Login',
    'LOGIN.FORGOT_PASSWORD': 'Forgot Password?',
    'LOGIN.CREATE_ACCOUNT': 'Create Account',
    'COMMON.REQUIRED': 'This field is required',
    'COMMON.INVALID_EMAIL': 'Invalid email address',
    'COMMON.MIN_LENGTH': 'Must be at least {0} characters'
  }
};

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguageSubject = new BehaviorSubject<Language>('ar');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private storageService: StorageService
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
    this.currentLanguageSubject.next(language);
    this.storageService.setLocalItem('language', language);

    // تعيين اتجاه النص - فقط في المتصفح
    if (isPlatformBrowser(this.platformId) && typeof document !== 'undefined') {
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
    const currentLang = this.getCurrentLanguage();
    let translation = translations[currentLang][key] || key;
    
    if (params) {
      Object.keys(params).forEach(paramKey => {
        translation = translation.replace(`{${paramKey}}`, params[paramKey]);
      });
    }
    
    return of(translation);
  }

  public instant(key: string, params?: any): string {
    const currentLang = this.getCurrentLanguage();
    let translation = translations[currentLang][key] || key;
    
    if (params) {
      Object.keys(params).forEach(paramKey => {
        translation = translation.replace(`{${paramKey}}`, params[paramKey]);
      });
    }
    
    return translation;
  }

  public getSupportedLanguages(): Language[] {
    return ['ar', 'en'];
  }
} 