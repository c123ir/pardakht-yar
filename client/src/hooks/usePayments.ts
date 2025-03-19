// client/src/hooks/usePayments.ts
// هوک مدیریت پرداخت‌ها

import { useState } from 'react';
import { 
  PaymentRequest, 
  PaymentFilter, 
  CreatePaymentDto, 
  UpdatePaymentDto,
  PaymentImage,
  PaymentStatus,
  PaginatedPaymentsResponse
} from '../types/payment.types';
import paymentService from '../services/paymentService';

interface UsePaymentsReturn {
  payments: PaymentRequest[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  fetchPayments: (filters: PaymentFilter) => Promise<void>;
  getPaymentById: (id: number) => Promise<PaymentRequest>;
  createPayment: (data: CreatePaymentDto) => Promise<PaymentRequest>;
  updatePayment: (id: number, data: UpdatePaymentDto) => Promise<PaymentRequest>;
  changePaymentStatus: (id: number, status: PaymentStatus) => Promise<PaymentRequest>;
  deletePayment: (id: number) => Promise<void>;
  uploadPaymentImage: (paymentId: number, image: File) => Promise<PaymentImage>;
  getPaymentImages: (paymentId: number) => Promise<PaymentImage[]>;
  deletePaymentImage: (paymentId: number, imageId: number) => Promise<void>;
  sendPaymentNotification: (paymentId: number) => Promise<any>;
}

export const usePayments = (): UsePaymentsReturn => {
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);

  /**
   * دریافت لیست پرداخت‌ها با فیلتر
   */
  const fetchPayments = async (filters: PaymentFilter): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const response: PaginatedPaymentsResponse = await paymentService.getPayments(filters);
        setPayments(response.data);
        setTotalItems(response.pagination.totalItems);
      } catch (err: any) {
        console.error("خطا در دریافت لیست پرداخت‌ها:", err);
        // در صورت خطا آرایه خالی را نمایش می‌دهیم
        setPayments([]);
        setTotalItems(0);
        setError(err.message || 'خطا در دریافت لیست پرداخت‌ها');
      }
    } catch (err: any) {
      console.error("خطا در تابع fetchPayments:", err);
      setError(err.message || 'خطا در پردازش درخواست');
    } finally {
      setLoading(false);
    }
  };

  /**
   * ارسال اطلاع‌رسانی پیامکی
   */
  const sendPaymentNotification = async (paymentId: number): Promise<any> => {
    try {
      setLoading(true);
      const result = await paymentService.sendPaymentNotification(paymentId);
      return result;
    } catch (err: any) {
      throw new Error(err.message || 'خطا در ارسال اطلاع‌رسانی پیامکی');
    } finally {
      setLoading(false);
    }
  };

  /**
   * دریافت اطلاعات یک پرداخت
   */
  const getPaymentById = async (id: number): Promise<PaymentRequest> => {
    try {
      setLoading(true);
      const payment = await paymentService.getPaymentById(id);
      return payment;
    } catch (err: any) {
      throw new Error(err.message || 'خطا در دریافت اطلاعات پرداخت');
    } finally {
      setLoading(false);
    }
  };

  /**
   * ایجاد درخواست پرداخت جدید
   */
  const createPayment = async (data: CreatePaymentDto): Promise<PaymentRequest> => {
    try {
      setLoading(true);
      try {
        const newPayment = await paymentService.createPayment(data);
        return newPayment;
      } catch (err: any) {
        console.error("خطا در ایجاد درخواست پرداخت:", err);
        // ساخت پیام خطای بهتر
        if (err.response?.status === 500) {
          throw new Error("خطای سرور در ایجاد درخواست پرداخت. لطفاً از برقراری ارتباط با سرور اطمینان حاصل کنید.");
        } else {
          throw new Error(err.message || 'خطا در ایجاد درخواست پرداخت');
        }
      }
    } catch (err: any) {
      console.error("خطا در تابع createPayment:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /**
   * به‌روزرسانی درخواست پرداخت
   */
  const updatePayment = async (id: number, data: UpdatePaymentDto): Promise<PaymentRequest> => {
    try {
      setLoading(true);
      const updatedPayment = await paymentService.updatePayment(id, data);
      return updatedPayment;
    } catch (err: any) {
      throw new Error(err.message || 'خطا در به‌روزرسانی درخواست پرداخت');
    } finally {
      setLoading(false);
    }
  };

  /**
   * تغییر وضعیت پرداخت
   */
  const changePaymentStatus = async (id: number, status: PaymentStatus): Promise<PaymentRequest> => {
    try {
      setLoading(true);
      const updatedPayment = await paymentService.changePaymentStatus(id, status);
      return updatedPayment;
    } catch (err: any) {
      throw new Error(err.message || 'خطا در تغییر وضعیت پرداخت');
    } finally {
      setLoading(false);
    }
  };

  /**
   * حذف درخواست پرداخت
   */
  const deletePayment = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      await paymentService.deletePayment(id);
    } catch (err: any) {
      throw new Error(err.message || 'خطا در حذف درخواست پرداخت');
    } finally {
      setLoading(false);
    }
  };

  /**
   * آپلود تصویر فیش پرداخت
   */
  const uploadPaymentImage = async (paymentId: number, image: File): Promise<PaymentImage> => {
    try {
      setLoading(true);
      const uploadedImage = await paymentService.uploadPaymentImage(paymentId, image);
      return uploadedImage;
    } catch (err: any) {
      throw new Error(err.message || 'خطا در آپلود تصویر فیش پرداخت');
    } finally {
      setLoading(false);
    }
  };

  /**
   * دریافت تصاویر یک پرداخت
   */
  const getPaymentImages = async (paymentId: number): Promise<PaymentImage[]> => {
    try {
      setLoading(true);
      const images = await paymentService.getPaymentImages(paymentId);
      return images;
    } catch (err: any) {
      throw new Error(err.message || 'خطا در دریافت تصاویر پرداخت');
    } finally {
      setLoading(false);
    }
  };

  /**
   * حذف تصویر پرداخت
   */
  const deletePaymentImage = async (paymentId: number, imageId: number): Promise<void> => {
    try {
      setLoading(true);
      await paymentService.deletePaymentImage(paymentId, imageId);
    } catch (err: any) {
      throw new Error(err.message || 'خطا در حذف تصویر پرداخت');
    } finally {
      setLoading(false);
    }
  };

  return {
    payments,
    loading,
    error,
    totalItems,
    fetchPayments,
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
};  