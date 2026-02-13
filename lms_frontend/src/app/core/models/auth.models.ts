export type UserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  roles: UserRole[];
};

export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
};

export type AuthResponse = {
  user: AuthUser;
  tokens: AuthTokens;
};
