import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { GradesApiService } from '../../core/services/grades-api.service';
import { GradeItem } from '../../core/models/lms.models';

@Component({
  selector: 'app-grades-page',
  imports: [NgIf, NgFor],
  template: `
  <div class="page">
    <div class="header">
      <div>
        <div class="h1">Grades</div>
        <div class="muted">Your gradebook summary.</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="h2">Grade Items</div>
        <span class="badge">{{ items?.length ?? 0 }}</span>
      </div>
      <div class="card-body">
        <div class="muted" *ngIf="loading">Loading…</div>
        <div class="muted" *ngIf="!loading && items.length === 0">No grades yet.</div>

        <table class="table" *ngIf="!loading && items.length">
          <thead>
            <tr>
              <th>Course</th>
              <th>Assignment</th>
              <th>Score</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let g of items">
              <td><strong>{{ g.courseTitle || g.courseId }}</strong></td>
              <td class="muted">{{ g.assignmentTitle || '—' }}</td>
              <td><span class="badge success">{{ g.score ?? '—' }}</span></td>
              <td class="muted">{{ g.points ?? '—' }}</td>
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
export class GradesPageComponent {
  private readonly api = inject(GradesApiService);

  loading = true;
  items: GradeItem[] = [];

  constructor() {
    this.api.listMyGrades().subscribe({
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
