// server/src/types/contact.types.ts
// تایپ‌های مربوط به مخاطبین سیستم

import { User } from './user.types';

export interface Contact {
  id: number;
  companyName: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  nationalId?: string;
  economicCode?: string;
  description?: string;
  bankInfo?: any;
  accessToken?: string;
  creatorId: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: User;
}

export interface CreateContactDto {
  companyName: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  nationalId?: string;
  economicCode?: string;
  description?: string;
  bankInfo?: any;
}

export interface UpdateContactDto {
  companyName?: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  nationalId?: string;
  economicCode?: string;
  description?: string;
  bankInfo?: any;
}

export interface ContactFilter {
  creatorId?: number;
  search?: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ContactPortalActivity {
  id: number;
  contactId: number;
  paymentId?: number;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  feedback?: string;
  createdAt: string;
} 