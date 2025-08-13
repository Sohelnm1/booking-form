# Quick fix for 403 error
Write-Host "🔧 Quick fix for 403 error..." -ForegroundColor Yellow

# Connect to server and fix permissions
Write-Host "Connecting to server to fix permissions..." -ForegroundColor Cyan

# Use here-string to avoid quote issues
$commands = @"
cd /home/u777170885/domains/hospipalhealth.com/public_html/booking
echo "Setting permissions..."
chmod -R 755 storage
chmod -R 755 bootstrap/cache
chmod 755 artisan
echo "Creating .env if needed..."
if [ ! -f .env ]; then
    cp .env.example .env
    php artisan key:generate
fi
echo "Clearing caches..."
php artisan config:clear
php artisan cache:clear
echo "✅ Fixed!"
"@

$commands | ssh -p 65002 u777170885@82.25.125.114

Write-Host "`n✅ Fix completed! Try accessing your website now." -ForegroundColor Green 