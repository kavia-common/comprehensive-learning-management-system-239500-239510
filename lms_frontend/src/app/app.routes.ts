import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout.component';
import { AppShellComponent } from './layouts/app-shell.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

import { LoginPageComponent } from './pages/auth/login-page.component';
import { RegisterPageComponent } from './pages/auth/register-page.component';

import { StudentDashboardPageComponent } from './pages/dashboards/student-dashboard-page.component';
import { InstructorDashboardPageComponent } from './pages/dashboards/instructor-dashboard-page.component';
import { AdminDashboardPageComponent } from './pages/dashboards/admin-dashboard-page.component';

import { CourseCatalogPageComponent } from './pages/courses/course-catalog-page.component';
import { CourseDetailPageComponent } from './pages/courses/course-detail-page.component';

import { EnrollmentsPageComponent } from './pages/enrollments/enrollments-page.component';

import { AssignmentsPageComponent } from './pages/assignments/assignments-page.component';
import { AssignmentDetailPageComponent } from './pages/assignments/assignment-detail-page.component';
import { GradesPageComponent } from './pages/grades/grades-page.component';

import { DiscussionsPageComponent } from './pages/discussions/discussions-page.component';
import { AnnouncementsPageComponent } from './pages/announcements/announcements-page.component';

import { NotificationsPageComponent } from './pages/notifications/notifications-page.component';

import { AdminUsersPageComponent } from './pages/admin/admin-users-page.component';
import { AdminCoursesPageComponent } from './pages/admin/admin-courses-page.component';
import { AdminReportsPageComponent } from './pages/admin/admin-reports-page.component';

import { NotFoundPageComponent } from './pages/not-found-page.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'login' },
      { path: 'login', component: LoginPageComponent, title: 'Login | LMS' },
      { path: 'register', component: RegisterPageComponent, title: 'Register | LMS' },
    ],
  },
  {
    path: 'app',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

      // Dashboards by role (we keep a unified route and show appropriate cards + quick links)
      { path: 'dashboard', component: StudentDashboardPageComponent, title: 'Dashboard | LMS' },
      { path: 'instructor', component: InstructorDashboardPageComponent, canActivate: [roleGuard(['INSTRUCTOR', 'ADMIN'])], title: 'Instructor | LMS' },
      { path: 'admin', component: AdminDashboardPageComponent, canActivate: [roleGuard(['ADMIN'])], title: 'Admin | LMS' },

      // Courses
      { path: 'courses', component: CourseCatalogPageComponent, title: 'Courses | LMS' },
      { path: 'courses/:courseId', component: CourseDetailPageComponent, title: 'Course | LMS' },

      // Enrollment
      { path: 'enrollments', component: EnrollmentsPageComponent, title: 'Enrollments | LMS' },

      // Assignments/grades
      { path: 'assignments', component: AssignmentsPageComponent, title: 'Assignments | LMS' },
      { path: 'assignments/:assignmentId', component: AssignmentDetailPageComponent, title: 'Assignment | LMS' },
      { path: 'grades', component: GradesPageComponent, title: 'Grades | LMS' },

      // Discussions/announcements
      { path: 'discussions', component: DiscussionsPageComponent, title: 'Discussions | LMS' },
      { path: 'announcements', component: AnnouncementsPageComponent, title: 'Announcements | LMS' },

      // Notifications
      { path: 'notifications', component: NotificationsPageComponent, title: 'Notifications | LMS' },

      // Admin management
      { path: 'admin/users', component: AdminUsersPageComponent, canActivate: [roleGuard(['ADMIN'])], title: 'Users | LMS' },
      { path: 'admin/courses', component: AdminCoursesPageComponent, canActivate: [roleGuard(['ADMIN'])], title: 'Manage Courses | LMS' },
      { path: 'admin/reports', component: AdminReportsPageComponent, canActivate: [roleGuard(['ADMIN'])], title: 'Reports | LMS' },
    ],
  },

  { path: '**', component: NotFoundPageComponent, title: 'Not Found | LMS' },
];
