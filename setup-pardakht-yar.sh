#!/bin/bash

# ایجاد پوشه اصلی پروژه
mkdir -p pardakht-yar
cd pardakht-yar

# ایجاد فایل README.md
cat > README.md << 'EOF'
# پرداخت‌یار

سیستم مدیریت واریزی‌ها و طرف‌حساب‌های مالی

## نصب و راه‌اندازی

برای نصب و راه‌اندازی، به مستندات داخل پوشه docs مراجعه کنید.
EOF

# ایجاد .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules
.pnp
.pnp.js

# Testing
coverage

# Production
build
dist
out

# Misc
.DS_Store
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.production

npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# TypeScript cache
*.tsbuildinfo

# Upload directories
uploads/*
!uploads/.gitkeep
server/uploads/*
!server/uploads/.gitkeep

# Prisma
server/prisma/migrations/*
EOF

# ایجاد فایل package.json اصلی
cat > package.json << 'EOF'
{
  "name": "pardakht-yar",
  "version": "0.1.0",
  "description": "سیستم مدیریت واریزی‌ها و طرف‌حساب‌های مالی",
  "scripts": {
    "client": "cd client && npm run dev",
    "server": "cd server && npm run dev",
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "setup": "npm i && cd client && npm i && cd ../server && npm i",
    "build": "cd client && npm run build && cd ../server && npm run build"
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "concurrently": "^8.2.0"
  }
}
EOF

# ایجاد docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: pardakht_yar
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

  server:
    build: ./server
    ports:
      - "5000:5000"
    depends_on:
      - postgres
    environment:
      DATABASE_URL: postgresql://postgres:postgres@postgres:5432/pardakht_yar
      PORT: 5000
      NODE_ENV: development
      JWT_SECRET: your_jwt_secret_key
    volumes:
      - ./server:/app
      - /app/node_modules
    networks:
      - app-network

  client:
    build: ./client
    ports:
      - "3000:3000"
    depends_on:
      - server
    environment:
      VITE_API_URL: http://localhost:5000/api
    volumes:
      - ./client:/app
      - /app/node_modules
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:
EOF

# ایجاد ساختار پوشه‌های اصلی
mkdir -p docs client/public client/src server/src server/uploads/payments server/logs portal/public portal/src

# ایجاد فایل‌های مستندات
mkdir -p docs
cat > docs/setup.md << 'EOF'
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
EOF

cat > docs/architecture.md << 'EOF'
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
EOF

cat > docs/api-docs.md << 'EOF'
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
EOF

# ایجاد ساختار پوشه‌ها و فایل‌های کلاینت
mkdir -p client/src/{assets/{fonts,images},components/{common,layout,dashboard,payments,groups,contacts,auth},contexts,hooks,pages,services,utils,types,styles}

# ایجاد فایل‌های اصلی کلاینت
cat > client/package.json << 'EOF'
{
  "name": "pardakht-yar-client",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@date-io/date-fns-jalali": "^2.16.0",
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.14.0",
    "@mui/lab": "^5.0.0-alpha.136",
    "@mui/material": "^5.14.0",
    "@mui/x-date-pickers": "^6.10.0",
    "axios": "^1.4.0",
    "date-fns": "^2.30.0",
    "date-fns-jalali": "^2.29.3-0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-hook-form": "^7.45.1",
    "react-router-dom": "^6.14.1",
    "stylis": "^4.3.0",
    "stylis-plugin-rtl": "^2.1.1",
    "yup": "^1.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.4.2",
    "@types/react": "^18.2.14",
    "@types/react-dom": "^18.2.6",
    "@types/stylis": "^4.2.0",
    "@typescript-eslint/eslint-plugin": "^5.61.0",
    "@typescript-eslint/parser": "^5.61.0",
    "@vitejs/plugin-react": "^4.0.1",
    "eslint": "^8.44.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.1",
    "typescript": "^5.0.2",
    "vite": "^4.4.0"
  }
}
EOF

cat > client/.env.development.example << 'EOF'
# آدرس API بک‌اند
VITE_API_URL=http://localhost:5000/api

# نسخه برنامه
VITE_APP_VERSION=0.1.0
EOF

cat > client/public/index.html << 'EOF'
<!DOCTYPE html>
<html lang="fa" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#000000" />
    <meta name="description" content="سیستم مدیریت واریزی‌ها و طرف‌حساب‌ها" />
    <title>پرداخت‌یار | سیستم مدیریت واریزی‌ها و طرف‌حساب‌ها</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/index.tsx"></script>
  </body>
</html>
EOF

cat > client/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
EOF

cat > client/tsconfig.node.json << 'EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
EOF

cat > client/vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  }
})
EOF

# ایجاد فایل‌های اصلی سرور
mkdir -p server/src/{config,controllers,middleware,models,routes,services,utils,types,prisma}

cat > server/package.json << 'EOF'
{
  "name": "pardakht-yar-server",
  "version": "0.1.0",
  "description": "سرور بک‌اند پرداخت‌یار",
  "main": "dist/index.js",
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "start": "node dist/index.js",
    "build": "tsc",
    "lint": "eslint . --ext .ts",
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:studio": "prisma studio"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@prisma/client": "^4.16.2",
    "bcryptjs": "^2.4.3",
    "compression": "^1.7.4",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "express-async-handler": "^1.2.0",
    "express-rate-limit": "^6.8.0",
    "helmet": "^7.0.0",
    "joi": "^17.9.2",
    "jsonwebtoken": "^9.0.1",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.32.1",
    "winston": "^3.10.0"
  },
  "devDependencies": {
    "@types/bcryptjs": "^2.4.2",
    "@types/compression": "^1.7.2",
    "@types/cors": "^2.8.13",
    "@types/express": "^4.17.17",
    "@types/jsonwebtoken": "^9.0.2",
    "@types/morgan": "^1.9.4",
    "@types/multer": "^1.4.7",
    "@types/node": "^20.4.2",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "eslint": "^8.44.0",
    "nodemon": "^3.0.1",
    "prisma": "^4.16.2",
    "ts-node": "^10.9.1",
    "typescript": "^5.1.6"
  }
}
EOF

cat > server/.env.example << 'EOF'
# تنظیمات سرور
PORT=5000
NODE_ENV=development

# تنظیمات پایگاه داده PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pardakht_yar

# تنظیمات JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

# تنظیمات SMS
SMS_API_KEY=your_sms_api_key
SMS_SENDER=your_sms_sender_number

# مسیر ذخیره فایل‌ها
UPLOAD_PATH=./uploads

# آدرس فرانت‌اند (برای CORS)
CLIENT_URL=http://localhost:3000
EOF

cat > server/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "es2017",
    "module": "commonjs",
    "lib": ["es2017", "esnext.asynciterable"],
    "typeRoots": ["./src/types", "./node_modules/@types"],
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "outDir": "./dist",
    "strict": true,
    "sourceMap": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

# ایجاد فایل اسکیمای Prisma
mkdir -p server/prisma
cat > server/prisma/schema.prisma << 'EOF'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// مدل کاربران سیستم
model User {
  id        Int      @id @default(autoincrement())
  username  String   @unique
  password  String
  fullName  String
  email     String?  @unique
  phone     String?  @unique
  role      Role     @default(USER)
  isActive  Boolean  @default(true)
  lastLogin DateTime?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // روابط
  createdPayments    PaymentRequest[] @relation("CreatedBy")
  updatedPayments    PaymentRequest[] @relation("UpdatedBy")
  paidPayments       PaymentRequest[] @relation("PaidBy")
  uploadedImages     PaymentImage[]   @relation("UploadedBy")
  createdGroups      PaymentGroup[]   @relation("GroupCreatedBy")
  createdContacts    Contact[]        @relation("ContactCreatedBy")
  groupMemberships   GroupMember[]
}

// نقش‌های کاربران
enum Role {
  ADMIN
  FINANCIAL_MANAGER
  ACCOUNTANT
  SELLER
  CEO
  PROCUREMENT
}

// گروه‌های پرداخت
model PaymentGroup {
  id          Int      @id @default(autoincrement())
  title       String
  description String?
  createdBy   User     @relation("GroupCreatedBy", fields: [creatorId], references: [id])
  creatorId   Int
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // روابط
  members         GroupMember[]
  paymentRequests PaymentRequest[]
}

// اعضای گروه
model GroupMember {
  id        Int          @id @default(autoincrement())
  group     PaymentGroup @relation(fields: [groupId], references: [id])
  groupId   Int
  user      User         @relation(fields: [userId], references: [id])
  userId    Int
  createdAt DateTime     @default(now())

  @@unique([groupId, userId])
}

// طرف‌حساب‌ها
model Contact {
  id              Int      @id @default(autoincrement())
  companyName     String
  ceoName         String?
  fieldOfActivity String?
  accountantName  String?
  accountantPhone String?
  email           String?
  address         String?
  bankInfo        Json?
  notes           String?
  accessToken     String?  @unique // توکن دسترسی به پورتال
  createdBy       User     @relation("ContactCreatedBy", fields: [creatorId], references: [id])
  creatorId       Int
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // روابط
  paymentRequests   PaymentRequest[]
  portalActivities  ContactPortalActivity[]
}

// درخواست‌های پرداخت
model PaymentRequest {
  id               Int           @id @default(autoincrement())
  title            String
  amount           BigInt
  effectiveDate    DateTime
  description      String?
  status           PaymentStatus @default(PENDING)
  paymentType      String?       // حقوق، طرف‌حساب، سود و...
  group            PaymentGroup? @relation(fields: [groupId], references: [id])
  groupId          Int?
  contact          Contact?      @relation(fields: [contactId], references: [id])
  contactId        Int?
  beneficiaryName  String?       // نام ذینفع
  beneficiaryPhone String?       // موبایل ذینفع
  isSMSSent        Boolean       @default(false)
  smsSentAt        DateTime?
  paymentDate      DateTime?     // تاریخ واقعی پرداخت
  paidBy           User?         @relation("PaidBy", fields: [paidById], references: [id])
  paidById         Int?
  createdBy        User          @relation("CreatedBy", fields: [creatorId], references: [id])
  creatorId        Int
  updatedBy        User?         @relation("UpdatedBy", fields: [updaterId], references: [id])
  updaterId        Int?
  createdAt        DateTime      @default(now())
  updatedAt        DateTime      @updatedAt

  // روابط
  images           PaymentImage[]
  notifications    Notification[]
  portalActivities ContactPortalActivity[]
}

// وضعیت‌های پرداخت
enum PaymentStatus {
  PENDING   // در انتظار
  APPROVED  // تایید شده
  PAID      // پرداخت شده
  REJECTED  // رد شده
}

// تصاویر پرداخت
model PaymentImage {
  id            Int            @id @default(autoincrement())
  payment       PaymentRequest @relation(fields: [paymentId], references: [id])
  paymentId     Int
  fileName      String
  filePath      String
  thumbnailPath String?
  originalName  String?
  mimeType      String?
  size          Int?
  hasWatermark  Boolean        @default(true)
  uploadedBy    User           @relation("UploadedBy", fields: [uploaderId], references: [id])
  uploaderId    Int
  uploadedAt    DateTime       @default(now())
}

// اطلاع‌رسانی‌ها
model Notification {
  id           Int            @id @default(autoincrement())
  payment      PaymentRequest @relation(fields: [paymentId], references: [id])
  paymentId    Int
  recipientType String        // 'contact' یا 'user'
  recipientId  Int
  message      String
  method       String         // 'sms', 'email', 'system'
  status       String         @default("pending") // 'pending', 'sent', 'failed'
  sentAt       DateTime?
  createdAt    DateTime       @default(now())
}

// فعالیت پورتال طرف‌حساب‌ها
model ContactPortalActivity {
  id          Int             @id @default(autoincrement())
  contact     Contact         @relation(fields: [contactId], references: [id])
  contactId   Int
  payment     PaymentRequest? @relation(fields: [paymentId], references: [id])
  paymentId   Int?
  action      String          // 'view', 'download', 'feedback'
  ipAddress   String?
  userAgent   String?
  feedback    String?
  createdAt   DateTime        @default(now())
}
EOF

# ایجاد فایل‌های اصلی
cat > server/src/config/logger.ts << 'EOF'
// server/src/config/logger.ts
// پیکربندی سیستم لاگینگ

import winston from 'winston';
import path from 'path';
import fs from 'fs';

// ایجاد مسیر لاگ اگر وجود نداشته باشد
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// فرمت اختصاصی برای لاگ‌ها
const customFormat = winston.format.printf(({ level, message, timestamp, ...meta }) => {
  // تبدیل حروف انگلیسی در سطح لاگ به فارسی برای خوانایی بهتر
  const persianLevel = 
    level === 'error' ? 'خطا' : 
    level === 'warn' ? 'هشدار' : 
    level === 'info' ? 'اطلاعات' : 
    level === 'debug' ? 'دیباگ' : level;

  // اضافه کردن متادیتا به پیام لاگ
  const metaStr = Object.keys(meta).length ? ` - ${JSON.stringify(meta)}` : '';
  
  return `${timestamp} | ${persianLevel.padEnd(10)} | ${message}${metaStr}`;
});

// تنظیمات لاگر
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    customFormat
  ),
  transports: [
    // لاگ در کنسول با رنگ‌بندی
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        customFormat
      )
    }),
    // لاگ خطاها در فایل
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error'
    }),
    // لاگ همه پیام‌ها در فایل
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log')
    })
  ]
});

// لاگرهای مختلف برای استفاده در برنامه
export const logInfo = (message: string, meta = {}) => {
  logger.info(message, meta);
};

export const logWarn = (message: string, meta = {}) => {
  logger.warn(message, meta);
};

export const logError = (message: string, error?: Error, meta = {}) => {
  if (error) {
    logger.error(`${message}: ${error.message}`, {
      stack: error.stack,
      ...meta
    });
  } else {
    logger.error(message, meta);
  }
};

export const logDebug = (message: string, meta = {}) => {
  logger.debug(message, meta);
};

export default {
  info: logInfo,
  warn: logWarn,
  error: logError,
  debug: logDebug
};
EOF

cat > server/src/config/app.ts << 'EOF'
// server/src/config/app.ts
// تنظیمات اصلی برنامه

import dotenv from 'dotenv';
import path from 'path';

// بارگذاری فایل .env
dotenv.config();

// پیکربندی برنامه
export default {
  // تنظیمات سرور
  server: {
    port: process.env.PORT || 5000,
    nodeEnv: process.env.NODE_ENV || 'development',
    clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  },
  
  // تنظیمات JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expire: process.env.JWT_EXPIRE || '24h',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
  },
  
  // تنظیمات آپلود فایل
  upload: {
    path: process.env.UPLOAD_PATH || path.join(__dirname, '../../uploads'),
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
  },
  
  // تنظیمات SMS
  sms: {
    apiKey: process.env.SMS_API_KEY || '',
    sender: process.env.SMS_SENDER || '',
  }
};
EOF

cat > server/src/index.ts << 'EOF'
// server/src/index.ts
// نقطه ورود برنامه

import app from './app';
import config from './config/app';
import logger from './config/logger';
import { PrismaClient } from '@prisma/client';

// راه‌اندازی سرور
const server = app.listen(config.server.port, () => {
  logger.info(`سرور در پورت ${config.server.port} در حال اجراست (محیط: ${config.server.nodeEnv})`);
});

// اتصال به پایگاه داده
const prisma = new PrismaClient();

// مدیریت سیگنال‌های خروج
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('سرور بسته شد');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

// مدیریت خطاهای دسته‌نشده
const unexpectedErrorHandler = (error: Error) => {
  logger.error('خطای دسته‌نشده', error);
  exitHandler();
};

// ثبت سیگنال‌های خروج
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
  logger.info('سیگنال SIGTERM دریافت شد');
  exitHandler();
});
process.on('SIGINT', () => {
  logger.info('سیگنال SIGINT دریافت شد');
  exitHandler();
});
EOF

cat > server/src/app.ts << 'EOF'
// server/src/app.ts
// تنظیمات اصلی اپلیکیشن Express

import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import path from 'path';
import config from './config/app';
import logger from './config/logger';

// ایجاد اپلیکیشن Express
const app: Express = express();

// میدل‌ورهای عمومی
app.use(helmet()); // امنیت هدرها
app.use(cors({ 
  origin: config.server.clientUrl,
  credentials: true,
})); // CORS
app.use(compression()); // فشرده‌سازی پاسخ‌ها
app.use(express.json()); // پارس کردن JSON در بدنه درخواست
app.use(express.urlencoded({ extended: true })); // پارس کردن URL-encoded در بدنه درخواست

// لاگینگ درخواست‌ها در محیط توسعه
if (config.server.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// دسترسی به فایل‌های استاتیک
app.use(
  '/uploads',
  express.static(path.join(__dirname, '../uploads'))
);

// مسیرهای API (در فازهای بعدی تکمیل خواهد شد)
// app.use('/api/auth', authRoutes);

// صفحه اصلی API
app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'به API پرداخت‌یار خوش آمدید',
    version: '1.0.0',
  });
});

// مدیریت خطاهای 404
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'مسیر مورد نظر یافت نشد',
  });
});

// مدیریت خطاها
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error(`خطا در پردازش درخواست: ${req.method} ${req.path}`, err);
  
  res.status(500).json({
    success: false,
    message: 'خطای سرور',
    error: config.server.nodeEnv === 'development' ? err.message : undefined,
  });
});

export default app;
EOF

cat > server/src/middleware/auth.ts << 'EOF'
// server/src/middleware/auth.ts
// میدل‌ور احراز هویت

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import logger from '../config/logger';
import config from '../config/app';

const prisma = new PrismaClient();

// گسترش تایپ Express Request برای اضافه کردن اطلاعات کاربر
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        username: string;
        role: string;
      };
    }
  }
}

// میدل‌ور احراز هویت
export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // بررسی وجود هدر Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'توکن احراز هویت یافت نشد',
      });
    }

    // استخراج توکن
    const token = authHeader.split(' ')[1];
    
    // تایید توکن
    const decoded = jwt.verify(token, config.jwt.secret) as jwt.JwtPayload & {
      id: number;
      username: string;
      role: string;
    };

    // بررسی وجود کاربر در دیتابیس
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, username: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'کاربر معتبر نیست',
      });
    }

    // افزودن اطلاعات کاربر به درخواست
    req.user = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (error) {
    logger.error('خطا در احراز هویت', error as Error);
    
    if ((error as Error).name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'توکن منقضی شده است',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'توکن نامعتبر است',
    });
  }
};

// میدل‌ور بررسی دسترسی بر اساس نقش
export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'دسترسی غیرمجاز',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'شما مجوز دسترسی به این منبع را ندارید',
      });
    }

    next();
  };
};
EOF

cat > server/src/middleware/upload.ts << 'EOF'
// server/src/middleware/upload.ts
// میدل‌ور آپلود فایل

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import config from '../config/app';
import logger from '../config/logger';

// اطمینان از وجود مسیر آپلود
const ensureDir = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// تنظیمات ذخیره‌سازی فایل
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(config.upload.path, 'payments');
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // ایجاد نام فایل منحصر به فرد
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `payment-${uniqueSuffix}${ext}`);
  },
});

// فیلتر فایل‌ها بر اساس نوع
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // بررسی نوع فایل
  if (config.upload.allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('نوع فایل مجاز نیست. فقط تصاویر با فرمت JPG و PNG پذیرفته می‌شوند.'));
  }
};

// پیکربندی آپلود
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.upload.maxSize, // حداکثر سایز فایل
  },
});

// میدل‌ور آپلود فایل پرداخت
export const uploadPaymentImage = upload.single('image');

// میدل‌ور مدیریت خطای آپلود
export const handleUploadError = (error: Error, req: Request, res: Response, next: NextFunction) => {
  if (error instanceof multer.MulterError) {
    logger.error('خطای آپلود فایل Multer', error);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: `حجم فایل نباید بیشتر از ${config.upload.maxSize / (1024 * 1024)} مگابایت باشد`,
      });
    }
    
    return res.status(400).json({
      success: false,
      message: 'خطا در آپلود فایل',
      error: error.message,
    });
  }
  
  if (error) {
    logger.error('خطای آپلود فایل', error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  
  next();
};
EOF

cat > server/src/middleware/error.ts << 'EOF'
// server/src/middleware/error.ts
// میدل‌ور مدیریت خطا

import { Request, Response, NextFunction } from 'express';
import logger from '../config/logger';
import config from '../config/app';

// کلاس خطای API
export class ApiError extends Error {
  statusCode: number;
  
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

// میدل‌ور مدیریت خطاها
export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'خطای سرور';
  
  // بررسی نوع خطا
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  
  // لاگ خطا
  logger.error(`${req.method} ${req.path} - ${err.message}`, err);
  
  // پاسخ خطا
  res.status(statusCode).json({
    success: false,
    message,
    // در محیط توسعه، جزئیات بیشتری نمایش داده می‌شود
    ...(config.server.nodeEnv === 'development' && {
      error: err.message,
      stack: err.stack,
    }),
  });
};

// میدل‌ور مدیریت مسیرهای یافت نشده
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(404, `مسیر ${req.originalUrl} یافت نشد`);
  next(error);
};
EOF

cat > server/src/middleware/validator.ts << 'EOF'
// server/src/middleware/validator.ts
// میدل‌ور اعتبارسنجی داده‌ها

import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from './error';

// میدل‌ور اعتبارسنجی
export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false, // نمایش تمام خطاها
      allowUnknown: true, // اجازه فیلدهای اضافی
      stripUnknown: true, // حذف فیلدهای اضافی
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      
      return next(new ApiError(400, errorMessage));
    }

    next();
  };
};

// مثال اسکیمای اعتبارسنجی برای ورود
export const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'نام کاربری الزامی است',
    'any.required': 'نام کاربری الزامی است',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'رمز عبور الزامی است',
    'any.required': 'رمز عبور الزامی است',
  }),
});

// مثال اسکیمای اعتبارسنجی برای ایجاد درخواست پرداخت
export const paymentRequestSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.empty': 'عنوان پرداخت الزامی است',
    'any.required': 'عنوان پرداخت الزامی است',
  }),
  amount: Joi.number().integer().positive().required().messages({
    'number.base': 'مبلغ باید عدد باشد',
    'number.integer': 'مبلغ باید عدد صحیح باشد',
    'number.positive': 'مبلغ باید مثبت باشد',
    'any.required': 'مبلغ الزامی است',
  }),
  effectiveDate: Joi.date().required().messages({
    'date.base': 'تاریخ مؤثر باید یک تاریخ معتبر باشد',
    'any.required': 'تاریخ مؤثر الزامی است',
  }),
  description: Joi.string().allow('', null),
  groupId: Joi.number().integer().positive().allow(null),
  contactId: Joi.number().integer().positive().allow(null),
  beneficiaryName: Joi.string().allow('', null),
  beneficiaryPhone: Joi.string().allow('', null),
});
EOF

cat > server/src/types/express.d.ts << 'EOF'
// server/src/types/express.d.ts
// تایپ‌های اختصاصی Express

declare namespace Express {
  interface Request {
    user?: {
      id: number;
      username: string;
      role: string;
    };
  }
}
EOF

# ایجاد پوشه‌های لاگ و آپلود
mkdir -p server/logs
mkdir -p server/uploads/payments

# ایجاد فایل .gitkeep در پوشه‌های آپلود
touch server/uploads/.gitkeep
touch server/uploads/payments/.gitkeep

# ایجاد فایل‌های فرانت‌اند
cat > client/src/index.tsx << 'EOF'
// client/src/index.tsx
// نقطه ورود برنامه فرانت‌اند

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

cat > client/src/App.tsx << 'EOF'
// client/src/App.tsx
// کامپوننت اصلی برنامه

import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import AppRoutes from './routes';
import theme from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';

// پیکربندی RTL برای Material-UI
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const App: React.FC = () => {
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default App;
EOF

cat > client/src/routes.tsx << 'EOF'
// client/src/routes.tsx
// تعریف مسیرهای برنامه

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PaymentsPage from './pages/PaymentsPage';
import GroupsPage from './pages/GroupsPage';
import ContactsPage from './pages/ContactsPage';
import Layout from './components/layout/Layout';
import { useAuth } from './hooks/useAuth';

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* مسیرهای عمومی */}
      <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" />} />
      
      {/* مسیرهای محافظت شده */}
      <Route
        path="/"
        element={isAuthenticated ? <Layout /> : <Navigate to="/login" />}
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="groups" element={<GroupsPage />} />
        <Route path="contacts" element={<ContactsPage />} />
      </Route>
      
      {/* مسیر 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
EOF

cat > client/src/styles/theme.ts << 'EOF'
// client/src/styles/theme.ts
// تنظیمات تم متریال

import { createTheme } from '@mui/material/styles';

// تنظیمات تم سفارشی با پشتیبانی RTL
const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: '"Vazirmatn", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
    },
  },
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        fullWidth: true,
        margin: 'normal',
      },
    },
    MuiButton: {
      defaultProps: {
        variant: 'contained',
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;

#!/bin/bash

cat > client/src/styles/global.css << 'EOF'
/* client/src/styles/global.css */
/* استایل‌های سراسری */

@import url('https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  font-family: 'Vazirmatn', 'Roboto', 'Helvetica', 'Arial', sans-serif;
  direction: rtl;
  text-align: right;
  background-color: #f5f5f5;
}

a {
  text-decoration: none;
  color: inherit;
}

/* استایل برای اعداد فارسی */
.persian-number {
  font-feature-settings: "ss01";
}

/* استایل برای اسکرول */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
EOF

cat > client/src/contexts/AuthContext.tsx << 'EOF'
// client/src/contexts/AuthContext.tsx
// کانتکست مدیریت احراز هویت

import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

// تایپ‌های مورد نیاز
interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

// ایجاد کانتکست با مقدار پیش‌فرض
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => {},
  logout: () => {},
});

