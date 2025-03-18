// client/src/types/contact.types.ts
// تایپ‌های مربوط به طرف‌حساب‌ها

export interface Contact {
  id: number;
  companyName: string;
  ceoName?: string;
  fieldOfActivity?: string;
  accountantName?: string;
  accountantPhone?: string;
  email?: string;
  address?: string;
  bankInfo?: {
    bankName?: string;
    accountNumber?: string;
    cardNumber?: string;
    iban?: string;
  };
  notes?: string;
  accessToken?: string;
  creatorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFilter {
  search?: string;
  page: number;
  limit: number;
}
