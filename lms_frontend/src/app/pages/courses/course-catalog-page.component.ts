import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CoursesApiService } from '../../core/services/courses-api.service';
import { Course } from '../../core/models/lms.models';
import { ToastService } from '../../shared/services/toast.service';
import { ApiError } from '../../core/services/api-client.service';

@Component({
  selector: 'app-course-catalog',
  imports: [NgIf, NgFor, RouterLink],
  template: `
  <div class="page">
    <div class="header">
      <div>
        <div class="h1">Course Catalog</div>
        <div class="muted">Browse available courses and enroll.</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="h2">Courses</div>
        <span class="badge">{{ courses?.length ?? 0 }}</span>
      </div>
      <div class="card-body">
        <div class="muted" *ngIf="loading">Loading…</div>
        <div class="muted" *ngIf="!loading && courses && courses.length === 0">No courses found.</div>

        <div class="grid cols-3" *ngIf="!loading && courses && courses.length">
          <div class="card course" *ngFor="let c of courses">
            <div class="title">{{ c.title }}</div>
            <div class="muted">{{ c.description || 'No description' }}</div>
            <div class="meta">
              <span class="badge" *ngIf="c.status">{{ c.status }}</span>
              <span class="muted" *ngIf="c.instructorName">Instructor: {{ c.instructorName }}</span>
            </div>
            <div class="actions">
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
  .course{ padding: 12px; }
  .title{ font-weight: 900; letter-spacing: -0.01em; margin-bottom: 6px; }
  .meta{ display:grid; gap: 8px; margin-top: 10px; font-size: 13px; }
  .actions{ display:flex; gap: 10px; margin-top: 12px; flex-wrap: wrap; }
  `]
})
export class CourseCatalogPageComponent {
  private readonly api = inject(CoursesApiService);
  private readonly toast = inject(ToastService);

  loading = true;
  courses: Course[] = [];

  constructor() {
    this.api.listCourses().subscribe({
      next: (items) => {
        this.courses = items ?? [];
        this.loading = false;
      },
      error: () => {
        this.courses = [];
        this.loading = false;
      }
    });
  }

  enroll(courseId: string): void {
    this.api.enroll(courseId).subscribe({
      next: () => this.toast.push('success', 'Enrolled', 'Enrollment created.'),
      error: (e: ApiError) => this.toast.push('error', 'Enrollment failed', e.message),
    });
  }
}
