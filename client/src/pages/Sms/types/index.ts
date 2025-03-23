// client/src/pages/Sms/types/index.ts
// تعریف تایپ‌ها و اینترفیس‌های مورد استفاده در بخش SMS

/**
 * انواع سرویس‌دهنده پیامک
 */
export enum SmsProvider {
  KAVENEGAR = 'kavenegar',
  MELLIPAYAMAK = 'mellipayamak',
  FARAZSMS = 'farazsms',
  CUSTOM = 'custom',
}

/**
 * وضعیت‌های پیامک
 */
export enum SmsStatus {
  DELIVERED = 'delivered',
  FAILED = 'failed',
  PENDING = 'pending',
}

/**
 * تب‌های صفحه تنظیمات پیامک
 */
export enum SmsSettingsTabs {
  DASHBOARD = 'dashboard',
  SETTINGS = 'settings',
  LOGS = 'logs',
  TEMPLATES = 'templates',
  CONTACT_GROUPS = 'contact_groups',
  SCHEDULES = 'schedules',
}

/**
 * تنظیمات سرویس پیامک
 */
export interface SmsSettings {
  provider: SmsProvider;
  username: string;
  password: string;
  apiKey: string;
  apiUrl: string;
  senderNumber: string;
  useLocalBlacklist: boolean;
  enableDeliveryReports: boolean;
}

/**
 * آیتم لاگ پیامک
 */
export interface SmsLogItem {
  id: string;
  receiver: string;
  message: string;
  status: SmsStatus;
  sentAt: string;
  senderNumber: string;
  statusDetails?: string;
  cost: number;
}

/**
 * قالب پیامک
 */
export interface SmsTemplate {
  id: string;
  title: string;
  content: string;
  variables: string[];
  createdAt: string;
}

/**
 * گروه مخاطبان
 */
export interface ContactGroup {
  id: string;
  name: string;
  memberCount: number;
  description: string;
  createdAt: string;
}

/**
 * برنامه زمان‌بندی ارسال پیامک
 */
export interface SmsSchedule {
  id: string;
  title: string;
  message: string;
  recipients: string[];
  recipientCount: number;
  scheduleTime: string;
  status: string;
  createdAt: string;
}

/**
 * آمار پیامک
 */
export interface SmsStats {
  totalSent: number;
  totalDelivered: number;
  totalFailed: number;
  totalPending: number;
  lastMonthSent: number;
  costThisMonth: number;
  costLastMonth: number;
  deliveryRatePercent: number;
  chartData: {
    daily: Array<{
      date: string;
      sent: number;
      delivered: number;
      failed: number;
    }>;
    monthly: Array<{
      date: string;
      sent: number;
      delivered: number;
      failed: number;
    }>;
  };
} 