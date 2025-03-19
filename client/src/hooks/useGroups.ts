import { useState } from 'react';
import api from '../services/api';
import { Group } from '../types/group.types';

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      setError(null);

      try {
        // سعی می‌کنیم گروه‌ها را دریافت کنیم
        const response = await api.get('/groups');
        setGroups(response.data.data || []);
      } catch (err) {
        console.warn("خطا در دریافت گروه‌ها - این خطا می‌تواند نادیده گرفته شود اگر مسیر API فعال نیست");
        // در صورت خطا، آرایه خالی را تنظیم می‌کنیم
        setGroups([]);
      }
    } catch (err) {
      console.error("خطای کلی در دریافت لیست گروه‌ها:", err);
      setError('خطا در دریافت لیست گروه‌ها');
    } finally {
      setLoading(false);
    }
  };

  // از UseEffect استفاده نمی‌کنیم تا خطای 404 در بارگذاری اولیه رخ ندهد
  // این هوک فقط زمانی که مورد نیاز است فراخوانی می‌شود

  return {
    groups,
    loading,
    error,
    fetchGroups,
  };
}; 