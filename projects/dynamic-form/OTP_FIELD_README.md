# Dynamic OTP Field Component

A comprehensive OTP (One-Time Password) input field component for Angular applications with advanced features like countdown timers, auto-submit, and resend functionality.

## Features

- ✅ **Configurable OTP Length**: Support for 4, 5, 6, or any number of digits
- ✅ **Auto-focus Navigation**: Automatically moves to next field when digit is entered
- ✅ **Backspace Support**: Navigate to previous field on backspace
- ✅ **Paste Support**: Paste OTP code to fill all fields at once
- ✅ **Countdown Timer**: Built-in countdown with resend functionality
- ✅ **Auto-submit**: Automatically submit when all fields are filled
- ✅ **Form Integration**: Full integration with Angular Reactive Forms
- ✅ **Validation**: Built-in validation support
- ✅ **Responsive Design**: Mobile-friendly input fields
- ✅ **Accessibility**: Proper ARIA labels and keyboard navigation

## Installation

The OTP field component is part of the dynamic-form library. Make sure you have the library installed:

```bash
npm install dynamic-form
```

## Basic Usage

### 1. Import the Component

```typescript
import { OtpFieldComponent } from 'dynamic-form';
import { ControlField } from 'dynamic-form';

@Component({
  imports: [OtpFieldComponent],
  // ...
})
```

### 2. Define the Field Configuration

```typescript
const otpField: ControlField = {
  name: 'otp',
  type: 'control',
  controlType: 'otp',
  label: 'Enter Verification Code',
  description: 'Please enter the 4-digit code sent to your phone',
  otpLength: 4,
  autoSubmit: true,
  validations: [
    { type: 'required', message: 'OTP is required' },
    { type: 'minLength', value: 4, message: 'OTP must be 4 digits' }
  ]
};
```

### 3. Use in Template

```html
<form [formGroup]="form">
  <lib-otp-field
    [field]="otpField"
    [control]="form.get('otp')!"
    [showLabels]="true"
    [showValidationMessages]="true"
  ></lib-otp-field>
</form>
```

## Configuration Options

### Basic Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `name` | string | - | Field name (required) |
| `label` | string | - | Field label |
| `description` | string | - | Field description |
| `otpLength` | number | 4 | Number of OTP digits |
| `autoSubmit` | boolean | true | Auto-submit when all fields filled |
| `disabled` | boolean | false | Disable the field |

### Countdown Timer Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `countdown` | number | - | Countdown timer in seconds |
| `canResend` | boolean | false | Whether resend is available |
| `onResend` | function | - | Resend callback function |
| `onComplete` | function | - | Called when OTP is completed |

### Validation Properties

| Property | Type | Description |
|----------|------|-------------|
| `validations` | ValidationRule[] | Array of validation rules |

## Examples

### 1. Basic OTP Field (4 digits)

```typescript
const basicOtpField: ControlField = {
  name: 'basicOtp',
  type: 'control',
  controlType: 'otp',
  label: 'Enter OTP Code',
  description: 'Please enter the 4-digit code sent to your phone',
  otpLength: 4,
  autoSubmit: true,
  validations: [
    { type: 'required', message: 'OTP is required' },
    { type: 'minLength', value: 4, message: 'OTP must be 4 digits' }
  ]
};
```

### 2. OTP with Countdown Timer (6 digits)

```typescript
const countdownOtpField: ControlField = {
  name: 'countdownOtp',
  type: 'control',
  controlType: 'otp',
  label: 'Verification Code',
  description: 'Enter the 6-digit code sent to your phone',
  otpLength: 6,
  countdown: 300, // 5 minutes
  canResend: false,
  onResend: () => {
    console.log('Resending OTP...');
    // API call to resend OTP
  },
  onComplete: (otp: string) => {
    console.log('OTP completed:', otp);
    // Auto-verify logic
  },
  validations: [
    { type: 'required', message: 'Verification code is required' },
    { type: 'minLength', value: 6, message: 'Code must be 6 digits' }
  ]
};
```

### 3. Manual Submit OTP (5 digits)

```typescript
const manualOtpField: ControlField = {
  name: 'manualOtp',
  type: 'control',
  controlType: 'otp',
  label: 'Security Code',
  description: 'Enter the 5-digit security code',
  otpLength: 5,
  autoSubmit: false, // Disable auto-submit
  validations: [
    { type: 'required', message: 'Security code is required' },
    { type: 'minLength', value: 5, message: 'Code must be 5 digits' }
  ]
};
```

