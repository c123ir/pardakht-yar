// client/src/services/contactService.ts
// سرویس مدیریت طرف‌حساب‌ها

import api from './api';
import { Contact, ContactFilter } from '../types/contact.types';

// دریافت لیست طرف‌حساب‌ها
const getContacts = async (params: ContactFilter = { page: 1, limit: 10 }) => {
  try {
    const response = await api.get('/contacts', { params });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت لیست طرف‌حساب‌ها'
    );
  }
};

// دریافت جزئیات یک طرف‌حساب
const getContactById = async (id: number) => {
  try {
    const response = await api.get(`/contacts/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت اطلاعات طرف‌حساب'
    );
  }
};

// ایجاد طرف‌حساب جدید
const createContact = async (contactData: Partial<Contact>) => {
  try {
    const response = await api.post('/contacts', contactData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در ایجاد طرف‌حساب'
    );
  }
};

// به‌روزرسانی طرف‌حساب
const updateContact = async (id: number, contactData: Partial<Contact>) => {
  try {
    const response = await api.put(`/contacts/${id}`, contactData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در به‌روزرسانی طرف‌حساب'
    );
  }
};

// حذف طرف‌حساب
const deleteContact = async (id: number) => {
  try {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در حذف طرف‌حساب'
    );
  }
};

// تولید توکن دسترسی
const generateContactToken = async (id: number) => {
  try {
    // بررسی آدرس API با مستندات - فرض صحیح: regenerate-token
    const response = await api.post(`/contacts/${id}/regenerate-token`);
    return response.data.data;
  } catch (error: any) {
    // در صورت خطای 404، امتحان آدرس جایگزین
    if (error.response?.status === 404) {
      try {
        const response = await api.post(`/contacts/${id}/generate-token`);
        return response.data.data;
      } catch (secondError: any) {
        throw new Error(
          secondError.response?.data?.message || 'خطا در تولید توکن دسترسی'
        );
      }
    }
    throw new Error(
      error.response?.data?.message || 'خطا در تولید توکن دسترسی'
    );
  }
};

export default {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  generateContactToken,
};