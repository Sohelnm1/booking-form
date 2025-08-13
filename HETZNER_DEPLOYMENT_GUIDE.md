# Hetzner Server Deployment Guide

## Server Information

-   **IP Address**: 37.27.198.139
-   **Username**: root
-   **Password**: Hospipal@321
-   **SSH Port**: 22

## Prerequisites

-   SSH access to your Hetzner server
-   FileZilla for file transfer
-   A subdomain from Hostinger to point to this server

## Step 1: Initial Server Setup

### 1.1 Connect to Server

```bash
ssh root@37.27.198.139
```

### 1.2 Update System

```bash
apt update && apt upgrade -y
```

### 1.3 Install Essential Packages

```bash
apt install -y curl wget git unzip software-properties-common apt-transport-https ca-certificates gnupg lsb-release
```

## Step 2: Install LEMP Stack

### 2.1 Install Nginx

```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

### 2.2 Install PHP 8.2 and Extensions

```bash
# Add PHP repository
add-apt-repository ppa:ondrej/php -y
apt update

# Install PHP 8.2 and required extensions
apt install -y php8.2 php8.2-fpm php8.2-mysql php8.2-xml php8.2-curl php8.2-mbstring php8.2-zip php8.2-gd php8.2-bcmath php8.2-intl php8.2-soap php8.2-redis php8.2-imagick

# Start and enable PHP-FPM
systemctl start php8.2-fpm
systemctl enable php8.2-fpm
```

### 2.3 Install MySQL

```bash
# Install MySQL
apt install -y mysql-server

# Secure MySQL installation
mysql_secure_installation

# Start and enable MySQL
systemctl start mysql
systemctl enable mysql
```

### 2.4 Install Composer

```bash
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer
```

### 2.5 Install Node.js and npm

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify installation
node --version
npm --version
```

## Step 3: Configure MySQL Database

### 3.1 Create Database and User

```bash
mysql -u root -p
```

In MySQL prompt:

```sql
CREATE DATABASE hospipal_booking;
CREATE USER 'hospipal_user'@'localhost' IDENTIFIED BY 'Hospipal@321';
GRANT ALL PRIVILEGES ON hospipal_booking.* TO 'hospipal_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Step 4: Deploy Application

### 4.1 Create Application Directory

```bash
mkdir -p /var/www/hospipal
cd /var/www/hospipal
```

### 4.2 Upload Files via FileZilla

1. Open FileZilla
2. Connect to your server:
    - Host: 37.27.198.139
    - Username: root
    - Password: Hospipal@321
    - Port: 22
3. Navigate to `/var/www/hospipal`
4. Upload all your project files

### 4.3 Set Permissions

```bash
cd /var/www/hospipal
chown -R www-data:www-data /var/www/hospipal
chmod -R 755 /var/www/hospipal
chmod -R 775 storage bootstrap/cache
```

### 4.4 Install PHP Dependencies

```bash
cd /var/www/hospipal
composer install --no-dev --optimize-autoloader
```

### 4.5 Install Node.js Dependencies and Build Assets

```bash
cd /var/www/hospipal
npm install
npm run build
```

### 4.6 Configure Environment

```bash
cd /var/www/hospipal
cp .env.example .env
```

Edit `.env` file:

```bash
nano .env
```

Update these values:

```env
APP_NAME="HospiPal Booking"
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-subdomain.yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hospipal_booking
DB_USERNAME=hospipal_user
DB_PASSWORD=Hospipal@321

CACHE_DRIVER=file
SESSION_DRIVER=file
QUEUE_CONNECTION=sync
```

### 4.7 Generate Application Key

```bash
php artisan key:generate
```

### 4.8 Run Migrations and Seeders

```bash
php artisan migrate --force
php artisan db:seed --force
```

### 4.9 Optimize Application

```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

## Step 5: Configure Nginx

### 5.1 Create Nginx Configuration

```bash
nano /etc/nginx/sites-available/hospipal
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-subdomain.yourdomain.com;
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
```

### 5.2 Enable Site

```bash
ln -s /etc/nginx/sites-available/hospipal /etc/nginx/sites-enabled/
rm /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx
```

## Step 6: Configure SSL (Optional but Recommended)

### 6.1 Install Certbot

```bash
apt install -y certbot python3-certbot-nginx
```

### 6.2 Get SSL Certificate

```bash
certbot --nginx -d your-subdomain.yourdomain.com
```

## Step 7: Configure Hostinger Subdomain

### 7.1 In Hostinger Control Panel:

1. Go to **Domains** → **Manage** → **DNS Zone Editor**
2. Add a new A record:
    - **Type**: A
    - **Name**: your-subdomain (e.g., booking, app, etc.)
    - **Value**: 37.27.198.139
    - **TTL**: 300

### 7.2 Wait for DNS Propagation

DNS changes can take up to 24-48 hours to propagate globally.

## Step 8: Final Configuration

### 8.1 Set Up Cron Job for Laravel Scheduler

```bash
crontab -e
```

Add this line:

```
* * * * * cd /var/www/hospipal && php artisan schedule:run >> /dev/null 2>&1
```

### 8.2 Configure Queue Worker (if using queues)

```bash
# Create systemd service for queue worker
nano /etc/systemd/system/hospipal-queue.service
```

Add:

```ini
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
```

Enable and start:

```bash
systemctl enable hospipal-queue
systemctl start hospipal-queue
```

## Step 9: Security Hardening

### 9.1 Configure Firewall

```bash
ufw allow ssh
ufw allow 'Nginx Full'
ufw enable
```

### 9.2 Secure File Permissions

```bash
cd /var/www/hospipal
chmod 644 .env
chown www-data:www-data .env
```

## Step 10: Testing

### 10.1 Test PHP

```bash
php -v
php artisan --version
```

### 10.2 Test Database Connection

```bash
php artisan tinker
DB::connection()->getPdo();
exit
```

### 10.3 Test Website

Visit your subdomain in a browser to ensure everything is working.

## Troubleshooting

### Common Issues:

1. **Permission Denied**: Ensure proper ownership and permissions
2. **Database Connection**: Verify MySQL credentials in `.env`
3. **Nginx 502 Error**: Check PHP-FPM status and configuration
4. **Assets Not Loading**: Ensure `npm run build` was executed

### Useful Commands:

```bash
# Check Nginx status
systemctl status nginx

# Check PHP-FPM status
systemctl status php8.2-fpm

# Check MySQL status
systemctl status mysql

# View Nginx error logs
tail -f /var/log/nginx/error.log

# View Laravel logs
tail -f /var/www/hospipal/storage/logs/laravel.log
```

## Maintenance

### Regular Updates:

```bash
# Update system
apt update && apt upgrade -y

# Update Laravel application
cd /var/www/hospipal
git pull origin main
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

Your Laravel booking website should now be successfully deployed on your Hetzner server!