### 4. Complete OTP Verification Form

```typescript
const completeOtpField: ControlField = {
  name: 'otp',
  type: 'control',
  controlType: 'otp',
  label: 'Verification Code',
  description: 'Enter the 4-digit code sent to your phone',
  otpLength: 4,
  countdown: 180, // 3 minutes
  canResend: false,
  onResend: () => {
    console.log('Resending verification code...');
    // API call to resend verification code
  },
  onComplete: (otp: string) => {
    console.log('Verification completed:', otp);
    // Auto-verify logic
  },
  validations: [
    { type: 'required', message: 'Verification code is required' },
    { type: 'minLength', value: 4, message: 'Code must be 4 digits' }
  ]
};
```

## Form Integration

### Reactive Forms Setup

```typescript
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export class OtpExampleComponent {
  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(4)]]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const otpValue = this.form.get('otp')?.value;
      console.log('OTP submitted:', otpValue);
    }
  }
}
```

### Template with Form

```html
<form [formGroup]="form" (ngSubmit)="onSubmit()">
  <lib-otp-field
    [field]="otpField"
    [control]="form.get('otp')!"
    [showLabels]="true"
    [showValidationMessages]="true"
  ></lib-otp-field>
  
  <button type="submit" class="btn btn-primary">
    Verify OTP
  </button>
</form>
```

## Dynamic Form Integration

The OTP field can also be used with the dynamic form component:

```typescript
const fields: ControlField[] = [
  {
    name: 'phone',
    type: 'control',
    controlType: 'phone',
    label: 'Phone Number',
    validations: [{ type: 'required', message: 'Phone is required' }]
  },
  {
    name: 'otp',
    type: 'control',
    controlType: 'otp',
    label: 'Verification Code',
    otpLength: 4,
    countdown: 300,
    onResend: () => console.log('Resending...'),
    validations: [
      { type: 'required', message: 'OTP is required' },
      { type: 'minLength', value: 4, message: 'Must be 4 digits' }
    ]
  }
];

const config: DynamicFormConfig = {
  fields,
  showLabels: true,
  showValidationMessages: true
};
```

```html
<lib-dynamic-form
  [fields]="fields"
  [config]="config"
  (formSubmit)="onSubmit($event)"
></lib-dynamic-form>
```

## Styling

The component uses CSS Grid for layout and includes responsive design. You can customize the appearance using CSS:

```css
.otp-input {
  width: 3rem;
  height: 3rem;
  text-align: center;
  font-size: 1.25rem;
  border: 2px solid #d1d5db;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
}

.otp-input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.otp-input.is-invalid {
  border-color: #ef4444;
}

.otp-input.is-valid {
  border-color: #10b981;
}
```

## Events and Callbacks

### onResend
Called when the user clicks the resend button:

```typescript
onResend: () => {
  // Make API call to resend OTP
  this.authService.resendOtp(this.phoneNumber).subscribe(
    response => console.log('OTP resent'),
    error => console.error('Failed to resend OTP')
  );
}
```

### onComplete
Called when all OTP fields are filled:

```typescript
onComplete: (otp: string) => {
  // Auto-verify the OTP
  this.authService.verifyOtp(otp).subscribe(
    response => {
      console.log('OTP verified successfully');
      this.router.navigate(['/dashboard']);
    },
    error => console.error('Invalid OTP')
  );
}
```

## Accessibility

The component includes proper accessibility features:

- ARIA labels for screen readers
- Keyboard navigation support
- Focus management
- Proper input types and patterns
- Clear error messages

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Mobile Support

The component is optimized for mobile devices with:

- Touch-friendly input sizes
- Proper input modes for numeric keyboards
- Responsive design
- Paste support for mobile browsers

## Troubleshooting

### Common Issues

1. **Component not found**: Make sure the OtpFieldComponent is properly imported and included in your module/component imports.

2. **Form validation not working**: Ensure the form control is properly connected and validators are set up correctly.

3. **Countdown not working**: Check that the countdown property is set and the onResend callback is provided.

4. **Auto-submit not working**: Verify that autoSubmit is set to true and onComplete callback is provided.

### Debug Tips

- Check browser console for any errors
- Verify form control values using `console.log(form.get('otp')?.value)`
- Test countdown functionality with shorter durations
- Ensure all required properties are set in the field configuration

## Contributing

To contribute to the OTP field component:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This component is part of the dynamic-form library and follows the same license terms. 