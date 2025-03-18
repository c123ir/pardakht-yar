// client/src/services/paymentService.ts
// سرویس مدیریت پرداخت‌ها

import api from './api';
import { 
  PaymentRequest, 
  PaymentFilter, 
  CreatePaymentDto, 
  UpdatePaymentDto,
  PaymentImage,
  PaginatedPaymentsResponse,
  PaymentStatus
} from '../types/payment.types';
import { formatDateToISO } from '../utils/dateUtils';
import { convertPersianToEnglishNumbers } from '../utils/stringUtils';

/**
 * دریافت لیست درخواست‌های پرداخت با فیلتر
 */
const getPayments = async (filters: PaymentFilter = {
  page: 1,
  limit: 10,
}): Promise<PaginatedPaymentsResponse> => {
  try {
    // تبدیل تاریخ‌ها به فرمت ISO
    const formattedFilters = { ...filters };
    
    if (filters.startDate) {
      formattedFilters.startDate = formatDateToISO(filters.startDate);
    }
    
    if (filters.endDate) {
      formattedFilters.endDate = formatDateToISO(filters.endDate);
    }
    
    // تبدیل شماره‌های صفحه و تعداد به عدد
    formattedFilters.page = Number(filters.page);
    formattedFilters.limit = Number(filters.limit);
    
    const response = await api.get('/payments', { params: formattedFilters });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت لیست پرداخت‌ها'
    );
  }
};

/**
 * دریافت اطلاعات یک درخواست پرداخت با شناسه
 */
const getPaymentById = async (id: number): Promise<PaymentRequest> => {
  try {
    const response = await api.get(`/payments/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت اطلاعات پرداخت'
    );
  }
};

/**
 * ایجاد درخواست پرداخت جدید
 */
const createPayment = async (paymentData: CreatePaymentDto): Promise<PaymentRequest> => {
  try {
    // تبدیل اعداد فارسی به انگلیسی
    const amount = convertPersianToEnglishNumbers(paymentData.amount.toString());
    const beneficiaryPhone = paymentData.beneficiaryPhone ? 
      convertPersianToEnglishNumbers(paymentData.beneficiaryPhone) : 
      undefined;
    
    // تبدیل تاریخ به فرمت ISO
    const effectiveDate = formatDateToISO(paymentData.effectiveDate);
    
    // ایجاد داده‌های پرداخت
    const formattedData = {
      ...paymentData,
      amount: parseInt(amount),
      beneficiaryPhone,
      effectiveDate
    };
    
    const response = await api.post('/payments', formattedData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در ایجاد درخواست پرداخت'
    );
  }
};

/**
 * به‌روزرسانی درخواست پرداخت
 */
const updatePayment = async (id: number, paymentData: UpdatePaymentDto): Promise<PaymentRequest> => {
  try {
    // فرمت کردن داده‌ها
    const formattedData: any = { ...paymentData };
    
    // تبدیل مبلغ اگر وجود داشته باشد
    if (formattedData.amount !== undefined) {
      formattedData.amount = parseInt(convertPersianToEnglishNumbers(formattedData.amount.toString()));
    }
    
    // تبدیل شماره موبایل اگر وجود داشته باشد
    if (formattedData.beneficiaryPhone) {
      formattedData.beneficiaryPhone = convertPersianToEnglishNumbers(formattedData.beneficiaryPhone);
    }
    
    // تبدیل تاریخ اگر وجود داشته باشد
    if (formattedData.effectiveDate) {
      formattedData.effectiveDate = formatDateToISO(formattedData.effectiveDate);
    }
    
    const response = await api.put(`/payments/${id}`, formattedData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در به‌روزرسانی درخواست پرداخت'
    );
  }
};

/**
 * تغییر وضعیت پرداخت
 */
const changePaymentStatus = async (id: number, status: PaymentStatus): Promise<PaymentRequest> => {
  try {
    const response = await api.patch(`/payments/${id}/status`, { status });
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در تغییر وضعیت پرداخت'
    );
  }
};

/**
 * حذف درخواست پرداخت
 */
const deletePayment = async (id: number): Promise<void> => {
  try {
    await api.delete(`/payments/${id}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در حذف درخواست پرداخت'
    );
  }
};

/**
 * آپلود تصویر فیش پرداخت
 */
const uploadPaymentImage = async (paymentId: number, image: File): Promise<PaymentImage> => {
  try {
    const formData = new FormData();
    formData.append('image', image);
    
    const response = await api.post(`/payments/${paymentId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در آپلود تصویر فیش پرداخت'
    );
  }
};

/**
 * دریافت تصاویر یک پرداخت
 */
const getPaymentImages = async (paymentId: number): Promise<PaymentImage[]> => {
  try {
    const response = await api.get(`/payments/${paymentId}/images`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت تصاویر پرداخت'
    );
  }
};

/**
 * حذف تصویر پرداخت
 */
const deletePaymentImage = async (paymentId: number, imageId: number): Promise<void> => {
  try {
    await api.delete(`/payments/${paymentId}/images/${imageId}`);
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در حذف تصویر پرداخت'
    );
  }
};

/**
 * ارسال اطلاع‌رسانی پیامکی
 */
const sendPaymentNotification = async (paymentId: number): Promise<any> => {
  try {
    const response = await api.post(`/payments/${paymentId}/notify`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در ارسال اطلاع‌رسانی پیامکی'
    );
  }
};

export default {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  changePaymentStatus,
  deletePayment,
  uploadPaymentImage,
  getPaymentImages,
  deletePaymentImage,
  sendPaymentNotification
};