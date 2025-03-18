// client/src/utils/dateUtils.ts
// توابع کمکی برای کار با تاریخ شمسی

import { format, parse, formatRelative } from 'date-fns-jalali';
import { addHours, isSameDay, isSameYear } from 'date-fns';

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
    // فرض: تاریخ شمسی به فرمت yyyy/MM/dd
    const gregorianDate = toGregorian(date);
    return gregorianDate.toISOString();
  }
  
  // اگر تاریخ از نوع Date باشد
  if (date instanceof Date) {
    return date.toISOString();
  }
  
  // در غیر این صورت فرض می‌کنیم تاریخ میلادی به فرمت ISO است
  return date;
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
  
  // تبدیل به تاریخ جلالی اگر بیش از یک هفته گذشته باشد
  if (diffInSeconds >= 604800) { // 7 * 24 * 60 * 60
    const formatStr = isSameYear(dateObj, now) ? 'd MMMM' : 'd MMMM yyyy';
    return toJalali(dateObj, formatStr);
  }
  
  // امروز یا دیروز
  if (isSameDay(dateObj, now) || isSameDay(dateObj, addHours(now, -24))) {
    // از formatRelative استفاده می‌کنیم
    const relativeFormat = formatRelative(dateObj, now);
    // تبدیل "today" به "امروز" و "yesterday" به "دیروز"
    return relativeFormat
      .replace('today', 'امروز')
      .replace('yesterday', 'دیروز');
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
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} روز پیش`;
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
  
  return dateObj.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// تبدیل تاریخ به فرمت نسبی (مثلاً "۲ روز پیش")
export const getRelativeTime = (date: Date | string): string => {
  const rtf = new Intl.RelativeTimeFormat('fa', { numeric: 'auto' });
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((targetDate.getTime() - now.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(diffInSeconds, 'second');
  } else if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, 'minute');
  } else if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, 'hour');
  } else if (Math.abs(diffInDays) < 30) {
    return rtf.format(diffInDays, 'day');
  } else if (Math.abs(diffInMonths) < 12) {
    return rtf.format(diffInMonths, 'month');
  } else {
    return rtf.format(diffInYears, 'year');
  }
};

// تبدیل تاریخ به فرمت فارسی
export const formatDate = (date: Date | string): string => {
  return new Date(date).toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};