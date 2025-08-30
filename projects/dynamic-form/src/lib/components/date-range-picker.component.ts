import { Component, forwardRef, OnInit, OnDestroy, HostListener, Input } from '@angular/core';
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
  isHovered: boolean;
}

interface DateRange {
  start: Date | null;
  end: Date | null;
}

interface PresetRange {
  label: string;
  start: Date;
  end: Date;
}

@Component({
  selector: 'lib-date-range-picker',
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

      <div class="date-range-wrapper">
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
            (click)="togglePicker()"
            (input)="onInputChange($event)"
            (blur)="onBlur()"
            class="field-input date-range-input"
            [class.has-prefix]="field.prefixIcon"
            [class.has-suffix]="field.suffixIcon"
            [class.is-invalid]="isFieldInvalid()"
            [class.is-valid]="isFieldValid()"
            [placeholder]="getPlaceholder()"
          />
          
          @if (field.suffixIcon) {
            <i [class]="field.suffixIcon" class="suffix-icon"></i>
          } @else {
            <i class="fas fa-calendar-alt suffix-icon calendar-icon" (click)="togglePicker()"></i>
          }
        </div>

        @if (isPickerOpen) {
          <div class="date-range-dropdown">
            <!-- Preset Ranges -->
            <div class="preset-ranges">
              <div class="preset-title">{{ isArabic ? 'فترات سريعة' : 'Quick Ranges' }}</div>
              <div class="preset-buttons">
                @for (preset of presetRanges; track preset.label) {
                  <button 
                    type="button" 
                    class="preset-btn"
                    (click)="selectPresetRange(preset)"
                    [class.active]="isPresetActive(preset)"
                  >
                    {{ preset.label }}
                  </button>
                }
              </div>
            </div>

            <!-- Calendar Container -->
            <div class="calendar-container">
              <!-- Left Calendar -->
              <div class="calendar-panel">
                <div class="calendar-header">
                  <button type="button" class="nav-btn" (click)="previousMonth('left')">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <div class="current-month">
                    {{ getCurrentMonthYear('left') }}
                  </div>
                  <button type="button" class="nav-btn" (click)="nextMonth('left')">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </div>

                <div class="calendar-weekdays">
                  <div class="weekday" *ngFor="let day of weekDays">{{ day }}</div>
                </div>

                <div class="calendar-days">
                  <div 
                    *ngFor="let day of leftCalendarDays" 
                    class="calendar-day"
                    [class.other-month]="!day.isCurrentMonth"
                    [class.today]="day.isToday"
                    [class.selected]="day.isSelected"
                    [class.in-range]="day.isInRange"
                    [class.range-start]="day.isRangeStart"
                    [class.range-end]="day.isRangeEnd"
                    [class.disabled]="day.isDisabled"
                    [class.hovered]="day.isHovered"
                    (click)="selectDate(day, 'left')"
                    (mouseenter)="onDayHover(day, 'left')"
                    (mouseleave)="onDayLeave()"
                  >
                    {{ day.day }}
                  </div>
                </div>
              </div>

              <!-- Right Calendar -->
              <div class="calendar-panel">
                <div class="calendar-header">
                  <button type="button" class="nav-btn" (click)="previousMonth('right')">
                    <i class="fas fa-chevron-left"></i>
                  </button>
                  <div class="current-month">
                    {{ getCurrentMonthYear('right') }}
                  </div>
                  <button type="button" class="nav-btn" (click)="nextMonth('right')">
                    <i class="fas fa-chevron-right"></i>
                  </button>
                </div>

                <div class="calendar-weekdays">
                  <div class="weekday" *ngFor="let day of weekDays">{{ day }}</div>
                </div>

                <div class="calendar-days">
                  <div 
                    *ngFor="let day of rightCalendarDays" 
                    class="calendar-day"
                    [class.other-month]="!day.isCurrentMonth"
                    [class.today]="day.isToday"
                    [class.selected]="day.isSelected"
                    [class.in-range]="day.isInRange"
                    [class.range-start]="day.isRangeStart"
                    [class.range-end]="day.isRangeEnd"
                    [class.disabled]="day.isDisabled"
                    [class.hovered]="day.isHovered"
                    (click)="selectDate(day, 'right')"
                    (mouseenter)="onDayHover(day, 'right')"
                    (mouseleave)="onDayLeave()"
                  >
                    {{ day.day }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="date-range-footer">
              <div class="range-display">
                <div class="range-item">
                  <span class="range-label">{{ isArabic ? 'من' : 'From' }}:</span>
                  <span class="range-value" [class.selected]="selectedRange.start">{{ getRangeStartDisplay() }}</span>
                </div>
                <div class="range-item">
                  <span class="range-label">{{ isArabic ? 'إلى' : 'To' }}:</span>
                  <span class="range-value" [class.selected]="selectedRange.end">{{ getRangeEndDisplay() }}</span>
                </div>
              </div>
              <div class="footer-buttons">
                <button type="button" class="clear-btn" (click)="clearRange()">
                  {{ isArabic ? 'مسح' : 'Clear' }}
                </button>
                <button type="button" class="apply-btn" (click)="applyRange()" [disabled]="!isRangeComplete()">
                  {{ isArabic ? 'تطبيق' : 'Apply' }}
                </button>
              </div>
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
    .date-range-wrapper {
      position: relative;
    }

    .date-range-input {
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

    .date-range-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 1000;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      margin-top: 4px;
      min-width: 600px;
      max-width: 700px;
    }

    .preset-ranges {
      padding: 16px;
      border-bottom: 1px solid #f3f4f6;
      background: #f9fafb;
      border-radius: 12px 12px 0 0;
    }

    .preset-title {
      font-weight: 600;
      color: #374151;
      margin-bottom: 12px;
      font-size: 14px;
    }

    .preset-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .preset-btn {
      background: white;
      border: 1px solid #d1d5db;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.2s;
      color: #374151;
    }

    .preset-btn:hover {
      background: #f3f4f6;
      border-color: #9ca3af;
    }

    .preset-btn.active {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .calendar-container {
      display: flex;
      gap: 0;
    }

    .calendar-panel {
      flex: 1;
      padding: 16px;
    }

    .calendar-panel:first-child {
      border-right: 1px solid #f3f4f6;
    }

    .calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 0 12px 0;
      margin-bottom: 8px;
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
      border-radius: 6px;
      margin-bottom: 8px;
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
      position: relative;
    }

    .calendar-day.in-range:not(.range-start):not(.range-end) {
      border-radius: 0;
    }

    .calendar-day.range-start {
      background: #3b82f6;
      color: white;
      font-weight: 600;
      border-radius: 6px 0 0 6px;
      position: relative;
    }

    .calendar-day.range-end {
      background: #3b82f6;
      color: white;
      font-weight: 600;
      border-radius: 0 6px 6px 0;
      position: relative;
    }

    .calendar-day.range-start.range-end {
      border-radius: 6px;
    }

    .calendar-day.hovered {
      background: #bfdbfe;
      color: #1e40af;
    }

    .calendar-day.disabled {
      color: #d1d5db;
      cursor: not-allowed;
    }

    .date-range-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px;
      border-top: 1px solid #f3f4f6;
      background: #f9fafb;
      border-radius: 0 0 12px 12px;
    }

    .range-display {
      display: flex;
      gap: 16px;
    }

    .range-item {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .range-label {
      font-size: 12px;
      color: #6b7280;
      font-weight: 500;
    }

    .range-value {
      font-size: 14px;
      color: #374151;
      font-weight: 600;
    }

    .range-value.selected {
      color: #3b82f6;
    }

    .footer-buttons {
      display: flex;
      gap: 8px;
    }

    .clear-btn, .apply-btn {
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      transition: all 0.2s;
      border: 1px solid #d1d5db;
    }

    .clear-btn {
      background: white;
      color: #6b7280;
    }

    .clear-btn:hover {
      background: #f3f4f6;
      color: #374151;
    }

    .apply-btn {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .apply-btn:hover:not(:disabled) {
      background: #2563eb;
    }

    .apply-btn:disabled {
      background: #9ca3af;
      cursor: not-allowed;
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

    .date-range-dropdown {
      animation: slideIn 0.3s ease-out;
    }

    /* RTL Support */
    [dir="rtl"] .calendar-day.range-start {
      border-radius: 0 6px 6px 0;
    }

    [dir="rtl"] .calendar-day.range-end {
      border-radius: 6px 0 0 6px;
    }

    [dir="rtl"] .calendar-panel:first-child {
      border-right: none;
      border-left: 1px solid #f3f4f6;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateRangePickerComponent),
      multi: true
    }
  ]
})
export class DateRangePickerComponent extends BaseFieldComponent implements OnInit, OnDestroy {
  @Input() presetRanges: PresetRange[] = [];
  
  isPickerOpen = false;
  leftCurrentDate = new Date();
  rightCurrentDate = new Date();
  selectedRange: DateRange = { start: null, end: null };
  hoveredDate: Date | null = null;
  leftCalendarDays: CalendarDay[] = [];
  rightCalendarDays: CalendarDay[] = [];
  isArabic = true;
  
  private weekDaysAr = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];
  private weekDaysEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.date-range-wrapper')) {
      this.isPickerOpen = false;
    }
  }

  ngOnInit() {
    // Initialize preset ranges if not provided
    if (this.presetRanges.length === 0) {
      this.initializePresetRanges();
    }
    
    // Detect language
    this.isArabic = this.detectLanguage();
    
    // Initialize right calendar to next month
    this.rightCurrentDate = new Date(this.leftCurrentDate);
    this.rightCurrentDate.setMonth(this.rightCurrentDate.getMonth() + 1);
    
    // Initialize selected range from value if available
    if (this.value && Array.isArray(this.value)) {
      try {
        if (this.value[0]) {
          const startDate = new Date(this.value[0]);
          if (!isNaN(startDate.getTime())) {
            this.selectedRange.start = startDate;
            this.leftCurrentDate = new Date(startDate);
            // Set right calendar to next month after start date
            this.rightCurrentDate = new Date(startDate);
            this.rightCurrentDate.setMonth(this.rightCurrentDate.getMonth() + 1);
          }
        }
        if (this.value[1]) {
          const endDate = new Date(this.value[1]);
          if (!isNaN(endDate.getTime())) {
            this.selectedRange.end = endDate;
          }
        }
      } catch (error) {
        console.warn('Error initializing date range with value:', error);
      }
    }
    
    this.generateCalendars();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  detectLanguage(): boolean {
    if (this.field.dateType === 'hijri') return true;
    if (this.field.dateType === 'gregorian') return false;
    
    return document.documentElement.dir === 'rtl' || 
           document.documentElement.lang === 'ar' ||
           navigator.language.startsWith('ar') ||
           this.field.language === 'ar';
  }

  get weekDays(): string[] {
    return this.isArabic ? this.weekDaysAr : this.weekDaysEn;
  }

  initializePresetRanges() {
    const today = new Date();
    this.presetRanges = [
      {
        label: this.isArabic ? 'اليوم' : 'Today',
        start: new Date(today),
        end: new Date(today)
      },
      {
        label: this.isArabic ? 'أمس' : 'Yesterday',
        start: new Date(today.getTime() - 24 * 60 * 60 * 1000),
        end: new Date(today.getTime() - 24 * 60 * 60 * 1000)
      },
      {
        label: this.isArabic ? 'آخر 7 أيام' : 'Last 7 Days',
        start: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000),
        end: new Date(today)
      },
      {
        label: this.isArabic ? 'آخر 30 يوم' : 'Last 30 Days',
        start: new Date(today.getTime() - 29 * 24 * 60 * 60 * 1000),
        end: new Date(today)
      },
      {
        label: this.isArabic ? 'هذا الشهر' : 'This Month',
        start: new Date(today.getFullYear(), today.getMonth(), 1),
        end: new Date(today.getFullYear(), today.getMonth() + 1, 0)
      },
      {
        label: this.isArabic ? 'الشهر الماضي' : 'Last Month',
        start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        end: new Date(today.getFullYear(), today.getMonth(), 0)
      }
    ];
  }

  togglePicker() {
    this.isPickerOpen = !this.isPickerOpen;
  }

  generateCalendars() {
    this.leftCalendarDays = this.generateCalendarDays(this.leftCurrentDate);
    this.rightCalendarDays = this.generateCalendarDays(this.rightCurrentDate);
  }

  generateCalendarDays(currentDate: Date): CalendarDay[] {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days: CalendarDay[] = [];
    
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
        isDisabled: this.isDisabled(date),
        isHovered: this.isHovered(date)
      };
      
      days.push(day);
    }
    
    return days;
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  isSelected(date: Date): boolean {
    return this.isRangeStart(date) || this.isRangeEnd(date);
  }

  isInRange(date: Date): boolean {
    if (!this.selectedRange.start || !this.selectedRange.end) {
      // Show hover range
      if (this.selectedRange.start && this.hoveredDate) {
        const start = this.selectedRange.start;
        const end = this.hoveredDate;
        const minDate = start < end ? start : end;
        const maxDate = start < end ? end : start;
        return date >= minDate && date <= maxDate;
      }
      return false;
    }
    return date >= this.selectedRange.start && date <= this.selectedRange.end;
  }

  isRangeStart(date: Date): boolean {
    if (!this.selectedRange.start) return false;
    return date.toDateString() === this.selectedRange.start.toDateString();
  }

  isRangeEnd(date: Date): boolean {
    if (!this.selectedRange.end) return false;
    return date.toDateString() === this.selectedRange.end.toDateString();
  }

  isHovered(date: Date): boolean {
    if (!this.hoveredDate) return false;
    return date.toDateString() === this.hoveredDate.toDateString();
  }

  isDisabled(date: Date): boolean {
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

  selectDate(day: CalendarDay, calendar: 'left' | 'right') {
    if (day.isDisabled) return;
    
    try {
      if (!this.selectedRange.start || (this.selectedRange.start && this.selectedRange.end)) {
        // Start new range
        this.selectedRange = { start: day.date, end: null };
        this.hoveredDate = null;
      } else {
        // Complete range - allow selecting any date (start or end)
        if (day.date.getTime() === this.selectedRange.start.getTime()) {
          // Same date selected - clear end date
          this.selectedRange.end = null;
        } else {
          // Different date selected - set as end date
          this.selectedRange.end = day.date;
        }
        this.hoveredDate = null;
      }
      
      this.generateCalendars();
    } catch (error) {
      console.warn('Error selecting date:', error);
    }
  }

  onDayHover(day: CalendarDay, calendar: 'left' | 'right') {
    if (this.selectedRange.start && !this.selectedRange.end && !day.isDisabled) {
      this.hoveredDate = day.date;
      this.generateCalendars();
    }
  }

  onDayLeave() {
    this.hoveredDate = null;
    this.generateCalendars();
  }

  selectPresetRange(preset: PresetRange) {
    this.selectedRange = {
      start: new Date(preset.start),
      end: new Date(preset.end)
    };
    
    // Set left calendar to start date month
    this.leftCurrentDate = new Date(preset.start);
    // Set right calendar to next month after start date
    this.rightCurrentDate = new Date(preset.start);
    this.rightCurrentDate.setMonth(this.rightCurrentDate.getMonth() + 1);
    
    this.hoveredDate = null;
    this.generateCalendars();
  }

  isPresetActive(preset: PresetRange): boolean {
    if (!this.selectedRange.start || !this.selectedRange.end) return false;
    return this.selectedRange.start.toDateString() === preset.start.toDateString() &&
           this.selectedRange.end.toDateString() === preset.end.toDateString();
  }

  previousMonth(calendar: 'left' | 'right') {
    if (calendar === 'left') {
      this.leftCurrentDate.setMonth(this.leftCurrentDate.getMonth() - 1);
      // Keep right calendar one month ahead
      this.rightCurrentDate = new Date(this.leftCurrentDate);
      this.rightCurrentDate.setMonth(this.rightCurrentDate.getMonth() + 1);
    } else {
      this.rightCurrentDate.setMonth(this.rightCurrentDate.getMonth() - 1);
      // Keep left calendar one month behind
      this.leftCurrentDate = new Date(this.rightCurrentDate);
      this.leftCurrentDate.setMonth(this.leftCurrentDate.getMonth() - 1);
    }
    this.generateCalendars();
  }

  nextMonth(calendar: 'left' | 'right') {
    if (calendar === 'left') {
      this.leftCurrentDate.setMonth(this.leftCurrentDate.getMonth() + 1);
      // Keep right calendar one month ahead
      this.rightCurrentDate = new Date(this.leftCurrentDate);
      this.rightCurrentDate.setMonth(this.rightCurrentDate.getMonth() + 1);
    } else {
      this.rightCurrentDate.setMonth(this.rightCurrentDate.getMonth() + 1);
      // Keep left calendar one month behind
      this.leftCurrentDate = new Date(this.rightCurrentDate);
      this.leftCurrentDate.setMonth(this.leftCurrentDate.getMonth() - 1);
    }
    this.generateCalendars();
  }

  getCurrentMonthYear(calendar: 'left' | 'right'): string {
    const currentDate = calendar === 'left' ? this.leftCurrentDate : this.rightCurrentDate;
    
    if (this.isArabic) {
      const months = [
        'يناير', 'فبراير', 'مارس', 'إبريل', 'مايو', 'يونيو',
        'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
      ];
      return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    } else {
      const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
      ];
      return `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    }
  }

  getDisplayValue(): string {
    if (!this.selectedRange.start && !this.selectedRange.end) return '';
    
    const start = this.selectedRange.start ? this.formatDateForDisplay(this.selectedRange.start) : '';
    const end = this.selectedRange.end ? this.formatDateForDisplay(this.selectedRange.end) : '';
    
    if (start && end) {
      return `${start} - ${end}`;
    } else if (start) {
      return `${start} ${this.isArabic ? '(اختر تاريخ النهاية)' : '(select end date)'}`;
    }
    return '';
  }

  getRangeStartDisplay(): string {
    return this.selectedRange.start ? this.formatDateForDisplay(this.selectedRange.start) : this.isArabic ? 'غير محدد' : 'Not set';
  }

  getRangeEndDisplay(): string {
    if (this.selectedRange.end) {
      return this.formatDateForDisplay(this.selectedRange.end);
    } else if (this.selectedRange.start) {
      return this.isArabic ? 'اختر تاريخ النهاية' : 'Select end date';
    } else {
      return this.isArabic ? 'غير محدد' : 'Not set';
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
    return date.toISOString().split('T')[0];
  }

  getPlaceholder(): string {
    return this.isArabic ? 'اختر نطاق التاريخ' : 'Select date range';
  }

  clearRange() {
    this.selectedRange = { start: null, end: null };
    this.hoveredDate = null;
    
    // Reset calendars to current month and next month
    const today = new Date();
    this.leftCurrentDate = new Date(today);
    this.rightCurrentDate = new Date(today);
    this.rightCurrentDate.setMonth(this.rightCurrentDate.getMonth() + 1);
    
    this.generateCalendars();
  }

  applyRange() {
    if (!this.isRangeComplete()) return;
    
    this.value = [
      this.selectedRange.start ? this.formatDateForOutput(this.selectedRange.start) : null,
      this.selectedRange.end ? this.formatDateForOutput(this.selectedRange.end) : null
    ];
    this.onChange(this.value);
    this.dirty = true;
    this.isPickerOpen = false;
  }

  isRangeComplete(): boolean {
    return !!(this.selectedRange.start && this.selectedRange.end && 
              this.selectedRange.start.getTime() !== this.selectedRange.end.getTime());
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
    
    if (value && Array.isArray(value)) {
      try {
        if (value[0]) {
          const startDate = new Date(value[0]);
          if (!isNaN(startDate.getTime())) {
            this.selectedRange.start = startDate;
            this.leftCurrentDate = new Date(startDate);
            // Set right calendar to next month after start date
            this.rightCurrentDate = new Date(startDate);
            this.rightCurrentDate.setMonth(this.rightCurrentDate.getMonth() + 1);
          }
        }
        if (value[1]) {
          const endDate = new Date(value[1]);
          if (!isNaN(endDate.getTime())) {
            this.selectedRange.end = endDate;
          }
        }
        this.generateCalendars();
      } catch (error) {
        console.warn('Error writing value to date range picker:', error);
      }
    } else {
      this.selectedRange = { start: null, end: null };
      this.generateCalendars();
    }
  }

  override hasError(errorType: string): boolean {
    return super.hasError(errorType);
  }
} 