import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormField, DynamicFormComponent, DynamicFormConfig } from '../../../../projects/dynamic-form/src';
import { Router } from '@angular/router';

@Component({
    selector: 'app-login-individual',
    templateUrl: './login-individual.component.html',
    styleUrls: ['./login-individual.component.scss'],
    imports: [DynamicFormComponent]
})
export class LoginIndividualComponent implements OnInit {
    loginMethod: 'phone' | 'email' = 'email';
    router = inject(Router);
    formFieldsEmail: FormField[] = [
        // Phone/Email Field
        {
            type: 'control',
            name: 'phone',
            label: 'Email or Username',
            controlType: 'email',
            placeholder: 'Enter Email or Username',
            validations: [
                { type: 'required', message: 'Email or Username is required' },
            ]
        },

        // Password
        {
            type: 'control',
            name: 'password',
            label: 'Password',
            controlType: 'password',
            placeholder: 'Enter Password',
            class: 'my-4',
            validations: [
                { type: 'required', message: 'Password is required' },
                { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' }
            ]
        },

        // Remember Me
        {
            type: 'control',
            name: 'rememberMe',
            label: 'Remember Me',
            controlType: 'checkbox'
        },

        // 2FA Placeholder
    //     {
    //         type: 'html',
    //         name: 'twoFactorPlaceholder',
    //         content: `
    //     <div class="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
    //       <div class="flex items-center">
    //         <div class="flex-shrink-0">
    //           <i class="fas fa-shield-alt text-blue-400"></i>
    //         </div>
    //         <div class="mr-3">
    //           <p class="text-sm text-blue-700">
    //             <strong>المصادقة الثنائية:</strong> سيتم تفعيلها قريباً لزيادة الأمان
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   `,
    //         safe: true
    //     },

        // Submit Button
        {
            type: 'button',
            name: 'submit',
            label: 'Login',
            action: 'submit',
            color: 'primary',
            class: 'text-center mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200',
            fullWidth: true,
            icon: 'fas fa-sign-in-alt'
        },

        // Forgot Password Link
        {
            type: 'button',
            name: 'forgotPasswordLink',
            action: 'custom',
            onClick: () => {
                this.router.navigate(['/auth/forgot-password']);
            },
            label: 'Forgot Password?',
            icon: 'fas fa-key',
            class: 'text-center  mt-4 w-full text-primary-700 font-medium py-2 px-4 rounded-md transition-colors duration-200',
            fullWidth: true,
        },

        // Sign Up Link
        {
            type: 'button',
            name: 'signupLink',
            action: 'custom',
            onClick: () => {
                this.router.navigate(['/auth/signup']);
            },
            label: 'Create Account',
            icon: 'fas fa-user-plus',
            class: 'text-center  mt-4 w-full text-primary-700 font-medium py-2 px-4 rounded-md transition-colors duration-200',
            fullWidth: true,
        },



    ];

    formFieldsPhone: FormField[] = [

        // Phone/Email Field
        {
            type: 'control',
            name: 'phone',
            label: 'Phone',
            controlType: 'phone',
            isViewOnly: true,
            placeholder: 'Enter Phone',
            validations: [
                { type: 'required', message: 'Phone is required' },
                { type: 'pattern', value: '^\\+966\\s?5[0-9]{8}$', message: 'Phone is not valid' }
            ]
        },
        // button send code
        {
            type: 'button',
            name: 'sendCode',
            label: 'Send Code',
            action: 'submit',
            class: 'text-center mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200',
            fullWidth: true,
            icon: 'fas fa-sign-in-alt'
        }

    ]

    formConfig: DynamicFormConfig = {
        direction: 'ltr',
        showLabels: true,
        showValidationMessages: true,
        class: 'max-w-4xl mx-auto',
        fields: []
    };

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {


        // Update validation based on login method
    }

    switchLoginMethod(method: 'phone' | 'email'): void {
        this.loginMethod = method;
        console.log(this.loginMethod);
    }



    onSubmit(formData: any): void {
        console.log('Login form submitted:', {
            ...formData,
            loginMethod: this.loginMethod
        });
        this.router.navigate(['/auth/otp-verification']);
        // Handle form submission
    }
} 