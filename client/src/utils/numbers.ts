/**
 * تبدیل اعداد فارسی به انگلیسی
 * @param str رشته حاوی اعداد فارسی
 * @returns رشته با اعداد انگلیسی
 */
export const convertPersianToEnglishNumbers = (str: string): string => {
  const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  const englishNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

  let result = str;

  // تبدیل اعداد فارسی
  for (let i = 0; i < 10; i++) {
    const regex = new RegExp(persianNumbers[i], 'g');
    result = result.replace(regex, englishNumbers[i]);
  }

  // تبدیل اعداد عربی
  for (let i = 0; i < 10; i++) {
    const regex = new RegExp(arabicNumbers[i], 'g');
    result = result.replace(regex, englishNumbers[i]);
  }

  return result;
}; 