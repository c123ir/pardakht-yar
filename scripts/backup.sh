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