// client/src/utils/numberUtils.ts
// توابع کمکی برای کار با اعداد فارسی

// تبدیل اعداد انگلیسی به فارسی
export const toPersianNumber = (num: number | string): string => {
  if (num === undefined || num === null) return '';
  
  const str = num.toString();
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  return str.replace(/[0-9]/g, (match) => {
    return persianDigits[parseInt(match)];
  });
};

// تبدیل اعداد فارسی به انگلیسی
export const toEnglishNumber = (str: string): string => {
  if (!str) return '';
  
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  return str.replace(/[۰-۹]/g, (match) => {
    return persianDigits.indexOf(match).toString();
  });
};

// فرمت کردن عدد به صورت پول (با جداکننده هزارگان)
export const formatCurrency = (num: number | string, persianize: boolean = true): string => {
  if (num === undefined || num === null) return '';
  
  const amount = typeof num === 'string' ? parseFloat(toEnglishNumber(num)) : num;
  
  // اضافه کردن جداکننده هزارگان
  const formattedNumber = amount.toLocaleString('fa-IR');
  
  return persianize ? formattedNumber : formattedNumber.replace(/[۰-۹]/g, d => String.fromCharCode(d.charCodeAt(0) - 1728));
};

// فرمت کردن عدد به صورت پول با واحد
export const formatMoney = (num: number | string, unit: string = 'ریال'): string => {
  if (num === undefined || num === null) return '';
  
  return `${formatCurrency(num)} ${unit}`;
};
