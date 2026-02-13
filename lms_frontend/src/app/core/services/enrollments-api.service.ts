import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { Enrollment } from '../models/lms.models';

@Injectable({ providedIn: 'root' })
export class EnrollmentsApiService {
  constructor(private readonly api: ApiClientService) {}

  // PUBLIC_INTERFACE
  listMyEnrollments(): Observable<Enrollment[]> {
    /** List current user's enrollments. */
    return this.api.get<Enrollment[]>('/enrollments/me');
  }
}
