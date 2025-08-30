# Enhanced File Upload Component

This document describes the enhanced file upload component that has been integrated into the dynamic form library with modern Tailwind CSS styling.

## Features

### 🎨 Modern UI Design
- **Tailwind CSS Integration**: Uses modern Tailwind CSS classes for consistent styling
- **Drag & Drop Support**: Intuitive drag and drop functionality
- **Visual Feedback**: Hover states, drag-over effects, and smooth animations
- **File Type Icons**: Custom icons for different file types (PDF, CSV, images, etc.)
- **Responsive Design**: Works seamlessly across different screen sizes

### 🔧 Enhanced Functionality
- **Multiple File Support**: Upload single or multiple files
- **File Type Restrictions**: Accept specific file types using the `accept` attribute
- **File Size Display**: Shows file size in human-readable format
- **File Preview**: Displays selected files with icons and metadata
- **Clear Functionality**: Easy file removal with clear button
- **Form Integration**: Fully compatible with Angular reactive forms

### 🌍 Internationalization
- **RTL/LTR Support**: Automatic text direction based on language
- **Bilingual Labels**: Arabic and English text support
- **Accessible**: ARIA labels and proper semantic markup

## Usage

### Basic File Upload

```typescript
const fileConfig: DynamicFormConfig = {
  fields: [
    {
      type: 'control',
      name: 'file',
      label: 'Upload File',
      controlType: 'file',
      description: 'Choose any file type up to 2MB',
      accept: '*',
      validations: [
        { type: 'required', message: 'File is required' }
      ]
    }
  ]
};
```

### Image Upload Only

```typescript
const imageConfig: DynamicFormConfig = {
  fields: [
    {
      type: 'control',
      name: 'image',
      label: 'Upload Image',
      controlType: 'file',
      description: 'Upload profile picture or any image file',
      accept: 'image/*',
      validations: [
        { type: 'required', message: 'Image is required' }
      ]
    }
  ]
};
```

### Document Upload

```typescript
const documentConfig: DynamicFormConfig = {
  fields: [
    {
      type: 'control',
      name: 'document',
      label: 'Upload Document',
      controlType: 'file',
      description: 'Upload PDF, CSV, or Word documents',
      accept: '.pdf,.csv,.doc,.docx',
      validations: [
        { type: 'required', message: 'Document is required' }
      ]
    }
  ]
};
```

### Multiple Files Upload

```typescript
const multipleConfig: DynamicFormConfig = {
  fields: [
    {
      type: 'control',
      name: 'files',
      label: 'Upload Multiple Files',
      controlType: 'file',
      description: 'Upload multiple files at once',
      accept: '*',
      multiple: true,
      validations: [
        { type: 'required', message: 'At least one file is required' }
      ]
    }
  ]
};
```

## Component Structure

### File Upload Container
The main container provides:
- Drag and drop zone
- Visual feedback for drag states
- File input trigger area

### File Preview Section
Shows selected files with:
- File type icon
- File name
- File size
- Remove button

### Hidden File Input
The actual file input is hidden but accessible for:
- Programmatic file selection
- Form validation
- Accessibility

## Styling Classes

### Tailwind CSS Classes Used
- `bg-base-200/60`: Background with opacity
- `border-2 border-base-content/20 border-dashed`: Dashed border
- `rounded-box`: Rounded corners
- `btn btn-soft btn-sm btn-primary`: Button styling
- `link link-animated link-primary`: Animated link
- `file-preview`: File preview container
- `file-icon`: File type icon container

### Custom CSS
- Drag-over effects
- Slide-in animations
- File icon styling
- Responsive layout adjustments

## Configuration Options

### FileUploadConfig Interface
```typescript
interface FileUploadConfig {
  url?: string;
  extensions?: {
    [key: string]: {
      icon: string;
      class: string;
    };
  };
}
```

### Supported File Extensions
- **CSV**: Spreadsheet icon
- **PDF**: Document icon
- **Images**: Image icon
- **Default**: Generic file icon

## Accessibility Features

- **ARIA Labels**: Proper labeling for screen readers
- **Keyboard Navigation**: Full keyboard support
- **Focus Management**: Clear focus indicators
- **Semantic HTML**: Proper HTML structure
- **Screen Reader Support**: Descriptive text and labels

## Browser Compatibility

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Drag & Drop API**: Supported in all modern browsers
- **File API**: Full support for file handling
- **CSS Grid/Flexbox**: Modern layout support

## Examples

### Demo Page
Visit `/file-upload-example` to see live examples of:
- Basic file upload
- Image-only upload
- Document upload
- Multiple file upload

### Integration
The component is fully integrated with the existing dynamic form system and can be used alongside other form controls.

## Customization

### Adding Custom File Types
```typescript
fileUploadConfig: FileUploadConfig = {
  extensions: {
    custom: {
      icon: '<svg>...</svg>',
      class: 'shrink-0 size-5'
    }
  }
};
```

### Styling Customization
Override Tailwind classes or add custom CSS to match your design system.

## Performance Considerations

- **File Size Limits**: Consider implementing client-side file size validation
- **Memory Management**: Large files are handled efficiently
- **Upload Progress**: Can be extended with progress indicators
- **Error Handling**: Comprehensive error states and messages

## Future Enhancements

- **Upload Progress**: Progress bar for file uploads
- **Image Preview**: Thumbnail generation for images
- **File Compression**: Client-side image compression
- **Batch Upload**: Enhanced multiple file handling
- **Cloud Integration**: Direct upload to cloud storage 