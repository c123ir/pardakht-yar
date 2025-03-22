// client/src/types/api.ts
// تعریف تایپ‌های مرتبط با API

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
} 