# Simple server check
Write-Host "🔍 Checking server..." -ForegroundColor Yellow

# Check what's in the booking directory
Write-Host "Listing files in booking directory..." -ForegroundColor Cyan
ssh -p 65002 u777170885@82.25.125.114 "ls -la /home/u777170885/domains/hospipalhealth.com/public_html/booking"

Write-Host "`nChecking if artisan exists..." -ForegroundColor Cyan
ssh -p 65002 u777170885@82.25.125.114 "ls -la /home/u777170885/domains/hospipalhealth.com/public_html/booking/artisan"

Write-Host "`nChecking storage folder..." -ForegroundColor Cyan
ssh -p 65002 u777170885@82.25.125.114 "ls -la /home/u777170885/domains/hospipalhealth.com/public_html/booking/storage" 