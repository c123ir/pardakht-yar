import { useState, useEffect } from 'react';
import axios from 'axios';
import { Contact } from '../types/contact.types';

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/contacts');
      setContacts(response.data);
    } catch (err) {
      setError('خطا در دریافت لیست طرف حساب‌ها');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  return {
    contacts,
    loading,
    error,
    fetchContacts,
  };
}; 