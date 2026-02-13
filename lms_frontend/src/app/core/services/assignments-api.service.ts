import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { Assignment, Submission } from '../models/lms.models';

@Injectable({ providedIn: 'root' })
export class AssignmentsApiService {
  constructor(private readonly api: ApiClientService) {}

  // PUBLIC_INTERFACE
  listAssignments(): Observable<Assignment[]> {
    /** List assignments for current user across courses (or active course context). */
    return this.api.get<Assignment[]>('/assignments');
  }

  // PUBLIC_INTERFACE
  getAssignment(assignmentId: string): Observable<Assignment> {
    /** Retrieve an assignment detail. */
    return this.api.get<Assignment>(`/assignments/${assignmentId}`);
  }

  // PUBLIC_INTERFACE
  submit(assignmentId: string, content: string): Observable<Submission> {
    /** Create or update a submission for current user. */
    return this.api.post<Submission>(`/assignments/${assignmentId}/submissions`, { content });
  }

  // PUBLIC_INTERFACE
  listSubmissions(assignmentId: string): Observable<Submission[]> {
    /** List submissions (instructor/admin). */
    return this.api.get<Submission[]>(`/assignments/${assignmentId}/submissions`);
  }

  // PUBLIC_INTERFACE
  gradeSubmission(submissionId: string, grade: number, feedback?: string): Observable<Submission> {
    /** Grade a submission (instructor/admin). */
    return this.api.put<Submission>(`/submissions/${submissionId}/grade`, { grade, feedback });
  }
}
