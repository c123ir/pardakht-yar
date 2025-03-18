# راهنمای راه‌اندازی پروژه پرداخت‌یار

<div dir="rtl">

## مرحله ۱: آماده‌سازی محیط توسعه

### پیش‌نیازها

قبل از شروع، اطمینان حاصل کنید که موارد زیر نصب شده‌اند:

1. **Node.js** (نسخه 16 یا بالاتر)
2. **npm** (نسخه 7 یا بالاتر) یا **yarn**
3. **PostgreSQL** (نسخه 13 یا بالاتر)
4. **Git**

### دریافت کد منبع

```bash
# کلون کردن مخزن
git clone https://github.com/your-username/pardakht-yar.git
cd pardakht-yar
```

## مرحله ۲: راه‌اندازی بک‌اند

### تنظیم متغیرهای محیطی

وارد پوشه `server` شوید و فایل `.env.example` را به `.env` کپی کنید:

```bash
cd server
cp .env.example .env
```

فایل `.env` را ویرایش کنید و مقادیر مناسب را وارد کنید.

### نصب وابستگی‌ها

```bash
npm install
# یا اگر از yarn استفاده می‌کنید
yarn
```

### آماده‌سازی پایگاه داده

ابتدا یک پایگاه داده PostgreSQL با نام `pardakht_yar` ایجاد کنید:

```bash
# وارد محیط psql شوید
psql -U postgres

# در محیط psql، پایگاه داده را ایجاد کنید
CREATE DATABASE pardakht_yar;
\q
```

سپس اسکیما و جداول را با استفاده از Prisma ایجاد کنید:

```bash
npx prisma migrate dev --name init
```

### راه‌اندازی سرور در محیط توسعه

```bash
npm run dev
# یا
yarn dev
```

سرور روی آدرس `http://localhost:5000` در دسترس خواهد بود.

## مرحله ۳: راه‌اندازی فرانت‌اند

### تنظیم متغیرهای محیطی

به پوشه اصلی پروژه برگردید و وارد پوشه `client` شوید:

```bash
cd ../client
cp .env.development.example .env.development
```

فایل `.env.development` را ویرایش کنید.

### نصب وابستگی‌ها

```bash
npm install
# یا
yarn
```

### راه‌اندازی برنامه در محیط توسعه

```bash
npm run dev
# یا
yarn dev
```

فرانت‌اند روی آدرس `http://localhost:3000` در دسترس خواهد بود.

</div>
