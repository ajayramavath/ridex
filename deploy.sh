#!/bin/bash

# --- Variables ---
REPO_URL="https://github.com/ajayramavath/ridex.git"
APP_DIR=~/ridex
SWAP_SIZE="1G"

# --- Update & Upgrade ---
sudo apt update && sudo apt upgrade -y

# --- Add Swap Space ---
echo "Adding swap space..."
sudo fallocate -l $SWAP_SIZE /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# --- Install Docker ---
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" -y
sudo apt update
sudo apt install -y docker-ce

# --- Install Docker Compose ---
sudo rm -f /usr/local/bin/docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.24.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
sudo ln -sf /usr/local/bin/docker-compose /usr/bin/docker-compose
docker-compose --version || { echo "Docker Compose installation failed"; exit 1; }

# --- Enable & start Docker ---
sudo systemctl enable docker
sudo systemctl start docker

# --- Clone or Update Repository ---
if [ -d "$APP_DIR" ]; then
  echo "Updating app repository..."
  cd "$APP_DIR" && git pull
else
  echo "Cloning app repository..."
  git clone "$REPO_URL" "$APP_DIR"
  cd "$APP_DIR"
fi
