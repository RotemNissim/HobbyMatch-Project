#!/bin/bash -x

# Set working directory to project root
cd "$(dirname "$0")" || exit

echo "🚀 Pulling latest changes from main..."
git pull origin main

# Function to deploy backend (PM2)
deploy_backend() {
  local dir="backend"
  echo "📦 Installing dependencies for $dir..."
  cd "$dir" || exit
  rm -rf dist
  npm install

  echo "🛠️ Building $dir..."
  npm run build

  if [ -f "ecosystem.config.cjs" ]; then
      CONFIG_FILE="ecosystem.config.cjs"
  elif [ -f "ecosystem.config.js" ]; then
      CONFIG_FILE="ecosystem.config.js"
  else
      echo "❌ No ecosystem.config.cjs or ecosystem.config.js found. Deployment aborted!"
      exit 1
  fi

  if [ $? -eq 0 ]; then
      echo "🔄 Restarting PM2 for $dir using $CONFIG_FILE..."
      pm2 restart "$CONFIG_FILE" --env production
      echo "✅ $dir deployment complete!"
  else
      echo "❌ $dir build failed. Deployment aborted!"
      exit 1
  fi

  cd ..
}

# Function to deploy frontend (copy dist to /var/www/html)
deploy_frontend() {
  local dir="frontend"
  echo "📦 Installing dependencies for $dir..."
  cd "$dir" || exit
  rm -rf dist
  npm install

  echo "🛠️ Building $dir..."
  npm run build

  if [ $? -eq 0 ]; then
      echo "🚀 Deploying frontend to /var/www/html..."
      sudo rm -rf /var/www/html/*
      sudo cp -r dist/* /var/www/html/
      sudo chown -R www-data:www-data /var/www/html
      sudo chmod -R 755 /var/www/html
      echo "✅ Frontend deployed successfully!"
  else
      echo "❌ Frontend build failed. Deployment aborted!"
      exit 1
  fi

  cd ..
}

# Deploy backend with PM2
deploy_backend

# Deploy frontend by copying to /var/www/html
deploy_frontend

echo "Restarting caddy"

sudo systemctl restart caddy

echo "🎉 All services deployed successfully!"
