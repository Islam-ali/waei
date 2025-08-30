import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationComponent } from './shared/components/navigation/navigation.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule, NavigationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'waai';
  // currentLang: Language = 'ar';
  // currentDir: 'rtl' | 'ltr' = 'rtl';

  constructor() {
    // this.translationService.currentLanguage$.subscribe(lang => {
    //   this.currentLang = lang;
    //   this.currentDir = lang === 'ar' ? 'rtl' : 'ltr';
    // });
  } 
}
