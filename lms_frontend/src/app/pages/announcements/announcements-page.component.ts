import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { CommunityApiService } from '../../core/services/community-api.service';
import { Announcement } from '../../core/models/lms.models';

@Component({
  selector: 'app-announcements-page',
  imports: [NgIf, NgFor],
  template: `
  <div class="page">
    <div class="header">
      <div>
        <div class="h1">Announcements</div>
        <div class="muted">Important updates from instructors and admins.</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="h2">Latest</div>
        <span class="badge">{{ items?.length ?? 0 }}</span>
      </div>
      <div class="card-body">
        <div class="muted" *ngIf="loading">Loading…</div>
        <div class="muted" *ngIf="!loading && items.length === 0">No announcements.</div>

        <div class="ann" *ngFor="let a of items">
          <div class="title">{{ a.title }}</div>
          <div class="muted">{{ a.message }}</div>
          <div class="muted meta">Course: {{ a.courseId || 'All' }} · {{ a.createdAt || '—' }}</div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
  .header{ display:flex; align-items:flex-end; justify-content: space-between; gap: 14px; margin-bottom: 14px; }
  .ann{
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-top: 10px;
    background: white;
    display:grid;
    gap: 8px;
  }
  .title{ font-weight: 900; letter-spacing: -0.01em; }
  .meta{ font-size: 12px; }
  `]
})
export class AnnouncementsPageComponent {
  private readonly api = inject(CommunityApiService);

  loading = true;
  items: Announcement[] = [];

  constructor() {
    this.api.listAnnouncements().subscribe({
      next: (items) => { this.items = items ?? []; this.loading = false; },
      error: () => { this.items = []; this.loading = false; }
    });
  }
}
