// تبدیل اعداد فارسی/عربی به اعداد انگلیسی
export const convertPersianToEnglishNumbers = (str: string): string => {
  if (!str) return str;
  
  // نگاشت اعداد فارسی و عربی به انگلیسی
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicDigits = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  
  // تبدیل اعداد فارسی به انگلیسی
  let result = str;
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
 * فرمت کردن مبلغ به صورت 3 رقم 3 رقم جدا شده با کاما
 * @param amount مبلغ به صورت عدد یا رشته
 * @returns مبلغ فرمت شده با کاما
 */
export const formatAmountWithCommas = (amount: number | string): string => {
  if (!amount && amount !== 0) return '';
  
  // تبدیل به رشته و حذف کاماهای احتمالی قبلی
  let amountStr = typeof amount === 'string' ? amount : amount.toString();
  amountStr = amountStr.replace(/,/g, '');
  
  // تبدیل اعداد فارسی به انگلیسی
  amountStr = convertPersianToEnglishNumbers(amountStr);
  
  // حذف کاراکترهای غیر عددی (بجز منفی در ابتدا)
  amountStr = amountStr.replace(/[^\d-]/g, '');
  if (amountStr.startsWith('-')) {
    amountStr = '-' + amountStr.substring(1).replace(/-/g, '');
  } else {
    amountStr = amountStr.replace(/-/g, '');
  }
  
  // اضافه کردن کاما هر 3 رقم
  return amountStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}; 