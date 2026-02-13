import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EnrollmentsApiService } from '../../core/services/enrollments-api.service';
import { Enrollment } from '../../core/models/lms.models';

@Component({
  selector: 'app-enrollments-page',
  imports: [NgIf, NgFor, RouterLink],
  template: `
  <div class="page">
    <div class="header">
      <div>
        <div class="h1">My Enrollments</div>
        <div class="muted">Courses you are currently enrolled in.</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="h2">Enrollments</div>
        <span class="badge">{{ items?.length ?? 0 }}</span>
      </div>
      <div class="card-body">
        <div class="muted" *ngIf="loading">Loading…</div>
        <div class="muted" *ngIf="!loading && items.length === 0">No enrollments found.</div>

        <table class="table" *ngIf="!loading && items.length">
          <thead>
            <tr>
              <th>Course</th>
              <th>Role</th>
              <th>Status</th>
              <th style="width: 140px;"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let e of items">
              <td><strong>{{ e.courseTitle || e.courseId }}</strong></td>
              <td><span class="badge">{{ e.role }}</span></td>
              <td class="muted">{{ e.status || 'ACTIVE' }}</td>
              <td><a class="btn ghost" routerLink="/app/courses/{{e.courseId}}">Open</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  `,
  styles: [`
  .header{ display:flex; align-items:flex-end; justify-content: space-between; gap: 14px; margin-bottom: 14px; }
  `]
})
export class EnrollmentsPageComponent {
  private readonly api = inject(EnrollmentsApiService);

  loading = true;
  items: Enrollment[] = [];

  constructor() {
    this.api.listMyEnrollments().subscribe({
      next: (items) => {
        this.items = items ?? [];
        this.loading = false;
      },
      error: () => {
        this.items = [];
        this.loading = false;
      }
    });
  }
}
