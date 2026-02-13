import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [RouterOutlet],
  template: `
  <div class="wrap">
    <div class="brand">
      <div class="mark" aria-hidden="true"></div>
      <div>
        <div class="name">LMS Portal</div>
        <div class="tag muted">Ocean Professional · Classic</div>
      </div>
    </div>

    <div class="panel card">
      <router-outlet></router-outlet>
    </div>

    <div class="footer muted">
      Tip: use <span class="kbd">Admin</span>, <span class="kbd">Instructor</span>, <span class="kbd">Student</span> roles for access control.
    </div>
  </div>
  `,
  styles: [`
  .wrap{
    min-height: 100vh;
    display: grid;
    place-items: center;
    gap: 18px;
    padding: 24px 16px;
    background: linear-gradient(180deg, rgba(30,58,138,0.10), rgba(245,158,11,0.10));
  }
  .brand{
    display:flex;
    align-items:center;
    gap: 12px;
  }
  .mark{
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: linear-gradient(135deg, var(--primary), rgba(245,158,11,0.9));
    box-shadow: var(--shadow-sm);
  }
  .name{
    font-weight: 900;
    letter-spacing: -0.02em;
    font-size: 16px;
  }
  .tag{
    font-size: 12px;
  }
  .panel{
    width: min(460px, 100%);
    padding: 18px;
  }
  .footer{
    font-size: 12px;
    text-align: center;
  }
  `]
})
export class AuthLayoutComponent {}
