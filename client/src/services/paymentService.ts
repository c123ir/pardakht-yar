// client/src/services/paymentService.ts
// سرویس مدیریت پرداخت‌ها

import api from './api';
import { PaymentRequest } from '../types/payment.types';

// تایپ پارامترهای جستجو
interface PaymentSearchParams {
  page?: number;
  limit?: number;
  status?: string;
  groupId?: number;
  contactId?: number;
  startDate?: string;
  endDate?: string;
}

// گرفتن لیست پرداخت‌ها
const getPayments = async (params: PaymentSearchParams = {}) => {
  try {
    const response = await api.get('/payments', { params });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت لیست پرداخت‌ها'
    );
  }
};

// گرفتن جزئیات یک پرداخت
const getPaymentById = async (id: number) => {
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
const createPayment = async (paymentData: Partial<PaymentRequest>) => {
  try {
    const response = await api.post('/payments', paymentData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در ایجاد درخواست پرداخت'
    );
  }
};

// به‌روزرسانی پرداخت
const updatePayment = async (id: number, paymentData: Partial<PaymentRequest>) => {
  try {
    const response = await api.put(`/payments/${id}`, paymentData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در به‌روزرسانی پرداخت'
    );
  }
};

// آپلود تصویر فیش پرداخت
const uploadPaymentImage = async (paymentId: number, imageFile: File) => {
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
const getPaymentImages = async (paymentId: number) => {
  try {
    const response = await api.get(`/payments/${paymentId}/images`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت تصاویر پرداخت'
    );
  }
};

// ارسال پیامک اطلاع‌رسانی
const sendPaymentSMS = async (paymentId: number) => {
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
  sendPaymentSMS,
};
