import { AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicFormComponent, DynamicFormConfig, FormField } from "../../../../../projects/dynamic-form/src";
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-signup-individual',
    templateUrl: './signup-individual.component.html',
    styleUrls: ['./signup-individual.component.scss'],
    imports: [DynamicFormComponent, RouterModule]
})
export class SignupIndividualComponent {
    // @ViewChild('loginLink') loginLink!: TemplateRef<any>;
    router = inject(Router);
    formGroup!: FormGroup;
    formFields: FormField[] = [
        {
            type: 'group',
            name: 'personalInfo',
            label: '',
            class: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
            children: [
                // First Name
                {
                    type: 'control',
                    name: 'firstName',
                    label: 'First Name',
                    controlType: 'input',
                    placeholder: 'Enter First Name',
                    prefixIcon: 'fas fa-user',
                    validations: [
                        { type: 'required', message: 'First Name is required' },
                        { type: 'minLength', value: 2, message: 'First Name must be at least 2 characters' },
                        { type: 'maxLength', value: 50, message: 'First Name must be less than 50 characters' },
                        { type: 'pattern', value: '^[\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB50-\\uFDFF\\uFE70-\\uFEFFa-zA-Z\\s]+$', message: 'First Name must contain only letters' }
                    ]
                },

                // Last Name
                {
                    type: 'control',
                    name: 'lastName',
                    label: 'Last Name',
                    controlType: 'input',
                    placeholder: 'Enter Last Name',
                    prefixIcon: 'fas fa-user',
                    validations: [
                        { type: 'required', message: 'Last Name is required' },
                        { type: 'minLength', value: 2, message: 'Last Name must be at least 2 characters' },
                        { type: 'maxLength', value: 50, message: 'Last Name must be less than 50 characters' },
                        { type: 'pattern', value: '^[\\u0600-\\u06FF\\u0750-\\u077F\\u08A0-\\u08FF\\uFB50-\\uFDFF\\uFE70-\\uFEFFa-zA-Z\\s]+$', message: 'Last Name must contain only letters' }
                    ]
                },

                // Email
                {
                    type: 'control',
                    name: 'email',
                    class: 'sm:col-span-2',
                    label: 'Email',
                    controlType: 'email',
                    placeholder: 'Enter Email',
                    prefixIcon: 'fas fa-envelope',
                    validations: [
                        { type: 'email', message: 'Email is not valid' }
                    ]
                },

                // Phone
                {
                    type: 'control',
                    name: 'phone',
                    label: 'Phone',
                    class: 'sm:col-span-2',
                    isViewOnly: true,
                    controlType: 'phone',
                    placeholder: 'Enter Phone',
                    validations: [
                        { type: 'required', message: 'Phone is required' },
                        { type: 'pattern', value: '^\\+[0-9]{1,4}\\s[0-9]{6,15}$', message: 'Phone is not valid' }
                    ]
                },

                // Username
                {
                    type: 'control',
                    name: 'username',
                    label: 'Username',
                    class: 'sm:col-span-2',
                    controlType: 'input',
                    placeholder: 'Enter Username',
                    prefixIcon: 'fas fa-at',
                    validations: [
                        { type: 'minLength', value: 5, message: 'Username must be at least 5 characters' },
                        { type: 'maxLength', value: 20, message: 'Username must be less than 20 characters' },
                        { type: 'pattern', value: '^[a-zA-Z0-9_]+$', message: 'Username must contain only letters, numbers and underscores' }
                    ]
                },

                // Password
                {
                    type: 'control',
                    name: 'password',
                    label: 'Password',
                    controlType: 'password',
                    placeholder: 'Enter Password',
                    prefixIcon: 'fas fa-lock',
                    validations: [
                        { type: 'required', message: 'Password is required' },
                        { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
                        {
                            type: 'pattern', value: '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$',
                            message: 'Password must be at least 8 characters with upper, lower, numbers, and special characters.'
                        }
                    ]
                },

                // Confirm Password
                {
                    type: 'control',
                    name: 'confirmPassword',
                    label: 'Confirm Password',
                    controlType: 'password',
                    placeholder: 'Confirm Password',
                    prefixIcon: 'fas fa-lock',
                    validations: [
                        { type: 'required', message: 'Confirm Password is required' },
                        { type: 'mismatch', formControlMatch: 'password', message: 'Passwords do not match.' }
                    ]
                },

                // How Did You Know
                {
                    type: 'control',
                    name: 'howDidYouKnow',
                    label: 'How Did You Know?',
                    controlType: 'select',
                    placeholder: 'Select How',
                    options: [
                        { label: 'Social Media', value: 'social_media' },
                        { label: 'Google Search', value: 'google_search' },
                        { label: 'Friend or Family', value: 'friend_family' },
                        { label: 'Advertisement', value: 'advertisement' },
                        { label: 'أخرى', value: 'other' }
                    ],
                    validations: [
                        { type: 'required', message: 'يرجى اختيار طريقة التعرف علينا' }
                    ]
                },

                // Other Field (conditional)
                {
                    type: 'control',
                    name: 'howDidYouKnowOther',
                    label: 'Other - Please Select',
                    controlType: 'input',
                    placeholder: 'Enter the way',
                    prefixIcon: 'fas fa-edit',
                    validations: [
                        { type: 'required', message: 'Please select the way' }
                    ]
                },

            ]
        },
        // Submit Button
        {
            type: 'button',
            name: 'submit',
            label: 'Create Account',
            action: 'submit',
            color: 'primary',
            class: 'text-center mt-4 w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200',
            fullWidth: true,
            icon: 'fas fa-user-plus'
        },
        // Login Link button
        {
            type: 'button',
            name: 'loginLink',
            label: 'Login',
            action: 'custom',
            onClick: () => {
                this.router.navigate(['/auth/login']);
            },
            color: 'primary',
            class: 'text-center mt-4 w-full text-primary-600 font-medium py-2 px-4 rounded-md transition-colors duration-200',
            fullWidth: true,
            icon: 'fas fa-user-plus'
        },
    ];
    formConfig: DynamicFormConfig = {
        direction: 'ltr',
        showLabels: true,
        showValidationMessages: true,
        class: 'max-w-4xl mx-auto',
        fields: []
    };
    constructor() { }

    onSubmit(formData: any): void {
        console.log('Form submitted:', formData);
    }
} 