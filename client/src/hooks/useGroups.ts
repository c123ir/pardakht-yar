import { useState } from 'react';
import axios from 'axios';
import { Group } from '../types/group.types';
import api from '../services/api';

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);
      // فعلا این درخواست را غیرفعال می‌کنیم تا خطای 404 نمایش داده نشود
      // const response = await axios.get('/api/groups');
      // setGroups(response.data);
      
      // موقتا آرایه خالی برمی‌گردانیم
      setGroups([]);
    } catch (err) {
      setError('خطا در دریافت لیست گروه‌ها');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // حذف useEffect برای جلوگیری از درخواست خودکار
  // useEffect(() => {
  //   fetchGroups();
  // }, []);

  return {
    groups,
    loading,
    error,
    fetchGroups,
  };
}; 