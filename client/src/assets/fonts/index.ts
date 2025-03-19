// این فایل برای مدیریت فونت‌های استفاده شده در پروژه است
// به جای استفاده از next/font/local از فایل CSS استاندارد استفاده می‌کنیم

// تعریف فونت‌های مورد استفاده
export const fontPaths = {
  iranSansRegular: './IRANSansWeb(FaNum)_Regular.ttf',
  iranSansBold: './IRANSansWeb (FaNum)_Bold.ttf',
  iranSansLight: './IRANSansWeb(FaNum)_Light.ttf',
  iranSansMedium: './IRANSansWeb(FaNum)_Medium.ttf',
};

// تعریف نام‌های فونت برای استفاده در استایل‌ها
export const fontNames = {
  iranSans: 'IRANSans',
};

// تعریف وزن‌های فونت
export const fontWeights = {
  light: 300,
  regular: 400,
  medium: 500,
  bold: 700,
};

// صادر کردن IranSans به عنوان یک شی
export const IranSans = {
  fontFamily: fontNames.iranSans,
  variants: fontPaths,
  weights: fontWeights,
};

export default fontNames; 