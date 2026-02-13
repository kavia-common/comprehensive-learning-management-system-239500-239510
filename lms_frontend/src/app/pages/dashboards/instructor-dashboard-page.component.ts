import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../shared/services/toast.service';
import { CommunityApiService } from '../../core/services/community-api.service';
import { ApiError } from '../../core/services/api-client.service';

@Component({
  selector: 'app-instructor-dashboard',
  imports: [RouterLink, FormsModule],
  template: `
  <div class="page">
    <div class="header">
      <div>
        <div class="h1">Instructor</div>
        <div class="muted">Manage assignments, grade submissions, and post announcements.</div>
      </div>
      <div class="actions">
        <a class="btn" routerLink="/app/assignments">Assignments</a>
        <a class="btn ghost" routerLink="/app/discussions">Discussions</a>
      </div>
    </div>

    <div class="grid cols-2">
      <div class="card">
        <div class="card-header">
          <div class="h2">Create announcement</div>
          <span class="badge">Instructor</span>
        </div>
        <div class="card-body">
          <div class="field">
            <div class="label">Title</div>
            <input class="input" [(ngModel)]="title" name="title" />
          </div>
          <div class="field" style="margin-top:10px;">
            <div class="label">Message</div>
            <textarea class="input" [(ngModel)]="message" name="message" style="height: 110px; padding-top: 10px;"></textarea>
          </div>
          <div style="margin-top: 10px;">
            <button class="btn secondary" (click)="post()" [disabled]="loading">{{ loading ? 'Posting…' : 'Post' }}</button>
          </div>
          <div class="muted" style="margin-top:10px; font-size:13px;">
            This is wired to <span class="kbd">/announcements</span> and can be aligned to the backend contract.
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="h2">Grading workflow</div>
          <span class="badge success">Ready</span>
        </div>
        <div class="card-body">
          <div class="muted">Use Assignments → Assignment detail to list submissions and grade them.</div>
          <div style="margin-top: 10px;">
            <a class="btn" routerLink="/app/assignments">Open assignments</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
  .header{ display:flex; align-items:flex-end; justify-content: space-between; gap: 14px; margin-bottom: 14px; }
  .actions{ display:flex; gap: 10px; flex-wrap: wrap; }
  `]
})
export class InstructorDashboardPageComponent {
  private readonly api = inject(CommunityApiService);
  private readonly toast = inject(ToastService);

  title = '';
  message = '';
  loading = false;

  post(): void {
    this.loading = true;
    this.api.createAnnouncement(this.title, this.message).subscribe({
      next: () => {
        this.toast.push('success', 'Announcement posted');
        this.title = '';
        this.message = '';
        this.loading = false;
      },
      error: (e: ApiError) => {
        this.toast.push('error', 'Post failed', e.message);
        this.loading = false;
      }
    });
  }
}
