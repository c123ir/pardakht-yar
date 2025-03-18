// client/src/types/payment.types.ts
// تایپ‌های مربوط به پرداخت‌ها

import { Contact } from './contact.types';
import { Group } from './group.types';
import { User } from './user.types';

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';

export interface PaymentImage {
  id: number;
  paymentId: number;
  fileName: string;
  filePath: string;
  thumbnailPath?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  hasWatermark: boolean;
  uploaderId: number;
  uploadedAt: string;
  uploadedBy?: {
    id: number;
    fullName: string;
  };
}

export interface Notification {
  id: number;
  paymentId: number;
  recipientType: string;
  recipientId: number;
  message: string;
  method: string;
  status: string;
  sentAt?: string;
  createdAt: string;
}

export interface PaymentRequest {
  id: number;
  title: string;
  amount: number;
  effectiveDate: string;
  description?: string;
  status: PaymentStatus;
  paymentType?: string;
  groupId?: number | null;
  contactId?: number | null;
  beneficiaryName?: string;
  beneficiaryPhone?: string;
  isSMSSent: boolean;
  smsSentAt?: string;
  paymentDate?: string;
  paidById?: number;
  creatorId: number;
  updaterId?: number;
  createdAt: string;
  updatedAt: string;
  
  // روابط
  contact?: Contact;
  group?: Group;
  createdBy?: {
    id: number;
    fullName: string;
  };
  paidBy?: {
    id: number;
    fullName: string;
  };
  updatedBy?: {
    id: number;
    fullName: string;
  };
  images?: PaymentImage[];
  notifications?: Notification[];
}

export interface CreatePaymentDto {
  title: string;
  amount: number;
  effectiveDate: string;
  description?: string;
  groupId?: number | null;
  contactId?: number | null;
  beneficiaryName?: string;
  beneficiaryPhone?: string;
}

export interface UpdatePaymentDto {
  title?: string;
  amount?: number;
  effectiveDate?: string;
  description?: string;
  status?: PaymentStatus;
  groupId?: number | null;
  contactId?: number | null;
  beneficiaryName?: string;
  beneficiaryPhone?: string;
}

export interface PaymentFilter {
  status?: PaymentStatus;
  groupId?: number | string;
  contactId?: number | string;
  startDate?: string;
  endDate?: string;
  search?: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedPaymentsResponse {
  success: boolean;
  data: PaymentRequest[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}