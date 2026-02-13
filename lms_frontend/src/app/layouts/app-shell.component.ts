import { Component, DestroyRef, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { AuthStateService } from '../core/services/auth-state.service';
import { NotificationsService } from '../core/services/notifications.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, AsyncPipe, NgIf],
  template: `
  <div class="shell">
    <header class="topbar">
      <div class="left">
        <button class="icon-btn" (click)="toggleSidebar()" aria-label="Toggle sidebar">
          <span aria-hidden="true">☰</span>
        </button>
        <a class="brand" routerLink="/app/dashboard">
          <span class="logo" aria-hidden="true"></span>
          <span>LMS</span>
        </a>
      </div>

      <div class="center muted">
        <span *ngIf="(auth.user$ | async) as u">Signed in as <strong>{{ u.fullName }}</strong> · {{ u.email }}</span>
      </div>

      <div class="right">
        <a class="icon-link" routerLink="/app/notifications" routerLinkActive="active" aria-label="Notifications">
          🔔
        </a>
        <button class="btn ghost" (click)="logout()">Logout</button>
      </div>
    </header>

    <div class="body">
      <aside class="sidebar" [class.collapsed]="collapsed">
        <div class="section">
          <div class="section-title muted">Learning</div>
          <a class="nav" routerLink="/app/dashboard" routerLinkActive="active">Dashboard</a>
          <a class="nav" routerLink="/app/courses" routerLinkActive="active">Course Catalog</a>
          <a class="nav" routerLink="/app/enrollments" routerLinkActive="active">My Enrollments</a>
          <a class="nav" routerLink="/app/assignments" routerLinkActive="active">Assignments</a>
          <a class="nav" routerLink="/app/grades" routerLinkActive="active">Grades</a>
        </div>

        <div class="section">
          <div class="section-title muted">Community</div>
          <a class="nav" routerLink="/app/discussions" routerLinkActive="active">Discussions</a>
          <a class="nav" routerLink="/app/announcements" routerLinkActive="active">Announcements</a>
        </div>

        <div class="section" *ngIf="(auth.user$ | async) as u">
          <div class="section-title muted">Role</div>
          <a class="nav" *ngIf="u.roles.includes('INSTRUCTOR') || u.roles.includes('ADMIN')" routerLink="/app/instructor" routerLinkActive="active">Instructor</a>
          <a class="nav" *ngIf="u.roles.includes('ADMIN')" routerLink="/app/admin" routerLinkActive="active">Admin</a>
        </div>

        <div class="section" *ngIf="(auth.user$ | async) as u">
          <div class="section-title muted">Admin Management</div>
          <a class="nav" *ngIf="u.roles.includes('ADMIN')" routerLink="/app/admin/users" routerLinkActive="active">Users</a>
          <a class="nav" *ngIf="u.roles.includes('ADMIN')" routerLink="/app/admin/courses" routerLinkActive="active">Courses</a>
          <a class="nav" *ngIf="u.roles.includes('ADMIN')" routerLink="/app/admin/reports" routerLinkActive="active">Reports</a>
        </div>
      </aside>

      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  </div>
  `,
  styles: [`
  .shell{
    min-height: 100vh;
    display: grid;
    grid-template-rows: 56px 1fr;
  }
  .topbar{
    position: sticky;
    top: 0;
    z-index: 10;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
    display:flex;
    align-items:center;
    justify-content: space-between;
    padding: 0 12px;
    box-shadow: var(--shadow-sm);
  }
  .left, .right{
    display:flex;
    align-items:center;
    gap: 10px;
  }
  .center{
    font-size: 13px;
    text-align:center;
    overflow:hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 10px;
  }
  .icon-btn{
    border: 1px solid var(--border);
    background: white;
    height: 38px;
    width: 38px;
    border-radius: 12px;
    cursor: pointer;
  }
  .brand{
    display:flex;
    align-items:center;
    gap: 10px;
    font-weight: 900;
    letter-spacing: -0.02em;
    color: var(--primary);
  }
  .logo{
    width: 26px;
    height: 26px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--primary), rgba(245,158,11,0.92));
  }
  .icon-link{
    height: 38px;
    width: 38px;
    display:grid;
    place-items:center;
    border-radius: 12px;
    border: 1px solid var(--border);
    background: white;
  }
  .icon-link.active{
    border-color: rgba(30,58,138,0.35);
    box-shadow: 0 0 0 4px rgba(30,58,138,0.10);
  }
  .body{
    display:grid;
    grid-template-columns: 270px 1fr;
    min-height: 0;
  }
  .sidebar{
    background: var(--surface);
    border-right: 1px solid var(--border);
    padding: 14px;
    display:flex;
    flex-direction: column;
    gap: 14px;
    overflow:auto;
  }
  .sidebar.collapsed{
    width: 72px;
    grid-column: 1;
  }
  .section{
    display:grid;
    gap: 8px;
  }
  .section-title{
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 4px 8px;
  }
  .nav{
    display:flex;
    align-items:center;
    gap: 10px;
    padding: 10px 10px;
    border-radius: 12px;
    border: 1px solid transparent;
    font-weight: 650;
    color: rgba(17,24,39,0.85);
  }
  .nav.active{
    background: rgba(30,58,138,0.08);
    border-color: rgba(30,58,138,0.18);
    color: var(--primary);
  }
  .content{
    padding: 18px;
    min-height: 0;
    overflow:auto;
  }

  @media (max-width: 960px) {
    .body{ grid-template-columns: 1fr; }
    .sidebar{ display:none; }
  }
  `]
})
export class AppShellComponent {
  protected collapsed = false;
  protected readonly auth = inject(AuthStateService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationsService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    // Connect notifications when authenticated; disconnect on logout/navigation destroy.
    this.auth.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(u => {
      if (u) this.notifications.connect();
      else this.notifications.disconnect();
    });
  }

  toggleSidebar(): void {
    this.collapsed = !this.collapsed;
  }

  logout(): void {
    this.auth.clear();
    this.notifications.disconnect();
    this.router.navigateByUrl('/login');
  }
}
