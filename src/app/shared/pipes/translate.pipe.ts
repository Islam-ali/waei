import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { TranslationService } from '../../core/services/translation.service';

@Pipe({
  name: 'translate',
  standalone: true
})
export class TranslatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  transform(key: string, params?: any): Observable<string> {
    return this.translationService.translate(key, params);
  }
} 