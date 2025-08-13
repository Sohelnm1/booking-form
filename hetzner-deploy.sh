#!/bin/bash

# Hetzner Server Deployment Script
# Run this script on your Hetzner server after connecting via SSH

set -e

echo "🚀 Starting Hetzner Server Deployment for HospiPal Booking System"
echo "================================================================"

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

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   print_error "This script must be run as root"
   exit 1
fi

# Step 1: Update System
print_status "Updating system packages..."
apt update && apt upgrade -y

# Step 2: Install Essential Packages
print_status "Installing essential packages..."
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release

# Step 3: Install Nginx
print_status "Installing Nginx..."
apt install -y nginx
systemctl start nginx
systemctl enable nginx

# Step 4: Install PHP 8.2
print_status "Installing PHP 8.2 and extensions..."
add-apt-repository ppa:ondrej/php -y
apt update

apt install -y php8.2 php8.2-fpm php8.2-mysql php8.2-xml php8.2-curl php8.2-mbstring php8.2-zip php8.2-gd php8.2-bcmath php8.2-intl php8.2-soap php8.2-redis php8.2-imagick

systemctl start php8.2-fpm
systemctl enable php8.2-fpm

# Step 5: Install MySQL
print_status "Installing MySQL..."
apt install -y mysql-server
systemctl start mysql
systemctl enable mysql

# Step 6: Install Composer
print_status "Installing Composer..."
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer

# Step 7: Install Node.js
print_status "Installing Node.js 18.x..."
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Step 8: Create Application Directory
print_status "Creating application directory..."
mkdir -p /var/www/hospipal
cd /var/www/hospipal

# Step 9: Set up MySQL Database
print_status "Setting up MySQL database..."
mysql -e "CREATE DATABASE IF NOT EXISTS hospipal_booking;"
mysql -e "CREATE USER IF NOT EXISTS 'hospipal_user'@'localhost' IDENTIFIED BY 'Hospipal@321';"
mysql -e "GRANT ALL PRIVILEGES ON hospipal_booking.* TO 'hospipal_user'@'localhost';"
mysql -e "FLUSH PRIVILEGES;"

# Step 10: Create Nginx Configuration
print_status "Creating Nginx configuration..."
cat > /etc/nginx/sites-available/hospipal << 'EOF'
server {
    listen 80;
    server_name _;
    root /var/www/hospipal/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/hospipal /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
nginx -t

# Reload Nginx
systemctl reload nginx

# Step 11: Set up Firewall
print_status "Configuring firewall..."
ufw allow ssh
ufw allow 'Nginx Full'
ufw --force enable

# Step 12: Set up Cron Job
print_status "Setting up Laravel scheduler cron job..."
(crontab -l 2>/dev/null; echo "* * * * * cd /var/www/hospipal && php artisan schedule:run >> /dev/null 2>&1") | crontab -

# Step 13: Create Queue Worker Service
print_status "Creating queue worker service..."
cat > /etc/systemd/system/hospipal-queue.service << 'EOF'
[Unit]
Description=HospiPal Queue Worker
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=/var/www/hospipal
ExecStart=/usr/bin/php artisan queue:work --sleep=3 --tries=3 --max-time=3600
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

systemctl enable hospipal-queue

print_status "Server setup completed successfully!"
echo ""
print_warning "Next steps:"
echo "1. Upload your Laravel project files to /var/www/hospipal using FileZilla"
echo "2. Run the following commands in /var/www/hospipal:"
echo "   - composer install --no-dev --optimize-autoloader"
echo "   - npm install && npm run build"
echo "   - cp .env.example .env"
echo "   - Edit .env with your database credentials"
echo "   - php artisan key:generate"
echo "   - php artisan migrate --force"
echo "   - php artisan db:seed --force"
echo "   - php artisan config:cache"
echo "   - php artisan route:cache"
echo "   - php artisan view:cache"
echo "3. Set proper permissions: chown -R www-data:www-data /var/www/hospipal"
echo "4. Configure your Hostinger subdomain to point to 37.27.198.139"
echo "5. Update the server_name in Nginx config with your actual domain"
echo ""
print_status "Server is ready for deployment!"
