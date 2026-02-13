import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AssignmentsApiService } from '../../core/services/assignments-api.service';
import { Assignment, Submission } from '../../core/models/lms.models';
import { ToastService } from '../../shared/services/toast.service';
import { ApiError } from '../../core/services/api-client.service';
import { AuthStateService } from '../../core/services/auth-state.service';

@Component({
  selector: 'app-assignment-detail',
  imports: [NgIf, NgFor, RouterLink, FormsModule],
  template: `
  <div class="page">
    <div class="header">
      <div>
        <div class="h1">Assignment</div>
        <div class="muted">Submit your work or grade student submissions.</div>
      </div>
      <div class="actions">
        <a class="btn ghost" routerLink="/app/assignments">Back</a>
      </div>
    </div>

    <div class="card" *ngIf="assignment as a; else loadingTpl">
      <div class="card-header">
        <div>
          <div class="h2">{{ a.title }}</div>
          <div class="muted">Course: {{ a.courseId }}</div>
        </div>
        <span class="badge warn" *ngIf="a.dueAt">Due {{ a.dueAt }}</span>
      </div>
      <div class="card-body">
        <div class="muted" style="line-height: 1.4;">{{ a.description || 'No description.' }}</div>

        <div class="grid cols-2" style="margin-top: 14px;">
          <div class="card">
            <div class="card-header"><div class="h2">My Submission</div></div>
            <div class="card-body">
              <div class="field">
                <div class="label">Content</div>
                <textarea class="input" [(ngModel)]="content" name="content" style="height: 140px; padding-top: 10px;"></textarea>
              </div>
              <div style="margin-top: 10px;">
                <button class="btn" (click)="submit()" [disabled]="submitting">{{ submitting ? 'Submitting…' : 'Submit' }}</button>
              </div>
              <div class="muted" style="margin-top: 10px; font-size: 13px;">
                Wired to <span class="kbd">/assignments/:id/submissions</span>.
              </div>
            </div>
          </div>

          <div class="card" *ngIf="canGrade">
            <div class="card-header"><div class="h2">Submissions</div></div>
            <div class="card-body">
              <div class="muted" *ngIf="subsLoading">Loading…</div>
              <div class="muted" *ngIf="!subsLoading && submissions.length === 0">No submissions yet.</div>

              <div class="sub" *ngFor="let s of submissions">
                <div>
                  <div><strong>{{ s.studentId }}</strong> <span class="muted">· {{ s.submittedAt || '—' }}</span></div>
                  <div class="muted" style="margin-top:4px;">{{ s.content || '—' }}</div>
                </div>
                <div class="grade">
                  <input class="input" style="width: 90px;" type="number" [(ngModel)]="s.grade" name="grade_{{s.id}}" placeholder="Grade" />
                  <button class="btn secondary" (click)="grade(s)" [disabled]="gradingId===s.id">{{ gradingId===s.id ? 'Saving…' : 'Save' }}</button>
                </div>
              </div>

            </div>
          </div>

          <div class="card" *ngIf="!canGrade">
            <div class="card-header"><div class="h2">Instructor tools</div></div>
            <div class="card-body">
              <div class="muted">Instructor/Admin role required to view and grade submissions.</div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <ng-template #loadingTpl>
      <div class="card"><div class="card-body muted">Loading…</div></div>
    </ng-template>
  </div>
  `,
  styles: [`
  .header{ display:flex; align-items:flex-end; justify-content: space-between; gap: 14px; margin-bottom: 14px; }
  .actions{ display:flex; gap: 10px; flex-wrap: wrap; }
  .sub{
    display:flex;
    align-items:flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 12px;
    border: 1px solid var(--border);
    border-radius: 12px;
    margin-top: 10px;
    background: rgba(30,58,138,0.03);
  }
  .grade{ display:flex; align-items:center; gap: 10px; flex-wrap: wrap; }
  `]
})
export class AssignmentDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(AssignmentsApiService);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthStateService);

  assignment: Assignment | null = null;
  content = '';
  submitting = false;

  canGrade = this.auth.hasAnyRole(['INSTRUCTOR', 'ADMIN']);
  subsLoading = false;
  submissions: Submission[] = [];
  gradingId: string | null = null;

  constructor() {
    const id = this.route.snapshot.paramMap.get('assignmentId') ?? '';
    this.api.getAssignment(id).subscribe({
      next: (a) => {
        this.assignment = a;
        if (this.canGrade) this.loadSubmissions();
      },
      error: () => this.assignment = null,
    });
  }

  submit(): void {
    const id = this.route.snapshot.paramMap.get('assignmentId') ?? '';
    this.submitting = true;
    this.api.submit(id, this.content).subscribe({
      next: () => {
        this.toast.push('success', 'Submitted', 'Your submission was saved.');
        this.submitting = false;
      },
      error: (e: ApiError) => {
        this.toast.push('error', 'Submit failed', e.message);
        this.submitting = false;
      }
    });
  }

  loadSubmissions(): void {
    const id = this.route.snapshot.paramMap.get('assignmentId') ?? '';
    this.subsLoading = true;
    this.api.listSubmissions(id).subscribe({
      next: (items) => {
        this.submissions = items ?? [];
        this.subsLoading = false;
      },
      error: () => {
        this.submissions = [];
        this.subsLoading = false;
      }
    });
  }

  grade(s: Submission): void {
    if (!s.id) return;
    this.gradingId = s.id;
    this.api.gradeSubmission(s.id, s.grade ?? 0, s.feedback).subscribe({
      next: () => {
        this.toast.push('success', 'Grade saved');
        this.gradingId = null;
      },
      error: (e: ApiError) => {
        this.toast.push('error', 'Save failed', e.message);
        this.gradingId = null;
      }
    });
  }
}
