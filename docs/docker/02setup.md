
Ran tool

```bash
docker-compose config | grep restart | cat
```

```compose:docker-compose.yml
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
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

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
      - JWT_SECRET=${JWT_SECRET:-your-secret-key-should-be-changed-in-production}
      - NODE_ENV=production
    volumes:
      - ./uploads:/app/uploads:ro
    depends_on:
      postgres:
        condition: service_healthy

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
    depends_on:
      - server

volumes:
  postgres_data:
```

```bash
cp docker-compose.yml docker-compose.production.yml && nano docker-compose.yml
```

```bash
cd .. && cp docker-compose.yml docker-compose.production.yml
```

```compose:docker-compose.yml
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

```bash
mkdir -p scripts
```

```shell script:scripts/deploy.sh
#!/bin/bash
# Deployment script for Pardakht-yar application

# Exit on any error
set -e

# Configuration
SSH_USER=${1:-"root"}
SSH_HOST=${2:-"your-server-ip"}
APP_DIR=${3:-"/opt/pardakht-yar"}
ENV_FILE=${4:-".env.production"}

# Display configuration
echo "Deploying to $SSH_USER@$SSH_HOST:$APP_DIR"
echo "Using environment file: $ENV_FILE"

# Check if ENV_FILE exists
if [ ! -f "$ENV_FILE" ]; then
  echo "Error: Environment file $ENV_FILE does not exist!"
  exit 1
fi

# Transfer files to the server
echo "Creating application directory on server..."
ssh $SSH_USER@$SSH_HOST "mkdir -p $APP_DIR/uploads/avatars $APP_DIR/uploads/payments $APP_DIR/uploads/requests"

echo "Copying files to server..."
scp docker-compose.production.yml $SSH_USER@$SSH_HOST:$APP_DIR/docker-compose.yml
scp $ENV_FILE $SSH_USER@$SSH_HOST:$APP_DIR/.env
scp -r server/Dockerfile $SSH_USER@$SSH_HOST:$APP_DIR/server/
scp -r client/Dockerfile $SSH_USER@$SSH_HOST:$APP_DIR/client/

# Deploy application
echo "Deploying application..."
ssh $SSH_USER@$SSH_HOST "cd $APP_DIR && docker-compose pull && docker-compose up -d"

# Check status
echo "Deployment completed. Checking container status..."
ssh $SSH_USER@$SSH_HOST "cd $APP_DIR && docker-compose ps"

echo "Application deployed successfully!"
echo "You can access it at: http://$SSH_HOST:5173"
```

```shell script:scripts/backup.sh
#!/bin/bash
# Database backup script for Pardakht-yar application

# Exit on any error
set -e

# Configuration
SSH_USER=${1:-"root"}
SSH_HOST=${2:-"your-server-ip"}
APP_DIR=${3:-"/opt/pardakht-yar"}
BACKUP_DIR=${4:-"/opt/backups/pardakht-yar"}
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
DB_NAME="pardakht_yar"
BACKUP_FILENAME="${DB_NAME}_${TIMESTAMP}.sql"
KEEP_DAYS=7

# Display configuration
echo "Creating backup on $SSH_USER@$SSH_HOST"
echo "Application directory: $APP_DIR"
echo "Backup directory: $BACKUP_DIR"

# Execute backup commands on the server
echo "Creating backup directory on server..."
ssh $SSH_USER@$SSH_HOST "mkdir -p $BACKUP_DIR"

echo "Creating database backup..."
ssh $SSH_USER@$SSH_HOST "cd $APP_DIR && \
    docker-compose exec -T postgres pg_dump -U postgres $DB_NAME > $BACKUP_DIR/$BACKUP_FILENAME && \
    gzip $BACKUP_DIR/$BACKUP_FILENAME"

echo "Backup created: $BACKUP_DIR/${BACKUP_FILENAME}.gz"

# Delete old backups
echo "Cleaning up old backups (older than $KEEP_DAYS days)..."
ssh $SSH_USER@$SSH_HOST "find $BACKUP_DIR -name '${DB_NAME}_*.sql.gz' -mtime +$KEEP_DAYS -delete"

echo "Backup process completed successfully!"
```

```shell script:.env.production.example
# Database Configuration
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/pardakht_yar

# Server Configuration
PORT=5050
NODE_ENV=production
JWT_SECRET=change-this-to-a-secure-random-string-in-production

# Client Configuration
VITE_API_URL=http://example.com:5050/api

# Postgres Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=pardakht_yar
```

```bash
chmod +x scripts/deploy.sh scripts/backup.sh
```

```markdown:README.md
# پرداخت‌یار - سیستم مدیریت واریزی‌ها و طرف‌حساب‌ها

## مقدمه
سیستم پرداخت‌یار یک نرم‌افزار مدیریت واریزی‌ها و طرف‌حساب‌هاست که به شما امکان می‌دهد به راحتی تراکنش‌های مالی را مدیریت کنید.

## نیازمندی‌ها
- Docker و Docker Compose
- Node.js (برای توسعه)
- npm یا yarn (برای توسعه)

## راه‌اندازی در محیط توسعه

برای راه‌اندازی پروژه در محیط توسعه، دستورات زیر را اجرا کنید:

```bash
# کلون کردن مخزن
git clone https://github.com/your-username/pardakht-yar.git
cd pardakht-yar

# راه‌اندازی با داکر
docker-compose up -d

# بررسی وضعیت کانتینرها
docker-compose ps
```

