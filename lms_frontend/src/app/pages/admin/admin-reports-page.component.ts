import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-reports-page',
  imports: [],
  template: `
  <div class="page">
    <div class="header">
      <div>
        <div class="h1">Reports</div>
        <div class="muted">Operational reporting (integration point).</div>
      </div>
    </div>

    <div class="grid cols-2">
      <div class="card">
        <div class="card-header"><div class="h2">Enrollments</div></div>
        <div class="card-body">
          <div class="muted">Integration point for enrollment/activity reports.</div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="h2">Audit Logs</div></div>
        <div class="card-body">
          <div class="muted">Integration point for admin audit logs.</div>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
  .header{ display:flex; align-items:flex-end; justify-content: space-between; gap: 14px; margin-bottom: 14px; }
  `]
})
export class AdminReportsPageComponent {}
