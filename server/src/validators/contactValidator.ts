// server/src/validators/contactValidator.ts
// اعتبارسنجی داده‌های طرف‌حساب

import Joi from 'joi';

// اسکیمای اعتبارسنجی ایجاد و به‌روزرسانی طرف‌حساب
export const contactSchema = Joi.object({
  companyName: Joi.string().required().messages({
    'string.empty': 'نام شرکت الزامی است',
    'any.required': 'نام شرکت الزامی است',
  }),
  ceoName: Joi.string().allow('', null),
  fieldOfActivity: Joi.string().allow('', null),
  accountantName: Joi.string().allow('', null),
  accountantPhone: Joi.string().allow('', null).pattern(/^(0|\+98)?9\d{9}$/).messages({
    'string.pattern.base': 'شماره موبایل حسابدار باید یک شماره موبایل ایرانی معتبر باشد',
  }),
  email: Joi.string().allow('', null).email().messages({
    'string.email': 'آدرس ایمیل وارد شده معتبر نیست',
  }),
  address: Joi.string().allow('', null),
  bankInfo: Joi.object({
    bankName: Joi.string().allow('', null),
    accountNumber: Joi.string().allow('', null),
    cardNumber: Joi.string().allow('', null).pattern(/^\d{16}$/).messages({
      'string.pattern.base': 'شماره کارت باید 16 رقم باشد',
    }),
    iban: Joi.string().allow('', null).pattern(/^(IR)?[0-9]{24}$/i).messages({
      'string.pattern.base': 'شماره شبا باید در فرمت صحیح باشد (IR + 24 رقم)',
    }),
    accountOwner: Joi.string().allow('', null),
  }).allow(null),
});