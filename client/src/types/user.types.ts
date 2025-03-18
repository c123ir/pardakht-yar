// client/src/types/user.types.ts
// تایپ‌های مربوط به کاربران

export interface User {
  id: number;
  username: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateUserInput {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: Role;
  isActive?: boolean;
}

export interface UpdateUserInput {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: Role;
  isActive?: boolean;
  password?: string;
}

export type Role = 'ADMIN' | 'FINANCIAL_MANAGER' | 'ACCOUNTANT' | 'SELLER' | 'CEO' | 'PROCUREMENT';