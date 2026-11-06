export type UserRole = 'owner' | 'admin' | 'member';

export interface TenantContext {
  userId: string;
  userEmail: string;
  organizationId: string;
  role: UserRole;
}

export interface UserSession {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

