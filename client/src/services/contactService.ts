// client/src/services/contactService.ts
// سرویس مدیریت طرف‌حساب‌ها

import api from './api';
import { Contact } from '../types/contact.types';

// تایپ پارامترهای جستجو
interface ContactSearchParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// دریافت لیست طرف‌حساب‌ها
const getContacts = async (params: ContactSearchParams = {}) => {
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

// بازتولید توکن دسترسی
const regenerateAccessToken = async (id: number) => {
  try {
    const response = await api.post(`/contacts/${id}/regenerate-token`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در بازتولید توکن دسترسی'
    );
  }
};

export default {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  regenerateAccessToken,
};