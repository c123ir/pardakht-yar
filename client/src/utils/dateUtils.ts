// client/src/utils/dateUtils.ts
// توابع کمکی برای کار با تاریخ شمسی

import { format, parse, isValid } from 'date-fns-jalali';
import { addHours, isSameDay } from 'date-fns';

/**
 * تبدیل تاریخ میلادی به شمسی
 * @param date تاریخ میلادی
 * @param formatStr الگوی نمایش تاریخ
 * @returns رشته تاریخ شمسی
 */
export const toJalali = (date: Date | string | number, formatStr: string = 'yyyy/MM/dd'): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  return format(dateObj, formatStr);
};

/**
 * تبدیل تاریخ شمسی به میلادی
 * @param jalaliDate تاریخ شمسی
 * @param formatStr الگوی تاریخ ورودی
 * @returns آبجکت تاریخ میلادی
 */
export const toGregorian = (jalaliDate: string, formatStr: string = 'yyyy/MM/dd'): Date => {
  return parse(jalaliDate, formatStr, new Date());
};

/**
 * تبدیل تاریخ به فرمت ISO برای ارسال به سرور
 * @param date تاریخ (میلادی یا شمسی)
 * @returns رشته تاریخ در فرمت ISO
 */
export const formatDateToISO = (date: string | Date): string => {
  if (!date) return '';
  
  // اگر تاریخ به فرمت رشته باشد و احتمالاً شمسی
  if (typeof date === 'string' && !date.includes('T') && !date.includes('Z')) {
    // فرض: تاریخ شمسی به فرمت yyyy-MM-dd یا yyyy/MM/dd
    const formattedDate = date.replace(/\//g, '-');
    try {
      const gregorianDate = toGregorian(formattedDate, 'yyyy-MM-dd');
      if (isValid(gregorianDate)) {
        return gregorianDate.toISOString();
      }
    } catch (e) {
      console.error('خطا در تبدیل تاریخ شمسی به میلادی:', e);
    }
  }
  
  // اگر تاریخ از نوع Date باشد
  if (date instanceof Date) {
    return date.toISOString();
  }
  
  // تلاش برای تبدیل مستقیم به ISO
  try {
    const dateObj = new Date(date);
    if (isValid(dateObj)) {
      return dateObj.toISOString();
    }
  } catch (e) {
    console.error('خطا در تبدیل تاریخ به ISO:', e);
  }
  
  // در صورت خطا، تاریخ اصلی را برگردان
  return String(date);
};

/**
 * نمایش تاریخ به صورت نسبی (مثلاً "۲ روز پیش")
 * @param date تاریخ
 * @returns متن تاریخ نسبی
 */
export const formatRelativeTime = (date: Date | string | number): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date)
    : date;
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  // امروز یا دیروز
  if (isSameDay(dateObj, now)) {
    return 'امروز';
  } else if (isSameDay(dateObj, addHours(now, -24))) {
    return 'دیروز';
  }
  
  // بقیه موارد بر اساس ثانیه، دقیقه، ساعت یا روز
  if (diffInSeconds < 60) {
    return 'چند لحظه پیش';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} دقیقه پیش`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ساعت پیش`;
  } else if (diffInSeconds < 2592000) { // حدود 30 روز
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} روز پیش`;
  } else {
    // تبدیل به تاریخ شمسی
    return toJalali(dateObj, 'yyyy/MM/dd');
  }
};

/**
 * تبدیل تاریخ به فرمت نمایشی تاریخ و زمان
 * @param date تاریخ
 * @returns تاریخ و زمان فرمت شده
 */
export const formatDateTime = (date: Date | string | number): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date)
    : date;
  
  if (!isValid(dateObj)) return '';
  
  try {
    return toJalali(dateObj, 'yyyy/MM/dd HH:mm');
  } catch (e) {
    console.error('خطا در فرمت کردن تاریخ و زمان:', e);
    return '';
  }
};

/**
 * فرمت کردن تاریخ برای نمایش
 * @param date تاریخ
 * @returns تاریخ فرمت شده
 */
export const formatDate = (date: Date | string | number): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date)
    : date;
  
  if (!isValid(dateObj)) return '';
  
  try {
    return toJalali(dateObj, 'yyyy/MM/dd');
  } catch (e) {
    console.error('خطا در فرمت کردن تاریخ:', e);
    return '';
  }
};

/**
 * نمایش نسبی روز، ماه یا سال به صورت فارسی
 * @param date تاریخ مورد نظر
 */
export const getRelativeTime = (date: Date | string): string => {
  const targetDate = new Date(date);
  const now = new Date();
  
  if (!isValid(targetDate)) return '';
  
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) {
    return 'امروز';
  } else if (diffInDays === 1) {
    return 'دیروز';
  } else if (diffInDays < 7) {
    return `${diffInDays} روز پیش`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} هفته پیش`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} ماه پیش`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} سال پیش`;
  }
};