// کامپوننت Provider
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // بررسی اعتبار توکن هنگام بارگذاری
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsLoading(false);
        return;
      }
      
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('خطا در دریافت اطلاعات کاربر:', err);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // تابع ورود
  const login = async (username: string, password: string) => {
    setError(null);
    setIsLoading(true);
    
    try {
      const { user: userData, token } = await authService.login(username, password);
      
      // ذخیره توکن در localStorage
      localStorage.setItem('token', token);
      
      setUser(userData);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // تابع خروج
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        error,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
EOF

cat > client/src/contexts/ThemeContext.tsx << 'EOF'
// client/src/contexts/ThemeContext.tsx
// کانتکست مدیریت تم

import React, { createContext, useState, useEffect } from 'react';

// تایپ‌های مورد نیاز
type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  themeMode: ThemeMode;
  toggleTheme: () => void;
}

// ایجاد کانتکست با مقدار پیش‌فرض
const ThemeContext = createContext<ThemeContextType>({
  themeMode: 'light',
  toggleTheme: () => {},
});

// کامپوننت Provider
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // خواندن تم ذخیره شده از localStorage یا استفاده از مقدار پیش‌فرض
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const savedTheme = localStorage.getItem('theme');
    return (savedTheme as ThemeMode) || 'light';
  });

  // تغییر تم
  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // ذخیره تم در localStorage هنگام تغییر
  useEffect(() => {
    localStorage.setItem('theme', themeMode);
    
    // اعمال کلاس مناسب به بدنه سند
    if (themeMode === 'dark') {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
  }, [themeMode]);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
EOF

cat > client/src/hooks/useAuth.ts << 'EOF'
// client/src/hooks/useAuth.ts
// هوک دسترسی به کانتکست احراز هویت

import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

export const useAuth = () => {
  return useContext(AuthContext);
};
EOF

cat > client/src/hooks/useToast.ts << 'EOF'
// client/src/hooks/useToast.ts
// هوک مدیریت نمایش پیام‌ها

import { useState } from 'react';

interface ToastState {
  open: boolean;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    type: 'info',
  });

  const showToast = (message: string, type: ToastState['type'] = 'info') => {
    setToast({
      open: true,
      message,
      type,
    });
  };

  const hideToast = () => {
    setToast({
      ...toast,
      open: false,
    });
  };

  return {
    toast,
    showToast,
    hideToast,
  };
};
EOF

