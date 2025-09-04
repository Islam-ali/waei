import {Component} from '@angular/core';
import { YourDetailsComponent } from './your-details/your-details.component';
import { VerifyCodeComponent } from '../../verify-code/verify-code.component';
import { UsernameAndEmailComponent } from './username-and-email/username-and-email.component';
import { SelectSourceComponent } from './select-source/select-source.component';
import { CreatePasswordComponent } from './create-password/create-password.component';
import { RouterModule } from '@angular/router';
import { NgClass, NgSwitch } from '@angular/common';

enum Step {
    YourDetails = 1,
    VerifyCode = 2,
    UserNameAndEmail = 3,
    SelectSource = 4,
    CreatePassword = 5,
  }
@Component({
    selector: 'app-signup-individual',
    templateUrl: './signup-individual.component.html',
    styleUrls: ['./signup-individual.component.scss'],
    imports: [
        YourDetailsComponent,
        VerifyCodeComponent,
        UsernameAndEmailComponent,
        SelectSourceComponent,
        CreatePasswordComponent,
        RouterModule,
        NgClass,
    ]
})
export class SignupIndividualComponent {

    currentStep = Step.YourDetails;
    Step = Step;

    constructor() { }

    onNextStep() {
        if (this.currentStep < Step.CreatePassword) {
          this.currentStep++;
        }
      }
    
      onPreviousStep() {
        if (this.currentStep > Step.YourDetails) {
          this.currentStep--;
        }
      }
} 