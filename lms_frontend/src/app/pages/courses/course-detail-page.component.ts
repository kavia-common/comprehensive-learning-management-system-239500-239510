import { Component, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CoursesApiService } from '../../core/services/courses-api.service';
import { Course } from '../../core/models/lms.models';
import { ToastService } from '../../shared/services/toast.service';
import { ApiError } from '../../core/services/api-client.service';

@Component({
  selector: 'app-course-detail',
  imports: [NgIf, AsyncPipe, RouterLink],
  template: `
  <div class="page">
    <div class="header">
      <div>
        <div class="h1">Course</div>
        <div class="muted">Details, enrollment, and learning resources.</div>
      </div>
      <div class="actions">
        <a class="btn ghost" routerLink="/app/courses">Back</a>
        <button class="btn secondary" (click)="enroll()" [disabled]="enrolling">{{ enrolling ? 'Enrolling…' : 'Enroll' }}</button>
      </div>
    </div>

    <div class="card" *ngIf="course as c; else loadingTpl">
      <div class="card-header">
        <div>
          <div class="h2">{{ c.title }}</div>
          <div class="muted" *ngIf="c.code">{{ c.code }}</div>
        </div>
        <span class="badge" *ngIf="c.status">{{ c.status }}</span>
      </div>
      <div class="card-body">
        <div class="muted" style="line-height: 1.4;">{{ c.description || 'No description provided.' }}</div>

        <div class="grid cols-2" style="margin-top: 14px;">
          <div class="card">
            <div class="card-header"><div class="h2">Assignments</div></div>
            <div class="card-body">
              <div class="muted">Go to assignments to view work for this course.</div>
              <div style="margin-top:10px;">
                <a class="btn" routerLink="/app/assignments">Open</a>
              </div>
            </div>
          </div>
          <div class="card">
            <div class="card-header"><div class="h2">Discussions</div></div>
            <div class="card-body">
              <div class="muted">Discuss topics with classmates and instructors.</div>
              <div style="margin-top:10px;">
                <a class="btn" routerLink="/app/discussions">Open</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loadingTpl>
      <div class="card">
        <div class="card-body muted">Loading…</div>
      </div>
    </ng-template>
  </div>
  `,
  styles: [`
  .header{ display:flex; align-items:flex-end; justify-content: space-between; gap: 14px; margin-bottom: 14px; }
  .actions{ display:flex; gap: 10px; flex-wrap: wrap; }
  `]
})
export class CourseDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(CoursesApiService);
  private readonly toast = inject(ToastService);

  course: Course | null = null;
  enrolling = false;

  constructor() {
    const courseId = this.route.snapshot.paramMap.get('courseId') ?? '';
    this.api.getCourse(courseId).subscribe({
      next: (c) => this.course = c,
      error: () => this.course = null,
    });
  }

  enroll(): void {
    const courseId = this.route.snapshot.paramMap.get('courseId') ?? '';
    this.enrolling = true;
    this.api.enroll(courseId).subscribe({
      next: () => {
        this.toast.push('success', 'Enrolled', 'You are now enrolled.');
        this.enrolling = false;
      },
      error: (e: ApiError) => {
        this.toast.push('error', 'Enrollment failed', e.message);
        this.enrolling = false;
      },
    });
  }
}