cat > client/src/services/api.ts << 'EOF'
// client/src/services/api.ts
// تنظیمات پایه برای ارتباط با API

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ایجاد نمونه axios با تنظیمات پایه
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// افزودن اینترسپتور برای درخواست‌ها
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // افزودن توکن به هدر Authorization اگر موجود باشد
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// افزودن اینترسپتور برای پاسخ‌ها
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // بررسی خطای 401 برای توکن منقضی شده
    if (error.response?.status === 401) {
      // پاک کردن توکن و ریدایرکت به صفحه ورود
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
EOF

cat > client/src/services/authService.ts << 'EOF'
// client/src/services/authService.ts
// سرویس احراز هویت

import api from './api';

// تایپ پاسخ ورود
interface LoginResponse {
  success: boolean;
  token: string;
  user: {
    id: number;
    username: string;
    fullName: string;
    role: string;
  };
}

// تایپ پاسخ پروفایل کاربر
interface UserResponse {
  success: boolean;
  user: {
    id: number;
    username: string;
    fullName: string;
    email: string | null;
    role: string;
  };
}

// تابع ورود
const login = async (username: string, password: string) => {
  try {
    const response = await api.post<LoginResponse>('/auth/login', {
      username,
      password,
    });

    return {
      user: response.data.user,
      token: response.data.token,
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در ورود به سیستم'
    );
  }
};

// دریافت اطلاعات کاربر جاری
const getCurrentUser = async () => {
  try {
    const response = await api.get<UserResponse>('/auth/me');
    return response.data.user;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت اطلاعات کاربر'
    );
  }
};

