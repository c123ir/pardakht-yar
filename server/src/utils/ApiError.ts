export class ApiError extends Error {
  statusCode: number;
  data: any;
  success: boolean;
  errors: string[];

  constructor(
    statusCode: number,
    message: string = "خطایی رخ داده است",
    errors: string[] = [],
    data: any = null
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = data;
    this.success = false;
    this.errors = errors;

    // ثبت stack trace صحیح
    Error.captureStackTrace(this, this.constructor);
  }
}

// تابع کمکی برای ایجاد خطاهای API رایج
export const createApiError = {
  badRequest: (message: string = "درخواست نامعتبر است", errors: string[] = []) => {
    return new ApiError(400, message, errors);
  },
  
  unauthorized: (message: string = "دسترسی غیرمجاز", errors: string[] = []) => {
    return new ApiError(401, message, errors);
  },
  
  forbidden: (message: string = "شما مجوز دسترسی به این منبع را ندارید", errors: string[] = []) => {
    return new ApiError(403, message, errors);
  },
  
  notFound: (message: string = "منبع درخواستی یافت نشد", errors: string[] = []) => {
    return new ApiError(404, message, errors);
  },
  
  conflict: (message: string = "تداخل با منابع موجود", errors: string[] = []) => {
    return new ApiError(409, message, errors);
  },
  
  internal: (message: string = "خطای داخلی سرور", errors: string[] = []) => {
    return new ApiError(500, message, errors);
  }
}; 