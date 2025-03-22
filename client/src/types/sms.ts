// client/src/types/sms.ts
// تعریف تایپ‌های مرتبط با پیامک

export interface SmsSettings {
  provider: string;
  username: string;
  password: string;
  from: string;
  isActive: boolean;
  lines?: string[];
  defaultLine?: string;
}

export enum SmsProvider {
  SMS0098 = '0098sms',
  KAVENEGAR = 'kavenegar',
  MELLIPAYAMAK = 'mellipayamak',
  GHASEDAK = 'ghasedak',
  FARAPAYAMAK = 'farapayamak',
}

export enum SmsStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  BLOCKED = 'BLOCKED',
  UNDELIVERED = 'UNDELIVERED',
}

export interface SmsLogItem {
  id: number;
  receiver: string;
  message: string;
  messageId?: string;
  status: SmsStatus;
  statusDetails?: string;
  provider: string;
  senderNumber: string;
  sentAt: string;
  relatedTo?: string;
  relatedId?: number;
  cost?: number;
}

export interface SmsTemplate {
  id: number;
  title: string;
  content: string;
  variables: string[];
  description?: string;
  category: string;
  isActive: boolean;
  createdAt: string;
}

export interface SmsDeliveryStatus {
  messageId: string;
  status: string | null;
  message: string;
} 