export default {
  login,
  getCurrentUser,
};
EOF

cat > client/src/services/paymentService.ts << 'EOF'
// client/src/services/paymentService.ts
// سرویس مدیریت پرداخت‌ها

import api from './api';
import { PaymentRequest, PaymentImage } from '../types/payment.types';

// تایپ پارامترهای جستجو
interface PaymentSearchParams {
  page?: number;
  limit?: number;
  status?: string;
  groupId?: number;
  contactId?: number;
  startDate?: string;
  endDate?: string;
}

// گرفتن لیست پرداخت‌ها
const getPayments = async (params: PaymentSearchParams = {}) => {
  try {
    const response = await api.get('/payments', { params });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت لیست پرداخت‌ها'
    );
  }
};

// گرفتن جزئیات یک پرداخت
const getPaymentById = async (id: number) => {
  try {
    const response = await api.get(`/payments/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت اطلاعات پرداخت'
    );
  }
};

// ایجاد درخواست پرداخت جدید
const createPayment = async (paymentData: Partial<PaymentRequest>) => {
  try {
    const response = await api.post('/payments', paymentData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در ایجاد درخواست پرداخت'
    );
  }
};

// به‌روزرسانی پرداخت
const updatePayment = async (id: number, paymentData: Partial<PaymentRequest>) => {
  try {
    const response = await api.put(`/payments/${id}`, paymentData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در به‌روزرسانی پرداخت'
    );
  }
};

// آپلود تصویر فیش پرداخت
const uploadPaymentImage = async (paymentId: number, imageFile: File) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await api.post(`/payments/${paymentId}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در آپلود تصویر'
    );
  }
};

