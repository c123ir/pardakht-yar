برای انتقال پروژه از طریق گیت و تنظیمات روی سرور، به ترتیب زیر عمل کنید:

## 1. انتقال کد از طریق گیت

1. **آماده‌سازی مخزن گیت:**
   ```bash
   git init
   git add .
   git commit -m "نسخه اولیه برای انتقال"
   ```

2. **ایجاد مخزن در GitHub/GitLab و انتقال کد:**
   ```bash
   git remote add origin https://github.com/username/pardakht-yar.git
   git push -u origin main
   ```

3. **کلون کردن مخزن روی سرور:**
   ```bash
   ssh user@آدرس-سرور
   mkdir -p /opt/pardakht-yar
   cd /opt/pardakht-yar
   git clone https://github.com/username/pardakht-yar.git .
   ```

## 2. تنظیمات سرور

1. **ساخت فایل محیط:**
   ```bash
   cp .env.production.example .env.production
   nano .env.production  # ویرایش فایل محیطی
   ```

2. **ایجاد دایرکتوری آپلودها:**
   ```bash
   mkdir -p uploads/avatars uploads/payments uploads/requests
   chmod -R 755 uploads
   ```

3. **راه‌اندازی با داکر:**
   ```bash
   docker-compose -f docker-compose.production.yml up -d
   ```

4. **بررسی وضعیت:**
   ```bash
   docker-compose -f docker-compose.production.yml ps
   ```

## 3. تنظیمات مک

همان دستورات قبلی برای محیط توسعه کار می‌کند. فقط با گیت پول کردن، کد را بروز نگه دارید:

```bash
git pull
docker-compose up -d
```

مشکل قبلی شما با انتقال مستقیم بود که به خاطر خطای `Could not resolve hostname server-ip` نتوانستید به سرور متصل شوید. استفاده از گیت این مشکل را حل می‌کند چون نیازی به اتصال مستقیم SSH از مک به سرور نیست.

آیا سرور واقعی دارید یا می‌خواهید روی همان مک اجرا کنید؟
