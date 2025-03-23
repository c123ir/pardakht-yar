// client/src/pages/Sms/utils/index.ts
// توابع کمکی برای بخش SMS

/**
 * تبدیل اعداد فارسی/عربی به اعداد انگلیسی
 * @param input رشته ورودی که حاوی اعداد فارسی یا عربی است
 * @returns رشته با اعداد انگلیسی
 */
export const convertPersianToEnglishNumbers = (input: string): string => {
  if (!input) return input;
  
  // نگاشت اعداد فارسی و عربی به انگلیسی
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  // تبدیل اعداد فارسی به انگلیسی
  let result = input;
  for (let i = 0; i < 10; i++) {
    const persianRegex = new RegExp(persianDigits[i], 'g');
    const arabicRegex = new RegExp(arabicDigits[i], 'g');
    
    result = result
      .replace(persianRegex, englishDigits[i])
      .replace(arabicRegex, englishDigits[i]);
  }
  
  return result;
};

/**
 * قالب‌بندی عدد با جداکننده هزار
 * @param num عدد ورودی
 * @returns رشته قالب‌بندی شده
 */
export const formatNumber = (num: number): string => {
  if (isNaN(num)) return '0';
  return new Intl.NumberFormat('fa-IR').format(num);
};

/**
 * تبدیل تاریخ میلادی به تاریخ شمسی قابل نمایش
 * @param isoDate تاریخ ISO
 * @returns تاریخ شمسی قالب‌بندی شده
 */
export const formatDate = (isoDate: string): string => {
  if (!isoDate) return '-';
  
  try {
    // اینجا می‌توانید از کتابخانه date-fns-jalali استفاده کنید
    // فعلاً یک نمونه ساده برای نمایش مفهوم
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('خطا در تبدیل تاریخ:', error);
    return isoDate;
  }
}; 