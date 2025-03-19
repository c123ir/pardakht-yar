import { useState } from 'react';
import { Contact, ContactFilter, PaginatedContactsResponse } from '../types/contact.types';
import contactService from '../services/contactService';

interface UseContactsReturn {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  loadContacts: (filters: ContactFilter) => Promise<void>;
  getContactById: (id: number) => Promise<Contact>;
  createContact: (data: Partial<Contact>) => Promise<Contact>;
  updateContact: (id: number, data: Partial<Contact>) => Promise<Contact>;
  deleteContact: (id: number) => Promise<void>;
  generateContactToken: (id: number) => Promise<string>;
}

export const useContacts = (): UseContactsReturn => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [totalItems, setTotalItems] = useState<number>(0);

  /**
   * بارگیری لیست طرف‌حساب‌ها با فیلتر
   */
  const loadContacts = async (filters: ContactFilter): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      try {
        const response: PaginatedContactsResponse = await contactService.getContacts(filters);
        setContacts(response.data);
        setTotalItems(response.pagination.totalItems);
      } catch (err: any) {
        console.error("خطا در دریافت لیست طرف‌حساب‌ها:", err);
        // در صورت خطا آرایه خالی را نمایش می‌دهیم
        setContacts([]);
        setTotalItems(0);
        setError(err.message || 'خطا در دریافت لیست طرف‌حساب‌ها');
      }
    } catch (err: any) {
      console.error("خطا در تابع loadContacts:", err);
      setError(err.message || 'خطا در پردازش درخواست');
    } finally {
      setLoading(false);
    }
  };

  /**
   * دریافت اطلاعات یک طرف‌حساب
   */
  const getContactById = async (id: number): Promise<Contact> => {
    try {
      setLoading(true);
      const contact = await contactService.getContactById(id);
      return contact;
    } catch (err: any) {
      throw new Error(err.message || 'خطا در دریافت اطلاعات طرف‌حساب');
    } finally {
      setLoading(false);
    }
  };

  /**
   * ایجاد طرف‌حساب جدید
   */
  const createContact = async (data: Partial<Contact>): Promise<Contact> => {
    try {
      setLoading(true);
      const newContact = await contactService.createContact(data);
      return newContact;
    } catch (err: any) {
      throw new Error(err.message || 'خطا در ایجاد طرف‌حساب');
    } finally {
      setLoading(false);
    }
  };

  /**
   * به‌روزرسانی طرف‌حساب
   */
  const updateContact = async (id: number, data: Partial<Contact>): Promise<Contact> => {
    try {
      setLoading(true);
      const updatedContact = await contactService.updateContact(id, data);
      return updatedContact;
    } catch (err: any) {
      throw new Error(err.message || 'خطا در به‌روزرسانی طرف‌حساب');
    } finally {
      setLoading(false);
    }
  };

  /**
   * حذف طرف‌حساب
   */
  const deleteContact = async (id: number): Promise<void> => {
    try {
      setLoading(true);
      await contactService.deleteContact(id);
    } catch (err: any) {
      throw new Error(err.message || 'خطا در حذف طرف‌حساب');
    } finally {
      setLoading(false);
    }
  };

  /**
   * تولید توکن دسترسی برای طرف‌حساب
   */
  const generateContactToken = async (id: number): Promise<string> => {
    try {
      setLoading(true);
      const response = await contactService.generateContactToken(id);
      return response.accessToken;
    } catch (err: any) {
      throw new Error(err.message || 'خطا در تولید توکن دسترسی');
    } finally {
      setLoading(false);
    }
  };

  return {
    contacts,
    loading,
    error,
    totalItems,
    loadContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact,
    generateContactToken,
  };
}; 