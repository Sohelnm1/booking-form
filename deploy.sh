#!/bin/bash

# Hostinger Git Deployment Script
# This script will be triggered by Git hooks to deploy your Laravel app

echo "🚀 Starting deployment to Hostinger..."

# Configuration
REMOTE_HOST="82.25.125.114"
REMOTE_USER="u777170885"
REMOTE_PORT="65002"
REMOTE_PATH="/home/u777170885/domains/hospipalhealth.com/public_html/booking"
LOCAL_PATH="."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "artisan" ]; then
    print_error "This doesn't look like a Laravel project. Make sure you're in the project root."
    exit 1
fi

print_status "Building frontend assets..."
npm run build

if [ $? -ne 0 ]; then
    print_error "Frontend build failed!"
    exit 1
fi

print_status "Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader

if [ $? -ne 0 ]; then
    print_error "Composer install failed!"
    exit 1
fi

print_status "Syncing files to Hostinger..."

# Create a temporary directory for the deployment
TEMP_DIR=$(mktemp -d)
cp -r . "$TEMP_DIR/"

# Remove files that shouldn't be deployed
cd "$TEMP_DIR"
rm -rf .git
rm -rf node_modules
rm -rf tests
rm -f .env
rm -f .env.example
rm -f .gitignore
rm -f .editorconfig
rm -f .gitattributes
rm -f phpunit.xml
rm -f deploy.sh

# Sync to Hostinger using scp (Windows compatible)
# Copy files directly to the booking directory, not into a subfolder
scp -P "$REMOTE_PORT" -r "$TEMP_DIR"/* "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

if [ $? -eq 0 ]; then
    print_status "Files synced successfully!"
    
    # Run post-deployment commands on the server
    ssh -p "$REMOTE_PORT" "$REMOTE_USER@$REMOTE_HOST" << 'EOF'
        cd /home/u777170885/domains/hospipalhealth.com/public_html/booking
        
        echo "🔄 Running Laravel maintenance tasks..."
        
        # Clear caches
        php artisan config:clear
        php artisan cache:clear
        php artisan route:clear
        php artisan view:clear
        
        # Run migrations (if any)
        php artisan migrate --force
        
        # Set proper permissions
        chmod -R 755 storage
        chmod -R 755 bootstrap/cache
        
        echo "✅ Deployment completed successfully!"
EOF
    
    print_status "Deployment completed! 🎉"
else
    print_error "File sync failed!"
    exit 1
fi

# Clean up
rm -rf "$TEMP_DIR"

print_status "Deployment script finished." 