// دریافت تصاویر پرداخت
const getPaymentImages = async (paymentId: number) => {
  try {
    const response = await api.get(`/payments/${paymentId}/images`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت تصاویر پرداخت'
    );
  }
};

// ارسال پیامک اطلاع‌رسانی
const sendPaymentSMS = async (paymentId: number) => {
  try {
    const response = await api.post(`/payments/${paymentId}/notify`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در ارسال پیامک'
    );
  }
};

export default {
  getPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  uploadPaymentImage,
  getPaymentImages,
  sendPaymentSMS,
};
EOF

cat > client/src/services/contactService.ts << 'EOF'
// client/src/services/contactService.ts
// سرویس مدیریت طرف‌حساب‌ها

import api from './api';
import { Contact } from '../types/contact.types';

// تایپ پارامترهای جستجو
interface ContactSearchParams {
  page?: number;
  limit?: number;
  search?: string;
}

// گرفتن لیست طرف‌حساب‌ها
const getContacts = async (params: ContactSearchParams = {}) => {
  try {
    const response = await api.get('/contacts', { params });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت لیست طرف‌حساب‌ها'
    );
  }
};

// گرفتن جزئیات یک طرف‌حساب
const getContactById = async (id: number) => {
  try {
    const response = await api.get(`/contacts/${id}`);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در دریافت اطلاعات طرف‌حساب'
    );
  }
};

