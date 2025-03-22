#!/bin/bash

# رنگ‌ها برای نمایش بهتر
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}===== شروع فرآیند همگام‌سازی با گیت =====${NC}"

# بررسی کانتینرهای در حال اجرا
POSTGRES_RUNNING=$(docker ps -q -f name=pardakhtyar-postgres)

if [ -n "$POSTGRES_RUNNING" ]; then
    # اگر کانتینر PostgreSQL در حال اجراست، ابتدا از آن بک‌آپ می‌گیریم
    echo -e "${YELLOW}در حال تهیه بک‌آپ از دیتابیس...${NC}"
    mkdir -p ./server/backups
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="./server/backups/db_backup_$TIMESTAMP.sql"
    
    docker exec pardakhtyar-postgres pg_dump -U postgres -d pardakht_yar > $BACKUP_FILE
    echo -e "${GREEN}بک‌آپ دیتابیس در $BACKUP_FILE ذخیره شد${NC}"
else
    echo -e "${YELLOW}کانتینر PostgreSQL در حال اجرا نیست. بک‌آپ گرفته نشد.${NC}"
    echo -e "${YELLOW}آیا می‌خواهید کانتینرها را راه‌اندازی کنید تا بتوانید بک‌آپ بگیرید؟ (y/n)${NC}"
    read start_containers
    
    if [[ $start_containers == "y" || $start_containers == "Y" ]]; then
        echo -e "${YELLOW}در حال راه‌اندازی کانتینرها...${NC}"
        docker-compose up -d
        sleep 5 # انتظار برای راه‌اندازی کامل دیتابیس
        
        echo -e "${YELLOW}در حال تهیه بک‌آپ از دیتابیس...${NC}"
        mkdir -p ./server/backups
        TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
        BACKUP_FILE="./server/backups/db_backup_$TIMESTAMP.sql"
        
        docker exec pardakhtyar-postgres pg_dump -U postgres -d pardakht_yar > $BACKUP_FILE
        echo -e "${GREEN}بک‌آپ دیتابیس در $BACKUP_FILE ذخیره شد${NC}"
    fi
fi

# متوقف کردن کانتینرهای داکر
echo -e "${YELLOW}در حال متوقف کردن کانتینرهای داکر...${NC}"
docker-compose down

# اجرای مایگریشن‌های Prisma
echo -e "${YELLOW}در حال بررسی تغییرات Prisma...${NC}"
cd server

# بررسی وجود دریفت در دیتابیس
echo -e "${YELLOW}آیا می‌خواهید از Prisma migrate reset استفاده کنید؟ این کار همه داده‌ها را حذف می‌کند. (y/n)${NC}"
echo -e "${RED}هشدار: با انتخاب 'y' تمام داده‌های دیتابیس پاک خواهد شد!${NC}"
read reset_db

if [[ $reset_db == "y" || $reset_db == "Y" ]]; then
    echo -e "${YELLOW}در حال بازنشانی دیتابیس...${NC}"
    npx prisma migrate reset --force
    
    echo -e "${YELLOW}در حال ایجاد مایگریشن جدید...${NC}"
    echo -e "${YELLOW}لطفاً نام مایگریشن را وارد کنید:${NC}"
    read migration_name
    npx prisma migrate dev --name $migration_name
else
    echo -e "${YELLOW}رد کردن بازنشانی دیتابیس.${NC}"
    echo -e "${YELLOW}بررسی امکان استفاده از dev migrations...${NC}"
    
    echo -e "${YELLOW}لطفاً نام مایگریشن را وارد کنید (یا برای رد کردن خالی بگذارید):${NC}"
    read migration_name
    
    if [ -n "$migration_name" ]; then
        npx prisma migrate dev --name $migration_name --create-only
        echo -e "${YELLOW}مایگریشن ایجاد شد اما اجرا نشد. شما باید آن را به صورت دستی بررسی و اجرا کنید.${NC}"
    fi
fi

# بازگشت به دایرکتوری اصلی
cd ..

# کامیت تغییرات به گیت
echo -e "${YELLOW}آماده‌سازی برای کامیت به گیت...${NC}"
echo -e "${YELLOW}فایل‌های تغییر کرده:${NC}"
git status

echo -e "${YELLOW}در حال اضافه کردن تغییرات...${NC}"
git add .

echo -e "${YELLOW}لطفاً پیام کامیت را وارد کنید:${NC}"
read commit_message

git commit -m "$commit_message"

echo -e "${YELLOW}در حال ارسال تغییرات به مخزن گیت...${NC}"
git push

echo -e "${GREEN}تغییرات با موفقیت به گیت ارسال شد!${NC}"
echo -e "${BLUE}===== فرآیند همگام‌سازی با موفقیت به پایان رسید =====${NC}" 