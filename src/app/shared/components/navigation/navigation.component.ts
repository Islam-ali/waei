import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="bg-base-100 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <h1 class="text-xl font-bold text-primary">WAIE Examples</h1>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              <a 
                routerLink="/dynamic-form-example" 
                routerLinkActive="border-primary text-primary"
                class="border-transparent text-base-content hover:text-primary hover:border-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
              >
                Dynamic Form
              </a>
              <a 
                routerLink="/file-upload-example" 
                routerLinkActive="border-primary text-primary"
                class="border-transparent text-base-content hover:text-primary hover:border-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
              >
                File Upload
              </a>
              <a 
                routerLink="/design-system" 
                routerLinkActive="border-primary text-primary"
                class="border-transparent text-base-content hover:text-primary hover:border-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
              >
                Design System
              </a>
              <a 
                routerLink="/storage-demo" 
                routerLinkActive="border-primary text-primary"
                class="border-transparent text-base-content hover:text-primary hover:border-primary inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors duration-200"
              >
                Storage Demo
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class NavigationComponent {} 