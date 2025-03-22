export interface User {
  id: string;
  username: string;
  fullName: string;
  email?: string;
  phone?: string;
  isActive: boolean;
  role: string;
  avatar?: string;
  _avatarUpdated?: number;
  createdAt?: string;
  updatedAt?: string;
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
  role?: UserRole;
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