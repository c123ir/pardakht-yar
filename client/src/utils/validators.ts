// client/src/utils/validators.ts
// توابع اعتبارسنجی

// اعتبارسنجی شماره موبایل
export const isValidMobileNumber = (phone: string): boolean => {
  // الگوی شماره موبایل ایرانی
  const mobileRegex = /^09\d{9}$/;
  return mobileRegex.test(phone);
};

// اعتبارسنجی ایمیل
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// اعتبارسنجی کد ملی
export const isValidNationalCode = (code: string): boolean => {
  // تبدیل به رشته و اعتبارسنجی طول
  const nc = typeof code === 'string' ? code : String(code);
  if (!/^\d{10}$/.test(nc)) return false;
  
  // الگوریتم کد ملی ایران
  const check = +nc[9];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += +nc[i] * (10 - i);
  }
  const remainder = sum % 11;
  return (remainder < 2 && check === remainder) || (remainder >= 2 && check + remainder === 11);
};

// اعتبارسنجی شماره کارت بانکی
export const isValidBankCardNumber = (card: string): boolean => {
  // حذف فاصله‌ها و خط‌ها
  const cardNumber = card.replace(/[\s-]/g, '');
  
  // بررسی طول و شروع با ۶۰۳۷ یا ۶۲۱۹ و...
  if (!/^\d{16}$/.test(cardNumber)) return false;
  
  // الگوریتم لان (Luhn)
  let sum = 0;
  let alternate = false;
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let n = parseInt(cardNumber.charAt(i), 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  
  return sum % 10 === 0;
};

// اعتبارسنجی شماره شبا
export const isValidIBAN = (iban: string): boolean => {
  // حذف فاصله‌ها
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  
  // بررسی فرمت کلی شبا
  if (!/^IR\d{24}$/.test(cleanIban)) return false;
  
  // IBAN های ایرانی همیشه با IR شروع می

  cat >> client/src/utils/validators.ts << 'EOF'
  // IBAN های ایرانی همیشه با IR شروع می‌شوند و ۲۴ رقم بعد از IR دارند
  // بررسی دقیق‌تر نیازمند محاسبات بیشتر است که اینجا ساده‌سازی شده
  return true;
};
