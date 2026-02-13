import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink],
  template: `
  <div class="page">
    <div class="header">
      <div>
        <div class="h1">Admin</div>
        <div class="muted">Manage users, courses, and reporting.</div>
      </div>
      <div class="actions">
        <a class="btn" routerLink="/app/admin/users">Users</a>
        <a class="btn ghost" routerLink="/app/admin/courses">Courses</a>
        <a class="btn ghost" routerLink="/app/admin/reports">Reports</a>
      </div>
    </div>

    <div class="grid cols-3">
      <div class="card">
        <div class="card-header"><div class="h2">User management</div></div>
        <div class="card-body">
          <div class="muted">Create, disable, or adjust roles for accounts.</div>
          <div style="margin-top:10px;"><a class="btn" routerLink="/app/admin/users">Open</a></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="h2">Course management</div></div>
        <div class="card-body">
          <div class="muted">Publish, archive, and audit course settings.</div>
          <div style="margin-top:10px;"><a class="btn" routerLink="/app/admin/courses">Open</a></div>
        </div>
      </div>
      <div class="card">
        <div class="card-header"><div class="h2">Reports</div></div>
        <div class="card-body">
          <div class="muted">Basic reporting surfaces for enrollments and activity logs.</div>
          <div style="margin-top:10px;"><a class="btn" routerLink="/app/admin/reports">Open</a></div>
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
export class AdminDashboardPageComponent {}
