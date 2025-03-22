// client/src/utils/validationUtils.ts
// توابع اعتبارسنجی برای فرم‌ها و داده‌های ورودی

import { convertPersianToEnglishNumbers } from './stringUtils';

/**
 * اعتبارسنجی شماره موبایل
 * @param mobile شماره موبایل
 * @returns آیا شماره موبایل معتبر است؟
 */
export const isValidMobile = (mobile: string | null | undefined): boolean => {
  if (!mobile) return false;
  
  // تبدیل اعداد فارسی به انگلیسی
  const normalizedMobile = convertPersianToEnglishNumbers(mobile.trim());
  
  // الگوی شماره موبایل ایران: شروع با ۰۹ و ۱۰ رقم
  const mobilePattern = /^(09|\+989|989)[0-9]{9}$/;
  
  // اضافه کردن صفر ابتدایی در صورت نیاز
  let standardMobile = normalizedMobile;
  if (normalizedMobile.startsWith('+989')) {
    standardMobile = '0' + normalizedMobile.substring(3);
  } else if (normalizedMobile.startsWith('989')) {
    standardMobile = '0' + normalizedMobile.substring(2);
  }
  
  return mobilePattern.test(standardMobile);
};

/**
 * استانداردسازی شماره موبایل به فرمت 09XXXXXXXXX
 * @param mobile شماره موبایل
 * @returns شماره موبایل استاندارد شده یا رشته خالی
 */
export const normalizeMobile = (mobile: string | null | undefined): string => {
  if (!mobile) return '';
  
  // تبدیل اعداد فارسی به انگلیسی
  const normalizedMobile = convertPersianToEnglishNumbers(mobile.trim());
  
  // حذف کاراکترهای غیر عددی
  const digitsOnly = normalizedMobile.replace(/\D/g, '');
  
  // استانداردسازی شماره
  if (digitsOnly.startsWith('989') && digitsOnly.length === 12) {
    return '0' + digitsOnly.substring(2);
  } else if (digitsOnly.startsWith('9') && digitsOnly.length === 10) {
    return '0' + digitsOnly;
  } else if (digitsOnly.startsWith('09') && digitsOnly.length === 11) {
    return digitsOnly;
  }
  
  return normalizedMobile;
};

/**
 * اعتبارسنجی کد ملی
 * @param nationalCode کد ملی
 * @returns آیا کد ملی معتبر است؟
 */
export const isValidNationalCode = (nationalCode: string | null | undefined): boolean => {
  if (!nationalCode) return false;
  
  // تبدیل اعداد فارسی به انگلیسی و حذف فاصله‌ها
  const code = convertPersianToEnglishNumbers(nationalCode.trim());
  
  // کد ملی باید ۱۰ رقم باشد
  if (!/^\d{10}$/.test(code)) return false;
  
  // کد ملی نباید با کدهای یکسان شروع شود
  if (/^(\d)\1{9}$/.test(code)) return false;
  
  // الگوریتم کنترلی کد ملی
  const check = +code[9];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += +code[i] * (10 - i);
  }
  
  const remainder = sum % 11;
  return (remainder < 2 && remainder === check) || (remainder >= 2 && check + remainder === 11);
};

/**
 * اعتبارسنجی ایمیل
 * @param email آدرس ایمیل
 * @returns آیا ایمیل معتبر است؟
 */
export const isValidEmail = (email: string | null | undefined): boolean => {
  if (!email) return false;
  
  // حذف فاصله‌های ابتدا و انتها
  const trimmedEmail = email.trim();
  
  // الگوی ایمیل استاندارد
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  return emailPattern.test(trimmedEmail);
};

/**
 * اعتبارسنجی کد پستی
 * @param postalCode کد پستی
 * @returns آیا کد پستی معتبر است؟
 */
export const isValidPostalCode = (postalCode: string | null | undefined): boolean => {
  if (!postalCode) return false;
  
  // تبدیل اعداد فارسی به انگلیسی و حذف فاصله‌ها
  const code = convertPersianToEnglishNumbers(postalCode.trim());
  
  // کد پستی باید ۱۰ رقم باشد
  return /^\d{10}$/.test(code);
};

