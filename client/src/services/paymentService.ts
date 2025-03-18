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
} from '../types/payment.types';
import { formatDateToISO } from '../utils/dateUtils';

// دریافت لیست پرداخت‌ها
const getPayments = async (params: PaymentFilter = {
  page: 1,
  limit: 10,
}): Promise<PaginatedPaymentsResponse> => {
  try {
    // تبدیل تاریخ‌ها به فرمت ISO
    const formattedParams = {
      ...params,
      startDate: params.startDate ? formatDateToISO(params.startDate) : undefined,
      endDate: params.endDate ? formatDateToISO(params.endDate) : undefined,
    };
    
    const response = await api.get('/payments', { params: formattedParams });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت لیست پرداخت‌ها'
    );
  }
};

// دریافت جزئیات یک پرداخت
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

// ایجاد درخواست پرداخت جدید
const createPayment = async (paymentData: CreatePaymentDto): Promise<PaymentRequest> => {
  try {
    // تبدیل تاریخ به فرمت ISO
    const formattedData = {
      ...paymentData,
      effectiveDate: formatDateToISO(paymentData.effectiveDate),
    };
    
    const response = await api.post('/payments', formattedData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در ایجاد درخواست پرداخت'
    );
  }
};

// به‌روزرسانی درخواست پرداخت
const updatePayment = async (id: number, paymentData: UpdatePaymentDto): Promise<PaymentRequest> => {
  try {
    // تبدیل تاریخ به فرمت ISO اگر وجود داشته باشد
    const formattedData = {
      ...paymentData,
      effectiveDate: paymentData.effectiveDate ? formatDateToISO(paymentData.effectiveDate) : undefined,
    };
    
    const response = await api.put(`/payments/${id}`, formattedData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در به‌روزرسانی پرداخت'
    );
  }
};

// آپلود تصویر فیش پرداخت
const uploadPaymentImage = async (paymentId: number, imageFile: File): Promise<PaymentImage> => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post(`/payments/${paymentId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در آپلود تصویر'
    );
  }
};

// دریافت تصاویر پرداخت
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

// تغییر وضعیت پرداخت
const changePaymentStatus = async (id: number, status: string): Promise<PaymentRequest> => {
  try {
    const response = await api.patch(`/payments/${id}/status`, { status });
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در تغییر وضعیت پرداخت'
    );
  }
};

// ارسال پیامک اطلاع‌رسانی
const sendPaymentSMS = async (paymentId: number): Promise<any> => {
  try {
    const response = await api.post(`/payments/${paymentId}/notify`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در ارسال پیامک'
    );
  }
};

export default {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  uploadPaymentImage,
  getPaymentImages,
  changePaymentStatus,
  sendPaymentSMS,
};