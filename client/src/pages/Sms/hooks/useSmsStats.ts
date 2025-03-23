import { useState, useEffect } from 'react';
import { SmsStats } from '../types';

/**
 * هوک کاستوم برای مدیریت آمار پیامک‌ها
 */
export const useSmsStats = () => {
  const [stats, setStats] = useState<SmsStats>({
    totalSent: 0,
    totalDelivered: 0,
    totalFailed: 0,
    totalPending: 0,
    lastMonthSent: 0,
    costThisMonth: 0,
    costLastMonth: 0,
    deliveryRatePercent: 0,
    chartData: {
      daily: [],
      monthly: []
    }
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // حالت نمایش نمودار (روزانه یا ماهانه)
  const [chartView, setChartView] = useState<'daily' | 'monthly'>('daily');

  /**
   * دریافت آمار پیامک‌ها از سرور
   */
  const fetchStats = async () => {
    setLoading(true);
    setError(null);

    try {
      // در یک پروژه واقعی، اینجا یک درخواست API به سمت سرور ارسال می‌شود
      // simulation (mock) data for development
      setTimeout(() => {
        const mockData: SmsStats = {
          totalSent: 12458,
          totalDelivered: 11924,
          totalFailed: 329,
          totalPending: 205,
          lastMonthSent: 1875,
          costThisMonth: 24750000,
          costLastMonth: 18650000,
          deliveryRatePercent: 95.7,
          chartData: {
            daily: Array.from({ length: 30 }, (_, i) => ({
              date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
              sent: Math.floor(Math.random() * 100) + 20,
              delivered: Math.floor(Math.random() * 80) + 10,
              failed: Math.floor(Math.random() * 10)
            })),
            monthly: Array.from({ length: 12 }, (_, i) => {
              const date = new Date();
              date.setMonth(date.getMonth() - (11 - i));
              return {
                date: date.toISOString(),
                sent: Math.floor(Math.random() * 2000) + 500,
                delivered: Math.floor(Math.random() * 1800) + 400,
                failed: Math.floor(Math.random() * 100) + 10
              };
            })
          }
        };
        
        setStats(mockData);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError('خطا در دریافت آمار پیامک‌ها');
      setLoading(false);
      console.error('Error fetching SMS stats:', err);
    }
  };

  /**
   * تغییر حالت نمایش نمودار (روزانه/ماهانه)
   */
  const toggleChartView = () => {
    setChartView(prev => prev === 'daily' ? 'monthly' : 'daily');
  };

  // دریافت اولیه داده‌ها
  useEffect(() => {
    fetchStats();
  }, []);

  return {
    stats,
    loading,
    error,
    chartView,
    toggleChartView,
    refreshStats: fetchStats
  };
}; 