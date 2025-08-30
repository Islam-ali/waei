import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageService } from '../../../core/services/storage.service';

@Component({
  selector: 'app-storage-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="storage-demo">
      <h3>Storage Demo</h3>
      
      <div class="storage-section">
        <h4>Local Storage</h4>
        <div class="input-group">
          <input [(ngModel)]="localKey" placeholder="Key" class="form-input">
          <input [(ngModel)]="localValue" placeholder="Value" class="form-input">
          <button (click)="setLocalItem()" class="btn btn-primary">Set Local</button>
        </div>
        <div class="input-group">
          <input [(ngModel)]="localGetKey" placeholder="Key to get" class="form-input">
          <button (click)="getLocalItem()" class="btn btn-secondary">Get Local</button>
          <span *ngIf="localResult" class="result">Result: {{ localResult }}</span>
        </div>
        <button (click)="clearLocal()" class="btn btn-danger">Clear Local</button>
        <p>Local Storage Size: {{ getLocalSize() }} bytes</p>
      </div>

      <div class="storage-section">
        <h4>Session Storage</h4>
        <div class="input-group">
          <input [(ngModel)]="sessionKey" placeholder="Key" class="form-input">
          <input [(ngModel)]="sessionValue" placeholder="Value" class="form-input">
          <button (click)="setSessionItem()" class="btn btn-primary">Set Session</button>
        </div>
        <div class="input-group">
          <input [(ngModel)]="sessionGetKey" placeholder="Key to get" class="form-input">
          <button (click)="getSessionItem()" class="btn btn-secondary">Get Session</button>
          <span *ngIf="sessionResult" class="result">Result: {{ sessionResult }}</span>
        </div>
        <button (click)="clearSession()" class="btn btn-danger">Clear Session</button>
        <p>Session Storage Size: {{ getSessionSize() }} bytes</p>
      </div>

      <div class="storage-section">
        <h4>Storage Info</h4>
        <p>Local Storage Supported: {{ isLocalSupported() ? 'Yes' : 'No' }}</p>
        <p>Session Storage Supported: {{ isSessionSupported() ? 'Yes' : 'No' }}</p>
        <p>Local Storage Keys: {{ getLocalKeys().join(', ') || 'None' }}</p>
        <p>Session Storage Keys: {{ getSessionKeys().join(', ') || 'None' }}</p>
      </div>
    </div>
  `,
  styles: [`
    .storage-demo {
      padding: 1rem;
      background: #f8f9fa;
      border-radius: 8px;
      margin: 1rem 0;
    }

    .storage-section {
      margin-bottom: 2rem;
      padding: 1rem;
      background: white;
      border-radius: 6px;
      border: 1px solid #e9ecef;
    }

    .input-group {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .form-input {
      padding: 0.5rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      flex: 1;
      min-width: 120px;
    }

    .btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-danger {
      background: #dc3545;
      color: white;
    }

    .result {
      margin-left: 1rem;
      padding: 0.25rem 0.5rem;
      background: #e9ecef;
      border-radius: 4px;
      font-family: monospace;
    }

    h3, h4 {
      margin-top: 0;
      color: #333;
    }

    p {
      margin: 0.5rem 0;
      color: #666;
    }
  `]
})
export class StorageDemoComponent {
  // Local Storage
  localKey: string = '';
  localValue: string = '';
  localGetKey: string = '';
  localResult: any = null;

  // Session Storage
  sessionKey: string = '';
  sessionValue: string = '';
  sessionGetKey: string = '';
  sessionResult: any = null;

  constructor(private storageService: StorageService) {}

  // Local Storage Methods
  setLocalItem(): void {
    if (this.localKey && this.localValue) {
      this.storageService.setLocalItem(this.localKey, this.localValue);
      this.localKey = '';
      this.localValue = '';
    }
  }

  getLocalItem(): void {
    if (this.localGetKey) {
      this.localResult = this.storageService.getLocalItem(this.localGetKey);
    }
  }

  clearLocal(): void {
    this.storageService.clearLocal();
    this.localResult = null;
  }

  getLocalSize(): number {
    return this.storageService.getLocalSize();
  }

  getLocalKeys(): string[] {
    return this.storageService.getLocalKeys();
  }

  isLocalSupported(): boolean {
    return this.storageService.isSupported('local');
  }

  // Session Storage Methods
  setSessionItem(): void {
    if (this.sessionKey && this.sessionValue) {
      this.storageService.setSessionItem(this.sessionKey, this.sessionValue);
      this.sessionKey = '';
      this.sessionValue = '';
    }
  }

  getSessionItem(): void {
    if (this.sessionGetKey) {
      this.sessionResult = this.storageService.getSessionItem(this.sessionGetKey);
    }
  }

  clearSession(): void {
    this.storageService.clearSession();
    this.sessionResult = null;
  }

  getSessionSize(): number {
    return this.storageService.getSessionSize();
  }

  getSessionKeys(): string[] {
    return this.storageService.getSessionKeys();
  }

  isSessionSupported(): boolean {
    return this.storageService.isSupported('session');
  }
} 