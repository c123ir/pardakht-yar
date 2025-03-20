// کلاس خطای سفارشی برای API
export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
    
    // فقط برای ES5 که Error.captureStackTrace را دارد
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
} 