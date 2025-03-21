
Read file: docker-compose.yml

```bash
ls -la uploads
```

```bash
curl http://localhost:5050/api/health | cat
```

```bash
docker-compose logs server | tail -n 50 | cat
```

```bash
docker-compose exec server npm run prisma:generate | cat
```

```bash
docker-compose restart server
```

```bash
docker-compose logs server | tail -n 20 | cat
```

```bash
curl http://localhost:5050/api/health | cat
```

```bash
curl http://localhost:5050/api | cat
```

```bash
curl http://localhost:5050/api/auth/login -X POST -H "Content-Type: application/json" -d '{"username":"admin", "password":"admin123"}' | cat
```

```bash
curl http://localhost:5173/ | cat
```

```bash
docker-compose logs client | tail -n 20 | cat
```

```bash
docker-compose restart client
```

```bash
docker-compose logs client | tail -n 20 | cat
```

Read file: client/Dockerfile

Read file: client/vite.config.ts

```typescript:client/vite.config.ts
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
    port: 5173,
  }
})
```

```bash
docker-compose restart client
```

```bash
docker-compose logs client | tail -n 20 | cat
```

```bash
curl http://localhost:5173/ | head -n 20 | cat
```
مشکل حل شد! حالا برنامه باید به درستی اجرا شود. دو مشکل اصلی وجود داشت:

1. **مشکل سرور**: 
   - کلاینت Prisma تولید نشده بود. این را با اجرای دستور `prisma:generate` حل کردیم.
   - سرور را پس از تولید کلاینت Prisma مجدداً راه‌اندازی کردیم.

2. **مشکل پورت کلاینت**: 
   - در فایل `vite.config.ts` پورت روی 3030 تنظیم شده بود، اما در داکر پورت 5173 نگاشت شده بود.
   - پورت را در `vite.config.ts` به 5173 تغییر دادیم.
   - کانتینر کلاینت را مجدداً راه‌اندازی کردیم.

حالا می‌توانید به برنامه از طریق مرورگر دسترسی داشته باشید:
http://localhost:5173

اطلاعات ورود به سیستم:
- نام کاربری: `admin`
- رمز عبور: `admin123`

آزمایش کردیم و تأیید شد که سرور API نیز به درستی کار می‌کند و می‌توانید وارد سیستم شوید.
