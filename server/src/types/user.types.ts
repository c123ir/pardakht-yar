// server/src/types/user.types.ts
// تایپ‌های مربوط به کاربران سیستم

import { Role } from '@prisma/client';

export interface User {
  id: number;
  username: string;
  password?: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserInfo {
  id: number;
  fullName: string;
  role: Role;
}

export interface CreateUserDto {
  username: string;
  password: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: Role;
}

export interface UpdateUserDto {
  fullName?: string;
  email?: string;
  phone?: string;
  role?: Role;
  isActive?: boolean;
  password?: string;
}

export interface UserFilter {
  role?: Role;
  isActive?: boolean;
  search?: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} 