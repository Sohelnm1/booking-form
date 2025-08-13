# Cleanup script to remove the incorrectly created booking_website folder
Write-Host "🧹 Cleaning up server..." -ForegroundColor Yellow

$REMOTE_HOST = "82.25.125.114"
$REMOTE_USER = "u777170885"
$REMOTE_PORT = "65002"
$REMOTE_PATH = "/home/u777170885/domains/hospipalhealth.com/public_html/booking"

Write-Host "Removing booking_website folder from server..." -ForegroundColor Cyan

# Remove the booking_website folder that was incorrectly created
$cleanupCommand = "ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST 'rm -rf $REMOTE_PATH/booking_website'"
Write-Host "Running: $cleanupCommand"
Invoke-Expression $cleanupCommand

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Cleanup completed! booking_website folder removed." -ForegroundColor Green
    Write-Host "You can now run the deployment script: .\deploy-simple.ps1" -ForegroundColor Cyan
} else {
    Write-Host "❌ Cleanup failed!" -ForegroundColor Red
} 