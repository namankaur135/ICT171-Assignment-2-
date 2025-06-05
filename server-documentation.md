# ICT 171 Assignment 2 - Cloud Server Project

**Student:** Namanjot Kaur  
**Student ID:** 35101497  
**Website URL:** [https://eventx.social](https://eventx.social)  
**Public IP Address:** 172.184.153.90

---

## 🚀 Quick Access

- **Live Website:** [https://eventx.social](https://eventx.social)
- **GitHub Repository:** [ICT171-Assignment-2](https://github.com/namankaur135/ICT171-Assignment-2-)
- **Server IP:** 172.184.153.90

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Project Overview](#project-overview)
3. [Infrastructure Requirements](#infrastructure-requirements)
4. [Initial Azure VM Setup](#initial-azure-vm-setup)
5. [System Configuration and Updates](#system-configuration-and-updates)
6. [Web Server Installation and Configuration](#web-server-installation-and-configuration)
7. [Domain Configuration and DNS Management](#domain-configuration-and-dns-management)
8. [SSL Certificate Implementation](#ssl-certificate-implementation)
9. [GitHub Integration and Version Control](#github-integration-and-version-control)
10. [Automation Script](#automation-script)
11. [Security Configuration](#security-configuration)
12. [Troubleshooting Guide](#troubleshooting-guide)

---

## Executive Summary

This document provides comprehensive documentation for the manual deployment of a web server using Microsoft Azure's Infrastructure as a Service (IaaS) platform. The project demonstrates proficiency in Linux command-line operations, server configuration, domain management, SSL implementation, and version control using GitHub. The server hosts a static website accessible at **https://eventx.social**, configured entirely through manual setup without pre-built templates or bundles.

---

## Project Overview

### 🎯 Objective

Deploy a production-ready web server using Azure IaaS to host a static website with custom domain and SSL encryption, demonstrating manual server configuration skills without relying on pre-configured templates.

### 🏗️ Architecture Overview

| Component | Technology |
|-----------|------------|
| **Cloud Provider** | Microsoft Azure |
| **Virtual Machine** | Ubuntu 22.04 LTS |
| **Web Server** | NGINX |
| **Domain Registrar** | GoDaddy |
| **SSL Provider** | Let's Encrypt |
| **Version Control** | GitHub |
| **Development Environment** | Visual Studio Code |

### ✨ Key Features Implemented

- ✅ Manual Linux server configuration
- ✅ Custom domain integration (eventx.social)
- ✅ SSL/TLS encryption with automatic renewal
- ✅ Firewall configuration for enhanced security
- ✅ GitHub-based deployment workflow
- ✅ Comprehensive logging and monitoring

---

## Infrastructure Requirements

### Azure Resource Specifications

**Virtual Machine Configuration:**
- **Size:** Standard D2s v3 (2 vcpus, 8 GiB memory)
- **Operating System:** Linux (Ubuntu 22.04)
- **Storage:** 30 GiB Premium SSD
- **Networking:** Standard public IP with SSH access
- **Location:** West US

### Network Configuration

- **Public IP:** 172.184.153.90 (Static allocation)
- **Inbound Ports:** 22 (SSH), 80 (HTTP), 443 (HTTPS)
- **Network Security Group:** Custom rules for web traffic (eventx-nsg)

### Domain Requirements

- **Primary Domain:** eventx.social
- **Subdomain Support:** www.eventx.social
- **DNS Provider:** GoDaddy with custom A records

---

## Initial Azure VM Setup

### Step 1: Creating the Virtual Machine

#### Azure Portal Navigation:
1. Navigate to Azure Portal (portal.azure.com)
2. Select "Virtual machines" from the main menu
3. Click "Create" → "Azure virtual machine"

#### Basic Configuration:
```yaml
# VM Configuration Details
Resource Group: eventx
Virtual Machine Name: eventx
Region: West US
Availability Options: No infrastructure redundancy required
Security Type: Standard
Image: Ubuntu Server 22.04 LTS
VM Architecture: x64
Size: Standard D2s v3 (2 vcpus, 8 GiB memory)
```

#### Authentication Setup:
```yaml
# SSH Key Configuration
Authentication Type: SSH public key
Username: azureuser
SSH Public Key Source: Generate new key pair
Key Pair Name: eventx_key
```

#### Networking Configuration:
```yaml
# Network Settings
Virtual Network: (new) eventx-vnet
Subnet: (new) default(10.0.0.0/24)
Public IP: eventx-ip (new, static)
```

### Step 2: Initial Connection and Authentication

#### Downloading SSH Keys:
After VM creation, Azure provides the private key file. Store securely and set appropriate permissions:

```bash
# On local machine (if using Linux/macOS)
chmod 600 ~/Downloads/eventx_key.pem

# Initial SSH connection
ssh -i ~/Downloads/eventx_key.pem azureuser@172.184.153.90
```

#### First Connection Verification:
```bash
azureuser@eventx-web-server:~$ uname -a
Linux eventx 6.8.0-1029-azure #34~22.04.1-Ubuntu SMP Thu May 1 02:51:54 UTC 2025 x86_64 x86_64 x86_64 GNU/Linux
```

---

## System Configuration and Updates

### Step 3: System Updates and Package Management

#### Initial System Update:
```bash
# Update package repository
sudo apt update

# Upgrade all installed packages
sudo apt upgrade -y
```

#### System Information Verification:
```bash
# Check system information
hostnamectl
```

**Expected Output:**
```
Static hostname: eventx
Icon name: computer-vm
Chassis: vm
Machine ID: 179e5c5032e9489ba549644023357292
Boot ID: f9b24b88a600411883f1e8ef06abd2fd
Virtualization: microsoft
Operating System: Ubuntu 22.04.5 LTS
Kernel: Linux 6.8.0-1029-azure
Architecture: x86-64
Hardware Vendor: Microsoft Corporation
Hardware Model: Virtual Machine
```

### Step 4: User and Permission Configuration

#### Adding User to Sudo Group:
```bash
# Verify current user permissions
groups azureuser

# Expected output:
# azureuser : azureuser adm dialout cdrom floppy sudo audio dip video plugdev netdev lxd
```

---

## Web Server Installation and Configuration

### Step 5: NGINX Installation

#### Installing NGINX:
```bash
# Install NGINX web server
sudo apt install nginx -y

# Verify installation
nginx -v
# Output: nginx version: nginx/1.18.0 (Ubuntu)
```

#### NGINX Service Management:
```bash
# Start NGINX service
sudo systemctl start nginx

# Enable NGINX to start on boot
sudo systemctl enable nginx

# Check service status
sudo systemctl status nginx
```

### Step 6: Initial NGINX Configuration

#### Testing Default Configuration:
```bash
# Test NGINX configuration syntax
sudo nginx -t

# Expected output:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration file /etc/nginx/nginx.conf test is successful
```

#### Understanding NGINX Directory Structure:
```bash
# Navigate to NGINX configuration directory
cd /etc/nginx

# List directory structure
ls -la
```

**Key directories and files:**
```
drwxr-xr-x 2 root root 4096 Feb 14 18:40 conf.d
drwxr-xr-x 2 root root 4096 Jun 2 13:49 sites-available
drwxr-xr-x 2 root root 4096 Jun 2 04:54 sites-enabled
drwxr-xr-x 2 root root 4096 Jun 1 16:50 snippets
-rw-r--r-- 1 root root 1447 May 30 2023 nginx.conf
```

### Step 7: Creating Custom Site Configuration

#### Preparing Website Directory:
```bash
# Create directory for website files
sudo mkdir -p /var/www/eventx.social

# Set appropriate ownership
sudo chown -R azureuser:azureuser /var/www/eventx.social

# Set appropriate permissions
sudo chmod -R 755 /var/www/eventx.social
```

#### Creating Site Configuration File:
```bash
# Create new site configuration
sudo nano /etc/nginx/sites-available/eventx.social
```

#### NGINX Site Configuration Content:
```nginx
server {
    server_name eventx.social www.eventx.social;
    root /var/www/ICT171-Assignment-2-;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ /.well-known/acme-challenge/ {
        allow all;
        root /var/www/ICT171-Assignment-2-/;
    }

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/eventx.social/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/eventx.social/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = www.eventx.social) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = eventx.social) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name eventx.social www.eventx.social;
    return 404; # managed by Certbot
}
```

#### Enabling the Site:
```bash
# Create symbolic link to enable site
sudo ln -s /etc/nginx/sites-available/eventx.social /etc/nginx/sites-enabled/

# Remove default site configuration
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload NGINX configuration
sudo systemctl reload nginx
```

---

## Domain Configuration and DNS Management

### Step 8: DNS Configuration with GoDaddy

#### Accessing GoDaddy DNS Management:
1. Log in to GoDaddy account
2. Follow some simple steps to buy your domain according to your wish
3. Navigate to "My Products" → "Domains"
4. Click "DNS" next to eventx.social domain

#### Creating A Records:
```yaml
# Primary domain A record
Type: A
Name: @
Value: 172.184.153.90
TTL: 1/2 Hour
```

#### Verifying DNS Propagation:
```bash
# Test DNS resolution from server
nslookup eventx.social

# Test DNS resolution with specific DNS server
nslookup eventx.social 8.8.8.8

# Use dig for detailed DNS information
dig eventx.social A +short
# Expected output: 172.184.153.90
```

### Step 9: Testing Domain Connectivity

#### HTTP Connectivity Tests:
```bash
# Test local connectivity
curl -I http://localhost

# Test domain connectivity from server
curl -I http://eventx.social

# Test from external location
curl -I http://eventx.social -H "Host: eventx.social"
```

#### Expected HTTP Response Headers:
```http
HTTP/1.1 200 OK
Server: nginx/1.18.0 (Ubuntu)
Date: Tue, 03 Jun 2025 16:27:27 GMT
Content-Type: text/html
Content-Length: 178
Last-Modified: [last-modified-date]
Connection: keep-alive
Location: https://eventx.social/
```

---

## SSL Certificate Implementation

### Step 10: Installing Certbot

#### Certbot Installation:
```bash
# Install Certbot and NGINX plugin
sudo apt install certbot python3-certbot-nginx -y

# Verify Certbot installation
certbot --version
# Expected output: certbot 1.21.0
```

### Step 11: Obtaining SSL Certificate

#### Running Certbot for NGINX:
```bash
# Obtain and install SSL certificate
sudo certbot --nginx -d eventx.social -d www.eventx.social
```

**Interactive prompts and responses:**
- Enter email address: [your-email@domain.com]
- Agree to terms of service: Y
- Share email with EFF: N (optional)
- Select redirect option: 2 (Redirect HTTP to HTTPS)

### Step 12: Verifying Updated NGINX Configuration

#### Reviewing Certbot-Modified Configuration:
```bash
# View updated NGINX configuration
sudo cat /etc/nginx/sites-available/eventx.social
```

#### Updated Configuration (Post-Certbot):
```nginx
server {
    server_name eventx.social www.eventx.social;
    root /var/www/eventx.social;
    index index.html index.htm index.nginx-debian.html;

    access_log /var/log/nginx/eventx.social.access.log;
    error_log /var/log/nginx/eventx.social.error.log;

    location / {
        try_files $uri $uri/ =404;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    listen [::]:443 ssl ipv6only=on; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/eventx.social/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/eventx.social/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = www.eventx.social) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = eventx.social) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    listen [::]:80;
    server_name eventx.social www.eventx.social;
    return 404; # managed by Certbot
}
```

### Step 13: SSL Certificate Verification

#### Testing SSL Configuration:
```bash
# Test SSL certificate
sudo certbot certificates
```

**Expected output:**
```
Found the following certs:
Certificate Name: eventx.social
Serial Number: 60b23aa714b47ac6c410d60db64ee4ff0c9
Key Type: RSA
Domains: eventx.social www.eventx.social
Expiry Date: 2025-08-31 06:51:54+00:00 (VALID: 88 days)
Certificate Path: /etc/letsencrypt/live/eventx.social/fullchain.pem
Private Key Path: /etc/letsencrypt/live/eventx.social/privkey.pem
```

#### SSL Connectivity Tests:
```bash
# Test HTTPS connectivity
curl -I https://eventx.social

# Test SSL certificate details
openssl s_client -connect eventx.social:443 -servername eventx.social < /dev/null
```

#### Setting Up Automatic Renewal:
```bash
# Test automatic renewal
sudo certbot renew --dry-run

# Expected output:
# Congratulations, all simulated renewals succeeded:
# /etc/letsencrypt/live/eventx.social/fullchain.pem (success)
```

---

## GitHub Integration and Version Control

### Step 14: Local Development Setup

#### Creating Local Repository:
```bash
# On local development machine
mkdir ICT171-Assignment-2-
cd ICT171-Assignment-2-

# Initialize Git repository
git init
```

### Step 15: GitHub Repository Setup

#### Creating GitHub Repository:
```bash
# Add files to Git
git add .
git commit -m "Initial commit: EventX Social website setup"

# Create repository on GitHub
# Repository name: ICT171-Assignment-2-

# Add remote origin
git remote add origin https://github.com/namankaur135/ICT171-Assignment-2-.git

# Push to GitHub
git push -u origin main
```

### Step 16: Deploying to Server

#### Cloning Repository on Server:
```bash
# SSH into Azure VM
ssh -i ~/Downloads/eventx_key.pem azureuser@172.184.153.90

# Navigate to web directory
cd /var/www

# Clone repository
sudo git clone https://github.com/namankaur135/ICT171-Assignment-2-.git eventx.social

# Set proper ownership and permissions
sudo chown -R azureuser:azureuser /var/www/eventx.social
sudo chmod -R 755 /var/www/eventx.social
```

---

## Automation Script

### Step 17: Creating Automation Script

#### Creating Deployment Script:
```bash
# Navigate to Your Project Directory
cd /var/www/ICT171-Assignment-2-

# Create Scripts Directory
mkdir -p .scripts
ls -la

# Navigate to Scripts Directory
cd .scripts

# Create the Script File
nano deploy.sh
```

#### Script Content:
```bash
#!/bin/bash
# EventX Social Deployment Script
# Purpose: Automatically deploy updates from GitHub
# Author: Namanjot Kaur
# Date: June 2025

# Enable strict error handling
set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Start deployment
echo "=================================================="
print_status "🚀 EventX Social Deployment Started"
print_status "Timestamp: $(date)"
echo "=================================================="

# Navigate to project directory
PROJECT_DIR="/var/www/ICT171-Assignment-2-"
print_status "📁 Navigating to project directory: $PROJECT_DIR"

if [ ! -d "$PROJECT_DIR" ]; then
    print_error "Project directory does not exist: $PROJECT_DIR"
    exit 1
fi

cd "$PROJECT_DIR"
print_status "✅ Successfully navigated to project directory"

# Check if git repository exists
if [ ! -d ".git" ]; then
    print_error "Not a git repository. Please initialize git first."
    exit 1
fi

# Backup current state (optional)
print_status "💾 Creating backup of current state"
BACKUP_DIR="/var/backups/eventx-$(date +%Y%m%d-%H%M%S)"
sudo mkdir -p "$BACKUP_DIR"
sudo cp -r . "$BACKUP_DIR/"
print_success "Backup created at: $BACKUP_DIR"

# Fetch latest changes from remote
print_status "🔄 Fetching latest changes from GitHub"
git fetch origin

# Check for updates
LOCAL_COMMIT=$(git rev-parse HEAD)
REMOTE_COMMIT=$(git rev-parse origin/main)

if [ "$LOCAL_COMMIT" = "$REMOTE_COMMIT" ]; then
    print_warning "No new changes detected. Deployment not needed."
    echo "Current commit: $LOCAL_COMMIT"
else
    print_status "📥 New changes detected. Pulling updates..."
    echo "Local commit: $LOCAL_COMMIT"
    echo "Remote commit: $REMOTE_COMMIT"
    
    # Pull latest changes
    git pull origin main
    print_success "Successfully pulled latest changes from GitHub"
fi

# Test Nginx configuration
print_status "🔧 Testing Nginx configuration"
if sudo nginx -t; then
    print_success "Nginx configuration is valid"
else
    print_error "Nginx configuration test failed"
    print_warning "Restoring from backup..."
    sudo cp -r "$BACKUP_DIR/"* .
    exit 1
fi

# Reload Nginx service
print_status "🔄 Reloading Nginx service"
if sudo systemctl reload nginx; then
    print_success "Nginx service reloaded successfully"
else
    print_error "Failed to reload Nginx service"
    exit 1
fi

# Verify Nginx is running
print_status "✅ Verifying Nginx status"
if systemctl is-active --quiet nginx; then
    print_success "Nginx is running successfully"
else
    print_error "Nginx is not running properly"
    sudo systemctl status nginx
    exit 1
fi

# Test website accessibility
print_status "🌐 Testing website accessibility"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost)

if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "301" ] || [ "$HTTP_STATUS" = "302" ]; then
    print_success "Website is accessible (HTTP Status: $HTTP_STATUS)"
else
    print_warning "Website may have issues (HTTP Status: $HTTP_STATUS)"
fi

# Log deployment
LOG_FILE="/var/log/eventx-deployments.log"
DEPLOY_LOG="$(date): Deployment completed successfully - Commit: $(git rev-parse --short HEAD)"
echo "$DEPLOY_LOG" | sudo tee -a "$LOG_FILE" > /dev/null

# Display final status
echo "=================================================="
print_success "🎉 Deployment completed successfully!"
print_status "🌐 Website: https://eventx.social"
print_status "📊 Current commit: $(git rev-parse --short HEAD)"
print_status "📝 Log entry added to: $LOG_FILE"
print_status "💾 Backup available at: $BACKUP_DIR"
echo "=================================================="

# Optional: Clean up old backups (keep last 5)
print_status "🧹 Cleaning up old backups (keeping last 5)"
sudo find /var/backups -name "eventx-*" -type d | sort | head -n -5 | sudo xargs rm -rf
print_success "Backup cleanup completed"

echo ""
print_success "Deployment process finished. Your website should now be updated!"
```

#### Make Script Executable and Test:
```bash
# Make Script Executable
chmod +x deploy.sh

# Final testing
./deploy.sh
```

---

## Security Configuration

### Step 18: Firewall Configuration

#### UFW Firewall Setup:
```bash
# Check UFW status
sudo ufw status

# Allow SSH (if not already allowed)
sudo ufw allow OpenSSH

# Allow HTTP traffic
sudo ufw allow 'Nginx HTTP'

# Allow HTTPS traffic
sudo ufw allow 'Nginx HTTPS'

# Enable UFW
sudo ufw --force enable

# Verify firewall rules
sudo ufw status verbose
```

#### Expected UFW Status Output:
```
Status: active
Logging: on (low)
Default: deny (incoming), allow (outgoing), disabled (routed)
New profiles: skip

To                         Action      From
--                         ------      ----
80/tcp                     ALLOW IN    Anywhere
22/tcp (OpenSSH)           ALLOW IN    Anywhere
80,443/tcp (Nginx Full)    ALLOW IN    Anywhere
80                         ALLOW IN    Anywhere
443                        ALLOW IN    Anywhere
80/tcp (Nginx HTTP)        ALLOW IN    Anywhere
80/tcp (v6)                ALLOW IN    Anywhere (v6)
22/tcp (OpenSSH (v6))      ALLOW IN    Anywhere (v6)
80,443/tcp (Nginx Full (v6)) ALLOW IN    Anywhere (v6)
80 (v6)                    ALLOW IN    Anywhere (v6)
443 (v6)                   ALLOW IN    Anywhere (v6)
80/tcp (Nginx HTTP (v6))   ALLOW IN    Anywhere (v6)
```

### Step 19: SSH Security Hardening

#### Configuring SSH Security:
```bash
# Backup original SSH configuration
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Edit SSH configuration
sudo nano /etc/ssh/sshd_config
```

#### Applying SSH Configuration:
```bash
# Test SSH configuration
sudo sshd -t

# Restart SSH service
sudo systemctl restart ssh

# Verify SSH service status
sudo systemctl status ssh
```

### Step 20: Comprehensive Testing

#### Connectivity Tests:
```bash
# Test HTTP to HTTPS redirect
curl -I http://eventx.social

# Expected response:
# HTTP/1.1 301 Moved Permanently
# Location: https://eventx.social/

# Test HTTPS connectivity
curl -I https://eventx.social

# Expected response:
# HTTP/1.1 200 OK
# Server: nginx/1.18.0 (Ubuntu)
```

#### SSL Certificate Validation:
```bash
# Check SSL certificate expiration
echo | openssl s_client -servername eventx.social -connect eventx.social:443 2>/dev/null | openssl x509 -noout -dates

# Expected output:
# notBefore=Jun 2 06:51:55 2025 GMT
# notAfter=Aug 31 06:51:54 2025 GMT
```

#### Performance Testing:
```bash
# Test website load time
time curl -s https://eventx.social > /dev/null
```

---

## Troubleshooting Guide

### Step 21: Common Issues and Solutions

#### Issue 1: NGINX Won't Start
```bash
# Check NGINX configuration syntax
sudo nginx -t

# Check port conflicts
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

**Common solutions:**
- Fix configuration syntax errors
- Kill processes using ports 80/443
- Check file permissions in web directory

#### Issue 2: SSL Certificate Problems
```bash
# Check certificate status
sudo certbot certificates

# Test certificate renewal
sudo certbot renew --dry-run

# Check certificate files
sudo ls -la /etc/letsencrypt/live/eventx.social/
```

**Common solutions:**
- Ensure domain points to correct IP
- Check firewall allows HTTP/HTTPS
- Verify NGINX configuration includes SSL settings

#### Issue 3: Website Not Accessible
```bash
# Check DNS resolution
nslookup eventx.social
dig eventx.social

# Check NGINX status
sudo systemctl status nginx

# Check firewall rules
sudo ufw status

# Test local connectivity
curl -I http://localhost
curl -I https://localhost
```

**Common solutions:**
- Update DNS A records
- Restart NGINX service
- Configure firewall rules
- Check Azure Network Security Group settings

---

## 📞 Support and Contact

For technical support or questions regarding this server setup:

- **Student:** Namanjot Kaur
- **Email:** 35101497@student.murdoch.edu.au
- **Website:** [https://eventx.social](https://eventx.social)
- **Repository:** [GitHub - ICT171-Assignment-2](https://github.com/namankaur135/ICT171-Assignment-2-)

---

## 📄 License

This project is created for educational purposes as part of ICT 171 Assignment 2 at Murdoch University.

---

*Last updated: June 2025*