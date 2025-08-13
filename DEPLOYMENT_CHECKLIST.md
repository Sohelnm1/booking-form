# Deployment Checklist for Hetzner Server

## Pre-Deployment

-   [ ] SSH access to Hetzner server confirmed
-   [ ] FileZilla access confirmed
-   [ ] Hostinger subdomain ready
-   [ ] Project files ready for upload

## Server Setup (Run hetzner-deploy.sh)

-   [ ] Connect to server: `ssh root@37.27.198.139`
-   [ ] Upload `hetzner-deploy.sh` to server
-   [ ] Make script executable: `chmod +x hetzner-deploy.sh`
-   [ ] Run server setup: `./hetzner-deploy.sh`
-   [ ] Verify all services are running:
    -   [ ] Nginx: `systemctl status nginx`
    -   [ ] PHP-FPM: `systemctl status php8.2-fpm`
    -   [ ] MySQL: `systemctl status mysql`

## File Upload

-   [ ] Open FileZilla
-   [ ] Connect to server:
    -   Host: `37.27.198.139`
    -   Username: `root`
    -   Password: `Hospipal@321`
    -   Port: `22`
-   [ ] Navigate to `/var/www/hospipal`
-   [ ] Upload all project files
-   [ ] Verify files are uploaded correctly

## Application Setup (Run post-deploy.sh)

-   [ ] SSH to server
-   [ ] Navigate to `/var/www/hospipal`
-   [ ] Upload `post-deploy.sh` to server
-   [ ] Make script executable: `chmod +x post-deploy.sh`
-   [ ] Run application setup: `./post-deploy.sh`
-   [ ] Verify Laravel is working: `php artisan --version`

## Environment Configuration

-   [ ] Edit `.env` file with correct settings:
    -   [ ] `APP_URL=https://your-subdomain.yourdomain.com`
    -   [ ] `DB_DATABASE=hospipal_booking`
    -   [ ] `DB_USERNAME=hospipal_user`
    -   [ ] `DB_PASSWORD=Hospipal@321`
    -   [ ] `APP_ENV=production`
    -   [ ] `APP_DEBUG=false`
-   [ ] Test database connection: `php artisan tinker`
-   [ ] Run migrations: `php artisan migrate --force`
-   [ ] Run seeders: `php artisan db:seed --force`

## Domain Configuration

-   [ ] In Hostinger control panel:
    -   [ ] Go to **Domains** → **Manage** → **DNS Zone Editor**
    -   [ ] Add A record:
        -   Type: `A`
        -   Name: `your-subdomain` (e.g., booking, app)
        -   Value: `37.27.198.139`
        -   TTL: `300`
-   [ ] Update Nginx configuration with your domain:
    -   [ ] Edit `/etc/nginx/sites-available/hospipal`
    -   [ ] Replace `server_name _;` with `server_name your-subdomain.yourdomain.com;`
    -   [ ] Test configuration: `nginx -t`
    -   [ ] Reload Nginx: `systemctl reload nginx`

## SSL Configuration (Optional but Recommended)

-   [ ] Install Certbot: `apt install -y certbot python3-certbot-nginx`
-   [ ] Get SSL certificate: `certbot --nginx -d your-subdomain.yourdomain.com`
-   [ ] Test SSL: Visit `https://your-subdomain.yourdomain.com`

## Testing

-   [ ] Test website functionality:
    -   [ ] Homepage loads correctly
    -   [ ] User registration/login works
    -   [ ] Booking system functions properly
    -   [ ] Admin panel accessible
    -   [ ] All forms submit correctly
-   [ ] Check error logs if issues:
    -   [ ] Nginx logs: `tail -f /var/log/nginx/error.log`
    -   [ ] Laravel logs: `tail -f /var/www/hospipal/storage/logs/laravel.log`

## Security Verification

-   [ ] Firewall is enabled: `ufw status`
-   [ ] SSH access is working
-   [ ] File permissions are correct
-   [ ] `.env` file is secure
-   [ ] Database is properly configured

## Performance Optimization

-   [ ] Application is cached:
    -   [ ] `php artisan config:cache`
    -   [ ] `php artisan route:cache`
    -   [ ] `php artisan view:cache`
-   [ ] Assets are built: `npm run build`
-   [ ] Queue worker is running: `systemctl status hospipal-queue`
-   [ ] Cron job is set up: `crontab -l`

## Final Verification

-   [ ] Website is accessible via domain
-   [ ] All features work as expected
-   [ ] No errors in browser console
-   [ ] Mobile responsiveness works
-   [ ] Payment integration (if any) works
-   [ ] Email functionality works (if configured)

## Post-Deployment

-   [ ] Set up monitoring (optional)
-   [ ] Configure backups (recommended)
-   [ ] Document deployment process
-   [ ] Share access credentials securely
-   [ ] Plan for future updates

## Troubleshooting Commands

```bash
# Check service status
systemctl status nginx php8.2-fpm mysql

# Check logs
tail -f /var/log/nginx/error.log
tail -f /var/www/hospipal/storage/logs/laravel.log

# Test PHP
php -v
php artisan --version

# Test database
php artisan tinker
DB::connection()->getPdo();

# Check permissions
ls -la /var/www/hospipal
ls -la /var/www/hospipal/storage

# Restart services if needed
systemctl restart nginx php8.2-fpm mysql
```

## Success Criteria

-   [ ] Website loads without errors
-   [ ] All functionality works as expected
-   [ ] Database is properly connected
-   [ ] Assets are loading correctly
-   [ ] SSL certificate is valid (if configured)
-   [ ] Performance is acceptable
-   [ ] Security measures are in place

🎉 **Deployment Complete!** Your HospiPal booking system is now live on your Hetzner server!
