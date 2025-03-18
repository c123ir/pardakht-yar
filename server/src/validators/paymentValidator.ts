// server/src/validators/paymentValidator.ts
// اعتبارسنجی داده‌های پرداخت

import Joi from 'joi';
import { PaymentStatus } from '@prisma/client';

// اسکیمای اعتبارسنجی ایجاد درخواست پرداخت
export const createPaymentSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'عنوان پرداخت الزامی است',
    'any.required': 'عنوان پرداخت الزامی است',
  }),
  amount: Joi.number().positive().required().messages({
    'number.base': 'مبلغ باید عدد باشد',
    'number.positive': 'مبلغ باید مثبت باشد',
    'any.required': 'مبلغ الزامی است',
  }),
  effectiveDate: Joi.date().iso().required().messages({
    'date.base': 'تاریخ مؤثر باید یک تاریخ معتبر باشد',
    'date.iso': 'تاریخ مؤثر باید در فرمت ISO باشد',
    'any.required': 'تاریخ مؤثر الزامی است',
  }),
  description: Joi.string().allow('', null),
  groupId: Joi.number().integer().positive().allow(null),
  contactId: Joi.number().integer().positive().allow(null),
  beneficiaryName: Joi.string().allow('', null),
  beneficiaryPhone: Joi.string().allow('', null).pattern(/^(0|\+98)?9\d{9}$/).messages({
    'string.pattern.base': 'شماره موبایل ذینفع باید یک شماره موبایل ایرانی معتبر باشد',
  }),
});

// اسکیمای اعتبارسنجی به‌روزرسانی درخواست پرداخت
export const updatePaymentSchema = Joi.object({
  title: Joi.string().messages({
    'string.empty': 'عنوان پرداخت نمی‌تواند خالی باشد',
  }),
  amount: Joi.number().positive().messages({
    'number.base': 'مبلغ باید عدد باشد',
    'number.positive': 'مبلغ باید مثبت باشد',
  }),
  effectiveDate: Joi.date().iso().messages({
    'date.base': 'تاریخ مؤثر باید یک تاریخ معتبر باشد',
    'date.iso': 'تاریخ مؤثر باید در فرمت ISO باشد',
  }),
  description: Joi.string().allow('', null),
  status: Joi.string().valid(...Object.values(PaymentStatus)),
  groupId: Joi.number().integer().positive().allow(null),
  contactId: Joi.number().integer().positive().allow(null),
  beneficiaryName: Joi.string().allow('', null),
  beneficiaryPhone: Joi.string().allow('', null).pattern(/^(0|\+98)?9\d{9}$/).messages({
    'string.pattern.base': 'شماره موبایل ذینفع باید یک شماره موبایل ایرانی معتبر باشد',
  }),
});