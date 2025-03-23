// client/src/pages/Sms/hooks/useSmsLogs.ts
// هوک کاستوم برای مدیریت لاگ‌های پیامک

import { useState, useEffect, useCallback } from 'react';
import { SmsStatus } from '../types';
import { useSnackbar } from 'notistack';

// تعریف interface برای استفاده در هوک
interface SmsLogItem {
  id: string;
  receiver: string;
  message: string;
  sentAt: string;
  status: SmsStatus;
  statusDetails?: string;
  senderNumber: string;
  deliveredAt?: string;
  cost: number;
}

/**
 * هوک کاستوم برای مدیریت لاگ‌های پیامک
 */
export const useSmsLogs = () => {
  // استفاده از useSnackbar برای نمایش نوتیفیکیشن‌ها
  const { enqueueSnackbar } = useSnackbar();

  // تعریف state های مورد نیاز
  const [logs, setLogs] = useState<SmsLogItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null]);
  const [statusFilter, setStatusFilter] = useState<SmsStatus | ''>('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // دریافت لاگ‌ها از سرور
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      // در حالت واقعی، این کد باید با سرویس SMS جایگزین شود
      // const sanitizedSearch = convertPersianToEnglishNumbers(searchTerm);
      // const response = await smsService.getLogs({
      //   page,
      //   limit: rowsPerPage,
      //   search: sanitizedSearch,
      //   status: statusFilter,
      //   startDate: dateRange[0] ? dateRange[0].toISOString() : undefined,
      //   endDate: dateRange[1] ? dateRange[1].toISOString() : undefined,
      // });
      
      // داده نمونه برای تست
      setTimeout(() => {
        const mockData: SmsLogItem[] = Array.from({ length: 15 }, (_, i) => ({
          id: `log-${i + 1}`,
          receiver: `0935${1000000 + i}`,
          message: `پیام نمونه شماره ${i + 1} برای تست سیستم پیامک`,
          status: [SmsStatus.DELIVERED, SmsStatus.FAILED, SmsStatus.PENDING][i % 3],
          sentAt: new Date(Date.now() - i * 3600000).toISOString(),
          provider: 'کاوه‌نگار',
          statusDetails: '',
          cost: Math.floor(i % 5 + 1) * 100,
          senderNumber: '1000596461',
        }));
        
        setLogs(mockData);
        setTotalItems(100); // فرض کنید 100 آیتم وجود دارد
        setLoading(false);
      }, 1000);
    } catch (err) {
      enqueueSnackbar('خطا در دریافت لاگ‌های پیامک', { variant: 'error' });
      setLoading(false);
      console.error('Error fetching SMS logs:', err);
    }
  }, [page, rowsPerPage, searchTerm, statusFilter, dateRange, refreshTrigger, enqueueSnackbar]);

  /**
   * تغییر صفحه جدول
   */
  const handleChangePage = (newPage: number) => {
    setPage(newPage);
  };

  // تغییر تعداد ردیف‌ها در هر صفحه
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(1);
  };

  // جستجو در لاگ‌ها
  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPage(1);
  };

  // فیلتر براساس وضعیت پیامک
  const handleStatusFilterChange = (status: SmsStatus | '') => {
    setStatusFilter(status);
    setPage(1);
  };

  // فیلتر براساس بازه زمانی
  const handleDateRangeChange = (range: [Date | null, Date | null]) => {
    setDateRange(range);
    setPage(1);
  };

  // بازخوانی لاگ‌ها
  const refreshLogs = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // بارگذاری لاگ‌ها در زمان تغییر پارامترهای فیلتر
  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    totalItems,
    page,
    rowsPerPage,
    loading,
    searchTerm,
    dateRange,
    statusFilter,
    handleChangePage,
    handleChangeRowsPerPage,
    handleSearch,
    handleStatusFilterChange,
    handleDateRangeChange,
    refreshLogs,
  };
}; 