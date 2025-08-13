# Simple Hostinger Deployment Script for Windows PowerShell
Write-Host "🚀 Starting deployment to Hostinger..." -ForegroundColor Green

# Configuration
$REMOTE_HOST = "82.25.125.114"
$REMOTE_USER = "u777170885"
$REMOTE_PORT = "65002"
$REMOTE_PATH = "/home/u777170885/domains/hospipalhealth.com/public_html/booking"

function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Check if we're in the right directory
if (-not (Test-Path "artisan")) {
    Write-Error "This doesn't look like a Laravel project. Make sure you're in the project root."
    exit 1
}

Write-Status "Building frontend assets..."
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Error "Frontend build failed!"
    exit 1
}

Write-Status "Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader

if ($LASTEXITCODE -ne 0) {
    Write-Error "Composer install failed!"
    exit 1
}

Write-Status "Creating deployment package..."

# Create a temporary directory
$TEMP_DIR = Join-Path $env:TEMP "deploy_$(Get-Date -Format 'yyyyMMdd_HHmmss')"
New-Item -ItemType Directory -Path $TEMP_DIR -Force | Out-Null

# Copy all files to temp directory
Copy-Item -Path "*" -Destination $TEMP_DIR -Recurse -Force

# Remove files that shouldn't be deployed
Set-Location $TEMP_DIR
Remove-Item -Path ".git" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "tests" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".env" -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".env.example" -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".gitignore" -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".editorconfig" -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".gitattributes" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "phpunit.xml" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "deploy.sh" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "deploy.ps1" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "deploy-simple.ps1" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "test-connection.ps1" -Force -ErrorAction SilentlyContinue

# Go back to original directory
Set-Location $PSScriptRoot

Write-Status "Uploading files to Hostinger..."

# Upload files using scp - copy contents of temp directory to remote
$scpCommand = "scp -P $REMOTE_PORT -r `"$TEMP_DIR\*`" $REMOTE_USER@$REMOTE_HOST`:$REMOTE_PATH/"
Write-Status "Running: $scpCommand"
Invoke-Expression $scpCommand

if ($LASTEXITCODE -eq 0) {
    Write-Status "Files uploaded successfully!"
    
    Write-Status "Running post-deployment tasks..."
    
    # Run Laravel commands on the server
    $remoteCommands = @"
        cd $REMOTE_PATH
        echo "🔄 Running Laravel maintenance tasks..."
        php artisan config:clear
        php artisan cache:clear
        php artisan route:clear
        php artisan view:clear
        php artisan migrate --force
        chmod -R 755 storage
        chmod -R 755 bootstrap/cache
        echo "✅ Deployment completed successfully!"
"@
    
    $remoteCommands | ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST
    
    Write-Status "Deployment completed! 🎉"
} else {
    Write-Error "File upload failed!"
    exit 1
}

# Clean up
Remove-Item -Path $TEMP_DIR -Recurse -Force -ErrorAction SilentlyContinue

Write-Status "Deployment script finished." 