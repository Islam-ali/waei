import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { VerifyCodeComponent } from "../../verify-code/verify-code.component";
import { CompanyRegistrationComponent } from "./company-registration/company-registration.component";
import { CreatePasswordCompanyComponent } from "./create-password-company/create-password-company.component";
import { TranslateService } from '@ngx-translate/core';

enum Step {
    CompanyRegistration = 1,
    VerifyCode = 2,
    CreatePassword = 3,
  }
@Component({
    selector: 'app-signup-company',
    templateUrl: './signup-company.component.html',
    styleUrls: ['./signup-company.component.scss'],
    imports: [
    NgClass,
    VerifyCodeComponent,
    CompanyRegistrationComponent,
    CreatePasswordCompanyComponent
]
})
export class SignupCompanyComponent {
  translate = inject(TranslateService);
    currentStep = Step.CompanyRegistration;
    Step = Step;
    titleVerifyCode = 'VERIFY_CODE.TITLE';
    subtitleVerifyCode = 'VERIFY_CODE.SUBTITLE';
    constructor() { }

    onNextStep() {
        if (this.currentStep < Step.CreatePassword) {
          this.currentStep++;
        }
      }
    
      onPreviousStep() {
        if (this.currentStep > Step.CompanyRegistration) {
          this.currentStep--;
        }
      }
} 