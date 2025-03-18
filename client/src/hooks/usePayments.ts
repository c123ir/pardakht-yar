import { useState } from 'react';
import axios from 'axios';
import { Payment, PaymentStatus } from '../types/payment.types';

interface PaymentFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: PaymentStatus;
  startDate?: string;
  endDate?: string;
  groupId?: string;
  contactId?: string;
}

interface PaymentData {
  title: string;
  amount: number;
  effectiveDate: string;
  description?: string;
  groupId?: number | null;
  contactId?: number | null;
  beneficiaryName?: string;
  beneficiaryPhone?: string;
}

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = async (filters: PaymentFilters) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/payments', { params: filters });
      setPayments(response.data.items);
      setTotalItems(response.data.total);
    } catch (err) {
      setError('خطا در دریافت لیست پرداخت‌ها');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPayment = async (id: number) => {
    try {
      const response = await axios.get(`/api/payments/${id}`);
      return response.data;
    } catch (err) {
      throw new Error('خطا در دریافت اطلاعات پرداخت');
    }
  };

  const createPayment = async (data: PaymentData) => {
    try {
      const response = await axios.post('/api/payments', data);
      return response.data;
    } catch (err) {
      throw new Error('خطا در ایجاد پرداخت');
    }
  };

  const updatePayment = async (id: number, data: PaymentData) => {
    try {
      const response = await axios.put(`/api/payments/${id}`, data);
      return response.data;
    } catch (err) {
      throw new Error('خطا در به‌روزرسانی پرداخت');
    }
  };

  const deletePayment = async (id: number) => {
    try {
      await axios.delete(`/api/payments/${id}`);
    } catch (err) {
      throw new Error('خطا در حذف پرداخت');
    }
  };

  const sendNotification = async (id: number) => {
    try {
      await axios.post(`/api/payments/${id}/notify`);
    } catch (err) {
      throw new Error('خطا در ارسال پیامک');
    }
  };

  const getPaymentImages = async (id: number) => {
    try {
      const response = await axios.get(`/api/payments/${id}/images`);
      return response.data;
    } catch (err) {
      throw new Error('خطا در دریافت تصاویر');
    }
  };

  const uploadPaymentImage = async (id: number, formData: FormData) => {
    try {
      const response = await axios.post(`/api/payments/${id}/images`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      throw new Error('خطا در آپلود تصویر');
    }
  };

  const deletePaymentImage = async (paymentId: number, imageId: number) => {
    try {
      await axios.delete(`/api/payments/${paymentId}/images/${imageId}`);
    } catch (err) {
      throw new Error('خطا در حذف تصویر');
    }
  };

  return {
    payments,
    totalItems,
    loading,
    error,
    fetchPayments,
    getPayment,
    createPayment,
    updatePayment,
    deletePayment,
    sendNotification,
    getPaymentImages,
    uploadPaymentImage,
    deletePaymentImage,
  };
}; 