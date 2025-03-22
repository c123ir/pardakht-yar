export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  _avatarUpdated?: number;
}

export interface CreateUserInput {
  username: string;
  password: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
  role?: UserRole;
  avatar?: string;
}

export interface UpdateUserInput {
  fullName: string;
  email: string;
  phone: string;
  password?: string;
  isActive: boolean;
  avatar?: string;
}

export type UserRole = 'ADMIN' | 'USER';

export const getRoleName = (role: UserRole): string => {
  switch (role) {
    case 'ADMIN':
      return 'مدیر';
    case 'USER':
      return 'کاربر';
    default:
      return role;
  }
}; 