// client/src/types/user.types.ts
// تایپ‌های مربوط به کاربران

export type Role = 'ADMIN' | 'FINANCIAL_MANAGER' | 'ACCOUNTANT' | 'SELLER' | 'CEO' | 'PROCUREMENT';

export interface User {
  id: number;
  username: string;
  fullName: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role: Role;
  isActive: boolean;
  lastLogin?: Date;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserInput {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role: Role;
  isActive?: boolean;
}

export interface UpdateUserInput {
  username?: string;
  password?: string;
  fullName?: string;
  email?: string;
  phone?: string;
  avatar?: string;
  role?: Role;
  isActive?: boolean;
}