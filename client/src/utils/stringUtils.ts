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
  
  // تبدیل اعداد فارسی به انگلیسی طبق مستندات @05-DIGIT_CONVERSION.md
  amountStr = convertPersianToEnglishNumbers(amountStr);
  
  // حذف کاراکترهای غیر عددی (بجز منفی در ابتدا)
  amountStr = amountStr.replace(/[^\d-]/g, '');
  if (amountStr.startsWith('-')) {
    amountStr = '-' + amountStr.substring(1).replace(/-/g, '');
  } else {
    amountStr = amountStr.replace(/-/g, '');
  }
  
  // بررسی اعداد خالی
  if (!amountStr) return '';
  
  // اضافه کردن کاما هر 3 رقم
  const formattedAmount = Number(amountStr).toLocaleString('fa-IR');
  
  // تبدیل مجدد اعداد فارسی به انگلیسی (برای اطمینان)
  return convertPersianToEnglishNumbers(formattedAmount);
};

/**
 * تبدیل اعداد انگلیسی به فارسی
 * @param str رشته حاوی اعداد انگلیسی
 * @returns رشته با اعداد فارسی
 */
export const convertEnglishToPersianNumbers = (str: string): string => {
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  let result = str;
  
  // جایگزینی اعداد انگلیسی
  englishNumbers.forEach((num, index) => {
    result = result.replace(new RegExp(num, 'g'), persianNumbers[index]);
  });
  
  return result;
};

/**
 * تبدیل عدد به فرمت پول با جداکننده سه رقمی و واحد تومان
 * @param amount مبلغ
 * @param withUnit آیا واحد تومان اضافه شود؟
 * @returns رشته فرمت شده
 */
export const formatCurrency = (amount: number, withUnit = true): string => {
  // جدا کردن هر سه رقم با کاما
  const formattedNumber = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  
  // تبدیل اعداد به فارسی
  const persianNumber = convertEnglishToPersianNumbers(formattedNumber);
  
  // اضافه کردن واحد تومان در صورت نیاز
  return withUnit ? `${persianNumber} تومان` : persianNumber;
};

/**
 * حذف فاصله‌های اضافی و استاندارد کردن فاصله‌ها
 * @param str رشته ورودی
 * @returns رشته با فاصله‌های استاندارد
 */
export const normalizeSpaces = (str: string): string => {
  // حذف فاصله‌های ابتدا و انتها
  let result = str.trim();
  
  // تبدیل نیم‌فاصله به فاصله معمولی
  result = result.replace(/\u200C/g, ' ');
  
  // جایگزینی چند فاصله پشت سر هم با یک فاصله
  result = result.replace(/\s+/g, ' ');
  
  return result;
}; 