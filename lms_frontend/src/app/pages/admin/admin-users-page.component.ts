import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-users-page',
  imports: [],
  template: `
  <div class="page">
    <div class="header">
      <div>
        <div class="h1">Users</div>
        <div class="muted">Admin management page (integration point).</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><div class="h2">User Directory</div></div>
      <div class="card-body">
        <div class="muted" style="line-height: 1.5;">
          This page is the integration point for admin user APIs (list/create/update/disable/roles).
          Expected endpoints commonly include <span class="kbd">/admin/users</span>.
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [`
  .header{ display:flex; align-items:flex-end; justify-content: space-between; gap: 14px; margin-bottom: 14px; }
  `]
})
export class AdminUsersPageComponent {}
