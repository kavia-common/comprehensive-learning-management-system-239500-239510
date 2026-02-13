import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NotificationItem } from '../models/lms.models';
import { getAppEnv } from '../config/app-env';
import { AuthStateService } from './auth-state.service';
import { ToastService } from '../../shared/services/toast.service';

@Injectable({ providedIn: 'root' })
export class NotificationsService {
  private readonly _items$ = new BehaviorSubject<NotificationItem[]>([]);
  readonly items$ = this._items$.asObservable();

  private sse?: EventSource;

  constructor(
    private readonly authState: AuthStateService,
    private readonly toast: ToastService,
  ) {}

  // PUBLIC_INTERFACE
  connect(): void {
    /** Connect to real-time notifications via SSE (if authenticated). */
    if (!this.authState.isAuthenticated()) return;
    if (this.sse) return;

    const { notificationsSseUrl } = getAppEnv();

    // NOTE: EventSource cannot set Authorization header in browsers.
    // This integration point assumes backend supports cookie auth OR token query param.
    // If backend requires Bearer, switch to WebSocket or fetch-based SSE proxy.
    const token = this.authState.accessToken;
    const url = token ? `${notificationsSseUrl}?access_token=${encodeURIComponent(token)}` : notificationsSseUrl;

    this.sse = new EventSource(url);
    this.sse.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data) as NotificationItem;
        this._items$.next([data, ...this._items$.value]);
        this.toast.push('info', data.title ?? 'Notification', data.message);
      } catch {
        // ignore malformed messages
      }
    };
    this.sse.onerror = () => {
      // keep it simple; consumer can call reconnect on route navigation if needed
    };
  }

  // PUBLIC_INTERFACE
  disconnect(): void {
    /** Disconnect real-time notifications. */
    this.sse?.close();
    this.sse = undefined;
  }

  // PUBLIC_INTERFACE
  markRead(id: string): void {
    /** Mark notification as read locally (API wiring can be added once backend contract is confirmed). */
    this._items$.next(
      this._items$.value.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }

  // PUBLIC_INTERFACE
  clear(): void {
    /** Clear all notifications locally. */
    this._items$.next([]);
  }

  // PUBLIC_INTERFACE
  connectWebSocketIntegrationPoint(): void {
    /**
     * Placeholder integration point for WebSocket-based notifications.
     * Once backend WS endpoint is confirmed, replace this with actual socket connection.
     */
    // Intentionally left as a documented integration point.
  }
}
