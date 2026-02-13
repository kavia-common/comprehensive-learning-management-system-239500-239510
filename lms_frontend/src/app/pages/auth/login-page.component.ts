import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';
import { AuthApiService } from '../../core/services/auth-api.service';
import { AuthStateService } from '../../core/services/auth-state.service';
import { ApiError } from '../../core/services/api-client.service';

@Component({
  selector: 'app-login-page',
  imports: [FormsModule, RouterLink],
  template: `
  <div class="head">
    <div class="h1">Sign in</div>
    <div class="muted">Access your courses, assignments, and grades.</div>
  </div>

  <form class="form" (ngSubmit)="submit()">
    <div class="field">
      <div class="label">Email</div>
      <input class="input" name="email" [(ngModel)]="email" type="email" autocomplete="email" required />
    </div>

    <div class="field">
      <div class="label">Password</div>
      <input class="input" name="password" [(ngModel)]="password" type="password" autocomplete="current-password" required />
    </div>

    <button class="btn" type="submit" [disabled]="loading">{{ loading ? 'Signing in…' : 'Login' }}</button>

    <div class="muted small">
      No account? <a routerLink="/register"><strong>Create one</strong></a>
    </div>
  </form>
  `,
  styles: [`
  .head{ display:grid; gap:6px; margin-bottom: 14px; }
  .form{ display:grid; gap: 12px; }
  .small{ font-size: 13px; }
  `]
})
export class LoginPageComponent {
  private readonly api = inject(AuthApiService);
  private readonly auth = inject(AuthStateService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  email = '';
  password = '';
  loading = false;

  submit(): void {
    this.loading = true;
    this.api.login({ email: this.email, password: this.password }).subscribe({
      next: (resp) => {
        this.auth.setAuth(resp);
        this.toast.push('success', 'Welcome back', resp.user.fullName);
        this.router.navigateByUrl('/app/dashboard');
      },
      error: (e: ApiError) => {
        this.toast.push('error', 'Login failed', e.message);
        this.loading = false;
      }
    });
  }
}
