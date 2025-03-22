# راهنمای داکرایز کردن پروژه پرداخت‌یار

داکرایز کردن پروژه شما یکی از بهترین راه‌حل‌ها برای جابجایی بین سیستم‌های مختلف (مک‌بوک M1، ای‌مک اینتل و سرور لینوکس) است. با این روش می‌توانید بدون نگرانی از تفاوت سیستم‌عامل یا معماری پردازنده، پروژه‌تان را در همه جا یکسان اجرا کنید.

## مرحله 1: ایجاد فایل‌های داکر

ابتدا باید فایل‌های داکر را برای هر سرویس (کلاینت و سرور) ایجاد کنیم:

```dockerfile:client/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
```

```dockerfile:server/Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5050

CMD ["npm", "run", "dev"]
```
## مرحله 2: ایجاد docker-compose.yml

حالا یک فایل docker-compose.yml در ریشه پروژه ایجاد می‌کنیم تا همه سرویس‌ها را کنار هم مدیریت کنیم:

```compose:docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: pardakhtyar-postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: pardakht_yar
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  server:
    build:
      context: ./server
      dockerfile: Dockerfile
    container_name: pardakhtyar-server
    restart: always
    ports:
      - "5050:5050"
    environment:
      - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/pardakht_yar
      - PORT=5050
      - JWT_SECRET=your-secret-key-should-be-changed-in-production
      - NODE_ENV=development
    volumes:
      - ./server:/app
      - /app/node_modules
      - ./uploads:/app/uploads
    depends_on:
      - postgres

  client:
    build:
      context: ./client
      dockerfile: Dockerfile
    container_name: pardakhtyar-client
    restart: always
    ports:
      - "5173:5173"
    environment:
      - VITE_API_URL=http://localhost:5050/api
    volumes:
      - ./client:/app
      - /app/node_modules
    depends_on:
      - server

volumes:
  postgres_data:
```
## مرحله 3: ایجاد فایل‌های .dockerignore

برای بهینه‌سازی فرآیند ساخت تصاویر داکر، فایل‌های .dockerignore را ایجاد می‌کنیم:

```ignore:client/.dockerignore
node_modules
dist
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
```

```ignore:server/.dockerignore
node_modules
dist
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
logs
```
## مرحله 4: ایجاد فایل .env برای سرور

برای تنظیمات محیطی سرور، فایل .env را ایجاد می‌کنیم:

```properties:server/.env
PORT=5050
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/pardakht_yar
JWT_SECRET=your-secret-key-should-be-changed-in-production
NODE_ENV=development
```
## مرحله 5: اطمینان از تنظیمات CORS در سرور

بیایید مطمئن شویم که تنظیمات CORS در فایل app.ts سرور برای کار با داکر مناسب است:

```typescript:server/src/app.ts
// تنظیمات CORS
app.use(cors({
  origin: ['http://localhost:3030', 'http://localhost:5050', 'http://localhost:5173', 'http://client:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
```
## مرحله 6: راهنمای استفاده

حالا بیایید یک فایل README.md ایجاد کنیم که نحوه استفاده از داکر را توضیح دهد:

```markdown:README.md
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
```
## جمع‌بندی و نکات مهم

تبریک می‌گویم! حالا پروژه شما برای اجرا روی هر سیستمی با داکر آماده است. فایل‌های ایجاد شده عبارتند از:

1. `client/Dockerfile` - پیکربندی داکر برای فرانت‌اند
2. `server/Dockerfile` - پیکربندی داکر برای بک‌اند
3. `docker-compose.yml` - پیکربندی کلی سرویس‌ها
4. `client/.dockerignore` و `server/.dockerignore` - فایل‌های نادیده گرفته شده
5. `.env` - تنظیمات محیطی
6. `README.md` - راهنمای کامل استفاده

### برای اجرای پروژه:

1. اطمینان حاصل کنید که داکر و داکر کامپوز روی سیستم نصب شده‌اند
2. در ریشه پروژه، دستور زیر را اجرا کنید:
   ```bash
   docker-compose up -d
   ```
3. اجرای مایگریشن‌ها و سیدها:
   ```bash
   docker-compose exec server npm run prisma:migrate
   docker-compose exec server npm run prisma:seed
   ```
4. برنامه در آدرس‌های زیر قابل دسترسی خواهد بود:
   - فرانت‌اند: http://localhost:5173
   - بک‌اند: http://localhost:5050/api

### نکات مهم برای انتقال بین سیستم‌ها:

1. **بهترین روش**: استفاده از گیت برای انتقال کد و سپس اجرای `docker-compose up -d` روی سیستم مقصد است.

2. **انتقال بدون اینترنت**: می‌توانید تصاویر داکر را با دستور `docker save` و `docker load` منتقل کنید.

3. **انتقال به سرور لینوکس**: از `scp` یا `sftp` برای انتقال فایل‌ها استفاده کنید و سپس دستورات داکر را روی سرور اجرا کنید.

4. **پایداری داده‌ها**:
   - داده‌های دیتابیس در حجم داکر (`postgres_data`) ذخیره می‌شوند
   - فایل‌های آپلود شده در پوشه `uploads` محلی ذخیره می‌شوند که بین سیستم میزبان و کانتینر به اشتراک گذاشته شده است

5. **توسعه همزمان**: تغییرات کد به صورت زنده در کانتینرها اعمال می‌شوند و نیازی به بازسازی کانتینرها نیست

با این پیکربندی، می‌توانید بدون نگرانی از اختلاف سیستم‌عامل‌ها یا معماری پردازنده، پروژه را روی هر سیستمی اجرا کنید.
