#!/bin/bash
# VPS Setup Script for ScriptForge
# Run this script on your fresh Ubuntu VPS to install all required dependencies.

set -e

echo "=== Updating Package Index ==="
sudo apt update

echo "=== Installing System Dependencies (FFmpeg, Git, Curl, Fonts) ==="
sudo apt install -y git curl ffmpeg fonts-dejavu-core

echo "=== Installing Node.js 20 ==="
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

echo "=== Installing PM2 Process Manager ==="
sudo npm install -g pm2

echo "=== Verification ==="
echo "Node Version: $(node -v)"
echo "NPM Version: $(npm -v)"
echo "FFmpeg Version: $(ffmpeg -version | head -n 1)"
echo "PM2 Version: $(pm2 -v)"

echo "=============================================="
echo "Setup Complete! You can now clone the repository,"
echo "configure the backend .env, and deploy using PM2."
echo "=============================================="
