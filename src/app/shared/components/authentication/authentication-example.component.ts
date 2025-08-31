import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication-example',
  templateUrl: './authentication-example.component.html',
  styleUrls: ['./authentication-example.component.scss']
})
export class AuthenticationExampleComponent {
  
  constructor(private router: Router) {}

  // Navigation methods
  goToSignupIndividual(): void {
    this.router.navigate(['signup']);
  }

  goToSignupCompany(): void {
    this.router.navigate(['signup-company']);
  }

  goToLoginIndividual(): void {
    this.router.navigate(['login']);
  }

  goToLoginCompany(): void {
    this.router.navigate(['login-company']);
  }

  goToOtpVerification(): void {
    this.router.navigate(['otp-verification']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['forgot-password']);
  }

  goToPhoneDemo(): void {
    this.router.navigate(['phone-demo']);
  }

  goToMaxLengthDemo(): void {
    this.router.navigate(['max-length-demo']);
  }

  goToPasswordDemo(): void {
    this.router.navigate(['password-demo']);
  }
} 