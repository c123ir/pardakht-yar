// client/src/types/contact.types.ts
// تایپ‌های مربوط به طرف‌حساب‌ها

export interface BankInfo {
  bankName?: string;
  accountNumber?: string;
  cardNumber?: string;
  iban?: string;
  accountOwner?: string;
}

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
  createdAt: string;
  updatedAt: string;
  bankInfo?: BankInfo;
  notes?: string;
  accessToken?: string;
  creatorId: number;
  // فیلدهای اضافه شده
  ceoName?: string;
  fieldOfActivity?: string;
  accountantName?: string;
  accountantPhone?: string;
  // روابط
  createdBy?: {
    fullName: string;
  };
  paymentRequests?: Array<{
    id: number;
    title: string;
    amount: number;
    status: string;
    createdAt: string;
  }>;
}

export interface ContactFilter {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedContactsResponse {
  success: boolean;
  data: Contact[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}