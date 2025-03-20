// server/src/middleware/validator.ts
// میدل‌ور اعتبارسنجی ورودی‌ها با استفاده از Joi

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from '../utils/error';

// میدل‌ور اعتبارسنجی
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false, // نمایش تمام خطاها
      allowUnknown: true, // اجازه فیلدهای اضافی
      stripUnknown: true, // حذف فیلدهای اضافی
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      
      return next(new ApiError(400, errorMessage));
    }

    next();
  };
};

// مثال اسکیمای اعتبارسنجی برای ورود
export const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'نام کاربری الزامی است',
    'any.required': 'نام کاربری الزامی است',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'رمز عبور الزامی است',
    'any.required': 'رمز عبور الزامی است',
  }),
});

// مثال اسکیمای اعتبارسنجی برای ایجاد درخواست پرداخت
export const paymentRequestSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'عنوان پرداخت الزامی است',
    'any.required': 'عنوان پرداخت الزامی است',
  }),
  amount: Joi.number().integer().positive().required().messages({
    'number.base': 'مبلغ باید عدد باشد',
    'number.integer': 'مبلغ باید عدد صحیح باشد',
    'number.positive': 'مبلغ باید مثبت باشد',
    'any.required': 'مبلغ الزامی است',
  }),
  effectiveDate: Joi.date().required().messages({
    'date.base': 'تاریخ مؤثر باید یک تاریخ معتبر باشد',
    'any.required': 'تاریخ مؤثر الزامی است',
  }),
  description: Joi.string().allow('', null),
  groupId: Joi.number().integer().positive().allow(null),
  contactId: Joi.number().integer().positive().allow(null),
  beneficiaryName: Joi.string().allow('', null),
  beneficiaryPhone: Joi.string().allow('', null),
});

// ایمیل و شماره موبایل ایرانی
export const customValidationRules = {
  email: Joi.string().email().messages({
    'string.email': 'ایمیل وارد شده معتبر نیست',
    'string.empty': 'ایمیل نمی‌تواند خالی باشد',
  }),
  
  mobileIR: Joi.string()
    .pattern(/^09\d{9}$/)
    .messages({
      'string.pattern.base': 'شماره موبایل باید با فرمت صحیح ایرانی باشد (مثال: 09123456789)',
      'string.empty': 'شماره موبایل نمی‌تواند خالی باشد',
    }),
  
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    .messages({
      'string.min': 'رمز عبور باید حداقل ۸ کاراکتر باشد',
      'string.pattern.base': 'رمز عبور باید شامل حداقل یک حرف کوچک، یک حرف بزرگ و یک عدد باشد',
      'string.empty': 'رمز عبور نمی‌تواند خالی باشد',
    }),
};
