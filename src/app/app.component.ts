import { Component, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslationService } from './core/services/translation.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [TranslationService]
})
export class AppComponent {
  title = 'waei';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2,
    private translationService: TranslationService
  ) { }
  ngOnInit(): void {
    this.translationService.currentLanguage$.subscribe(() => {
      if (isPlatformBrowser(this.platformId)) {
        setTimeout(() => {
          const loader = document.getElementById('app-loader');
          if (loader) {
            this.renderer.addClass(loader, 'fade-out');
            setTimeout(() => {
              this.renderer.setStyle(loader, 'display', 'none');
              document.body.style.overflowY = 'auto';
            }, 500);
          }
        }, 1000);
      }
    });
  }
}
