# 🚀 Git Deployment to Hostinger Setup Guide

## Overview

This guide will help you connect your Git repository to your Hostinger hosting account for automated deployments.

## 🔧 **Method 1: GitHub Actions (Recommended)**

### Step 1: Set up SSH Key Authentication

1. **Generate SSH Key Pair** (if you don't have one):

    ```bash
    ssh-keygen -t rsa -b 4096 -C "your-email@example.com"
    ```

2. **Add Public Key to Hostinger**:

    - Copy your public key: `cat ~/.ssh/id_rsa.pub`
    - Go to Hostinger Control Panel → Advanced → SSH Access
    - Add your public key

3. **Add Private Key to GitHub Secrets**:
    - Go to your GitHub repository → Settings → Secrets and variables → Actions
    - Add these secrets:
        - `SSH_PRIVATE_KEY`: Your private key content
        - `REMOTE_HOST`: Your Hostinger server (e.g., `in-mum-web1948.hostinger.com`)
        - `REMOTE_USER`: Your Hostinger username (e.g., `u777170885`)
        - `REMOTE_PATH`: Your project path (e.g., `/home/u777170885/domains/hospipalhealth.com/public_html/booking`)

### Step 2: Configure the Workflow

The GitHub Actions workflow (`.github/workflows/deploy.yml`) is already configured. It will:

-   Build your Laravel application
-   Deploy to Hostinger via SSH
-   Run Laravel maintenance commands

### Step 3: Test Deployment

1. Push to your main branch:

    ```bash
    git add .
    git commit -m "Initial deployment setup"
    git push origin main
    ```

2. Check GitHub Actions tab to see deployment progress

## 🔧 **Method 2: Local Git Hooks**

### Step 1: Configure SSH Access

1. **Set up SSH config** (`~/.ssh/config`):

    ```
    Host hostinger
        HostName in-mum-web1948.hostinger.com
        User u777170885
        Port 22
        IdentityFile ~/.ssh/id_rsa
    ```

2. **Test SSH connection**:
    ```bash
    ssh hostinger
    ```

### Step 2: Update Deployment Script

Edit `deploy.sh` with your actual Hostinger details:

```bash
REMOTE_HOST="in-mum-web1948.hostinger.com"
REMOTE_USER="u777170885"
REMOTE_PATH="/home/u777170885/domains/hospipalhealth.com/public_html/booking"
```

### Step 3: Make Script Executable

```bash
chmod +x deploy.sh
chmod +x .git/hooks/post-commit
```

### Step 4: Test Manual Deployment

```bash
./deploy.sh
```

## 🔧 **Method 3: Manual Deployment**

### Step 1: Build Locally

```bash
# Install dependencies
composer install --no-dev --optimize-autoloader
npm install
npm run build

# Create deployment package
tar -czf deployment.tar.gz \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='tests' \
    --exclude='.env' \
    --exclude='.env.example' \
    --exclude='.gitignore' \
    .
```

### Step 2: Upload to Hostinger

1. **Via File Manager**:

    - Upload `deployment.tar.gz` to your Hostinger directory
    - Extract the archive
    - Remove the archive file

2. **Via FTP/SFTP**:
    ```bash
    scp deployment.tar.gz hostinger:/home/u777170885/domains/hospipalhealth.com/public_html/booking/
    ssh hostinger "cd /home/u777170885/domains/hospipalhealth.com/public_html/booking && tar -xzf deployment.tar.gz && rm deployment.tar.gz"
    ```

### Step 3: Run Laravel Commands

SSH into your Hostinger server and run:

```bash
cd /home/u777170885/domains/hospipalhealth.com/public_html/booking
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear
php artisan migrate --force
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

## 🔧 **Method 4: Hostinger Git Integration**

### Step 1: Enable Git in Hostinger

1. Go to Hostinger Control Panel → Advanced → Git
2. Click "Create Repository"
3. Choose your repository type (GitHub, GitLab, etc.)
4. Connect your Git account

### Step 2: Configure Auto-Deploy

1. Set your repository URL
2. Choose the branch to deploy (usually `main` or `master`)
3. Set the deployment path
4. Configure build commands:
    ```bash
    composer install --no-dev --optimize-autoloader
    npm install
    npm run build
    php artisan config:clear
    php artisan cache:clear
    php artisan migrate --force
    ```

## 📋 **Environment Configuration**

### Create `.env` file on Hostinger:

```env
APP_NAME="Booking Platform"
APP_ENV=production
APP_KEY=base64:YOUR_APP_KEY_HERE
APP_DEBUG=false
APP_URL=https://your-subdomain.hospipalhealth.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=your_database_name
DB_USERNAME=your_database_user
DB_PASSWORD=your_database_password

MAIL_MAILER=smtp
MAIL_HOST=mail.hospipalhealth.com
MAIL_PORT=587
MAIL_USERNAME=noreply@hospipalhealth.com
MAIL_PASSWORD=your_email_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="noreply@hospipalhealth.com"
MAIL_FROM_NAME="${APP_NAME}"
```

## 🔒 **Security Considerations**

1. **Never commit sensitive files**:

    - `.env` files
    - API keys
    - Database credentials

2. **Use environment variables** for sensitive data

3. **Set proper file permissions**:
    ```bash
    chmod 644 .env
    chmod -R 755 storage
    chmod -R 755 bootstrap/cache
    ```

## 🚨 **Troubleshooting**

### Common Issues:

1. **SSH Connection Failed**:

    - Verify SSH key is added to Hostinger
    - Check server hostname and username
    - Test SSH connection manually

2. **Permission Denied**:

    - Ensure proper file permissions
    - Check Hostinger file permissions settings

3. **Build Failures**:

    - Verify Node.js and Composer are available
    - Check for missing dependencies

4. **Database Migration Errors**:
    - Ensure database credentials are correct
    - Check database connection

## 📞 **Support**

If you encounter issues:

1. Check Hostinger's Git documentation
2. Review GitHub Actions logs
3. Test SSH connection manually
4. Contact Hostinger support for server-specific issues

---

**Choose the method that best fits your workflow!** 🎯
