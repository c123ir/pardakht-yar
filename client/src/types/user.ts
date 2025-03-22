export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  email?: string;
  phone?: string;
  avatar?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  _avatarUpdated?: number;
}

export interface CreateUserInput {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
  role?: string;
  avatar?: string;
  _avatarUpdated?: number;
}

export interface UpdateUserInput {
  fullName?: string;
  password?: string;
  email?: string;
  phone?: string;
  isActive?: boolean;
  role?: string;
  avatar?: string;
  _avatarUpdated?: number;
}

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