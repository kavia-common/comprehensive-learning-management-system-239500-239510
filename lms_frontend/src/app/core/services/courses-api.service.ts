import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { Course } from '../models/lms.models';

@Injectable({ providedIn: 'root' })
export class CoursesApiService {
  constructor(private readonly api: ApiClientService) {}

  // PUBLIC_INTERFACE
  listCourses(): Observable<Course[]> {
    /** List courses visible to current user (or public catalog). */
    return this.api.get<Course[]>('/courses');
  }

  // PUBLIC_INTERFACE
  getCourse(courseId: string): Observable<Course> {
    /** Retrieve a single course detail. */
    return this.api.get<Course>(`/courses/${courseId}`);
  }

  // PUBLIC_INTERFACE
  enroll(courseId: string): Observable<{ enrollmentId: string }> {
    /** Enroll current user into course. */
    return this.api.post<{ enrollmentId: string }>(`/courses/${courseId}/enroll`, {});
  }
}
