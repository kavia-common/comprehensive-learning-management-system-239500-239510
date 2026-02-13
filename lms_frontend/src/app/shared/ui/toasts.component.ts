import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'app-toasts',
  imports: [AsyncPipe, NgFor, NgIf],
  template: `
  <div class="toast-wrap" *ngIf="(toastService.toasts$ | async) as toasts">
    <div class="toast card" *ngFor="let t of toasts" [class]="kindClass(t.kind)">
      <div class="toast-title">
        <span class="dot" aria-hidden="true"></span>
        <strong>{{ t.title }}</strong>
      </div>
      <div class="toast-msg muted" *ngIf="t.message">{{ t.message }}</div>
      <button class="toast-close" (click)="toastService.dismiss(t.id)" aria-label="Dismiss">×</button>
    </div>
  </div>
  `,
  styles: [`
  .toast-wrap{
    position: fixed;
    right: 14px;
    top: 14px;
    display: grid;
    gap: 10px;
    z-index: 1000;
    width: min(420px, calc(100% - 28px));
  }
  .toast{
    position: relative;
    padding: 14px 14px 12px 14px;
    border-radius: 14px;
  }
  .toast-title{
    display:flex;
    align-items:center;
    gap:10px;
    font-size: 14px;
  }
  .toast-msg{
    margin-top: 6px;
    font-size: 13px;
    line-height: 1.3;
  }
  .toast-close{
    position:absolute;
    right: 10px;
    top: 8px;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 18px;
    color: rgba(17,24,39,0.6);
  }
  .dot{
    width: 10px;
    height: 10px;
    border-radius: 999px;
    background: var(--primary);
    box-shadow: 0 0 0 4px rgba(30,58,138,0.12);
  }
  .toast.info .dot{ background: var(--primary); box-shadow: 0 0 0 4px rgba(30,58,138,0.12); }
  .toast.success .dot{ background: var(--success); box-shadow: 0 0 0 4px rgba(5,150,105,0.12); }
  .toast.warning .dot{ background: var(--secondary); box-shadow: 0 0 0 4px rgba(245,158,11,0.14); }
  .toast.error .dot{ background: var(--error); box-shadow: 0 0 0 4px rgba(220,38,38,0.14); }
  `]
})
export class ToastsComponent {
  protected readonly toastService = inject(ToastService);

  kindClass(kind: string): string {
    return `toast ${kind}`;
  }
}
