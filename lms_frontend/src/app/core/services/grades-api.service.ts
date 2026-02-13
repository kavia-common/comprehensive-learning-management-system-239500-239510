import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { GradeItem } from '../models/lms.models';

@Injectable({ providedIn: 'root' })
export class GradesApiService {
  constructor(private readonly api: ApiClientService) {}

  // PUBLIC_INTERFACE
  listMyGrades(): Observable<GradeItem[]> {
    /** List current user's grades. */
    return this.api.get<GradeItem[]>('/grades/me');
  }
}
