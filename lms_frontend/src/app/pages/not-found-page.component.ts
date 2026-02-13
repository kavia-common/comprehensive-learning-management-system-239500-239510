import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
  <div class="page">
    <div class="card">
      <div class="card-header">
        <div class="h2">Page not found</div>
        <a class="btn ghost" routerLink="/app/dashboard">Go to dashboard</a>
      </div>
      <div class="card-body">
        <div class="muted">The page you requested does not exist.</div>
      </div>
    </div>
  </div>
  `,
})
export class NotFoundPageComponent {}
