import { Component, forwardRef, ElementRef, ViewChild, HostListener, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef, OnDestroy, Optional } from '@angular/core';
import { NG_VALUE_ACCESSOR, AbstractControl, FormsModule, NgControl } from '@angular/forms';
import { BaseFieldComponent } from './base-field.component';

interface FileWithProgress {
  file: File | any;
  type: string;
  content?: string;
  iconClass?: string;
  size: string;
  sizeBytes: number;
  name: string;
  progress: number;
  uploading: boolean;
  uploaded: boolean;
  error?: string;
  id: string;
  description: string;
}

interface UploadStats {
  total: number;
  uploaded: number;
  failed: number;
  uploading: number;
}

@Component({
  selector: 'lib-file-field',
  standalone: true,
  imports: [FormsModule],
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

      <div class="upload-container">
        <!-- Upload Statistics -->
        @if (selectedFiles.length > 0 && overallProgress !== 100) {
          <div class="mb-4">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium">Upload Progress</span>
              <span class="text-sm text-gray-500">
                {{ uploadStats.uploaded }}/{{ uploadStats.total }} files completed
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" [style.width.%]="overallProgress"></div>
            </div>
          </div>
        }
      
        <!-- Upload Area -->
        <div class="flex items-center justify-center w-full max-w-6xl mx-auto mb-6">
          <label
            [for]="'dropzone-file-' + field.name"
            class="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors"
            [class.h-28]="!field.multiple || selectedFiles.length === 0"
            [class.h-40]="field.multiple && selectedFiles.length > 0"
            [class.border-blue-400]="isUploading"
            [class.bg-blue-50]="isUploading"
            [class.border-green-400]="!field.multiple && selectedFiles.length > 0 && selectedFiles[0].uploaded"
            [class.bg-green-50]="!field.multiple && selectedFiles.length > 0 && selectedFiles[0].uploaded"
            (dragover)="onDragOver($event)"
            (dragleave)="onDragLeave($event)"
            (drop)="onDrop($event)"
          >
            <div class="flex flex-col items-center justify-center p-6">
              <!-- Single File Display -->
              @if (!field.multiple && selectedFiles.length > 0) {
                <div class="flex items-center gap-4 mb-4">
                  <!-- File Preview -->
                  <div class="flex-shrink-0">
                    @if (selectedFiles[0].type.includes('image') && selectedFiles[0].content) {
                      <img
                        class="h-16 w-16 object-cover rounded-lg border-2 border-gray-200 shadow-sm"
                        [src]="selectedFiles[0].content"
                        [alt]="selectedFiles[0].name"
                      />
                    } @else if (selectedFiles[0].type.includes('video') && selectedFiles[0].content) {
                      <video class="h-16 w-16 rounded-lg border-2 border-gray-200 shadow-sm" [poster]="selectedFiles[0].content">
                        <source [src]="selectedFiles[0].content" type="video/mp4" />
                      </video>
                    } @else if (selectedFiles[0].type.includes('audio') && selectedFiles[0].content) {
                      <div class="h-16 w-16 flex items-center justify-center bg-purple-100 rounded-lg border-2 border-gray-200 shadow-sm">
                        <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.5 13.5H2a1 1 0 01-1-1v-5a1 1 0 011-1h2.5l3.883-3.794a1 1 0 011.617.794zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    } @else {
                      <div class="h-16 w-16 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-gray-200 shadow-sm">
                        <svg class="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    }
                  </div>
                  
                  <!-- File Info -->
                  <div class="flex-1 min-w-0">
                    <div class="font-semibold text-sm text-gray-900 mb-1 truncate">{{ selectedFiles[0].name }}</div>
                    <div class="text-xs text-gray-500 mb-2">{{ selectedFiles[0].size }}</div>
                    
                    <!-- Status -->
                    @if (selectedFiles[0].uploading) {
                      <div class="flex items-center gap-2">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          <svg class="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </span>
                      </div>
                    } @else if (selectedFiles[0].uploaded) {
                      <div class="flex items-center gap-2">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                          Uploaded Successfully
                        </span>
                      </div>
                    } @else if (selectedFiles[0].error) {
                      <div class="flex items-center gap-2">
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                          </svg>
                          {{ selectedFiles[0].error }}
                        </span>
                      </div>
                    }
                  </div>
                  
                  <!-- Replace Button -->
                  <button 
                    type="button"
                    class="p-2 rounded-full hover:bg-gray-200 text-gray-600 transition-colors"
                    (click)="replaceFile()"
                    [disabled]="selectedFiles[0].uploading"
                    title="Replace File"
                  >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
                
                <!-- Progress Bar for Single File -->
                @if (selectedFiles[0].uploading || (selectedFiles[0].progress > 0 && selectedFiles[0].progress < 100)) {
                  <div class="w-full mb-4">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-xs text-gray-600">Upload Progress</span>
                      <span class="text-xs text-gray-600">{{ selectedFiles[0].progress }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" [style.width.%]="selectedFiles[0].progress"></div>
                    </div>
                  </div>
                }
                
                <p class="text-xs text-gray-500 text-center">
                  Click to replace file or drag and drop a new one
                </p>
              } @else {
                <!-- Default Upload State -->
                <svg
                  class="w-8 h-8 mb-4 text-gray-500"
                  [class.text-blue-500]="isUploading"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p class="mb-2 text-sm text-gray-500">
                  <span class="font-semibold">Click to upload</span> or drag and drop
                </p>
                @if (isUploading) {
                  <p class="text-xs text-gray-500">
                    Uploading {{ uploadStats.uploading }} file(s)...
                  </p>
                }
              }
            </div>
            <input
              [id]="'dropzone-file-' + field.name"
              type="file"
              class="hidden"
              [multiple]="field.multiple || false"
              [accept]="field.accept || '*'"
              (change)="onFilesSelected($event)"
              [disabled]="isUploading"
            />
          </label>
        </div>
      
        <!-- Files List (Only show for multiple files) -->
        @if (field.multiple && selectedFiles.length > 0) {
          <div class="flex flex-wrap p-2 gap-4 w-full max-h-[600px] overflow-y-auto relative grid md:grid-cols-2 lg:grid-cols-3">
            @for (file of selectedFiles; track file.id) {
              <div
                class="flex flex-col w-full relative p-3 border-solid border-[1px] rounded-lg transition-all duration-200"
                [class.border-gray-200]="!file.uploaded && !file.error"
                [class.border-green-300]="file.uploaded"
                [class.bg-green-50]="file.uploaded"
                [class.border-red-300]="file.error"
                [class.bg-red-50]="file.error"
                [class.border-blue-300]="file.uploading"
                [class.bg-blue-50]="file.uploading"
              >
                <!-- File Header -->
                <div class="flex items-center gap-3 max-w-full">
                  <!-- File Icon/Preview -->
                  <div class="card-image flex-shrink-0">
                    @if (file.type.includes('image') && file.content) {
                      <img
                        class="h-12 w-12 object-cover rounded border"
                        [src]="file.content"
                        [alt]="file.name"
                      />
                    } @else if (file.type.includes('video') && file.content) {
                      <video class="h-12 w-12 rounded border" [poster]="file.content">
                        <source [src]="file.content" type="video/mp4" />
                      </video>
                    } @else if (file.type.includes('audio') && file.content) {
                      <div class="h-12 w-12 flex items-center justify-center bg-purple-100 rounded border">
                        <svg class="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.794L4.5 13.5H2a1 1 0 01-1-1v-5a1 1 0 011-1h2.5l3.883-3.794a1 1 0 011.617.794zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    } @else {
                      <div class="h-12 w-12 flex items-center justify-center bg-gray-100 rounded border">
                        <svg class="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                        </svg>
                      </div>
                    }
                  </div>
      
                  <!-- File Info -->
                  <div class="flex-1">
                    <div class="font-semibold text-sm max-w-20 truncate mb-1">{{ file.name }}</div>
                    <div class="text-xs text-gray-500 mb-1">{{ file.size }}</div>
                    
                    <!-- Status -->
                    <div class="flex items-center gap-2">
                      @if (file.uploading) {
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                          <svg class="animate-spin -ml-1 mr-1 h-3 w-3 text-blue-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Uploading...
                        </span>
                      }
                      @if (file.uploaded) {
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                          </svg>
                          Uploaded
                        </span>
                      }
                      @if (file.error) {
                        <span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                          </svg>
                          {{ file.error }}
                        </span>
                      }
                    </div>
                  </div>
      
                  <!-- Actions -->
                  <div class="flex items-center gap-2">
                    @if (file.error) {
                      <button 
                        class="p-1 rounded-full hover:bg-blue-100 text-blue-600 transition-colors border-transparent cursor-pointer h-6 w-6 flex items-center justify-center"
                        (click)="retryUpload(file.id)"
                        title="Retry Upload"
                      >
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    }
                    
                    <button 
                      class="p-1 rounded-full hover:bg-green-100 text-green-600 transition-colors border-transparent cursor-pointer h-6 w-6 flex items-center justify-center"
                      (click)="downloadFile(file.id)"
                      [disabled]="file.uploading"
                      title="Download"
                    >
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                    
                    <button 
                      class="p-1 rounded-full hover:bg-red-100 text-red-600 transition-colors border-transparent cursor-pointer h-6 w-6 flex items-center justify-center"
                      (click)="removeFile(file.id)"
                      [disabled]="file.uploading"
                      title="Remove"
                    >
                      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                @if (field.description) {
                  <div class="mt-2 w-full">
                    <textarea class="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent" [(ngModel)]="file.description" rows="2" placeholder="Add description..."></textarea>
                  </div>
                }
                
                <!-- Progress Bar -->
                @if (file.uploading || (file.progress > 0 && file.progress < 100)) {
                  <div class="w-full mt-2">
                    <div class="flex justify-between items-center mb-1">
                      <span class="text-xs text-gray-600">Progress</span>
                      <span class="text-xs text-gray-600">{{ file.progress }}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                      <div class="bg-blue-600 h-2 rounded-full transition-all duration-300" [style.width.%]="file.progress"></div>
                    </div>
                  </div>
                }
      
                <!-- Audio Player for Audio Files -->
                @if (file.type.includes('audio') && file.content && file.uploaded) {
                  <div class="mt-3">
                    <audio controls class="w-full">
                      <source [src]="file.content" type="audio/mpeg" />
                      <source [src]="file.content" type="audio/ogg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                }
              </div>
            }
          </div>
        }
      </div>

      @if (showValidationMessages && hasError('required')) {
        <div class="field-error">{{ getErrorMessage() }}</div>
      }
    </div>
  `,
  styles: [`
    .upload-container {
      width: 100%;
    }
    
    .field-error {
      color: hsl(var(--er));
      font-size: 0.875rem;
      margin-top: 0.5rem;
    }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileFieldComponent),
      multi: true
    }
  ]
})
export class FileFieldComponent extends BaseFieldComponent implements OnChanges, OnDestroy {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @Input() isApi: boolean = true;
  @Input() isDescription: boolean = false;
  @Input() loadingExport: boolean = false;
  @Input() filesServer: any = [];
  @Input() apiUrl: string = '/api/upload'; // URL للـ API
  @Input() apiHeaders: any = {}; // Headers إضافية للـ API
  @Input() uploadData: any = {}; // بيانات إضافية للرفع
  @Output() onExportFiles: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUploadStart: EventEmitter<any> = new EventEmitter<any>(); // حدث بداية الرفع
  @Output() onUploadProgress: EventEmitter<any> = new EventEmitter<any>(); // حدث تقدم الرفع
  @Output() onUploadComplete: EventEmitter<any> = new EventEmitter<any>(); // حدث اكتمال الرفع
  @Output() onUploadError: EventEmitter<any> = new EventEmitter<any>(); // حدث خطأ في الرفع
  
