# Fix Laravel permissions and configuration
Write-Host "🔧 Fixing Laravel permissions..." -ForegroundColor Yellow

$REMOTE_HOST = "82.25.125.114"
$REMOTE_USER = "u777170885"
$REMOTE_PORT = "65002"
$REMOTE_PATH = "/home/u777170885/domains/hospipalhealth.com/public_html/booking"

Write-Host "Setting correct file permissions..." -ForegroundColor Cyan

# Fix permissions and Laravel setup
$fixCommands = @"
    cd $REMOTE_PATH
    
    echo "Setting file permissions..."
    find . -type f -exec chmod 644 {} \;
    find . -type d -exec chmod 755 {} \;
    
    echo "Setting special permissions for Laravel..."
    chmod -R 755 storage
    chmod -R 755 bootstrap/cache
    chmod 755 artisan
    
    echo "Creating .env file if it doesn't exist..."
    if [ ! -f .env ]; then
        cp .env.example .env
        php artisan key:generate
    fi
    
    echo "Clearing Laravel caches..."
    php artisan config:clear
    php artisan cache:clear
    php artisan route:clear
    php artisan view:clear
    
    echo "Running migrations..."
    php artisan migrate --force
    
    echo "Setting ownership..."
    chown -R $REMOTE_USER:$REMOTE_USER .
    
    echo "✅ Permissions fixed!"
"@

Write-Host "Running fix commands..." -ForegroundColor Green
$fixCommands | ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST

Write-Host "`nChecking if .env file exists..." -ForegroundColor Cyan
$envCheck = "ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST 'ls -la $REMOTE_PATH/.env'"
Invoke-Expression $envCheck

Write-Host "`n✅ Permission fix completed!" -ForegroundColor Green
Write-Host "Try accessing your website now." -ForegroundColor Cyan 