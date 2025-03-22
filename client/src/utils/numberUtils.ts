// client/src/utils/numberUtils.ts
// توابع مفید برای کار با اعداد

import { convertEnglishToPersianNumbers, convertPersianToEnglishNumbers } from './stringUtils';

/**
 * تبدیل عدد به فرمت قیمت (با جداکننده هزارگان و واحد تومان)
 * @param value مقدار عددی یا رشته
 * @param showUnit نمایش واحد تومان
 * @returns قیمت فرمت شده
 */
export const formatPrice = (value: number | string | null | undefined, showUnit = true): string => {
  if (value === null || value === undefined || value === '') return '-';
  
  try {
    // تبدیل به رشته و حذف کاراکترهای غیر عددی
    let numStr = value.toString();
    
    // تبدیل اعداد فارسی به انگلیسی
    numStr = convertPersianToEnglishNumbers(numStr);
    
    // حذف کاراکترهای غیر عددی
    numStr = numStr.replace(/[^\d.-]/g, '');
    
    // تبدیل به عدد
    const num = parseFloat(numStr);
    
    // اعتبارسنجی عدد
    if (isNaN(num)) return '-';
    
    // قالب‌بندی با جداکننده هزارگان
    const formattedNum = num.toLocaleString();
    
    // تبدیل اعداد به فارسی
    const persianNum = convertEnglishToPersianNumbers(formattedNum);
    
    // اضافه کردن واحد تومان در صورت نیاز
    return showUnit ? `${persianNum} تومان` : persianNum;
  } catch (error) {
    console.error('خطا در فرمت قیمت:', error);
    return '-';
  }
};

/**
 * تبدیل عدد صحیح به فارسی با حروف
 * @param num عدد صحیح
 * @returns نمایش فارسی عدد با حروف
 */
export const numberToWords = (num: number): string => {
  if (isNaN(num) || !isFinite(num)) return '';
  
  // آرایه‌های لازم برای تبدیل عدد به حروف
  const units = ['', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
  const teens = ['ده', 'یازده', 'دوازده', 'سیزده', 'چهارده', 'پانزده', 'شانزده', 'هفده', 'هجده', 'نوزده'];
  const tens = ['', 'ده', 'بیست', 'سی', 'چهل', 'پنجاه', 'شصت', 'هفتاد', 'هشتاد', 'نود'];
  const hundreds = ['', 'صد', 'دویست', 'سیصد', 'چهارصد', 'پانصد', 'ششصد', 'هفتصد', 'هشتصد', 'نهصد'];
  const scales = ['', 'هزار', 'میلیون', 'میلیارد', 'تریلیون'];
  
  // تابع بازگشتی برای تبدیل گروه سه‌تایی از ارقام
  const convertGroup = (n: number): string => {
    if (n === 0) return '';
    
    let result = '';
    
    // رقم صدگان
    const h = Math.floor(n / 100);
    if (h > 0) {
      result += hundreds[h] + ' ';
    }
    
    // ارقام دهگان و یکان
    const t = n % 100;
    if (t > 0) {
      if (t < 10) {
        result += units[t];
      } else if (t < 20) {
        result += teens[t - 10];
      } else {
        const ten = Math.floor(t / 10);
        const unit = t % 10;
        result += tens[ten];
        if (unit > 0) {
          result += ' و ' + units[unit];
        }
      }
    }
    
    return result.trim();
  };
  
  // برای عدد صفر
  if (num === 0) return 'صفر';
  
  // برای اعداد منفی
  if (num < 0) return 'منفی ' + numberToWords(Math.abs(num));
  
  let result = '';
  let groupIndex = 0;
  
  // تقسیم عدد به گروه‌های سه‌تایی و تبدیل هر گروه
  while (num > 0) {
    const group = num % 1000;
    num = Math.floor(num / 1000);
    
    if (group > 0) {
      const groupStr = convertGroup(group);
      const scaleStr = scales[groupIndex];
      
      // اضافه کردن به نتیجه
      if (result.length > 0 && groupStr.length > 0) {
        result = groupStr + ' ' + scaleStr + ' و ' + result;
      } else if (groupStr.length > 0) {
        result = groupStr + ' ' + scaleStr;
      }
    }
    
    groupIndex++;
  }
  
  return result.trim();
};

/**
 * تبدیل اعداد اعشاری یا کسری به حروف فارسی
 * @param num عدد اعشاری
 * @returns نمایش فارسی عدد با حروف
 */
export const decimalToWords = (num: number): string => {
  if (isNaN(num) || !isFinite(num)) return '';
  
  // جدا کردن بخش صحیح و اعشاری
  const integerPart = Math.floor(Math.abs(num));
  const decimalPart = Math.abs(num) - integerPart;
  
  // تبدیل بخش صحیح به حروف
  let result = numberToWords(num < 0 ? -integerPart : integerPart);
  
  // اگر بخش اعشاری داریم
  if (decimalPart > 0) {
    // تبدیل اعشار به رشته و حذف قسمت "0."
    const decimalStr = decimalPart.toString().substring(2);
    
    // اضافه کردن "ممیز" و حروف بخش اعشاری
    result += ' ممیز ';
    
    // خواندن تک تک ارقام اعشاری
    const digitNames = ['صفر', 'یک', 'دو', 'سه', 'چهار', 'پنج', 'شش', 'هفت', 'هشت', 'نه'];
    for (let i = 0; i < decimalStr.length; i++) {
      const digit = parseInt(decimalStr[i]);
      result += digitNames[digit];
      
      // اضافه کردن فاصله بین ارقام
      if (i < decimalStr.length - 1) {
        result += ' ';
      }
    }
  }
  
  return result;
};

/**
 * فرمت کردن اعداد با فاصله سه رقمی و تبدیل به فارسی
 * @param num عدد یا رشته عددی
 * @returns رشته فرمت شده
 */
export const formatNumber = (num: number | string | null | undefined): string => {
  if (num === null || num === undefined || num === '') return '-';
  
  try {
    // تبدیل به رشته و حذف کاراکترهای غیر عددی
    let numStr = num.toString();
    
    // تبدیل اعداد فارسی به انگلیسی
    numStr = convertPersianToEnglishNumbers(numStr);
    
    // حذف همه کاراکترهای غیر عددی (به جز نقطه اعشار)
    numStr = numStr.replace(/[^\d.-]/g, '');
    
    // تبدیل به عدد
    const numValue = parseFloat(numStr);
    
    // اعتبارسنجی عدد
    if (isNaN(numValue)) return '-';
    
    // قالب‌بندی با جداکننده هزارگان
    const formattedNum = numValue.toLocaleString();
    
    // تبدیل اعداد به فارسی
    return convertEnglishToPersianNumbers(formattedNum);
  } catch (error) {
    console.error('خطا در فرمت عدد:', error);
    return '-';
  }
};
