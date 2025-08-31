import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormField, DynamicFormComponent, DynamicFormConfig } from '../../../../../projects/dynamic-form/src';

@Component({
    selector: 'app-signup-company',
    templateUrl: './signup-company.component.html',
    styleUrls: ['./signup-company.component.scss'],
    imports: [DynamicFormComponent]
})
export class SignupCompanyComponent implements OnInit {
    formFields: FormField[] = [
        {
            type: 'group',
            name: 'companyInfo',
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
                        { type: 'pattern', value: '^[a-zA-Z\\s]+$', message: 'First Name must contain only letters' }
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
                        { type: 'pattern', value: '^[a-zA-Z\\s]+$', message: 'Last Name must contain only letters' }
                    ]
                },

                // Company Type
                {
                    type: 'control',
                    name: 'companyType',
                    label: 'Company Type',
                    controlType: 'select',
                    placeholder: 'Select Company Type',
                    options: [
                        { label: 'Private Company', value: 'private' },
                        { label: 'Government Company', value: 'government' }
                    ],
                    validations: [
                        { type: 'required', message: 'Company Type is required' }
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
                        { type: 'required', message: 'Email is required' },
                        { type: 'email', message: 'Email is not valid' }
                    ]
                },

                // Phone
                {
                    type: 'control',
                    name: 'phone',
                    class: 'sm:col-span-2',
                    label: 'Phone',
                    controlType: 'phone',
                    isViewOnly: true,
                    placeholder: 'Enter Phone',
                    validations: [
                        { type: 'required', message: 'Phone is required' },
                        { type: 'pattern', value: '^\\+[0-9]{1,4}\\s[0-9]{6,15}$', message: 'Phone is not valid' }
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
                        { type: 'pattern', value: '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$', 
                            message: 'Password must be at least 8 characters with upper, lower, numbers, and special characters.' }
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
                        { type: 'mismatch', message: 'Passwords do not match.', formControlMatch: 'password' }
                    ]
                },
            ]
        },

        // Submit Button
        {
            type: 'button',
            name: 'submit',
            label: 'Create Company Account',
            action: 'submit',
            color: 'primary',
            class: 'text-center mt-4 w-full bg-secondary-600 text-white hover:bg-secondary-700 rounded-md py-2 px-4',
            fullWidth: true,
            icon: 'fas fa-building'
        },

        // Login Link
        {
            type: 'html',
            name: 'loginLink',
            content: `
          <div class="text-center mt-4">
            <p class="text-gray-600">
              Do you have an account? 
              <a href="/login" class="text-blue-600 hover:text-blue-800 font-medium">Login</a>
            </p>
          </div>
        `,
            safe: true
        }
    ];

    formConfig: DynamicFormConfig = {
        direction: 'ltr',
        showLabels: true,
        showValidationMessages: true,
        class: 'max-w-4xl mx-auto',
        fields: []
    };

    constructor(private fb: FormBuilder) { }

    ngOnInit(): void {


    }



    onSubmit(formData: any): void {
        console.log('Company form submitted:', formData);
        // Handle form submission
    }
} 