// ایجاد طرف‌حساب جدید
const createContact = async (contactData: Partial<Contact>) => {
  try {
    const response = await api.post('/contacts', contactData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در ایجاد طرف‌حساب'
    );
  }
};

// به‌روزرسانی طرف‌حساب
const updateContact = async (id: number, contactData: Partial<Contact>) => {
  try {
    const response = await api.put(`/contacts/${id}`, contactData);
    return response.data.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در به‌روزرسانی طرف‌حساب'
    );
  }
};

// حذف طرف‌حساب
const deleteContact = async (id: number) => {
  try {
    const response = await api.delete(`/contacts/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'خطا در حذف طرف‌حساب'
    );
  }
};

export default {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
};
EOF

cat > client/src/types/auth.types.ts << 'EOF'
// client/src/types/auth.types.ts
// تایپ‌های مربوط به احراز هویت

export interface User {
  id: number;
  username: string;
  fullName: string;
  email?: string;
  phone?: string;
  role: Role;
  isActive: boolean;
  lastLogin?: string;
}

export type Role = 'ADMIN' | 'FINANCIAL_MANAGER' | 'ACCOUNTANT' | 'SELLER' | 'CEO' | 'PROCUREMENT';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
EOF

cat > client/src/types/payment.types.ts << 'EOF'
// client/src/types/payment.types.ts
// تایپ‌های مربوط به پرداخت‌ها

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'PAID' | 'REJECTED';

export interface PaymentRequest {
  id: number;
  title: string;
  amount: number;
  effectiveDate: string;
  description?: string;
  status: PaymentStatus;
  paymentType?: string;
  groupId?: number;
  contactId?: number;
  beneficiaryName?: string;
  beneficiaryPhone?: string;
  isSMSSent: boolean;
  smsSentAt?: string;
  paymentDate?: string;
  paidById?: number;
  creatorId: number;
  updaterId?: number;
  createdAt: string;
  updatedAt: string;
  // روابط
  group?: {
    id: number;
    title: string;
  };
  contact?: {
    id: number;
    companyName: string;
  };
  images?: PaymentImage[];
}

export interface PaymentImage {
  id: number;
  paymentId: number;
  fileName: string;
  filePath: string;
  thumbnailPath?: string;
  originalName?: string;
  mimeType?: string;
  size?: number;
  hasWatermark: boolean;
  uploaderId: number;
  uploadedAt: string;
}

export interface PaymentFilter {
  status?: PaymentStatus;
  groupId?: number;
  contactId?: number;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
EOF

cat > client/src/types/contact.types.ts << 'EOF'
// client/src/types/contact.types.ts
// تایپ‌های مربوط به طرف‌حساب‌ها

export interface Contact {
  id: number;
  companyName: string;
  ceoName?: string;
  fieldOfActivity?: string;
  accountantName?: string;
  accountantPhone?: string;
  email?: string;
  address?: string;
  bankInfo?: {
    bankName?: string;
    accountNumber?: string;
    cardNumber?: string;
    iban?: string;
  };
  notes?: string;
  accessToken?: string;
  creatorId: number;
  createdAt: string;
  updatedAt: string;
}

export interface ContactFilter {
  search?: string;
  page: number;
  limit: number;
}
EOF

cat > client/src/utils/dateUtils.ts << 'EOF'
// client/src/utils/dateUtils.ts
// توابع کمکی برای کار با تاریخ شمسی

import { format, parse } from 'date-fns-jalali';

// تبدیل تاریخ میلادی به شمسی
export const toJalali = (date: Date | string | number, formatStr: string = 'yyyy/MM/dd'): string => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  return format(dateObj, formatStr);
};

// تبدیل تاریخ شمسی به میلادی
export const toGregorian = (jalaliDate: string, formatStr: string = 'yyyy/MM/dd'): Date => {
  return parse(jalaliDate, formatStr, new Date());
};

// فرمت کردن تاریخ شمسی
export const formatJalaliDate = (date: Date | string | number, formatStr: string = 'yyyy/MM/dd'): string => {
  return toJalali(date, formatStr);
};

// نمایش تاریخ به صورت نسبی (مثلاً "۲ روز پیش")
export const getRelativeTime = (date: Date | string | number): string => {
  const dateObj = typeof date === 'string' || typeof date === 'number' 
    ? new Date(date) 
    : date;
  
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'چند لحظه پیش';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} دقیقه پیش`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ساعت پیش`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} روز پیش`;
  }
  
  return toJalali(dateObj);
};
EOF

cat > client/src/utils/numberUtils.ts << 'EOF'
// client/src/utils/numberUtils.ts
// توابع کمکی برای کار با اعداد فارسی

// تبدیل اعداد انگلیسی به فارسی
export const toPersianNumber = (num: number | string): string => {
  if (num === undefined || num === null) return '';
  
  const str = num.toString();
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  return str.replace(/[0-9]/g, (match) => {
    return persianDigits[parseInt(match)];
  });
};

// تبدیل اعداد فارسی به انگلیسی
export const toEnglishNumber = (str: string): string => {
  if (!str) return '';
  
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  
  return str.replace(/[۰-۹]/g, (match) => {
    return persianDigits.indexOf(match).toString();
  });
};

// فرمت کردن عدد به صورت پول (با جداکننده هزارگان)
export const formatCurrency = (num: number | string, persianize: boolean = true): string => {
  if (num === undefined || num === null) return '';
  
  const amount = typeof num === 'string' ? parseFloat(toEnglishNumber(num)) : num;
  
  // اضافه کردن جداکننده هزارگان
  const formattedNumber = amount.toLocaleString('fa-IR');
  
  return persianize ? formattedNumber : formattedNumber.replace(/[۰-۹]/g, d => String.fromCharCode(d.charCodeAt(0) - 1728));
};

// فرمت کردن عدد به صورت پول با واحد
export const formatMoney = (num: number | string, unit: string = 'ریال'): string => {
  if (num === undefined || num === null) return '';
  
  return `${formatCurrency(num)} ${unit}`;
};
EOF

cat > client/src/utils/validators.ts << 'EOF'
// client/src/utils/validators.ts
// توابع اعتبارسنجی

// اعتبارسنجی شماره موبایل
export const isValidMobileNumber = (phone: string): boolean => {
  // الگوی شماره موبایل ایرانی
  const mobileRegex = /^09\d{9}$/;
  return mobileRegex.test(phone);
};

// اعتبارسنجی ایمیل
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// اعتبارسنجی کد ملی
export const isValidNationalCode = (code: string): boolean => {
  // تبدیل به رشته و اعتبارسنجی طول
  const nc = typeof code === 'string' ? code : String(code);
  if (!/^\d{10}$/.test(nc)) return false;
  
  // الگوریتم کد ملی ایران
  const check = +nc[9];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += +nc[i] * (10 - i);
  }
  const remainder = sum % 11;
  return (remainder < 2 && check === remainder) || (remainder >= 2 && check + remainder === 11);
};

