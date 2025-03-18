# راه‌اندازی پروژه پرداخت‌یار

برای راه‌اندازی پروژه پرداخت‌یار، مراحل زیر را دنبال کنید:

## مرحله 1: کلون کردن پروژه

```bash
git clone https://github.com/your-username/pardakht-yar.git
cd pardakht-yar
```

## مرحله 2: نصب وابستگی‌ها

برای نصب همه وابستگی‌ها در هر دو بخش کلاینت و سرور:

```bash
npm run setup
```

یا به صورت دستی:

```bash
# نصب وابستگی‌های اصلی
npm install

# نصب وابستگی‌های کلاینت
cd client
npm install
cd ..

# نصب وابستگی‌های سرور
cd server
npm install
cd ..
```

## مرحله 3: تنظیم فایل‌های محیطی

### برای سرور:

```bash
cd server
cp .env.example .env
```

سپس فایل `.env` را با مقادیر مناسب ویرایش کنید.

### برای کلاینت:

```bash
cd client
cp .env.development.example .env.development
```

## مرحله 4: راه‌اندازی پایگاه داده PostgreSQL

یک پایگاه داده PostgreSQL با نام `pardakht_yar` ایجاد کنید:

```bash
psql -U postgres
CREATE DATABASE pardakht_yar;
\q
```

## مرحله 5: اعمال مهاجرت‌های پایگاه داده

```bash
cd server
npx prisma migrate dev --name init
```

## مرحله 6: راه‌اندازی برنامه

برای راه‌اندازی هم‌زمان سرور و کلاینت:

```bash
npm run dev
```

یا به صورت جداگانه:

```bash
# راه‌اندازی سرور
cd server
npm run dev

# در ترمینال دیگر، راه‌اندازی کلاینت
cd client
npm run dev
```

سرور روی آدرس `http://localhost:5000` و کلاینت روی آدرس `http://localhost:3000` در دسترس خواهند بود.

## مستندات بیشتر

برای اطلاعات بیشتر به مستندات موجود در پوشه `docs` مراجعه کنید.