/**
 * اعتبارسنجی شماره کارت بانکی
 * @param cardNumber شماره کارت
 * @returns آیا شماره کارت معتبر است؟
 */
export const isValidBankCardNumber = (cardNumber: string | null | undefined): boolean => {
  if (!cardNumber) return false;
  
  // تبدیل اعداد فارسی به انگلیسی و حذف کاراکترهای غیر عددی
  const cleanCardNumber = convertPersianToEnglishNumbers(cardNumber.replace(/\D/g, ''));
  
  // شماره کارت باید ۱۶ رقم باشد
  if (cleanCardNumber.length !== 16) return false;
  
  // الگوریتم luhn برای اعتبارسنجی شماره کارت
  let sum = 0;
  let alternate = false;
  
  for (let i = cleanCardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanCardNumber[i], 10);
    
    if (alternate) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    alternate = !alternate;
  }
  
  return sum % 10 === 0;
};

/**
 * فرمت کردن شماره کارت با جداکننده
 * @param cardNumber شماره کارت
 * @returns شماره کارت با جداکننده
 */
export const formatBankCardNumber = (cardNumber: string): string => {
  if (!cardNumber) return '';
  
  // تبدیل اعداد فارسی به انگلیسی و حذف کاراکترهای غیر عددی
  const cleanCardNumber = convertPersianToEnglishNumbers(cardNumber.replace(/\D/g, ''));
  
  // اضافه کردن فاصله بین هر ۴ رقم
  const formatted = cleanCardNumber.replace(/(\d{4})(?=\d)/g, '$1-');
  
  return formatted;
};

/**
 * اعتبارسنجی شماره شبا
 * @param iban شماره شبا با یا بدون IR
 * @returns آیا شماره شبا معتبر است؟
 */
export const isValidIBAN = (iban: string | null | undefined): boolean => {
  if (!iban) return false;
  
  // تبدیل اعداد فارسی به انگلیسی و حذف فاصله‌ها
  const normalizedIban = convertPersianToEnglishNumbers(iban.trim().toUpperCase());
  
  // اضافه کردن IR در صورت نبودن
  let formattedIban = normalizedIban;
  if (!normalizedIban.startsWith('IR') && normalizedIban.length === 24) {
    formattedIban = 'IR' + normalizedIban;
  }
  
  // الگوی شبای ایران: IR + 24 رقم
  if (!/^IR[0-9]{24}$/.test(formattedIban)) return false;
  
  // الگوریتم بررسی شبا
  // برداشتن IR و قرار دادن در انتها + تبدیل حروف به عدد
  const rearranged = formattedIban.substring(4) + '1827' + formattedIban.substring(2, 4);
  
  // بررسی باقیمانده بر ۹۷
  let mod = 0;
  for (let i = 0; i < rearranged.length; i++) {
    mod = (mod * 10 + parseInt(rearranged[i], 10)) % 97;
  }
  
  return mod === 1;
};

/**
 * اعتبارسنجی رمز عبور قوی
 * @param password رمز عبور
 * @returns آیا رمز عبور به اندازه کافی قوی است؟
 */
export const isStrongPassword = (password: string | null | undefined): boolean => {
  if (!password) return false;
  
  // طول رمز حداقل ۸ کاراکتر
  if (password.length < 8) return false;
  
  // حداقل یک حرف بزرگ
  if (!/[A-Z]/.test(password)) return false;
  
  // حداقل یک حرف کوچک
  if (!/[a-z]/.test(password)) return false;
  
  // حداقل یک عدد
  if (!/[0-9]/.test(password)) return false;
  
  // حداقل یک کاراکتر ویژه
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) return false;
  
  return true;
};

/**
 * بررسی خالی بودن مقدار
 * @param value مقدار ورودی
 * @returns آیا مقدار خالی است؟
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  
  if (typeof value === 'string') return value.trim() === '';
  
  if (Array.isArray(value)) return value.length === 0;
  
  if (typeof value === 'object') return Object.keys(value).length === 0;
  
  return false;
}; 