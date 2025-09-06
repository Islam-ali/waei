import { Component, forwardRef, OnInit, OnDestroy, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';
import { CommonModule } from '@angular/common';

interface SelectOption {
  label: string;
  value: any;
  disabled?: boolean;
  icon?: string;
  description?: string;
}

@Component({
  selector: 'lib-select-field',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div [class]="getClassString(field.class)" [style]="getStyleString(field.style)" class="form-field">
      
      @if (showLabels && field.label) {
        <label [for]="field.name" class="field-label">
          {{ field.label }}
          @if (isRequired()) {
            <span class="required-indicator">*</span>
          }
        </label>
      }

      @if (field.description) {
        <p class="field-description">{{ field.description }}</p>
      }

      <div class="select-container relative w-full" [class.is-open]="isOpen" [class.is-multiple]="field.multiple">
        <!-- Select Trigger -->
        <div 
          class="select-trigger flex items-center justify-between w-full min-h-[2.5rem] px-3 py-2 bg-white border border-gray-200 rounded-md cursor-pointer transition-all duration-150 ease-in-out text-sm font-medium hover:border-gray-400 focus:outline-none focus:border-blue-500"
          [class.border-red-500]="isFieldInvalid()"
          [class.border-green-500]="isFieldValid()"
          [class.bg-gray-100]="field.disabled"
          [class.cursor-not-allowed]="field.disabled"
          [class.opacity-60]="field.disabled"
          [class.border-blue-500]="isOpen"
          (click)="toggleDropdown()"
        >
          @if (field.prefixIcon) {
            <i [class]="field.prefixIcon" class="prefix-icon text-gray-500 text-base mr-2"></i>
          }

          <div class="select-value flex-1 flex items-center gap-2 min-w-0">
            @if (field.multiple && selectedOptions.length > 0) {
              <div class="selected-items flex flex-wrap gap-1 w-full">
                @for (option of selectedOptions; track option.value) {
                  <span class="selected-item inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {{ option.label }}
                    <button 
                      type="button" 
                      class="remove-item inline-flex items-center justify-center w-4 h-4 border-none bg-transparent text-blue-600 cursor-pointer rounded-full text-xs leading-none hover:bg-blue-200 transition-colors"
                      (click)="removeOption(option, $event)"
                    >
                      ×
                    </button>
                  </span>
                }
              </div>
            } @else if (selectedOption) {
              <span class="single-value text-gray-900 font-medium">{{ selectedOption.label }}</span>
            } @else {
              <span class="placeholder text-gray-500">{{ field.placeholder || 'اختر خياراً...' }}</span>
            }
          </div>

          @if (field.suffixIcon) {
            <i [class]="field.suffixIcon" class="suffix-icon text-gray-500 text-base ml-2"></i>
          } @else {
            <i class="chevron-icon text-xs text-gray-500 transition-transform duration-150" [class.rotate-180]="isOpen">▼</i>
          }
        </div>

        <!-- Dropdown -->
        @if (isOpen) {
          <div class="select-dropdown absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-64 overflow-hidden flex flex-col">
            <!-- Search Input -->
            @if (field.searchable) {
              <div class="search-container relative p-2 border-b border-gray-200">
                <input
                  type="text"
                  class="search-input w-full px-3 py-2 pr-8 text-sm bg-white border border-gray-200 rounded text-gray-900 font-medium outline-none focus:border-blue-500"
                  placeholder="ابحث..."
                  [(ngModel)]="searchTerm"
                  (input)="onSearchChange()"
                  (keydown)="onSearchKeydown($event)"
                >
                @if (searchTerm) {
                  <button 
                    type="button" 
                    class="clear-search absolute right-2 top-1/2 transform -translate-y-1/2 inline-flex items-center justify-center w-5 h-5 border-none bg-transparent text-gray-500 cursor-pointer rounded-full text-sm hover:bg-gray-200 transition-colors"
                    (click)="clearSearch()"
                  >
                    ×
                  </button>
                }
              </div>
            }

            <!-- Options List -->
            <div class="options-container flex-1 overflow-y-auto max-h-48">
              @if (filteredOptions.length === 0) {
                <div class="no-options p-4 text-center text-gray-500 text-sm">
                  @if (searchTerm) {
                    لا توجد نتائج لـ "{{ searchTerm }}"
                  } @else {
                    لا توجد خيارات متاحة
                  }
                </div>
              } @else {
                @for (option of filteredOptions; track option.value) {
                  <div 
                    class="select-option flex items-center gap-2 px-3 py-2 cursor-pointer transition-colors duration-150 text-sm hover:bg-gray-50"
                    [class.bg-blue-50]="isOptionSelected(option)"
                    [class.text-blue-700]="isOptionSelected(option)"
                    [class.opacity-50]="option.disabled"
                    [class.cursor-not-allowed]="option.disabled"
                    [class.bg-gray-100]="option.disabled"
                    (click)="selectOption(option)"
                  >
                    @if (field.multiple) {
                      <input 
                        type="checkbox" 
                        [checked]="isOptionSelected(option)"
                        [disabled]="option.disabled"
                        class="option-checkbox w-4 h-4 accent-blue-500"
                      >
                    }
                    
                    @if (option.icon) {
                      <i [class]="option.icon" class="option-icon text-base text-gray-500 w-5 text-center"></i>
                    }
                    
                    <div class="option-content flex-1 min-w-0">
                      <div class="option-label font-medium text-inherit">{{ option.label }}</div>
                      @if (option.description) {
                        <div class="option-description text-xs text-gray-500 mt-0.5">{{ option.description }}</div>
                      }
                    </div>
                  </div>
                }
              }
            </div>

            <!-- Actions -->
            @if (field.multiple && selectedOptions.length > 0) {
              <div class="select-actions flex gap-2 p-2 border-t border-gray-200 bg-gray-50">
                <button 
                  type="button" 
                  class="clear-all-btn flex-1 px-2 py-1 text-xs font-medium border border-red-300 rounded bg-white text-red-600 cursor-pointer transition-all hover:bg-red-50 hover:border-red-400"
                  (click)="clearAll()"
                >
                  مسح الكل
                </button>
                <button 
                  type="button" 
                  class="select-all-btn flex-1 px-2 py-1 text-xs font-medium border border-blue-300 rounded bg-white text-blue-600 cursor-pointer transition-all hover:bg-blue-50 hover:border-blue-400"
                  (click)="selectAll()"
                >
                  تحديد الكل
                </button>
              </div>
            }
          </div>
        }
      </div>

      @if (showValidationMessages && hasError('required')) {
        <div class="field-error mt-1 text-xs text-red-600">{{ getErrorMessage('required') }}</div>
      }
    </div>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectFieldComponent),
      multi: true
    }
  ]
})
export class SelectFieldComponent extends BaseFieldComponent implements OnInit, OnDestroy {
  isOpen = false;
  searchTerm = '';
  selectedOption: SelectOption | null = null;
  selectedOptions: SelectOption[] = [];
  filteredOptions: SelectOption[] = [];
  allOptions: SelectOption[] = [];

