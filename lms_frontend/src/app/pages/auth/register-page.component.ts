import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastService } from '../../shared/services/toast.service';
import { AuthApiService } from '../../core/services/auth-api.service';
import { AuthStateService } from '../../core/services/auth-state.service';
import { UserRole } from '../../core/models/auth.models';
import { ApiError } from '../../core/services/api-client.service';

@Component({
  selector: 'app-register-page',
  imports: [FormsModule, RouterLink],
  template: `
  <div class="head">
    <div class="h1">Create account</div>
    <div class="muted">Join as a student or instructor. Admin can be restricted by backend policy.</div>
  </div>

  <form class="form" (ngSubmit)="submit()">
    <div class="field">
      <div class="label">Full name</div>
      <input class="input" name="fullName" [(ngModel)]="fullName" autocomplete="name" required />
    </div>

    <div class="field">
      <div class="label">Email</div>
      <input class="input" name="email" [(ngModel)]="email" type="email" autocomplete="email" required />
    </div>

    <div class="field">
      <div class="label">Password</div>
      <input class="input" name="password" [(ngModel)]="password" type="password" autocomplete="new-password" required />
    </div>

    <div class="field">
      <div class="label">Role</div>
      <select class="input" name="role" [(ngModel)]="role" required>
        <option value="STUDENT">Student</option>
        <option value="INSTRUCTOR">Instructor</option>
        <option value="ADMIN">Admin</option>
      </select>
    </div>

    <button class="btn secondary" type="submit" [disabled]="loading">{{ loading ? 'Creating…' : 'Register' }}</button>

    <div class="muted small">
      Have an account? <a routerLink="/login"><strong>Sign in</strong></a>
    </div>
  </form>
  `,
  styles: [`
  .head{ display:grid; gap:6px; margin-bottom: 14px; }
  .form{ display:grid; gap: 12px; }
  .small{ font-size: 13px; }
  `]
})
export class RegisterPageComponent {
  private readonly api = inject(AuthApiService);
  private readonly auth = inject(AuthStateService);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  fullName = '';
  email = '';
  password = '';
  role: UserRole = 'STUDENT';
  loading = false;

  submit(): void {
    this.loading = true;
    this.api.register({ fullName: this.fullName, email: this.email, password: this.password, role: this.role }).subscribe({
      next: (resp) => {
        this.auth.setAuth(resp);
        this.toast.push('success', 'Account created', resp.user.fullName);
        this.router.navigateByUrl('/app/dashboard');
      },
      error: (e: ApiError) => {
        this.toast.push('error', 'Registration failed', e.message);
        this.loading = false;
      }
    });
  }
}
