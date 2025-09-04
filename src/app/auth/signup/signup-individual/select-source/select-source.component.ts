import { Component, EventEmitter, Output } from '@angular/core';
import { NgClass } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-select-source',
  imports: [NgClass, TranslateModule],
  templateUrl: './select-source.component.html',
  styleUrl: './select-source.component.scss'
})
export class SelectSourceComponent {
  @Output() nextStep = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();
  
  constructor(private translate: TranslateService) {}
  
  listOfSources: { name: string; value: string; selected: boolean; translationKey: string }[] = [
    {
      name: 'ALDREES WEBSITE',
      value: 'aldrees_website',
      selected: false,
      translationKey: 'SOURCE.ALDREES_WEBSITE'
    },
    
    {
      name: 'NEWSPAPER',
      value: 'newspaper',
      selected: false,
      translationKey: 'SOURCE.NEWSPAPER'
    },
    
    {
      name: 'SOCIAL MEDIA',
      value: 'social_media',
      selected: false,
      translationKey: 'SOURCE.SOCIAL_MEDIA'
    },
    
    {
      name: 'TELEVISION',
      value: 'television',
      selected: false,
      translationKey: 'SOURCE.TELEVISION'
    },
    
    {
      name: 'INTERNET',
      value: 'internet',
      selected: false,
      translationKey: 'SOURCE.INTERNET'
    },
    
    {
      name: 'RADIO',
      value: 'radio',
      selected: false,
      translationKey: 'SOURCE.RADIO'
    },
    {
      name: 'OTHER',
      value: 'other',
      selected: false,
      translationKey: 'SOURCE.OTHER'
    }
  ];

  onNextStep() {
    this.nextStep.emit();
  }
  onPreviousStep() {
    this.previousStep.emit();
  }
  onSourceSelect(index: number) {
    this.listOfSources[index].selected = !this.listOfSources[index].selected;
  }
}
