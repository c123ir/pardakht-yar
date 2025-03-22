#!/bin/bash

# رنگ‌ها برای نمایش بهتر
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}===== شروع فرآیند راه‌اندازی پروژه =====${NC}"

# بررسی اینکه آیا داکر در حال اجراست
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}خطا: داکر در حال اجرا نیست. لطفاً داکر را راه‌اندازی کنید.${NC}"
  exit 1
fi

# بررسی پورت‌های در حال استفاده
PORT_5050=$(lsof -i:5050 -t)
if [ -n "$PORT_5050" ]; then
  echo -e "${YELLOW}پورت 5050 قبلاً در حال استفاده است. در حال متوقف کردن فرآیند...${NC}"
  kill -9 $PORT_5050
  echo -e "${GREEN}فرآیند در پورت 5050 متوقف شد.${NC}"
fi

# دریافت تغییرات جدید از گیت
echo -e "${YELLOW}در حال دریافت تغییرات جدید از گیت...${NC}"
git pull

# متوقف کردن کانتینرهای قبلی (اگر در حال اجرا باشند)
echo -e "${YELLOW}در حال متوقف کردن کانتینرهای قبلی...${NC}"
docker-compose down

# نصب وابستگی‌های پروژه
echo -e "${YELLOW}در حال نصب/به‌روزرسانی وابستگی‌های پروژه...${NC}"
npm install
cd client && npm install && cd ..
cd server && npm install && cd ..

# اجرای مایگریشن‌های Prisma برای به‌روزرسانی دیتابیس
echo -e "${YELLOW}آیا می‌خواهید مایگریشن‌های دیتابیس را اجرا کنید؟ (y/n)${NC}"
read apply_migrations

if [[ $apply_migrations == "y" || $apply_migrations == "Y" ]]; then
  echo -e "${YELLOW}در حال اجرای مایگریشن‌های Prisma...${NC}"
  
  echo -e "${YELLOW}آیا می‌خواهید دیتابیس را بازنشانی کنید؟ (reset) این کار همه داده‌ها را حذف می‌کند. (y/n)${NC}"
  echo -e "${RED}هشدار: با انتخاب 'y' تمام داده‌های دیتابیس پاک خواهد شد!${NC}"
  read reset_db
  
  if [[ $reset_db == "y" || $reset_db == "Y" ]]; then
    cd server && npx prisma migrate reset --force && cd ..
  else
    cd server && npx prisma migrate deploy && cd ..
  fi
fi

# راه‌اندازی پروژه با داکر
echo -e "${YELLOW}در حال راه‌اندازی کانتینرهای داکر...${NC}"
docker-compose up --build -d

# انتظار برای راه‌اندازی کامل سرور
echo -e "${YELLOW}در حال انتظار برای راه‌اندازی کامل سرور...${NC}"
sleep 10

# اجرای Prisma Generate داخل کانتینر سرور
echo -e "${YELLOW}در حال اجرای Prisma Generate داخل کانتینر...${NC}"
docker exec -it pardakhtyar-server sh -c "cd /app && npx prisma generate"

# راه‌اندازی مجدد کانتینر سرور
echo -e "${YELLOW}در حال راه‌اندازی مجدد کانتینر سرور...${NC}"
docker restart pardakhtyar-server

# انتظار برای راه‌اندازی مجدد سرور
sleep 5

# بررسی وضعیت سرور
echo -e "${YELLOW}در حال بررسی وضعیت سرور...${NC}"
SERVER_RUNNING=$(docker ps -q -f name=pardakhtyar-server)
if [ -n "$SERVER_RUNNING" ]; then
  LOGS=$(docker logs pardakhtyar-server --tail 5)
  if [[ $LOGS == *"Server is running"* ]]; then
    echo -e "${GREEN}سرور با موفقیت راه‌اندازی شد!${NC}"
  else
    echo -e "${RED}به نظر می‌رسد سرور با خطا مواجه شده است. لطفاً لاگ‌ها را بررسی کنید.${NC}"
    docker logs pardakhtyar-server --tail 20
  fi
else
  echo -e "${RED}کانتینر سرور راه‌اندازی نشد.${NC}"
fi

# نمایش وضعیت کانتینرها
echo -e "${YELLOW}وضعیت کانتینرهای در حال اجرا:${NC}"
docker ps

# نمایش آدرس‌های دسترسی
echo -e "${GREEN}پروژه با موفقیت راه‌اندازی شد!${NC}"
echo -e "${BLUE}آدرس فرانت‌اند: http://localhost:5173${NC}"
echo -e "${BLUE}آدرس بک‌اند: http://localhost:5050${NC}"
echo -e "${BLUE}===== فرآیند راه‌اندازی با موفقیت به پایان رسید =====${NC}" 