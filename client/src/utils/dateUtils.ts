// client/src/utils/dateUtils.ts
// توابع کمکی برای کار با تاریخ شمسی

import { format, parse, isValid } from 'date-fns-jalali';
import { addHours, isSameDay } from 'date-fns';
import { convertEnglishToPersianNumbers } from './stringUtils';

/**
 * تبدیل تاریخ میلادی به شمسی
 * @param date تاریخ میلادی
 * @param formatStr الگوی نمایش تاریخ
 * @returns رشته تاریخ شمسی
 */
export const toJalali = (date: Date | string | number, formatStr = 'yyyy/MM/dd'): string => {
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
export const toGregorian = (jalaliDate: string, formatStr = 'yyyy/MM/dd'): Date => {
  return parse(jalaliDate, formatStr, new Date());
};

/**
 * تبدیل تاریخ به فرمت ISO برای ارسال به سرور
 * @param date تاریخ (میلادی یا شمسی)
 * @returns رشته تاریخ در فرمت ISO
 */
export const formatDateToISO = (date: string | Date): string => {
  if (!date) return '';
  
  console.log('formatDateToISO input:', date, typeof date);
  
  // اگر تاریخ به فرمت رشته باشد و احتمالاً شمسی
  if (typeof date === 'string') {
    // حذف کاراکترهای اضافی و استاندارد‌سازی فرمت
    const cleanDate = date.trim().replace(/\//g, '-');
    
    try {
      // اگر تاریخ ISO باشد آن را به همان صورت برگردان
      if (cleanDate.includes('T') || cleanDate.includes('Z')) {
        const dateObj = new Date(cleanDate);
        if (isValid(dateObj)) {
          console.log('Valid ISO date:', dateObj.toISOString());
          return dateObj.toISOString();
        }
      }
      
      // تبدیل تاریخ شمسی به میلادی
      const gregorianDate = toGregorian(cleanDate, 'yyyy-MM-dd');
      if (isValid(gregorianDate)) {
        console.log('Converted to Gregorian:', gregorianDate.toISOString());
        return gregorianDate.toISOString();
      }
    } catch (e) {
      console.error('Error converting date:', e, 'Original date:', date);
    }
  }
  
  // اگر تاریخ از نوع Date باشد
  if (date instanceof Date && isValid(date)) {
    console.log('Valid Date object:', date.toISOString());
    return date.toISOString();
  }
  
  // در صورت خطا، یک تاریخ پیش‌فرض برگردان (امروز)
  console.warn('Invalid date format, returning current date:', date);
  return new Date().toISOString();
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
    console.error('Error formatting date and time:', e);
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
    console.error('Error formatting date:', e);
    return '';
  }
};

/**
 * نمایش نسبی روز، ماه یا سال به صورت فارسی
 * @param date تاریخ مورد نظر
 */
export const getRelativeTime = (date: Date | string): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = now.getTime() - dateObj.getTime();
    
    // تبدیل به ثانیه
    const diffSec = Math.floor(diffMs / 1000);
    
    // کمتر از یک دقیقه
    if (diffSec < 60) {
      return 'لحظاتی پیش';
    }
    
    // تبدیل به دقیقه
    const diffMin = Math.floor(diffSec / 60);
    
    // کمتر از یک ساعت
    if (diffMin < 60) {
      return `${convertEnglishToPersianNumbers(diffMin.toString())} دقیقه پیش`;
    }
    
    // تبدیل به ساعت
    const diffHour = Math.floor(diffMin / 60);
    
    // کمتر از یک روز
    if (diffHour < 24) {
      return `${convertEnglishToPersianNumbers(diffHour.toString())} ساعت پیش`;
    }
    
    // تبدیل به روز
    const diffDay = Math.floor(diffHour / 24);
    
    // کمتر از یک هفته
    if (diffDay < 7) {
      return `${convertEnglishToPersianNumbers(diffDay.toString())} روز پیش`;
    }
    
    // تبدیل به هفته
    const diffWeek = Math.floor(diffDay / 7);
    
    // کمتر از یک ماه
    if (diffWeek < 4) {
      return `${convertEnglishToPersianNumbers(diffWeek.toString())} هفته پیش`;
    }
    
    // بیشتر از یک ماه: نمایش تاریخ کامل
    return formatDateToPersian(dateObj);
  } catch (error) {
    console.error('خطا در محاسبه زمان نسبی:', error);
    return '-';
  }
};

/**
 * فرمت کردن تاریخ به صورت شمسی (1402/01/01)
 * @param date تاریخ میلادی
 * @returns رشته تاریخ شمسی
 */
export const formatDateToPersian = (date: Date | string | null): string => {
  if (!date) return '-';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // تبدیل به تاریخ شمسی
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      calendar: 'persian'
    };
    
    // دریافت تاریخ شمسی با فرمت پیش‌فرض
    const persianDate = dateObj.toLocaleDateString('fa-IR', options);
    
    // حذف فاصله‌ها و جایگزینی / به جای -
    return persianDate.replace(/\s/g, '').replace(/-/g, '/');
  } catch (error) {
    console.error('خطا در تبدیل تاریخ:', error);
    return '-';
  }
};

/**
 * فرمت کردن تاریخ و زمان به صورت شمسی (1402/01/01 14:30)
 * @param dateTime تاریخ و زمان میلادی
 * @returns رشته تاریخ و زمان شمسی
 */
export const formatDateTimeToPersian = (dateTime: Date | string | null): string => {
  if (!dateTime) return '-';
  
  try {
    const dateObj = typeof dateTime === 'string' ? new Date(dateTime) : dateTime;
    
    // تاریخ شمسی
    const dateOptions: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      calendar: 'persian'
    };
    const persianDate = dateObj.toLocaleDateString('fa-IR', dateOptions)
      .replace(/\s/g, '')
      .replace(/-/g, '/');
    
    // زمان
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit'
    };
    const time = dateObj.toLocaleTimeString('fa-IR', timeOptions);
    
    // ترکیب تاریخ و زمان
    return `${persianDate} ${time}`;
  } catch (error) {
    console.error('خطا در تبدیل تاریخ و زمان:', error);
    return '-';
  }
};