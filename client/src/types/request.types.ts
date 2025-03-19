// client/src/types/request.types.ts
// تایپ‌های مربوط به سیستم درخواست‌ها

// تایپ برای پاسخ‌های API
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// تایپ برای پاسخ‌های صفحه‌بندی شده API
export interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

// تنظیمات فیلد
export interface FieldSetting {
  enabled: boolean;
  required: boolean;
  label: string;
}

// تنظیمات فیلدهای پیش‌فرض
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

// تایپ برای نوع درخواست
export interface RequestType {
  id: number;
  name: string;
  description?: string;
  isActive: boolean;
  fieldConfig: FieldConfig;
  createdAt: string;
  updatedAt: string;
  createdBy: number;
}

// DTO برای ایجاد نوع درخواست جدید
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

// مدل درخواست
export interface Request {
  id: number;
  title: string;
  description?: string;
  amount?: number;
  effectiveDate?: string;
  status: RequestStatus;
  requestTypeId: number;
  requestType: RequestType;
  userId: number;
  user: {
    id: number;
    fullName: string;
  };
  beneficiaryName?: string;
  beneficiaryPhone?: string;
  contactId?: number;
  contact?: {
    id: number;
    fullName: string;
  };
  groupId?: number;
  group?: RequestGroup;
  subGroupId?: number;
  subGroup?: RequestSubGroup;
  createdAt: string;
  updatedAt: string;
  customFields?: Record<string, any>;
}

// انواع وضعیت درخواست
export enum RequestStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

// تایپ برای گروه درخواست
export interface RequestGroup {
  id: number;
  name: string;
  description?: string;
  requestTypeId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  requestType?: RequestType;
  _count?: {
    subGroups: number;
    requests: number;
  };
}

// DTO برای ایجاد گروه درخواست جدید
export interface CreateRequestGroupDto {
  name: string;
  description?: string;
  requestTypeId: number;
}

// DTO برای بروزرسانی گروه درخواست
export interface UpdateRequestGroupDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}

// تایپ برای زیرگروه درخواست
export interface RequestSubGroup {
  id: number;
  name: string;
  description?: string;
  groupId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  group?: RequestGroup;
  _count?: {
    requests: number;
  };
}

// DTO برای ایجاد زیرگروه درخواست جدید
export interface CreateRequestSubGroupDto {
  name: string;
  description?: string;
  groupId: number;
}

// DTO برای بروزرسانی زیرگروه درخواست
export interface UpdateRequestSubGroupDto {
  name?: string;
  description?: string;
  isActive?: boolean;
}

// DTO برای ایجاد درخواست جدید
export interface CreateRequestDto {
  title: string;
  description?: string;
  amount?: number;
  effectiveDate?: string;
  requestTypeId: number;
  beneficiaryName?: string;
  beneficiaryPhone?: string;
  contactId?: number;
  groupId?: number;
  subGroupId?: number;
  customFields?: Record<string, any>;
}

// DTO برای بروزرسانی درخواست
export interface UpdateRequestDto {
  title?: string;
  description?: string;
  amount?: number;
  effectiveDate?: string;
  status?: RequestStatus;
  beneficiaryName?: string;
  beneficiaryPhone?: string;
  contactId?: number;
  groupId?: number;
  subGroupId?: number;
  customFields?: Record<string, any>;
} 