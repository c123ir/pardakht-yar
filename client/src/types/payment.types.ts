// client/src/types/payment.types.ts
// تایپ‌های مربوط به پرداخت‌ها

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';

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
  images?: PaymentImage[];
}

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
}

export interface PaymentFilter {
  status?: PaymentStatus;
  groupId?: number;
  contactId?: number;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
