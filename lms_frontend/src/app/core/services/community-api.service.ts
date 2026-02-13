import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from './api-client.service';
import { Announcement, DiscussionThread } from '../models/lms.models';

@Injectable({ providedIn: 'root' })
export class CommunityApiService {
  constructor(private readonly api: ApiClientService) {}

  // PUBLIC_INTERFACE
  listThreads(): Observable<DiscussionThread[]> {
    /** List discussion threads. */
    return this.api.get<DiscussionThread[]>('/discussions');
  }

  // PUBLIC_INTERFACE
  createThread(courseId: string, title: string): Observable<DiscussionThread> {
    /** Create a new thread. */
    return this.api.post<DiscussionThread>('/discussions', { courseId, title });
  }

  // PUBLIC_INTERFACE
  listAnnouncements(): Observable<Announcement[]> {
    /** List announcements. */
    return this.api.get<Announcement[]>('/announcements');
  }

  // PUBLIC_INTERFACE
  createAnnouncement(title: string, message: string, courseId?: string): Observable<Announcement> {
    /** Create an announcement (instructor/admin). */
    return this.api.post<Announcement>('/announcements', { title, message, courseId });
  }
}