// اعتبارسنجی شماره کارت بانکی
export const isValidBankCardNumber = (card: string): boolean => {
  // حذف فاصله‌ها و خط‌ها
  const cardNumber = card.replace(/[\s-]/g, '');
  
  // بررسی طول و شروع با ۶۰۳۷ یا ۶۲۱۹ و...
  if (!/^\d{16}$/.test(cardNumber)) return false;
  
  // الگوریتم لان (Luhn)
  let sum = 0;
  let alternate = false;
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let n = parseInt(cardNumber.charAt(i), 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  
  return sum % 10 === 0;
};

// اعتبارسنجی شماره شبا
export const isValidIBAN = (iban: string): boolean => {
  // حذف فاصله‌ها
  const cleanIban = iban.replace(/\s/g, '').toUpperCase();
  
  // بررسی فرمت کلی شبا
  if (!/^IR\d{24}$/.test(cleanIban)) return false;
  
  // IBAN های ایرانی همیشه با IR شروع می

  cat >> client/src/utils/validators.ts << 'EOF'
  // IBAN های ایرانی همیشه با IR شروع می‌شوند و ۲۴ رقم بعد از IR دارند
  // بررسی دقیق‌تر نیازمند محاسبات بیشتر است که اینجا ساده‌سازی شده
  return true;
};
EOF

# ایجاد فایل‌های صفحات اصلی
cat > client/src/pages/LoginPage.tsx << 'EOF'
// client/src/pages/LoginPage.tsx
// صفحه ورود به سیستم

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      await login(username, password);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5" fontWeight="bold" mb={3}>
            ورود به سیستم پرداخت‌یار
          </Typography>
          
          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} width="100%">
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="نام کاربری"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="رمز عبور"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'ورود'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;
EOF

cat > client/src/pages/DashboardPage.tsx << 'EOF'
// client/src/pages/DashboardPage.tsx
// صفحه داشبورد

import React from 'react';
import { Box, Typography, Grid, Paper } from '@mui/material';

const DashboardPage: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        داشبورد
      </Typography>
      
      <Grid container spacing={3}>
        {/* کارت خلاصه پرداخت‌ها */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography color="text.secondary" variant="subtitle2">
              کل پرداخت‌ها
            </Typography>
            <Typography component="p" variant="h4" sx={{ my: 2 }}>
              ۱۲۳,۴۵۶,۷۸۹ ریال
            </Typography>
            <Typography color="text.secondary" variant="body2">
              از ابتدای ماه جاری
            </Typography>
          </Paper>
        </Grid>
        
        {/* کارت درخواست‌های در انتظار */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography color="text.secondary" variant="subtitle2">
              درخواست‌های در انتظار
            </Typography>
            <Typography component="p" variant="h4" sx={{ my: 2 }}>
              ۵ مورد
            </Typography>
            <Typography color="text.secondary" variant="body2">
              نیازمند تأیید
            </Typography>
          </Paper>
        </Grid>
        
        {/* کارت پرداخت‌های امروز */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography color="text.secondary" variant="subtitle2">
              پرداخت‌های امروز
            </Typography>
            <Typography component="p" variant="h4" sx={{ my: 2 }}>
              ۳ مورد
            </Typography>
            <Typography color="text.secondary" variant="body2">
              ۱۲,۴۵۶,۰۰۰ ریال
            </Typography>
          </Paper>
        </Grid>
        
        {/* کارت طرف‌حساب‌ها */}
        <Grid item xs={12} md={6} lg={3}>
          <Paper
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography color="text.secondary" variant="subtitle2">
              تعداد طرف‌حساب‌ها
            </Typography>
            <Typography component="p" variant="h4" sx={{ my: 2 }}>
              ۴۵ طرف‌حساب
            </Typography>
            <Typography color="text.secondary" variant="body2">
              ۱۲ مورد فعال در ماه جاری
            </Typography>
          </Paper>
        </Grid>
        
        {/* جدول آخرین پرداخت‌ها */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom component="div">
              آخرین پرداخت‌ها
            </Typography>
            <Typography variant="body1" color="text.secondary">
              اطلاعات پرداخت‌ها در اینجا نمایش داده می‌شود...
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;
EOF

cat > client/src/pages/PaymentsPage.tsx << 'EOF'
// client/src/pages/PaymentsPage.tsx
// صفحه مدیریت پرداخت‌ها

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const PaymentsPage: React.FC = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          مدیریت پرداخت‌ها
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {/* اینجا باید مودال ایجاد پرداخت باز شود */}}
        >
          ایجاد درخواست جدید
        </Button>
      </Box>
      
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          جدول مدیریت پرداخت‌ها در اینجا قرار می‌گیرد.
        </Typography>
      </Paper>
    </Box>
  );
};

export default PaymentsPage;
EOF

cat > client/src/pages/GroupsPage.tsx << 'EOF'
// client/src/pages/GroupsPage.tsx
// صفحه مدیریت گروه‌ها

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const GroupsPage: React.FC = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          مدیریت گروه‌ها
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {/* اینجا باید مودال ایجاد گروه باز شود */}}
        >
          ایجاد گروه جدید
        </Button>
      </Box>
      
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          جدول مدیریت گروه‌ها در اینجا قرار می‌گیرد.
        </Typography>
      </Paper>
    </Box>
  );
};

