// client/src/utils/dateUtils.ts
// توابع کمکی برای کار با تاریخ شمسی

import { format, parse } from 'date-fns-jalali';

// تبدیل تاریخ میلادی به شمسی
export const toJalali = (date: Date | string | number, formatStr: string = 'yyyy/MM/dd'): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  return format(dateObj, formatStr);
};

// تبدیل تاریخ شمسی به میلادی
export const toGregorian = (jalaliDate: string, formatStr: string = 'yyyy/MM/dd'): Date => {
  return parse(jalaliDate, formatStr, new Date());
};

// فرمت کردن تاریخ شمسی
export const formatJalaliDate = (date: Date | string | number, formatStr: string = 'yyyy/MM/dd'): string => {
  return toJalali(date, formatStr);
};

// نمایش تاریخ به صورت نسبی (مثلاً "۲ روز پیش")
export const getRelativeTime = (date: Date | string | number): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'چند لحظه پیش';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} دقیقه پیش`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ساعت پیش`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} روز پیش`;
  }
  
  return toJalali(dateObj);
};