  selectedFiles: FileWithProgress[] = [];
  files: { file: FileWithProgress, Result: any }[] = [];
  isDragOver = false;

  constructor(private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filesServer'] && changes['filesServer'].currentValue) {
      // Convert to array if single object
      const filesArray = Array.isArray(this.filesServer) ? this.filesServer : [this.filesServer];
      
      this.selectedFiles = filesArray.map((file: any) => ({
        file: file,
        type: file.mimeType || file.type,
        content: file.filePath || file.content,
        iconClass: this.getFileIconClass(file.mimeType || file.type),
        size: this.formatBytes(file.fileSize || file.size),
        sizeBytes: file.fileSize || file.size,
        name: file.originalFileName || file.name,
        progress: 100,
        uploading: false,
        uploaded: true,
        error: undefined,
        id: file.id?.toString() || this.generateId(),
        description: file.description || '',
      }));
      
      this.updateFormControl();
      this.cdr.detectChanges();
    }
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const newFiles: FileWithProgress[] = Array.from(input.files).map((file) => ({
        file: file,
        name: file.name,
        type: file.type,
        sizeBytes: file.size,
        size: this.formatBytes(file.size),
        iconClass: this.getFileIconClass(file.type),
        progress: 0,
        uploading: false,
        uploaded: false,
        id: this.generateId(),
        description: '',
      }));

