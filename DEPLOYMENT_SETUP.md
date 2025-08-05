# Hostinger Deployment Setup Guide

## Prerequisites

-   Hostinger hosting account
-   SSH access enabled on your hosting plan
-   Your server details from Hostinger control panel

## Step 1: Get Your Server Details

1. Log into your Hostinger control panel
2. Go to **Hosting** → **Manage** → **Advanced** → **SSH Access**
3. Note down your:
    - **Server hostname** (e.g., `srv123.hostinger.com`)
    - **SSH username** (usually your hosting username)
    - **SSH port** (usually 22)

## Step 2: Update Deployment Script

Edit `deploy.sh` and replace the placeholder values:

```bash
REMOTE_HOST="your-actual-server-hostname.hostinger.com"
REMOTE_USER="your-hosting-username"
REMOTE_PATH="/home/your-username/domains/yourdomain.com/public_html/booking"
```

## Step 3: Set Up SSH Key Authentication

### Option A: Generate SSH Key (Recommended)

```bash
# Generate SSH key pair
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# Copy public key to clipboard (Windows)
clip < ~/.ssh/id_rsa.pub

# Or display it to copy manually
cat ~/.ssh/id_rsa.pub
```

### Option B: Use Password Authentication

If you prefer password authentication, you'll be prompted for your hosting password during deployment.

## Step 4: Add SSH Key to Hostinger

1. In Hostinger control panel, go to **SSH Access**
2. Click **Add SSH Key**
3. Paste your public key
4. Save the key

## Step 5: Test Connection

Test your SSH connection:

```bash
ssh your-username@your-server-hostname
```

## Step 6: Run Deployment

```bash
# Make script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

## Troubleshooting

### SSH Connection Issues

-   Verify your server hostname is correct
-   Check if SSH access is enabled on your hosting plan
-   Ensure your SSH key is properly added to Hostinger

### Permission Issues

-   Make sure the remote path exists
-   Check file permissions on the server
-   Verify your hosting username has write access

### Build Issues

-   Ensure Node.js and npm are installed locally
-   Check that all dependencies are properly installed
-   Verify your Laravel project structure is correct

## Security Notes

-   Never commit your `.env` file to version control
-   Keep your SSH private key secure
-   Use strong passwords for your hosting account
-   Regularly update your SSH keys
