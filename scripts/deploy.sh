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