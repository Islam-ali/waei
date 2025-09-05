import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, OnInit, OnDestroy, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LanguageSwitcherComponent } from "../../shared/components";

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterModule, LanguageSwitcherComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})

export class SignupComponent implements OnInit, OnDestroy, AfterViewInit {
  platformId = inject(PLATFORM_ID);
  @ViewChild('slider', { static: true }) sliderRef!: ElementRef<HTMLDivElement>;
  index = 0;
  intervalId: any;


  updateSlider() {
    const slider = this.sliderRef.nativeElement;
    const cards = Array.from(slider.children) as HTMLElement[];

    cards.forEach(c => c.classList.remove('active'));
    cards[this.index].classList.add('active');

    const cardWidth = cards[0].offsetWidth + 16;
    const offset =
      -this.index * cardWidth +
      (slider.parentElement!.offsetWidth / 2 - cardWidth / 2);

    slider.style.transform = `translateX(${offset}px)`;
  }

  nextSlide() {
    const slider = this.sliderRef.nativeElement;
    const cards = Array.from(slider.children);
    this.index = (this.index + 1) % cards.length;
    this.updateSlider();
  }

  ngOnInit() {
    // Only initialize if we're in browser
    if (isPlatformBrowser(this.platformId)) {
      // Start autoplay for testimonial carousel
      this.startTestimonialAutoplay();
    }
  }

  ngAfterViewInit() {
    // Ensure DOM is ready before any DOM operations
    if (isPlatformBrowser(this.platformId)) {
      // Use a longer timeout to ensure DOM is fully rendered
      setTimeout(() => {
        try {
          this.updateSlider();
          this.intervalId = setInterval(() => this.nextSlide(), 2000);
        } catch (error) {
          console.warn('Failed to initialize carousel:', error);
        }
      }, 200);
    }
  }



  ngOnDestroy() {
    // Clear autoplay interval
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
    
    // Reset state
    this.currentTestimonial = 1;
  }

  private autoplayInterval: any;
  private currentTestimonial = 1;
  private totalTestimonials = 3;

  startTestimonialAutoplay() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        // Clear any existing interval first
        if (this.autoplayInterval) {
          clearInterval(this.autoplayInterval);
        }
        
        this.autoplayInterval = setInterval(() => {
          try {
            this.nextTestimonial();
          } catch (error) {
            console.warn('Autoplay error:', error);
            // Stop autoplay on error
            this.pauseAutoplay();
          }
        }, 3000); // Change testimonial every 3 seconds for smoother movement
      } catch (error) {
        console.warn('Failed to start autoplay:', error);
      }
    }
  }

  private initializeTestimonialCarousel() {
    // Set initial state
    if (isPlatformBrowser(this.platformId)) {
      try {
        this.updateTestimonialClassesWithSlides(1);
        // Start continuous sliding animation
        this.startContinuousSliding();
      } catch (error) {
        console.warn('Failed to initialize carousel:', error);
      }
    }
  }

  private startContinuousSliding() {
    if (isPlatformBrowser(this.platformId)) {
      // Add continuous sliding class to the carousel container
      const carouselContainer = document.querySelector('.carousel-container');
      if (carouselContainer) {
        carouselContainer.classList.add('carousel-slide-left');
      }
    }
  }

  private stopContinuousSliding() {
    if (isPlatformBrowser(this.platformId)) {
      const carouselContainer = document.querySelector('.carousel-container');
      if (carouselContainer) {
        carouselContainer.classList.remove('carousel-slide-left');
      }
    }
  }

  pauseAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
    // Stop continuous sliding when paused
    this.stopContinuousSliding();
  }

  resumeAutoplay() {
    if (isPlatformBrowser(this.platformId)) {
      this.startTestimonialAutoplay();
      // Resume continuous sliding
      this.startContinuousSliding();
    }
  }

  nextTestimonial() {
    this.currentTestimonial = this.currentTestimonial >= this.totalTestimonials ? 1 : this.currentTestimonial + 1;
    if (isPlatformBrowser(this.platformId)) {
      this.showTestimonial(this.currentTestimonial);
    }
  }

  previousTestimonial() {
    this.currentTestimonial = this.currentTestimonial <= 1 ? this.totalTestimonials : this.currentTestimonial - 1;
    if (isPlatformBrowser(this.platformId)) {
      this.showTestimonial(this.currentTestimonial);
    }
  }

  showTestimonial(testimonialNumber: number) {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      // Reset autoplay timer
      if (this.autoplayInterval) {
        clearInterval(this.autoplayInterval);
      }
      
      // Update current testimonial
      this.currentTestimonial = testimonialNumber;
      
      // Check the appropriate radio button
      let radioButton: HTMLInputElement | null = null;
      radioButton = document.getElementById(`testimonial-${testimonialNumber}`) as HTMLInputElement;
      if (radioButton) {
        radioButton.checked = true;
      }
      
      // Update CSS classes for animations with slide effects
      this.updateTestimonialClassesWithSlides(testimonialNumber);
      
      // Restart autoplay
      this.startTestimonialAutoplay();
    } catch (error) {
      console.warn('Failed to show testimonial:', error);
    }
  }

  private updateTestimonialClassesWithSlides(activeTestimonial: number) {
    if (isPlatformBrowser(this.platformId)) {
      try {
        // Remove all classes first
        for (let i = 1; i <= this.totalTestimonials; i++) {
          const card = document.getElementById(`testimonial-card-${i}`);
          if (card) {
            card.classList.remove('testimonial-active', 'testimonial-next', 'testimonial-prev', 'slide-in-right', 'slide-out-left');
          }
        }

        // Add slide-in animation for active card
        const activeCard = document.getElementById(`testimonial-card-${activeTestimonial}`);
        if (activeCard) {
          activeCard.classList.add('testimonial-active', 'slide-in-right');
        }

        // Next testimonial (slides in from right)
        const nextTestimonial = activeTestimonial >= this.totalTestimonials ? 1 : activeTestimonial + 1;
        const nextCard = document.getElementById(`testimonial-card-${nextTestimonial}`);
        if (nextCard) {
          nextCard.classList.add('testimonial-next');
        }

        // Previous testimonial (slides out to left)
        const prevTestimonial = activeTestimonial <= 1 ? this.totalTestimonials : activeTestimonial - 1;
        const prevCard = document.getElementById(`testimonial-card-${prevTestimonial}`);
        if (prevCard) {
          prevCard.classList.add('testimonial-prev', 'slide-out-left');
        }

        // Update indicators
        this.updateIndicators(activeTestimonial);
      } catch (error) {
        console.warn('Failed to update testimonial classes with slides:', error);
      }
    }
  }

  private updateIndicators(activeTestimonial: number) {
    if (isPlatformBrowser(this.platformId)) {
      try {
        for (let i = 1; i <= this.totalTestimonials; i++) {
          const indicator = document.getElementById(`indicator-${i}`);
          if (indicator) {
            if (i === activeTestimonial) {
              indicator.classList.add('bg-white', 'scale-125');
              indicator.classList.remove('bg-white/80');
            } else {
              indicator.classList.remove('bg-white', 'scale-125');
              indicator.classList.add('bg-white/80');
            }
          }
        }
      } catch (error) {
        console.warn('Failed to update indicators:', error);
      }
    }
  }

  // Public methods for button clicks
  public onNextClick() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        this.nextTestimonial();
      } catch (error) {
        console.warn('Failed to go to next testimonial:', error);
      }
    }
  }

  public onPreviousClick() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        this.previousTestimonial();
      } catch (error) {
        console.warn('Failed to go to previous testimonial:', error);
      }
    }
  }
}