      if (!this.field.multiple) {
        // For single file upload, replace the current file
        this.selectedFiles = [newFiles[0]];
        this.files = [];
      } else {
        // For multiple files, filter out duplicates and add new files
        const filteredFiles = newFiles.filter(
          (newFile) =>
            !this.selectedFiles.some(
              (existing) => existing.name === newFile.name
            )
        );
        this.selectedFiles = [...this.selectedFiles, ...filteredFiles];
      }

      if (this.isApi && newFiles.length > 0) {
        // Start uploading each file
        const filesToUpload = this.field.multiple ? newFiles : [newFiles[0]];
        filesToUpload.forEach((fileObj) => {
          if (fileObj && fileObj.id) {
            this.uploadFile(fileObj);
          }
        });
      } else {
        this.updateFormControl();
      }

      if (newFiles.length > 0) {
        this.readFiles(this.field.multiple ? newFiles : [newFiles[0]]);
      }
    }
  }

  uploadFile(fileObj: FileWithProgress): void {
    if (!fileObj || !fileObj.id) {
      console.error('Invalid file object or missing ID');
      return;
    }

    this.updateFileState(fileObj.id, { uploading: true, progress: 0, error: undefined });

    // Emit upload start event
    this.onUploadStart.emit({
      file: fileObj,
      timestamp: new Date().toISOString()
    });

    if (this.isApi) {
      // Real API upload
      this.uploadToApi(fileObj);
    } else {
      // Simulate upload progress (for demo/testing)
      this.simulateUpload(fileObj);
    }
  }

  private uploadToApi(fileObj: FileWithProgress): void {
    const formData = new FormData();
    formData.append('file', fileObj.file);
    
    // Add additional upload data
    Object.keys(this.uploadData).forEach(key => {
      formData.append(key, this.uploadData[key]);
    });

    // Add file metadata
    formData.append('fileName', fileObj.name);
    formData.append('fileType', fileObj.type);
    formData.append('fileSize', fileObj.sizeBytes.toString());
    formData.append('description', fileObj.description || '');

    // Create XMLHttpRequest for progress tracking
    const xhr = new XMLHttpRequest();

    // Progress event
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        this.updateFileState(fileObj.id, { progress });
        
        // Emit progress event
        this.onUploadProgress.emit({
          file: fileObj,
          progress,
          loaded: event.loaded,
          total: event.total,
          timestamp: new Date().toISOString()
        });
      }
    });

    // Load event (upload complete)
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          this.updateFileState(fileObj.id, {
            uploading: false,
            uploaded: true,
            progress: 100
          });

          // Create result data
          const resultData = {
            id: response.id || fileObj.id,
            originalFileName: fileObj.name,
            mimeType: fileObj.type,
            fileSize: fileObj.sizeBytes,
            filePath: response.filePath || response.url || '',
            description: fileObj.description || '',
            uploadedAt: new Date().toISOString(),
            serverResponse: response
          };

          // Add to files array
          this.files.push({ file: fileObj, Result: resultData });

          // Emit upload complete event
          this.onUploadComplete.emit({
            file: fileObj,
            result: resultData,
            response: response,
            timestamp: new Date().toISOString()
          });

          this.updateFormControl();
        } catch (error) {
          this.handleUploadError(fileObj, 'Invalid response format');
        }
      } else {
        this.handleUploadError(fileObj, `HTTP Error: ${xhr.status}`);
      }
    });

    // Error event
    xhr.addEventListener('error', () => {
      this.handleUploadError(fileObj, 'Network error');
    });

    // Abort event
    xhr.addEventListener('abort', () => {
      this.handleUploadError(fileObj, 'Upload cancelled');
    });

    // Open and send request
    xhr.open('POST', this.apiUrl);
    
    // Set headers
    Object.keys(this.apiHeaders).forEach(key => {
      xhr.setRequestHeader(key, this.apiHeaders[key]);
    });

    xhr.send(formData);
  }

  private simulateUpload(fileObj: FileWithProgress): void {
    // Simulate upload progress
    const interval = setInterval(() => {
      const currentFile = this.selectedFiles.find(f => f.id === fileObj.id);
      if (currentFile && currentFile.progress < 90) {
        const newProgress = currentFile.progress + 10;
        this.updateFileState(fileObj.id, { progress: newProgress });
        
        // Emit progress event
        this.onUploadProgress.emit({
          file: fileObj,
          progress: newProgress,
          loaded: newProgress,
          total: 100,
          timestamp: new Date().toISOString()
        });
      } else {
        clearInterval(interval);
        // Simulate upload completion
        setTimeout(() => {
          this.updateFileState(fileObj.id, {
            uploading: false,
            uploaded: true,
            progress: 100
          });

          // Create simulated result data
          const resultData = {
            id: fileObj.id,
            originalFileName: fileObj.name,
            mimeType: fileObj.type,
            fileSize: fileObj.sizeBytes,
            filePath: `uploads/${fileObj.name}`,
            description: fileObj.description || '',
            uploadedAt: new Date().toISOString(),
            serverResponse: { success: true, message: 'File uploaded successfully' }
          };

          // Add to files array
          this.files.push({ file: fileObj, Result: resultData });

          // Emit upload complete event
          this.onUploadComplete.emit({
            file: fileObj,
            result: resultData,
            response: resultData.serverResponse,
            timestamp: new Date().toISOString()
          });

          this.updateFormControl();
        }, 500);
      }
    }, 200);
  }

  private handleUploadError(fileObj: FileWithProgress, errorMessage: string): void {
    this.updateFileState(fileObj.id, {
      uploading: false,
      uploaded: false,
      error: errorMessage
    });

    // Emit upload error event
    this.onUploadError.emit({
      file: fileObj,
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
  }

  updateFileState(fileId: string, updates: Partial<FileWithProgress>): void {
    if (!fileId) {
      console.error('File ID is required for updateFileState');
      return;
    }
    
    this.selectedFiles = this.selectedFiles.map(file =>
      file.id === fileId ? { ...file, ...updates } : file
    );
    this.cdr.detectChanges();
  }

  generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }

  getFileIconClass(type: string): string {
    type = type.toLowerCase();
    if (type.includes("excel") || type.includes("spreadsheetml")) {
      return "pi pi-file-excel text-green-600";
    } else if (type.includes("pdf")) {
      return "pi pi-file-pdf text-red-600";
    } else if (type.includes("image")) {
      return "pi pi-image text-blue-500";
    } else if (type.includes("zip") || type.includes("compressed")) {
      return "pi pi-folder text-yellow-600";
    } else if (type.includes("msword") || type.includes("wordprocessingml")) {
      return "pi pi-file-word text-blue-600";
    } else if (type.includes("text")) {
      return "pi pi-file text-gray-600";
    } else if (type.includes("audio")) {
      return "pi pi-volume-up text-purple-600";
    } else if (type.includes("video")) {
      return "pi pi-video text-indigo-600";
    } else {
      return "pi pi-file text-gray-400";
    }
  }

  readFiles(files: FileWithProgress[]): void {
    if (!files || files.length === 0) {
      return;
    }

    files.forEach((fileObj) => {
      if (fileObj && fileObj.id && fileObj.type && 
          (fileObj.type.startsWith('image/') || fileObj.type.startsWith('video/') || fileObj.type.startsWith('audio/'))) {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            this.updateFileState(fileObj.id, { content: e.target.result as string });
          }
        };
        reader.readAsDataURL(fileObj.file);
      }
    });
  }

  updateFormControl(): void {
    // Extract filePath from files
    const files = this.files
      .filter(f => f.Result && f.Result)
      .map(f => f.Result);
    
    // Return single object if multiple = false, array if multiple = true
    const value = this.field.multiple ? files : (files.length > 0 ? files[0] : null);
    this.onChange(value);
    this.onTouched();
  }

  removeFile(fileId: string): void {
    if (!fileId) {
      console.error('File ID is required for removeFile');
      return;
    }

    const fileIndex = this.selectedFiles.findIndex(f => f.id === fileId);
    if (fileIndex !== -1) {
      this.selectedFiles.splice(fileIndex, 1);
      this.files.splice(fileIndex, 1);
      this.updateFormControl();
    }
  }

  retryUpload(fileId: string): void {
    const fileObj = this.selectedFiles.find(f => f.id === fileId);
    if (fileObj) {
      // Clear error and start upload again
      this.updateFileState(fileId, {
        error: undefined,
        progress: 0,
        uploading: false,
        uploaded: false
      });
      
      // Start upload again
      this.uploadFile(fileObj);
    }
  }

  // Method to cancel upload
  cancelUpload(fileId: string): void {
    const fileObj = this.selectedFiles.find(f => f.id === fileId);
    if (fileObj && fileObj.uploading) {
      // Remove file from selected files
      this.selectedFiles = this.selectedFiles.filter(f => f.id !== fileId);
      this.updateFormControl();
    }
  }

  // Method to get upload status
  getUploadStatus(): any {
    return {
      totalFiles: this.selectedFiles.length,
      uploadedFiles: this.selectedFiles.filter(f => f.uploaded).length,
      uploadingFiles: this.selectedFiles.filter(f => f.uploading).length,
      errorFiles: this.selectedFiles.filter(f => f.error).length,
      files: this.selectedFiles.map(file => ({
        id: file.id,
        name: file.name,
        status: file.uploaded ? 'uploaded' : file.uploading ? 'uploading' : file.error ? 'error' : 'pending',
        progress: file.progress,
        error: file.error
      }))
    };
  }

  replaceFile(): void {
    if (!this.field.multiple && this.selectedFiles.length > 0) {
      // Remove the current file
      this.selectedFiles = [];
      this.files = [];
      this.updateFormControl();
      
      // Trigger file input click
      const fileInput = document.getElementById(`dropzone-file-${this.field.name}`) as HTMLInputElement;
      if (fileInput) {
        fileInput.click();
      }
    }
  }

  formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  downloadFile(fileId: string): void {
    if (!fileId) {
      console.error('File ID is required for downloadFile');
      return;
    }

    const fileObj = this.selectedFiles.find(f => f.id === fileId);
    if (fileObj && fileObj.file) {
      if (fileObj.content) {
        const blob = this.base64ToBlob(fileObj.content, fileObj.type);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileObj.name;
        link.click();
        URL.revokeObjectURL(url);
      } else {
        const url = URL.createObjectURL(fileObj.file);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileObj.name;
        link.click();
        URL.revokeObjectURL(url);
      }
    }
  }

  base64ToBlob(base64: string, type: string): Blob {
    if (!base64 || !type) {
      console.error('Base64 data and type are required for base64ToBlob');
      return new Blob();
    }

    try {
      const byteString = atob(base64.split(",")[1]);
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const uintArray = new Uint8Array(arrayBuffer);
      for (let i = 0; i < byteString.length; i++) {
        uintArray[i] = byteString.charCodeAt(i);
      }
      return new Blob([uintArray], { type });
    } catch (error) {
      console.error('Error converting base64 to blob:', error);
      return new Blob();
    }
  }

  get overallProgress(): number {
    if (this.selectedFiles.length === 0) return 0;
    const totalProgress = this.selectedFiles.reduce((sum, file) => sum + file.progress, 0);
    return Math.round(totalProgress / this.selectedFiles.length);
  }

  get isUploading(): boolean {
    return this.selectedFiles.some(file => file.uploading);
  }

  get uploadStats(): UploadStats {
    const total = this.selectedFiles.length;
    const uploaded = this.selectedFiles.filter(f => f.uploaded).length;
    const failed = this.selectedFiles.filter(f => f.error).length;
    const uploading = this.selectedFiles.filter(f => f.uploading).length;

    return { total, uploaded, failed, uploading };
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const fileEvent = { target: { files } } as any;
      this.onFilesSelected(fileEvent);
    }
  }

  override hasError(errorType: string): boolean {
    return this.control?.hasError(errorType) || false;
  }

  override getErrorMessage(errorType?: string): string {
    if (this.control?.hasError(errorType || 'required')) {
      return this.field.validations?.find(v => v.type === (errorType || 'required'))?.message || 'This field is required';
    }
    return '';
  }

  ngOnDestroy(): void {
    this.selectedFiles = [];
    this.files = [];
    const value = this.field.multiple ? [] : null;
    this.onChange(value);
  }
}