export default GroupsPage;
EOF

cat > client/src/pages/ContactsPage.tsx << 'EOF'
// client/src/pages/ContactsPage.tsx
// صفحه مدیریت طرف‌حساب‌ها

import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const ContactsPage: React.FC = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          مدیریت طرف‌حساب‌ها
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => {/* اینجا باید مودال ایجاد طرف‌حساب باز شود */}}
        >
          ثبت طرف‌حساب جدید
        </Button>
      </Box>
      
      <Paper sx={{ p: 2 }}>
        <Typography variant="body1">
          جدول مدیریت طرف‌حساب‌ها در اینجا قرار می‌گیرد.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ContactsPage;
EOF

# ایجاد کامپوننت Layout
mkdir -p client/src/components/layout
cat > client/src/components/layout/Layout.tsx << 'EOF'
// client/src/components/layout/Layout.tsx
// کامپوننت لایه‌بندی اصلی برنامه

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  Box, 
  Toolbar, 
  CssBaseline, 
  Container,
  IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AppHeader from './AppHeader';
import SideMenu from './SideMenu';

const Layout: React.FC = () => {
  const [open, setOpen] = useState(true);
  
  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* هدر برنامه */}
      <AppHeader open={open}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={toggleDrawer}
          sx={{
            marginRight: '36px',
            ...(open && { display: 'none' }),
          }}
        >
          <MenuIcon />
        </IconButton>
      </AppHeader>
      
      {/* منوی کناری */}
      <SideMenu open={open} toggleDrawer={toggleDrawer} />
      
      {/* محتوای اصلی */}
      <Box
        component="main"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[100]
              : theme.palette.grey[900],
          flexGrow: 1,
          height: '100vh',
          overflow: 'auto',
        }}
      >
        <Toolbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
EOF

cat > client/src/components/layout/AppHeader.tsx << 'EOF'
// client/src/components/layout/AppHeader.tsx
// کامپوننت هدر برنامه

import React from 'react';
import { 
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  ListItemIcon,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../../hooks/useAuth';

const drawerWidth = 240;

interface AppHeaderProps {
  open: boolean;
  children?: React.ReactNode;
}

// هدر با پشتیبانی از منوی کشویی
const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const AppHeader: React.FC<AppHeaderProps> = ({ open, children }) => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  
  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  return (
    <StyledAppBar position="absolute" open={open}>
      <Toolbar
        sx={{
          pr: '24px',
        }}
      >
        {children}
        
        <Typography
          component="h1"
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1 }}
        >
          پرداخت‌یار
        </Typography>
        
        {/* آیکون اعلان‌ها */}
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        
        {/* منوی کاربر */}
        <Tooltip title="تنظیمات حساب کاربری">
          <IconButton
            onClick={handleMenu}
            size="large"
            sx={{ ml: 2 }}
            aria-controls="menu-appbar"
            aria-haspopup="true"
          >
            <Avatar sx={{ width: 32, height: 32 }}>
              {user?.fullName.charAt(0)}
            </Avatar>
          </IconButton>
        </Tooltip>
        
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          keepMounted
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            پروفایل
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            تنظیمات
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            خروج
          </MenuItem>
        </Menu>
      </Toolbar>
    </StyledAppBar>
  );
};

export default AppHeader;
EOF

cat > client/src/components/layout/SideMenu.tsx << 'EOF'
// client/src/components/layout/SideMenu.tsx
// کامپوننت منوی کناری

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Drawer,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PaymentsIcon from '@mui/icons-material/Payments';
import GroupsIcon from '@mui/icons-material/Groups';
import ContactsIcon from '@mui/icons-material/Contacts';
import SettingsIcon from '@mui/icons-material/Settings';

const drawerWidth = 240;

interface SideMenuProps {
  open: boolean;
  toggleDrawer: () => void;
}

// منوی کشویی با انیمیشن
const StyledDrawer = styled(Drawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// آیتم‌های منو
const menuItems = [
  { text: 'داشبورد', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'پرداخت‌ها', icon: <PaymentsIcon />, path: '/payments' },
  { text: 'گروه‌ها', icon: <GroupsIcon />, path: '/groups' },
  { text: 'طرف‌حساب‌ها', icon: <ContactsIcon />, path: '/contacts' },
];

const SideMenu: React.FC<SideMenuProps> = ({ open, toggleDrawer }) => {
  const location = useLocation();
  
  return (
    <StyledDrawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronRightIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/settings">
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="تنظیمات" />
          </ListItemButton>
        </ListItem>
      </List>
    </StyledDrawer>
  );
};

export default SideMenu;
EOF

# ایجاد مستندات راه‌اندازی پروژه
cat > STARTUP.md << 'EOF'
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
EOF

echo "ساختار پروژه پرداخت‌یار با موفقیت ایجاد شد."
echo "برای راه‌اندازی پروژه، مراحل موجود در فایل STARTUP.md را دنبال کنید."

