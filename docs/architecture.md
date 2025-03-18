# معماری سیستم پرداخت‌یار

<div dir="rtl">

## معماری کلی سیستم

پرداخت‌یار یک برنامه‌ی وب Full-Stack است که از PERN stack (PostgreSQL, Express, React, Node.js) با تایپ‌اسکریپت بهره می‌برد.

### لایه‌های اصلی

1. **لایه‌ی ارائه (Presentation Layer)**
   - فرانت‌اند React با استفاده از Material-UI
   - تایپ‌اسکریپت برای تعریف تایپ‌ها

2. **لایه‌ی سرویس (Service Layer)**
   - Backend Express.js
   - RESTful API
   - پردازش بیزنس لاجیک

3. **لایه‌ی داده (Data Layer)**
   - PostgreSQL به عنوان پایگاه داده
   - Prisma به عنوان ORM

## معماری فرانت‌اند

- **React + TypeScript**: برای ساخت رابط کاربری
- **Context API + Hooks**: برای مدیریت حالت (State Management)
- **Material-UI**: برای طراحی متریال دیزاین
- **React Router**: برای مدیریت مسیرها
- **Axios**: برای ارتباط با API

## معماری بک‌اند

- **Express.js + TypeScript**: برای ساخت RESTful API
- **Prisma**: برای ارتباط با پایگاه داده
- **JWT**: برای احراز هویت
- **Multer + Sharp**: برای مدیریت آپلود و پردازش تصاویر
- **Winston**: برای لاگینگ

## دیاگرام ارتباطی

```
+----------------+       +----------------+       +----------------+
|                |       |                |       |                |
|    React UI    |------>|   Express API  |------>|  PostgreSQL    |
|                |<------|                |<------|                |
+----------------+       +----------------+       +----------------+
                                 |
                                 v
                          +----------------+
                          |                |
                          |  File Storage  |
                          |                |
                          +----------------+
```

## معماری امنیت

- **JWT (JSON Web Tokens)**: برای احراز هویت و حفظ نشست کاربران
- **RBAC (Role-Based Access Control)**: برای مدیریت سطوح دسترسی
- **CORS**: برای امنیت cross-origin
- **Helmet**: برای تنظیم هدرهای HTTP امنیتی
- **Rate Limiting**: برای محدودیت درخواست‌ها

</div>
