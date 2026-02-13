import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { NotificationsService } from '../../core/services/notifications.service';

@Component({
  selector: 'app-notifications-page',
  imports: [AsyncPipe, NgIf, NgFor],
  template: `
  <div class="page">
    <div class="header">
      <div>
        <div class="h1">Notifications</div>
        <div class="muted">Real-time updates (SSE integration point).</div>
      </div>
      <div class="actions">
        <button class="btn ghost" (click)="notifications.connect()">Connect</button>
        <button class="btn ghost" (click)="notifications.disconnect()">Disconnect</button>
        <button class="btn danger" (click)="notifications.clear()">Clear</button>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="h2">Inbox</div>
      </div>
      <div class="card-body" *ngIf="(notifications.items$ | async) as items">
        <div class="muted" *ngIf="items.length === 0">No notifications.</div>
        <div class="n" *ngFor="let n of items">
          <div class="row">
            <div class="title"><strong>{{ n.title || 'Notification' }}</strong></div>
            <span class="badge" [class.success]="n.read">{{ n.read ? 'Read' : 'New' }}</span>
          </div>
          <div class="muted">{{ n.message }}</div>
          <div class="muted meta">{{ n.createdAt || '—' }}</div>
          <div style="margin-top:10px;">
            <button class="btn ghost" (click)="notifications.markRead(n.id)">Mark read</button>
          </div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top: 14px;">
      <div class="card-header"><div class="h2">Integration notes</div></div>
      <div class="card-body">
        <div class="muted" style="line-height: 1.5;">
          SSE endpoint defaults to <span class="kbd">/api/notifications/stream</span> and currently passes the access token as a query param
          because browsers cannot set Authorization headers for EventSource. If the backend requires Bearer headers, switch to the documented
          WebSocket integration point in <span class="kbd">NotificationsService.connectWebSocketIntegrationPoint()</span>.
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
  .header{ display:flex; align-items:flex-end; justify-content: space-between; gap: 14px; margin-bottom: 14px; }
  .actions{ display:flex; gap: 10px; flex-wrap: wrap; }
  .n{
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: white;
    display:grid;
    gap: 8px;
    margin-top: 10px;
  }
  .row{ display:flex; align-items:center; justify-content: space-between; gap: 10px; }
  .meta{ font-size: 12px; }
  `]
})
export class NotificationsPageComponent {
  protected readonly notifications = inject(NotificationsService);
}
