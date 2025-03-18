import { useState, useEffect } from 'react';
import axios from 'axios';
import { Group } from '../types/group.types';

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/groups');
      setGroups(response.data);
    } catch (err) {
      setError('خطا در دریافت لیست گروه‌ها');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  return {
    groups,
    loading,
    error,
    fetchGroups,
  };
}; 