  ngOnInit() {
    this.allOptions = this.field.options || [];
    this.filteredOptions = [...this.allOptions];
    this.updateSelectedState();
  }

  ngOnDestroy() {
    this.closeDropdown();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.select-container')) {
      this.closeDropdown();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onDocumentKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.closeDropdown();
    }
  }

  toggleDropdown() {
    if (this.field.disabled) return;
    
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    this.isOpen = true;
    this.searchTerm = '';
    this.filteredOptions = [...this.allOptions];
    setTimeout(() => {
      if (typeof document !== 'undefined') {
        const searchInput = document.querySelector('.search-input') as HTMLInputElement;
        if (searchInput && this.field.searchable) {
          searchInput.focus();
        }
      }
    }, 100);
  }

  closeDropdown() {
    this.isOpen = false;
    this.searchTerm = '';
  }

  onSearchChange() {
    if (!this.searchTerm.trim()) {
      this.filteredOptions = [...this.allOptions];
    } else {
      this.filteredOptions = this.allOptions.filter(option =>
        option.label.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (option.description && option.description.toLowerCase().includes(this.searchTerm.toLowerCase()))
      );
    }
  }

  onSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.filteredOptions.length > 0) {
        this.selectOption(this.filteredOptions[0]);
      }
    }
  }

  clearSearch() {
    this.searchTerm = '';
    this.onSearchChange();
  }

  selectOption(option: SelectOption) {
    if (option.disabled) return;

    if (this.field.multiple) {
      const index = this.selectedOptions.findIndex(opt => opt.value === option.value);
      if (index > -1) {
        this.selectedOptions.splice(index, 1);
      } else {
        this.selectedOptions.push(option);
      }
      this.value = this.selectedOptions.map(opt => opt.value);
    } else {
      this.selectedOption = option;
      this.value = option.value;
      this.closeDropdown();
    }

    this.onChange(this.value);
    this.onTouched();
  }

  removeOption(option: SelectOption, event: Event) {
    event.stopPropagation();
    const index = this.selectedOptions.findIndex(opt => opt.value === option.value);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
      this.value = this.selectedOptions.map(opt => opt.value);
      this.onChange(this.value);
      this.onTouched();
    }
  }

  clearAll() {
    this.selectedOptions = [];
    this.value = [];
    this.onChange(this.value);
    this.onTouched();
  }

  selectAll() {
    const availableOptions = this.allOptions.filter(option => !option.disabled);
    this.selectedOptions = [...availableOptions];
    this.value = this.selectedOptions.map(opt => opt.value);
    this.onChange(this.value);
    this.onTouched();
  }

  isOptionSelected(option: SelectOption): boolean {
    if (this.field.multiple) {
      return this.selectedOptions.some(opt => opt.value === option.value);
    } else {
      return this.selectedOption?.value === option.value;
    }
  }

  updateSelectedState() {
    if (this.field.multiple) {
      this.selectedOptions = this.allOptions.filter(option => 
        Array.isArray(this.value) && this.value.includes(option.value)
      );
    } else {
      this.selectedOption = this.allOptions.find(option => option.value === this.value) || null;
    }
  }

  override writeValue(value: any): void {
    super.writeValue(value);
    this.updateSelectedState();
  }

  override hasError(errorType: string): boolean {
    // This would be implemented with actual form control validation
    // For now, return false as this is a demo
    return false;
  }
} 