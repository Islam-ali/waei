import { Component, forwardRef, OnInit, OnDestroy, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BaseFieldComponent } from './base-field.component';

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  isInRange: boolean;
  isRangeStart: boolean;
  isRangeEnd: boolean;
  isDisabled: boolean;
}

interface DateRange {
  start: Date | null;
  end: Date | null;
}

@Component({
  selector: 'lib-calendar-field',
  standalone: true,
  imports: [CommonModule],
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

      <div class="calendar-wrapper">
        <div class="input-wrapper">
          @if (field.prefixIcon) {
            <i [class]="field.prefixIcon" class="prefix-icon"></i>
          }
          
          <input
            type="text"
            [id]="field.name"
            [name]="field.name"
            [value]="getDisplayValue()"
            [readonly]="field.readonly"
            (click)="toggleCalendar()"
            (input)="onInputChange($event)"
            (blur)="onBlur()"
            class="field-input calendar-input"
            [class.has-prefix]="field.prefixIcon"
            [class.has-suffix]="field.suffixIcon"
            [class.is-invalid]="isFieldInvalid()"
            [class.is-valid]="isFieldValid()"
            [placeholder]="getPlaceholder()"
          />
          
          @if (field.suffixIcon) {
            <i [class]="field.suffixIcon" class="suffix-icon"></i>
          } @else {
            <i class="fas fa-calendar-alt suffix-icon calendar-icon" (click)="toggleCalendar()"></i>
          }
        </div>

        @if (isCalendarOpen) {
          <div class="calendar-dropdown">
            <div class="calendar-header">
              <button type="button" class="nav-btn" (click)="previousMonth()">
                <i class="fas fa-chevron-left"></i>
              </button>
              <div class="current-month">
                {{ getCurrentMonthYear() }}
              </div>
              <button type="button" class="nav-btn" (click)="nextMonth()">
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>

            <div class="calendar-weekdays">
              <div class="weekday" *ngFor="let day of weekDays">{{ day }}</div>
            </div>

            <div class="calendar-days">
              <div 
                *ngFor="let day of calendarDays" 
                class="calendar-day"
                [class.other-month]="!day.isCurrentMonth"
                [class.today]="day.isToday"
                [class.selected]="day.isSelected"
                [class.in-range]="day.isInRange"
                [class.range-start]="day.isRangeStart"
                [class.range-end]="day.isRangeEnd"
                [class.disabled]="day.isDisabled"
                (click)="selectDate(day)"
              >
                {{ day.day }}
              </div>
            </div>

            <div class="calendar-footer">
              <button type="button" class="today-btn" (click)="selectToday()">
                {{ isArabic ? 'اليوم' : 'Today' }}
              </button>
              <button type="button" class="clear-btn" (click)="clearDate()">
                {{ isArabic ? 'مسح' : 'Clear' }}
              </button>
            </div>
          </div>
        }
      </div>

      @if (showValidationMessages && hasError('required')) {
        <div class="field-error">{{ getErrorMessage() }}</div>
      }
    </div>
  `,
  styles: [`
    .calendar-wrapper {
      position: relative;
    }

    .calendar-input {
      cursor: pointer;
    }

    .calendar-icon {
      cursor: pointer;
      color: #6b7280;
      transition: color 0.2s;
    }

    .calendar-icon:hover {
      color: #3b82f6;
    }

    .calendar-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 1000;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      margin-top: 4px;
      min-width: 280px;
    }

    .calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      border-bottom: 1px solid #f3f4f6;
      background: #f9fafb;
      border-radius: 8px 8px 0 0;
    }

    .nav-btn {
      background: none;
      border: none;
      padding: 8px;
      border-radius: 6px;
      cursor: pointer;
      color: #6b7280;
      transition: all 0.2s;
    }

    .nav-btn:hover {
      background: #e5e7eb;
      color: #374151;
    }

    .current-month {
      font-weight: 600;
      color: #374151;
      font-size: 14px;
    }

    .calendar-weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      padding: 8px 0;
      background: #f9fafb;
      border-bottom: 1px solid #f3f4f6;
    }

    .weekday {
      text-align: center;
      font-size: 12px;
      font-weight: 600;
      color: #6b7280;
      padding: 8px 4px;
    }

    .calendar-days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      padding: 8px;
      gap: 2px;
    }

    .calendar-day {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 36px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
      color: #374151;
      position: relative;
    }

    .calendar-day:hover:not(.disabled) {
      background: #f3f4f6;
    }

    .calendar-day.other-month {
      color: #9ca3af;
    }

    .calendar-day.today {
      background: #dbeafe;
      color: #1d4ed8;
      font-weight: 600;
    }

    .calendar-day.selected {
      background: #3b82f6;
      color: white;
      font-weight: 600;
    }

    .calendar-day.in-range {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .calendar-day.range-start {
      background: #3b82f6;
      color: white;
      font-weight: 600;
      border-radius: 6px 0 0 6px;
    }

    .calendar-day.range-end {
      background: #3b82f6;
      color: white;
      font-weight: 600;
      border-radius: 0 6px 6px 0;
    }

    .calendar-day.disabled {
      color: #d1d5db;
      cursor: not-allowed;
    }

    .calendar-footer {
      display: flex;
      justify-content: space-between;
      padding: 12px 16px;
      border-top: 1px solid #f3f4f6;
      background: #f9fafb;
      border-radius: 0 0 8px 8px;
    }

    .today-btn, .clear-btn {
      background: none;
      border: 1px solid #d1d5db;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s;
    }

    .today-btn {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .today-btn:hover {
      background: #2563eb;
    }

    .clear-btn {
      color: #6b7280;
    }

    .clear-btn:hover {
      background: #f3f4f6;
      color: #374151;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .calendar-dropdown {
      animation: slideIn 0.2s ease-out;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CalendarFieldComponent),
      multi: true
    }
  ]
})
export class CalendarFieldComponent extends BaseFieldComponent implements OnInit, OnDestroy {
  isCalendarOpen = false;
  currentDate = new Date();
  selectedDate: Date | null = null;
  dateRange: DateRange = { start: null, end: null };
  calendarDays: CalendarDay[] = [];
  isRangeMode = false;
  isArabic = true;

