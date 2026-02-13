import { Component, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthStateService } from '../../core/services/auth-state.service';
import { EnrollmentsApiService } from '../../core/services/enrollments-api.service';
import { CoursesApiService } from '../../core/services/courses-api.service';
import { ToastService } from '../../shared/services/toast.service';
import { Enrollment } from '../../core/models/lms.models';
import { ApiError } from '../../core/services/api-client.service';

@Component({
  selector: 'app-student-dashboard',
  imports: [AsyncPipe, NgIf, NgFor, RouterLink],
  template: `
  <div class="page">
    <div class="header">
      <div>
        <div class="h1">Dashboard</div>
        <div class="muted" *ngIf="(auth.user$ | async) as u">Welcome, {{ u.fullName }}.</div>
      </div>
      <div class="actions">
        <a class="btn ghost" routerLink="/app/courses">Browse courses</a>
        <a class="btn" routerLink="/app/assignments">View assignments</a>
      </div>
    </div>

    <div class="grid cols-3">
      <div class="card">
        <div class="card-header">
          <div class="h2">My enrollments</div>
          <span class="badge">{{ enrollments ? enrollments.length : 0 }}</span>
        </div>
        <div class="card-body">
          <div class="muted" *ngIf="!enrollmentsLoaded">Loading…</div>
          <div class="muted" *ngIf="enrollmentsLoaded && (!enrollments || enrollments.length === 0)">No enrollments yet.</div>
          <ul class="list" *ngIf="enrollments && enrollments.length">
            <li *ngFor="let e of enrollments">
              <a routerLink="/app/courses/{{e.courseId}}"><strong>{{ e.courseTitle || e.courseId }}</strong></a>
              <span class="muted">{{ e.status || 'ACTIVE' }}</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="h2">Role</div>
          <span class="badge warn" *ngIf="(auth.user$ | async) as u">{{ u.roles.join(', ') }}</span>
        </div>
        <div class="card-body">
          <div class="muted">Your UI adapts based on role-based access controls.</div>
          <div class="mt" *ngIf="(auth.user$ | async) as u">
            <a
              class="btn ghost"
              routerLink="/app/instructor"
              *ngIf="u.roles.includes('INSTRUCTOR') || u.roles.includes('ADMIN')"
            >Go to Instructor</a>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="h2">Quick actions</div>
        </div>
        <div class="card-body">
          <div class="qa">
            <a class="btn ghost" routerLink="/app/grades">Grades</a>
            <a class="btn ghost" routerLink="/app/discussions">Discussions</a>
            <a class="btn ghost" routerLink="/app/announcements">Announcements</a>
          </div>
        </div>
      </div>
    </div>

    <div class="card" style="margin-top: 14px;">
      <div class="card-header">
        <div class="h2">Course Catalog (preview)</div>
        <a class="btn ghost" routerLink="/app/courses">View all</a>
      </div>
      <div class="card-body">
        <div class="muted" *ngIf="!catalogLoaded">Loading…</div>
        <div class="grid cols-3" *ngIf="catalogLoaded">
          <div class="card course" *ngFor="let c of catalog">
            <div class="course-title">{{ c.title }}</div>
            <div class="muted">{{ c.description || 'No description' }}</div>
            <div class="course-actions">
              <a class="btn ghost" routerLink="/app/courses/{{c.id}}">Details</a>
              <button class="btn secondary" (click)="enroll(c.id)">Enroll</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
  `,
  styles: [`
  .header{ display:flex; align-items:flex-end; justify-content: space-between; gap: 14px; margin-bottom: 14px; }
  .actions{ display:flex; gap: 10px; flex-wrap: wrap; }
  .list{ list-style: none; display:grid; gap: 10px; margin-top: 8px; }
  .list li{ display:flex; justify-content: space-between; gap: 10px; }
  .qa{ display:flex; gap: 10px; flex-wrap: wrap; }
  .mt{ margin-top: 10px; }
  .course{ padding: 12px; }
  .course-title{ font-weight: 900; letter-spacing: -0.01em; margin-bottom: 4px; }
  .course-actions{ display:flex; gap: 10px; margin-top: 10px; flex-wrap: wrap; }
  `]
})
export class StudentDashboardPageComponent {
  protected readonly auth = inject(AuthStateService);
  private readonly enrollmentsApi = inject(EnrollmentsApiService);
  private readonly coursesApi = inject(CoursesApiService);
  private readonly toast = inject(ToastService);

  enrollmentsLoaded = false;
  enrollments: Enrollment[] | null = null;

  catalogLoaded = false;
  catalog: any[] = [];

  constructor() {
    this.enrollmentsApi.listMyEnrollments().subscribe({
      next: (items) => {
        this.enrollments = items;
        this.enrollmentsLoaded = true;
      },
      error: () => {
        this.enrollmentsLoaded = true;
        this.enrollments = [];
      }
    });

    this.coursesApi.listCourses().subscribe({
      next: (items) => {
        this.catalog = (items ?? []).slice(0, 6);
        this.catalogLoaded = true;
      },
      error: () => {
        this.catalogLoaded = true;
        this.catalog = [];
      }
    });
  }

  enroll(courseId: string): void {
    this.coursesApi.enroll(courseId).subscribe({
      next: () => this.toast.push('success', 'Enrolled', 'You have been enrolled in the course.'),
      error: (e: ApiError) => this.toast.push('error', 'Enrollment failed', e.message),
    });
  }
}
