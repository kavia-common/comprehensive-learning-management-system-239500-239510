import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { CommunityApiService } from '../../core/services/community-api.service';
import { DiscussionThread } from '../../core/models/lms.models';
import { ToastService } from '../../shared/services/toast.service';
import { ApiError } from '../../core/services/api-client.service';

@Component({
  selector: 'app-discussions-page',
  imports: [NgIf, NgFor, FormsModule],
  template: `
  <div class="page">
    <div class="header">
      <div>
        <div class="h1">Discussions</div>
        <div class="muted">Threads across your courses.</div>
      </div>
    </div>

    <div class="grid cols-2">
      <div class="card">
        <div class="card-header"><div class="h2">Create thread</div></div>
        <div class="card-body">
          <div class="field">
            <div class="label">Course ID</div>
            <input class="input" [(ngModel)]="courseId" name="courseId" placeholder="e.g. C-101" />
          </div>
          <div class="field" style="margin-top:10px;">
            <div class="label">Title</div>
            <input class="input" [(ngModel)]="title" name="title" placeholder="Thread title" />
          </div>
          <div style="margin-top:10px;">
            <button class="btn secondary" (click)="create()" [disabled]="creating">{{ creating ? 'Creating…' : 'Create' }}</button>
          </div>
          <div class="muted" style="margin-top:10px; font-size:13px;">
            Wiring point: <span class="kbd">/discussions</span>.
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="h2">Threads</div>
          <span class="badge">{{ threads?.length ?? 0 }}</span>
        </div>
        <div class="card-body">
          <div class="muted" *ngIf="loading">Loading…</div>
          <div class="muted" *ngIf="!loading && threads.length === 0">No threads yet.</div>

          <div class="thread" *ngFor="let t of threads">
            <div><strong>{{ t.title }}</strong></div>
            <div class="muted">Course: {{ t.courseId }} · {{ t.createdByName || '—' }} · {{ t.createdAt || '—' }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
  .header{ display:flex; align-items:flex-end; justify-content: space-between; gap: 14px; margin-bottom: 14px; }
  .thread{
    padding: 10px 12px;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: white;
    margin-top: 10px;
    display:grid;
    gap: 6px;
  }
  `]
})
export class DiscussionsPageComponent {
  private readonly api = inject(CommunityApiService);
  private readonly toast = inject(ToastService);

  loading = true;
  threads: DiscussionThread[] = [];

  courseId = '';
  title = '';
  creating = false;

  constructor() {
    this.api.listThreads().subscribe({
      next: (items) => { this.threads = items ?? []; this.loading = false; },
      error: () => { this.threads = []; this.loading = false; }
    });
  }

  create(): void {
    this.creating = true;
    this.api.createThread(this.courseId, this.title).subscribe({
      next: (t) => {
        this.toast.push('success', 'Thread created');
        this.threads = [t, ...this.threads];
        this.courseId = '';
        this.title = '';
        this.creating = false;
      },
      error: (e: ApiError) => {
        this.toast.push('error', 'Create failed', e.message);
        this.creating = false;
      }
    });
  }
}
