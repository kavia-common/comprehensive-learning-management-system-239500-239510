import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-courses-page',
  imports: [],
  template: `
  <div class="page">
    <div class="header">
      <div>
        <div class="h1">Manage Courses</div>
        <div class="muted">Publish/archive courses (integration point).</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="h2">Course Administration</div></div>
      <div class="card-body">
        <div class="muted" style="line-height: 1.5;">
          Integration point for admin course management endpoints (e.g., <span class="kbd">/admin/courses</span>).
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
  .header{ display:flex; align-items:flex-end; justify-content: space-between; gap: 14px; margin-bottom: 14px; }
  `]
})
export class AdminCoursesPageComponent {}
