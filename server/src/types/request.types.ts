// server/src/types/request.types.ts
// تایپ‌های مربوط به سیستم درخواست‌های داینامیک

import { User } from './user.types';
import { Contact } from './contact.types';
import { PaymentGroup } from './group.types';

export type RequestStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED' | 'COMPLETED' | 'CANCELED';

// تنظیمات فیلد
export interface FieldSetting {
  enabled: boolean;
  required: boolean;
  label: string;
}

// تنظیمات فیلدهای فرم
export interface FieldConfig {
  title: FieldSetting;
  description: FieldSetting;
  amount: FieldSetting;
  effectiveDate: FieldSetting;
  beneficiaryName: FieldSetting;
  beneficiaryPhone: FieldSetting;
  contactId: FieldSetting;
  groupId: FieldSetting;
  [key: string]: FieldSetting; // برای فیلدهای سفارشی
}

// نوع درخواست
export interface RequestType {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  fieldConfig: FieldConfig;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  creator?: {
    id: number;
    fullName: string;
  };
}

// درخواست
export interface Request {
  id: number;
  requestTypeId: number;
  title: string;
  description?: string;
  amount?: number;
  effectiveDate?: string;
  beneficiaryName?: string;
  beneficiaryPhone?: string;
  contactId?: number;
  groupId?: number;
  status: RequestStatus;
  creatorId: number;
  assigneeId?: number;
  createdAt: string;
  updatedAt: string;
  
  // روابط
  requestType?: RequestType;
  creator?: {
    id: number;
    fullName: string;
  };
  assignee?: {
    id: number;
    fullName: string;
  };
  contact?: Contact;
  group?: PaymentGroup;
  attachments?: RequestAttachment[];
  activities?: RequestActivity[];
}

// پیوست درخواست
export interface RequestAttachment {
  id: number;
  requestId: number;
  filePath: string;
  fileType: string;
  fileName: string;
  uploadedBy: number;
  uploadedAt: string;
  
  // روابط
  uploader?: {
    id: number;
    fullName: string;
  };
}

// فعالیت درخواست
export interface RequestActivity {
  id: number;
  requestId: number;
  userId: number;
  action: string;
  details?: any;
  createdAt: string;
  
  // روابط
  user?: {
    id: number;
    fullName: string;
  };
}

// DTO برای ایجاد نوع درخواست
export interface CreateRequestTypeDto {
  name: string;
  description?: string;
  fieldConfig: FieldConfig;
}

// DTO برای بروزرسانی نوع درخواست
export interface UpdateRequestTypeDto {
  name?: string;
  description?: string;
  isActive?: boolean;
  fieldConfig?: FieldConfig;
}

// DTO برای ایجاد درخواست
export interface CreateRequestDto {
  requestTypeId: number;
  title: string;
  description?: string;
  amount?: number;
  effectiveDate?: string;
  beneficiaryName?: string;
  beneficiaryPhone?: string;
  contactId?: number;
  groupId?: number;
  assigneeId?: number;
}

// DTO برای بروزرسانی درخواست
export interface UpdateRequestDto {
  title?: string;
  description?: string;
  amount?: number;
  effectiveDate?: string;
  beneficiaryName?: string;
  beneficiaryPhone?: string;
  contactId?: number;
  groupId?: number;
  status?: RequestStatus;
  assigneeId?: number;
}

// فیلتر درخواست‌ها
export interface RequestFilter {
  requestTypeId?: number;
  status?: RequestStatus;
  creatorId?: number;
  assigneeId?: number;
  contactId?: number;
  groupId?: number;
  startDate?: string;
  endDate?: string;
  search?: string;
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// پاسخ پاجینیت شده درخواست‌ها
export interface PaginatedRequestsResponse {
  success: boolean;
  data: Request[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
} 