پس از اجرای دستورات بالا، سیستم در آدرس‌های زیر قابل دسترسی خواهد بود:
- رابط کاربری: http://localhost:5173
- API: http://localhost:5050/api

اطلاعات ورود پیش‌فرض:
- نام کاربری: `admin`
- رمز عبور: `admin123`

## استقرار در محیط تولید

برای استقرار پروژه در محیط تولید، مراحل زیر را دنبال کنید:

### 1. آماده‌سازی فایل‌های محیط

ابتدا یک فایل محیطی برای تولید ایجاد کنید:

```bash
cp .env.production.example .env.production
```

فایل `.env.production` را با مقادیر مناسب برای محیط تولید ویرایش کنید. حتماً `JWT_SECRET` را به یک رشته تصادفی امن تغییر دهید و `VITE_API_URL` را به آدرس سرور تولید خود تنظیم کنید.

### 2. استقرار با اسکریپت

اسکریپت استقرار را با مشخص کردن اطلاعات سرور خود اجرا کنید:

```bash
./scripts/deploy.sh user server-ip /path/to/app .env.production
```

این اسکریپت به صورت خودکار:
- دایرکتوری‌های لازم را در سرور ایجاد می‌کند
- فایل‌های پیکربندی را به سرور منتقل می‌کند
- کانتینرها را روی سرور راه‌اندازی می‌کند

### 3. تهیه نسخه پشتیبان از دیتابیس

برای تهیه نسخه پشتیبان از دیتابیس، می‌توانید از اسکریپت زیر استفاده کنید:

```bash
./scripts/backup.sh user server-ip /path/to/app /path/to/backups
```

می‌توانید این اسکریپت را در cron سرور تنظیم کنید تا به صورت خودکار نسخه پشتیبان تهیه شود.

## ساختار پروژه

- `client/`: کد فرانت‌اند React با TypeScript
- `server/`: کد بک‌اند Node.js با Express و TypeScript
- `docker-compose.yml`: پیکربندی داکر برای محیط توسعه
- `docker-compose.production.yml`: پیکربندی داکر برای محیط تولید
- `scripts/`: اسکریپت‌های مفید برای استقرار و نگهداری

## توسعه‌دهندگان
[نام شما و تیم توسعه]
```
مراحل انتقال برنامه پرداخت‌یار به محیط تولید:

## 1. آماده‌سازی محیط تولید

1. **ایجاد فایل محیطی برای تولید:**
   ```bash
   cp .env.production.example .env.production
   ```

2. **ویرایش فایل `.env.production`:**
   - تغییر `JWT_SECRET` به یک رشته تصادفی و امن
   - تنظیم `VITE_API_URL` به آدرس سرور تولید خود
   - تغییر سایر تنظیمات بر اساس نیاز

## 2. آماده‌سازی سرور تولید

1. **اطمینان از نصب Docker و Docker Compose روی سرور**
   ```bash
   ssh user@server-ip
   docker --version
   docker-compose --version
   ```

2. **ایجاد کلید SSH برای اتصال امن (اگر ندارید):**
   ```bash
   ssh-keygen -t rsa -b 4096
   ssh-copy-id user@server-ip
   ```

## 3. استقرار برنامه

1. **اجرای اسکریپت استقرار:**
   ```bash
   ./scripts/deploy.sh user server-ip /opt/pardakht-yar .env.production
   ```

2. **بررسی وضعیت کانتینرها روی سرور:**
   ```bash
   ssh user@server-ip "cd /opt/pardakht-yar && docker-compose ps"
   ```

3. **بررسی لاگ‌ها برای اطمینان از اجرای صحیح:**
   ```bash
   ssh user@server-ip "cd /opt/pardakht-yar && docker-compose logs"
   ```

## 4. تنظیم پشتیبان‌گیری خودکار

1. **تست اسکریپت پشتیبان‌گیری:**
   ```bash
   ./scripts/backup.sh user server-ip /opt/pardakht-yar /opt/backups/pardakht-yar
   ```

2. **تنظیم cron برای پشتیبان‌گیری خودکار (روی سرور):**
   ```bash
   ssh user@server-ip
   crontab -e
   ```

3. **افزودن خط زیر برای پشتیبان‌گیری روزانه در ساعت 2 صبح:**
   ```
   0 2 * * * /opt/pardakht-yar/scripts/backup.sh localhost localhost /opt/pardakht-yar /opt/backups/pardakht-yar >> /var/log/pardakht-backup.log 2>&1
   ```

## 5. دسترسی به برنامه

- **رابط کاربری:** http://server-ip:5173
- **API:** http://server-ip:5050/api
- **اطلاعات ورود پیش‌فرض:**
  - نام کاربری: `admin`
  - رمز عبور: `admin123`

## 6. بهینه‌سازی‌های اضافی (اختیاری)

1. **تنظیم Nginx به عنوان reverse proxy:**
   - انتقال ترافیک از پورت 80/443 به پورت‌های برنامه
   - پیکربندی SSL/TLS برای اتصال امن

2. **تنظیم فایروال:**
   ```bash
   ssh user@server-ip
   sudo ufw allow 22/tcp
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   sudo ufw enable
   ```

3. **تنظیم مانیتورینگ سیستم:**
   - نصب و پیکربندی ابزارهایی مانند Prometheus و Grafana

این مراحل به شما کمک می‌کند برنامه پرداخت‌یار را به صورت امن و پایدار در محیط تولید مستقر کنید. آیا در هر یک از مراحل به توضیح بیشتری نیاز دارید؟
