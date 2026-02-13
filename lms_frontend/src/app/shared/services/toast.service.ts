import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastKind = 'info' | 'success' | 'warning' | 'error';

export type Toast = {
  id: string;
  kind: ToastKind;
  title: string;
  message?: string;
  createdAt: number;
};

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly _toasts$ = new BehaviorSubject<Toast[]>([]);
  readonly toasts$ = this._toasts$.asObservable();

  // PUBLIC_INTERFACE
  push(kind: ToastKind, title: string, message?: string): void {
    /** Push a toast notification. */
    const toast: Toast = {
      id: crypto.randomUUID(),
      kind,
      title,
      message,
      createdAt: Date.now(),
    };
    this._toasts$.next([toast, ...this._toasts$.value].slice(0, 5));
    window.setTimeout(() => this.dismiss(toast.id), 4000);
  }

  // PUBLIC_INTERFACE
  dismiss(id: string): void {
    /** Dismiss a toast by id. */
    this._toasts$.next(this._toasts$.value.filter(t => t.id !== id));
  }
}
