// server/src/middleware/validator.ts
// میدل‌ور اعتبارسنجی داده‌ها

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from './error';

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