  private weekDaysAr = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  private weekDaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.calendar-wrapper')) {
      this.isCalendarOpen = false;
    }
  }

  ngOnInit() {
    // Check if range mode is enabled
    this.isRangeMode = this.field.controlType === 'calendar' && this.field.multiple === true;

    // Detect language from document or field configuration
    this.isArabic = this.detectLanguage();

    // Initialize selected date from value if available
    // if (this.value) {
    try {
      if (this.isRangeMode && Array.isArray(this.value)) {
        // Range mode
        if (this.value[0]) {
          const startDate = new Date(this.value[0]);
          if (!isNaN(startDate.getTime())) {
            this.dateRange.start = startDate;
            this.currentDate = new Date(startDate);
          }
        }
        if (this.value[1]) {
          const endDate = new Date(this.value[1]);
          if (!isNaN(endDate.getTime())) {
            this.dateRange.end = endDate;
          }
        }
      } else {
        // Single date mode
        const date = new Date(this.value);
        if (!isNaN(date.getTime())) {
          this.selectedDate = date;
          this.currentDate = new Date(date);
        }
      }
    } catch (error) {
      console.warn('Error initializing calendar with value:', error);
    }


    this.generateCalendar();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  detectLanguage(): boolean {
    // Check document direction or use field configuration
    if (this.field.dateType === 'hijri') return true;
    if (this.field.dateType === 'gregorian') return false;

    // Default to Arabic for RTL or based on document
    return document.documentElement.dir === 'rtl' ||
      document.documentElement.lang === 'ar' ||
      navigator.language.startsWith('ar') ||
      this.field.language === 'ar';
  }

  get weekDays(): string[] {
    return this.isArabic ? this.weekDaysAr : this.weekDaysEn;
  }

  toggleCalendar() {
    this.isCalendarOpen = !this.isCalendarOpen;
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    this.calendarDays = [];

    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const day: CalendarDay = {
        date: new Date(date),
        day: date.getDate(),
        isCurrentMonth: date.getMonth() === month,
        isToday: this.isToday(date),
        isSelected: this.isSelected(date),
        isInRange: this.isInRange(date),
        isRangeStart: this.isRangeStart(date),
        isRangeEnd: this.isRangeEnd(date),
        isDisabled: this.isDisabled(date)
      };

      this.calendarDays.push(day);
    }
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  isSelected(date: Date): boolean {
    if (this.isRangeMode) {
      return this.isRangeStart(date) || this.isRangeEnd(date);
    }
    if (!this.selectedDate) return false;
    return date.toDateString() === this.selectedDate.toDateString();
  }

  isInRange(date: Date): boolean {
    if (!this.isRangeMode || !this.dateRange.start || !this.dateRange.end) return false;
    return date >= this.dateRange.start && date <= this.dateRange.end;
  }

  isRangeStart(date: Date): boolean {
    if (!this.isRangeMode || !this.dateRange.start) return false;
    return date.toDateString() === this.dateRange.start.toDateString();
  }

  isRangeEnd(date: Date): boolean {
    if (!this.isRangeMode || !this.dateRange.end) return false;
    return date.toDateString() === this.dateRange.end.toDateString();
  }

  isDisabled(date: Date): boolean {
    // Add your validation logic here
    const minValidation = this.field.validations?.find(v => v.type === 'min');
    const maxValidation = this.field.validations?.find(v => v.type === 'max');

    try {
      if (minValidation) {
        const minDate = new Date(minValidation.value);
        if (!isNaN(minDate.getTime()) && date < minDate) {
          return true;
        }
      }

      if (maxValidation) {
        const maxDate = new Date(maxValidation.value);
        if (!isNaN(maxDate.getTime()) && date > maxDate) {
          return true;
        }
      }
    } catch (error) {
      console.warn('Error checking date validation:', error);
    }

    return false;
  }

  selectDate(day: CalendarDay) {
    if (day.isDisabled) return;

    try {
      if (this.isRangeMode) {
        this.selectRangeDate(day.date);
      } else {
        this.selectedDate = day.date;
        this.value = this.formatDateForOutput(day.date);
        this.onChange(this.value);
        this.dirty = true;
        this.generateCalendar();
        this.isCalendarOpen = false;
      }
    } catch (error) {
      console.warn('Error selecting date:', error);
    }
  }

  selectRangeDate(date: Date) {
    if (!this.dateRange.start || (this.dateRange.start && this.dateRange.end)) {
      // Start new range
      this.dateRange = { start: date, end: null };
    } else {
      // Complete range
      if (date >= this.dateRange.start) {
        this.dateRange.end = date;
      } else {
        this.dateRange = { start: date, end: this.dateRange.start };
      }
    }

    this.value = [
      this.dateRange.start ? this.formatDateForOutput(this.dateRange.start) : null,
      this.dateRange.end ? this.formatDateForOutput(this.dateRange.end) : null
    ];
    this.onChange(this.value);
    this.dirty = true;
    this.generateCalendar();

    // Close calendar if range is complete
    if (this.dateRange.start && this.dateRange.end) {
      this.isCalendarOpen = false;
    }
  }

  selectToday() {
    try {
      const today = new Date();
      if (this.isRangeMode) {
        this.selectRangeDate(today);
      } else {
        this.selectedDate = today;
        this.value = this.formatDateForOutput(today);
        this.onChange(this.value);
        this.dirty = true;
        this.generateCalendar();
      }
    } catch (error) {
      console.warn('Error selecting today:', error);
    }
  }

  clearDate() {
    if (this.isRangeMode) {
      this.dateRange = { start: null, end: null };
      this.value = [null, null];
    } else {
      this.selectedDate = null;
      this.value = null;
    }
    this.onChange(this.value);
    this.dirty = true;
    this.generateCalendar();
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  getCurrentMonthYear(): string {
    if (this.isArabic) {
      const months = [
        'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
      ];
      return `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    } else {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }
  }

  getDisplayValue(): string {
    if (!this.value) return '';

    try {
      if (this.isRangeMode && Array.isArray(this.value)) {
        const start = this.value[0] ? this.formatDateForDisplay(new Date(this.value[0])) : '';
        const end = this.value[1] ? this.formatDateForDisplay(new Date(this.value[1])) : '';
        return start && end ? `${start} - ${end}` : start || end;
      } else {
        const date = new Date(this.value);
        if (isNaN(date.getTime())) {
          return '';
        }
        return this.formatDateForDisplay(date);
      }
    } catch (error) {
      console.warn('Invalid date value:', this.value);
      return '';
    }
  }

  formatDateForDisplay(date: Date): string {
    if (this.isArabic) {
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }

  formatDateForOutput(date: Date): string {
    // Return ISO string to avoid timezone issues
    return date.toISOString().split('T')[0];
  }

  getPlaceholder(): string {
    if (this.isRangeMode) {
      return this.isArabic ? 'اختر نطاق التاريخ' : 'Select date range';
    }
    return this.isArabic ? 'اختر التاريخ' : 'Select date';
  }

  override onInputChange(event: any): void {
    const value = event.target?.value || '';
    this.value = value;
    this.onChange(value);
    this.onTouched();
    this.dirty = true;
  }

  override writeValue(value: any): void {
    super.writeValue(value);

    if (value) {
      try {
        if (this.isRangeMode && Array.isArray(value)) {
          // Range mode
          if (value[0]) {
            const startDate = new Date(value[0]);
            if (!isNaN(startDate.getTime())) {
              this.dateRange.start = startDate;
              this.currentDate = new Date(startDate);
            }
          }
          if (value[1]) {
            const endDate = new Date(value[1]);
            if (!isNaN(endDate.getTime())) {
              this.dateRange.end = endDate;
            }
          }
        } else {
          // Single date mode
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            this.selectedDate = date;
            this.currentDate = new Date(date);
          }
        }
        this.generateCalendar();
      } catch (error) {
        console.warn('Error writing value to calendar:', error);
      }
    } else {
      if (this.isRangeMode) {
        this.dateRange = { start: null, end: null };
      } else {
        this.selectedDate = null;
      }
      this.generateCalendar();
    }
  }

  override hasError(errorType: string): boolean {
    // Form control validation is handled by the base class
    return super.hasError(errorType);
  }
} 