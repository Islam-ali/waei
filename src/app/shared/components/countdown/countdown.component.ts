import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-countdown',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.scss'
})
export class CountdownComponent implements OnInit {
  @Input() countdown: number = 0;
  countdown$ = new BehaviorSubject<number>(0);
  canResend$ = new BehaviorSubject<boolean>(false);
  private destroy$ = new Subject<void>();
  private reset$ = new Subject<number>();
  private cdr = inject(ChangeDetectorRef);
  private countdownTimer?: any;

  ngOnInit(): void {
    this.bindCountdownStream();
    this.resetCountdown(this.countdown);
  }

  ngOnDestroy(): void {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = undefined;
    }
    this.destroy$.next();
    this.destroy$.complete();
    this.reset$.complete();
  }

  private bindCountdownStream(): void {

    // Subscribe to reset$ directly
    this.reset$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((startSeconds) => {
      this.startCountdown(startSeconds);
    });
  }

  private startCountdown(startSeconds: number): void {

    // Clear any existing timer
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = undefined;
    }

    let currentValue = startSeconds;
    this.countdown$.next(currentValue);

    this.countdownTimer = setInterval(() => {
      currentValue--;

      if (currentValue >= 0) {
        this.countdown$.next(currentValue);
        this.cdr.detectChanges();

        if (currentValue === 0) {
          this.canResend$.next(true);
          clearInterval(this.countdownTimer);
          this.countdownTimer = undefined;
        }
      } else {
        clearInterval(this.countdownTimer);
        this.countdownTimer = undefined;
      }
    }, 1000);
  }

  private resetCountdown(seconds: number): void {

    // Clear existing timer first
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = undefined;
    }

    this.canResend$.next(false);
    this.reset$.next(seconds);
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}
