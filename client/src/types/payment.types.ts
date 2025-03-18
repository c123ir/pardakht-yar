// client/src/types/payment.types.ts
// تایپ‌های مربوط به پرداخت‌ها

import { Group } from './group.types';
import { Contact } from './contact.types';

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';

export interface Payment {
  id: number;
  title: string;
  amount: number;
  effectiveDate: string;
  description?: string;
  status: PaymentStatus;
  groupId?: number;
  group?: Group;
  contactId?: number;
  contact?: Contact;
  beneficiaryName?: string;
  beneficiaryPhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentImage {
  id: number;
  paymentId: number;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface PaymentRequest {
  id: number;
  title: string;
  amount: number;
  effectiveDate: string;
  description?: string;
  status: PaymentStatus;
  paymentType?: string;
  groupId?: number;
  contactId?: number;
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
  group?: {
    id: number;
    title: string;
  };
  contact?: {
    id: number;
    companyName: string;
  };
  createdBy?: {
    id: number;
    fullName: string;
  };
  paidBy?: {
    id: number;
    fullName: string;
  };
  images?: PaymentImage[];
}

export interface CreatePaymentDto {
  title: string;
  amount: number;
  effectiveDate: string;
  description?: string;
  groupId?: number;
  contactId?: number;
  beneficiaryName?: string;
  beneficiaryPhone?: string;
}

export interface UpdatePaymentDto {
  title?: string;
  amount?: number;
  effectiveDate?: string;
  description?: string;
  status?: PaymentStatus;
  groupId?: number;
  contactId?: number;
  beneficiaryName?: string;
  beneficiaryPhone?: string;
}

export interface PaymentFilter {
  status?: PaymentStatus;
  groupId?: number;
  contactId?: number;
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