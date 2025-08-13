# Hostinger Git Deployment Script for Windows PowerShell
# This script will deploy your Laravel app to Hostinger

Write-Host "🚀 Starting deployment to Hostinger..." -ForegroundColor Green

# Configuration
$REMOTE_HOST = "82.25.125.114"
$REMOTE_USER = "u777170885"
$REMOTE_PORT = "65002"
$REMOTE_PATH = "/home/u777170885/domains/hospipalhealth.com/public_html/booking"

# Function to print colored output
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
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

Write-Status "Syncing files to Hostinger..."

# Create a temporary directory for the deployment
$TEMP_DIR = New-TemporaryFile | ForEach-Object { Remove-Item $_; New-Item -ItemType Directory -Path $_ }
Copy-Item -Path "." -Destination $TEMP_DIR -Recurse -Force

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

# Sync to Hostinger using scp
# Copy files directly to the booking directory, not into a subfolder
$scpCommand = "scp -P $REMOTE_PORT -r `"$TEMP_DIR\*`" $REMOTE_USER@$REMOTE_HOST`:$REMOTE_PATH/"
Write-Status "Running: $scpCommand"
Invoke-Expression $scpCommand

if ($LASTEXITCODE -eq 0) {
    Write-Status "Files synced successfully!"
    
    # Run post-deployment commands on the server
    $sshCommand = "ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST"
    $remoteCommands = @"
        cd /home/u777170885/domains/hospipalhealth.com/public_html/booking
        
        echo "🔄 Running Laravel maintenance tasks..."
        
        # Clear caches
        php artisan config:clear
        php artisan cache:clear
        php artisan route:clear
        php artisan view:clear
        
        # Run migrations (if any)
        php artisan migrate --force
        
        # Set proper permissions
        chmod -R 755 storage
        chmod -R 755 bootstrap/cache
        
        echo "✅ Deployment completed successfully!"
"@
    
    Write-Status "Running post-deployment tasks..."
    $remoteCommands | & ssh -p $REMOTE_PORT $REMOTE_USER@$REMOTE_HOST
    
    Write-Status "Deployment completed! 🎉"
} else {
    Write-Error "File sync failed!"
    exit 1
}

# Clean up
Remove-Item -Path $TEMP_DIR -Recurse -Force

Write-Status "Deployment script finished." 