// client/src/types/auth.types.ts
// تایپ‌های مربوط به احراز هویت

export interface User {
  id: number;
  username: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  lastLogin?: string;
}

export type Role = 'ADMIN' | 'FINANCIAL_MANAGER' | 'ACCOUNTANT' | 'SELLER' | 'CEO' | 'PROCUREMENT';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
