# Check server files and permissions
Write-Host "🔍 Checking server files..." -ForegroundColor Yellow

$REMOTE_HOST = "82.25.125.114"
$REMOTE_USER = "u777170885"
$REMOTE_PORT = "65002"
$REMOTE_PATH = "/home/u777170885/domains/hospipalhealth.com/public_html/booking"

Write-Host "Listing files in booking directory..." -ForegroundColor Cyan

# List files on server
ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST "ls -la $REMOTE_PATH"

Write-Host "`nChecking if artisan file exists..." -ForegroundColor Cyan
ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST "ls -la $REMOTE_PATH/artisan"

Write-Host "`nChecking storage permissions..." -ForegroundColor Cyan
ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST "ls -la $REMOTE_PATH/storage" 