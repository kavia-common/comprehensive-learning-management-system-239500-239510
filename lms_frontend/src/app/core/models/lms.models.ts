export type Course = {
  id: string;
  code?: string;
  title: string;
  description?: string;
  instructorName?: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
};

export type Enrollment = {
  id: string;
  courseId: string;
  courseTitle?: string;
  userId: string;
  role: 'STUDENT' | 'INSTRUCTOR';
  status?: 'ACTIVE' | 'DROPPED' | 'COMPLETED';
};

export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  dueAt?: string;
  points?: number;
};

export type Submission = {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt?: string;
  content?: string;
  grade?: number;
  feedback?: string;
};

export type GradeItem = {
  id: string;
  courseId: string;
  courseTitle?: string;
  assignmentTitle?: string;
  score?: number;
  points?: number;
};

export type DiscussionThread = {
  id: string;
  courseId: string;
  title: string;
  createdAt?: string;
  createdByName?: string;
};

export type Announcement = {
  id: string;
  courseId?: string;
  title: string;
  message: string;
  createdAt?: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  message: string;
  createdAt?: string;
  read?: boolean;
  type?: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
};
