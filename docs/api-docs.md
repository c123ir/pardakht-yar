# مستندات API سیستم پرداخت‌یار

<div dir="rtl">

## اطلاعات کلی API

- **URL پایه**: `http://localhost:5000/api`
- **فرمت مبادله داده**: JSON
- **احراز هویت**: JWT (JSON Web Token)
- **نسخه API**: v1

## مسیرهای API

### احراز هویت

#### ورود به سیستم
- **URL**: `/auth/login`
- **روش**: `POST`
- **بدنه درخواست**:
  ```json
  {
    "username": "username",
    "password": "password"
  }
  ```
- **پاسخ موفق (200)**:
  ```json
  {
    "success": true,
    "token": "jwt_token",
    "user": {
      "id": 1,
      "username": "username",
      "fullName": "نام کامل",
      "role": "ADMIN"
    }
  }
  ```

#### دریافت پروفایل کاربر
- **URL**: `/auth/me`
- **روش**: `GET`
- **هدرها**: `Authorization: Bearer jwt_token`
- **پاسخ موفق (200)**:
  ```json
  {
    "success": true,
    "user": {
      "id": 1,
      "username": "username",
      "fullName": "نام کامل",
      "email": "email@example.com",
      "role": "ADMIN"
    }
  }
  ```

### مدیریت پرداخت‌ها

#### دریافت لیست پرداخت‌ها
- **URL**: `/payments`
- **روش**: `GET`
- **هدرها**: `Authorization: Bearer jwt_token`
- **پارامترهای Query (اختیاری)**:
  - `status`: وضعیت پرداخت (PENDING, APPROVED, PAID, REJECTED)
  - `groupId`: شناسه گروه
  - `contactId`: شناسه طرف‌حساب
  - `page`: شماره صفحه (پیش‌فرض: 1)
  - `limit`: تعداد آیتم در هر صفحه (پیش‌فرض: 10)
- **پاسخ موفق (200)**:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "title": "واریز حقوق",
        "amount": 12000000,
        "status": "PAID",
        "effectiveDate": "2023-12-28T00:00:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 1,
      "totalPages": 1
    }
  }
  ```

#### ایجاد درخواست پرداخت جدید
- **URL**: `/payments`
- **روش**: `POST`
- **هدرها**: `Authorization: Bearer jwt_token`
- **بدنه درخواست**:
  ```json
  {
    "title": "واریز حقوق محمد حیدری",
    "amount": 12000000,
    "effectiveDate": "1403-12-28",
    "groupId": 1,
    "description": "حقوق اسفند ماه",
    "beneficiaryName": "محمد حیدری",
    "beneficiaryPhone": "09123456789"
  }
  ```
- **پاسخ موفق (201)**:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "title": "واریز حقوق محمد حیدری",
      "amount": 12000000,
      "effectiveDate": "2023-12-28T00:00:00.000Z",
      "status": "PENDING"
    }
  }
  ```

### ادامه مستندات...
سایر اندپوینت‌های API مانند مدیریت گروه‌ها، طرف‌حساب‌ها، و آپلود تصاویر در نسخه‌های بعدی مستندات اضافه خواهند شد.

</div>
