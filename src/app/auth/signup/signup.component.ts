import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, AfterViewInit, ElementRef, ViewChild, Inject, PLATFORM_ID, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageSwitcherComponent } from "../../shared/components";
import { TranslationService } from '../../core';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSwitcherComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})

export class SignupComponent implements OnDestroy, AfterViewInit, OnInit {
  @ViewChild('slider', { static: true }) sliderRef!: ElementRef<HTMLDivElement>;
  index = 0;
  private intervalId: number | null = null;
  isRtl = false;
  private destroy$ = new Subject<void>();
  private isBrowser: boolean;

  constructor(
    private translate: TranslationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // Initialize language subscription
    this.translate.currentLanguage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(lang => {
        this.isRtl = lang === 'ar';
        this.updateSlider();
      });

    // Start slider - handle both SSR and browser cases
    if (this.isBrowser) {
      // Running in browser - start immediately
      this.startSlider();
    } else {
      // Running on server - use a simple approach
      this.startSliderAfterHydration();
    }
  }

  private startSliderAfterHydration(): void {
    // Simple approach: just try to start after a delay
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        this.isBrowser = true;
        this.startSlider();
      }
    }, 1000);
  }


  private startSlider(): void {
    // Clear any existing interval before starting a new one
    this.clearInterval();

    // Double check we're in browser and DOM is ready
    if (this.isBrowser && typeof window !== 'undefined' && this.sliderRef?.nativeElement) {
      // Check if slider has cards
      const slider = this.sliderRef.nativeElement;
      const cards = Array.from(slider.children);

      if (cards.length > 0) {
        this.intervalId = window.setInterval(() => this.nextSlide(), 2000);
        // Initialize the slider position
        this.updateSlider();
      } else {
        // Try again after a short delay
        setTimeout(() => this.startSlider(), 500);
      }
    } else {
      console.log('Cannot start slider - not in browser environment or DOM not ready');
    }
  }

  private clearInterval(): void {
    if (this.intervalId !== null) {
      if (this.isBrowser && typeof window !== 'undefined') {
        window.clearInterval(this.intervalId);
      }
      this.intervalId = null;
    }
  }

  // Method to pause the slider (useful for user interaction)
  pauseSlider(): void {
    this.clearInterval();
  }

  // Method to resume the slider
  resumeSlider(): void {
    if (this.intervalId === null && this.isBrowser) {
      this.startSlider();
    }
  }

  updateSlider() {
    const slider = this.sliderRef.nativeElement;
    const cards = Array.from(slider.children) as HTMLElement[];

    cards.forEach(c => c.classList.remove('active'));
    cards[this.index].classList.add('active');

    const cardWidth = cards[0].offsetWidth + 16;

    let offset;
    if (this.isRtl) {
      // RTL → نبدأ من اليمين
      offset =
        this.index * cardWidth -
        (slider.parentElement!.offsetWidth / 2 - cardWidth / 2);
    } else {
      // LTR → زي ما هو
      offset =
        -this.index * cardWidth +
        (slider.parentElement!.offsetWidth / 2 - cardWidth / 2);
    }

    slider.style.transform = `translateX(${offset}px)`;
  }

  nextSlide() {
    // Check if component is still alive and in browser before proceeding
    if (this.destroy$.closed || !this.isBrowser) {
      return;
    }

    const slider = this.sliderRef?.nativeElement;
    if (!slider) {
      return;
    }

    const cards = Array.from(slider.children);
    if (cards.length === 0) {
      return;
    }

    this.index = (this.index + 1) % cards.length;
    this.updateSlider();
  }

  ngOnDestroy() {
    this.clearInterval();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
