// server/src/scripts/createTestRequestTypes.ts
// اسکریپت برای ایجاد نمونه‌های آزمایشی از انواع درخواست‌ها

import { PrismaClient } from '@prisma/client';
import { FieldConfig } from '../types/request.types';

const prisma = new PrismaClient();

// تنظیمات فیلدهای پیش‌فرض درخواست
const DEFAULT_FIELD_CONFIG: FieldConfig = {
  title: {
    enabled: true,
    required: true,
    label: 'عنوان',
    order: 1,
  },
  description: {
    enabled: true,
    required: false,
    label: 'توضیحات',
    order: 2,
  },
  amount: {
    enabled: true,
    required: false,
    label: 'مبلغ',
    order: 3,
  },
  effectiveDate: {
    enabled: true,
    required: false,
    label: 'تاریخ',
    order: 4,
  },
  status: {
    enabled: true,
    required: true,
    label: 'وضعیت',
    order: 5,
    options: []
  },
  beneficiaryName: {
    enabled: true,
    required: false,
    label: 'نام ذینفع',
    order: 6,
  },
  beneficiaryPhone: {
    enabled: true,
    required: false,
    label: 'شماره تماس ذینفع',
    order: 7,
  },
  contactId: {
    enabled: true,
    required: false,
    label: 'مخاطب',
    order: 8,
  },
  groupId: {
    enabled: true,
    required: false,
    label: 'گروه',
    order: 9,
  },
  timeField: {
    enabled: true,
    required: false,
    label: 'زمان',
    order: 10,
  },
  toggleField: {
    enabled: false,
    required: false,
    label: 'فیلد بله/خیر',
    order: 11,
  }
};

// انواع درخواست‌های نمونه
const sampleRequestTypes = [
  {
    name: 'درخواست پرداخت معمولی',
    description: 'درخواست پرداخت استاندارد با همه فیلدها',
    isActive: true,
    fieldConfig: {
      ...DEFAULT_FIELD_CONFIG,
      amount: { ...DEFAULT_FIELD_CONFIG.amount, required: true },
      contactId: { ...DEFAULT_FIELD_CONFIG.contactId, required: true },
    },
  },
  {
    name: 'درخواست پرداخت به ذینفع',
    description: 'درخواست پرداخت به شخص ذینفع بدون نیاز به طرف‌حساب',
    isActive: true,
    fieldConfig: {
      ...DEFAULT_FIELD_CONFIG,
      amount: { ...DEFAULT_FIELD_CONFIG.amount, required: true },
      beneficiaryName: { ...DEFAULT_FIELD_CONFIG.beneficiaryName, required: true },
      beneficiaryPhone: { ...DEFAULT_FIELD_CONFIG.beneficiaryPhone, required: true },
      contactId: { ...DEFAULT_FIELD_CONFIG.contactId, enabled: false },
    },
  },
  {
    name: 'درخواست خرید',
    description: 'درخواست خرید کالا یا خدمات',
    isActive: true,
    fieldConfig: {
      ...DEFAULT_FIELD_CONFIG,
      amount: { ...DEFAULT_FIELD_CONFIG.amount, required: true },
      vendor: { enabled: true, required: true, label: 'فروشنده' },
      productDetails: { enabled: true, required: true, label: 'جزئیات محصول/خدمات' },
      justification: { enabled: true, required: false, label: 'توجیه درخواست' },
      contactId: { ...DEFAULT_FIELD_CONFIG.contactId, enabled: false },
    },
  },
  {
    name: 'درخواست تنخواه',
    description: 'درخواست تنخواه برای هزینه‌های روزمره',
    isActive: true,
    fieldConfig: {
      ...DEFAULT_FIELD_CONFIG,
      amount: { ...DEFAULT_FIELD_CONFIG.amount, required: true },
      purpose: { enabled: true, required: true, label: 'هدف' },
      dateRequired: { enabled: true, required: true, label: 'تاریخ مورد نیاز' },
      contactId: { ...DEFAULT_FIELD_CONFIG.contactId, enabled: false },
      groupId: { ...DEFAULT_FIELD_CONFIG.groupId, enabled: false },
    },
  },
  {
    name: 'درخواست استرداد',
    description: 'درخواست استرداد وجه به مشتری',
    isActive: true,
    fieldConfig: {
      ...DEFAULT_FIELD_CONFIG,
      amount: { ...DEFAULT_FIELD_CONFIG.amount, required: true },
      contactId: { ...DEFAULT_FIELD_CONFIG.contactId, required: true },
      originalInvoiceNumber: { enabled: true, required: true, label: 'شماره فاکتور اصلی' },
      originalPurchaseDate: { enabled: true, required: true, label: 'تاریخ خرید اصلی' },
      reason: { enabled: true, required: true, label: 'دلیل استرداد' },
    },
  },
];

// ایجاد نمونه‌های آزمایشی در دیتابیس
async function createTestRequestTypes() {
  try {
    // پیدا کردن کاربر ادمین
    const admin = await prisma.user.findFirst({
      where: {
        role: 'ADMIN',
      },
    });

    if (!admin) {
      console.error('هیچ کاربر ادمینی یافت نشد. لطفاً ابتدا یک کاربر ادمین ایجاد کنید.');
      return;
    }

    console.log('در حال ایجاد انواع درخواست آزمایشی...');

    // حذف انواع درخواست موجود (اختیاری)
    await prisma.requestType.deleteMany({});

    // ایجاد انواع درخواست جدید
    for (const requestType of sampleRequestTypes) {
      await prisma.requestType.create({
        data: {
          name: requestType.name,
          description: requestType.description,
          isActive: requestType.isActive,
          fieldConfig: JSON.parse(JSON.stringify(requestType.fieldConfig)), // تبدیل به JSON برای ذخیره در Prisma
          createdBy: admin.id,
        },
      });
    }

    console.log('انواع درخواست آزمایشی با موفقیت ایجاد شدند!');
  } catch (error) {
    console.error('خطا در ایجاد انواع درخواست آزمایشی:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// اجرای اسکریپت
createTestRequestTypes(); 