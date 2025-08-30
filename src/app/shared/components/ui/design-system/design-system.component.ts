import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-design-system',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './design-system.component.html',
  styleUrl: './design-system.component.scss'
})
export class DesignSystemComponent {
  form: FormGroup;

  primaryShades = [
    { name: 'Primary 50', class: 'bg-primary-50', hex: '#eff6ff' },
    { name: 'Primary 100', class: 'bg-primary-100', hex: '#dbeafe' },
    { name: 'Primary 500', class: 'bg-primary-500', hex: '#3b82f6' },
    { name: 'Primary 600', class: 'bg-primary-600', hex: '#2563eb' },
    { name: 'Primary 900', class: 'bg-primary-900', hex: '#1e3a8a' }
  ];

  successShades = [
    { name: 'Success 50', class: 'bg-success-50', hex: '#f0fdf4' },
    { name: 'Success 100', class: 'bg-success-100', hex: '#dcfce7' },
    { name: 'Success 500', class: 'bg-success-500', hex: '#22c55e' },
    { name: 'Success 600', class: 'bg-success-600', hex: '#16a34a' },
    { name: 'Success 900', class: 'bg-success-900', hex: '#14532d' }
  ];

  errorShades = [
    { name: 'Error 50', class: 'bg-error-50', hex: '#fef2f2' },
    { name: 'Error 100', class: 'bg-error-100', hex: '#fee2e2' },
    { name: 'Error 500', class: 'bg-error-500', hex: '#ef4444' },
    { name: 'Error 600', class: 'bg-error-600', hex: '#dc2626' },
    { name: 'Error 900', class: 'bg-error-900', hex: '#7f1d1d' }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.pattern(/^[0-9+\-\s()]*$/)]
    });
  }

  dismissAlert(type: string): void {
    console.log(`Alert ${type} dismissed`);
  }
} 