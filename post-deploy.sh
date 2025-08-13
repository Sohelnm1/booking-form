#!/bin/bash

# Post-Deployment Script for HospiPal Booking System
# Run this script after uploading files to /var/www/hospipal

set -e

echo "🔧 Setting up Laravel Application"
echo "================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

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
    print_error "Please run this script from the Laravel project root directory (/var/www/hospipal)"
    exit 1
fi

# Step 1: Set proper permissions
print_status "Setting proper permissions..."
chown -R www-data:www-data /var/www/hospipal
chmod -R 755 /var/www/hospipal
chmod -R 775 storage bootstrap/cache

# Step 2: Install PHP dependencies
print_status "Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

# Step 3: Install Node.js dependencies and build assets
print_status "Installing Node.js dependencies..."
npm install

print_status "Building assets..."
npm run build

# Step 4: Configure environment
print_status "Configuring environment..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    print_warning "Created .env file from .env.example"
    print_warning "Please edit .env file with your specific configuration"
fi

# Step 5: Generate application key
print_status "Generating application key..."
php artisan key:generate

# Step 6: Run migrations
print_status "Running database migrations..."
php artisan migrate --force

# Step 7: Run seeders
print_status "Running database seeders..."
php artisan db:seed --force

# Step 8: Optimize application
print_status "Optimizing application..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Step 9: Set secure permissions for .env
print_status "Securing .env file..."
chmod 644 .env
chown www-data:www-data .env

# Step 10: Start queue worker
print_status "Starting queue worker..."
systemctl start hospipal-queue

print_status "Laravel application setup completed successfully!"
echo ""
print_warning "Don't forget to:"
echo "1. Update your .env file with correct database credentials"
echo "2. Configure your domain in Nginx configuration"
echo "3. Set up SSL certificate if needed"
echo "4. Test your application by visiting your domain"
echo ""
print_status "Your HospiPal booking system is now ready!"
