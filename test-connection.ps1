# Test SSH Connection Script
Write-Host "Testing SSH connection to Hostinger..." -ForegroundColor Yellow

$REMOTE_HOST = "82.25.125.114"
$REMOTE_USER = "u777170885"
$REMOTE_PORT = "65002"

Write-Host "Attempting to connect to $REMOTE_USER@$REMOTE_HOST port $REMOTE_PORT" -ForegroundColor Cyan

# Test basic SSH connection
try {
    $result = ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST "echo 'Connection successful'"
    Write-Host "✅ SSH connection successful!" -ForegroundColor Green
    Write-Host "You can now run the deployment script." -ForegroundColor Green
} catch {
    Write-Host "❌ SSH connection failed!" -ForegroundColor Red
    Write-Host "Please check your credentials and try again." -ForegroundColor Red
    Write-Host "You may need to enter your password manually." -ForegroundColor Yellow
}

Write-Host "`nTo deploy your application, run: .\deploy.ps1" -ForegroundColor Cyan 