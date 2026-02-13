import { Component, inject } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AssignmentsApiService } from '../../core/services/assignments-api.service';
import { Assignment } from '../../core/models/lms.models';

@Component({
  selector: 'app-assignments-page',
  imports: [NgIf, NgFor, RouterLink],
  template: `
  <div class="page">
    <div class="header">
      <div>
        <div class="h1">Assignments</div>
        <div class="muted">View upcoming work and submission status.</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <div class="h2">All Assignments</div>
        <span class="badge">{{ items?.length ?? 0 }}</span>
      </div>
      <div class="card-body">
        <div class="muted" *ngIf="loading">Loading…</div>
        <div class="muted" *ngIf="!loading && items.length === 0">No assignments found.</div>

        <table class="table" *ngIf="!loading && items.length">
          <thead>
            <tr>
              <th>Title</th>
              <th>Due</th>
              <th>Points</th>
              <th style="width: 150px;"></th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let a of items">
              <td><strong>{{ a.title }}</strong></td>
              <td class="muted">{{ a.dueAt || '—' }}</td>
              <td class="muted">{{ a.points ?? '—' }}</td>
              <td><a class="btn ghost" routerLink="/app/assignments/{{a.id}}">Open</a></td>
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
export class AssignmentsPageComponent {
  private readonly api = inject(AssignmentsApiService);

  loading = true;
  items: Assignment[] = [];

  constructor() {
    this.api.listAssignments().subscribe({
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
