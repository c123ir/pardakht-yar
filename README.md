# پرداخت یار

پروژه مدیریت پرداخت‌ها و درخواست‌های مالی

## راه‌اندازی با داکر

این پروژه با استفاده از داکر قابل اجرا است که انتقال بین سیستم‌های مختلف را ساده می‌کند.

### پیش‌نیازها

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### مراحل اجرا

1. **کلون کردن مخزن**
   ```bash
   git clone <repository-url>
   cd pardakht-yar
   ```

2. **ساخت و اجرای کانتینرها**
   ```bash
   docker-compose up -d
   ```
   این دستور سه سرویس را اجرا می‌کند:
   - دیتابیس PostgreSQL روی پورت 5432
   - سرور بک‌اند روی پورت 5050
   - کلاینت فرانت‌اند روی پورت 5173

3. **اجرای مایگریشن‌ها و سید‌ها**
   ```bash
   docker-compose exec server npm run prisma:migrate
   docker-compose exec server npm run prisma:seed
   ```

4. **دسترسی به برنامه**
   - فرانت‌اند: http://localhost:5173
   - بک‌اند: http://localhost:5050/api
   - کاربر پیش‌فرض: `admin` با رمز عبور `admin123`

### دستورات مفید

- **مشاهده لاگ‌ها**
  ```bash
  docker-compose logs -f
  ```

- **متوقف کردن کانتینرها**
  ```bash
  docker-compose down
  ```

- **بازسازی کانتینرها پس از تغییرات در Dockerfile**
  ```bash
  docker-compose build --no-cache
  docker-compose up -d
  ```

- **حذف کامل کانتینرها و حجم‌ها**
  ```bash
  docker-compose down -v
  ```

## انتقال بین سیستم‌های مختلف

1. **مخزن گیت**
   بهترین روش، استفاده از گیت برای انتقال کد بین سیستم‌های مختلف است:
   ```bash
   git push # روی سیستم اول
   git pull # روی سیستم دوم
   ```
   سپس روی سیستم دوم کافیست دستور `docker-compose up -d` را اجرا کنید.

2. **انتقال تصاویر داکر**
   برای انتقال بدون نیاز به اینترنت:
   ```bash
   # روی سیستم اول
   docker-compose build
   docker save -o pardakhtyar-images.tar pardakhtyar-client pardakhtyar-server postgres:15-alpine

   # انتقال فایل به سیستم دوم

   # روی سیستم دوم
   docker load -i pardakhtyar-images.tar
   docker-compose up -d
   ```

3. **انتقال به سرور لینوکس**
   از SCP یا SFTP برای انتقال فایل‌ها استفاده کنید:
   ```bash
   scp -r ./pardakht-yar user@your-server-ip:/path/to/destination
   ```
   سپس روی سرور لینوکس:
   ```bash
   cd /path/to/destination/pardakht-yar
   docker-compose up -d
   ```

## نکات مهم

- داده‌های دیتابیس در یک حجم داکر ذخیره می‌شوند و با حذف کانتینرها از بین نمی‌روند
- پوشه `uploads` بین سیستم میزبان و کانتینر به اشتراک گذاشته می‌شود
- تغییرات کد به صورت زنده اعمال می‌شوند و نیازی به بازسازی کانتینرها نیست
