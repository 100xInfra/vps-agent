#!/bin/bash

# Exit script on error
set -e

# Variables
APP_DIR="$HOME/infra-vps-agent"
REPO_URL="https://github.com/100xInfra/vps-agent.git"
BRANCH="main" 

# Color codes (Use \033 instead of \e for better compatibility)
GREEN="\033[1;32m"
YELLOW="\033[1;33m"
RED="\033[1;31m"
CYAN="\033[1;36m"
NC="\033[0m"

divider="--------------------------------------------------"

echo -e "\n${CYAN}$divider${NC}"
echo -e "${GREEN} 🚀 VPS Agent Installation Script ${NC}"
echo -e "${CYAN}$divider${NC}\n"

# Check if Homebrew is installed
echo -e "${YELLOW}🔍 Checking for Homebrew...${NC}"
if ! command -v brew &>/dev/null; then
    echo -e "${RED}❌ Homebrew not found! Installing Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo -e "${GREEN}✅ Homebrew is already installed.${NC}"
fi

# Install dependencies if not installed
echo -e "\n${YELLOW}🔄 Checking and installing required dependencies...${NC}"
for pkg in git curl unzip node; do
    if ! brew list --formula | grep -q "^${pkg}$"; then
        echo -e "${CYAN}➜ Installing $pkg...${NC}"
        brew install "$pkg"
    else
        echo -e "${GREEN}✔ $pkg is already installed.${NC}"
    fi
done

# Show installed versions
echo -e "\n${YELLOW}🛠 Installed Versions:${NC}"
echo -e "${CYAN}➜ Node.js: $(node -v)${NC}"
echo -e "${CYAN}➜ NPM: $(npm -v)${NC}"

# Clone or update the repository
echo -e "\n${YELLOW}📂 Setting up the VPS Agent...${NC}"
if [ -d "$APP_DIR" ]; then
    echo -e "${RED}⚠ Existing installation found! Removing old files...${NC}"
    rm -rf "$APP_DIR"
fi
echo -e "${CYAN}➜ Cloning repository from $REPO_URL...${NC}"
git clone --branch $BRANCH $REPO_URL "$APP_DIR"
cd "$APP_DIR"

# Install project dependencies
echo -e "\n${YELLOW}📦 Installing project dependencies...${NC}"
npm install

# Build the project
echo -e "\n${YELLOW}⚙ Building the application...${NC}"
npm run build

# Set up logging directories
echo -e "\n${YELLOW}📁 Setting up logging directories...${NC}"
mkdir -p logs
chmod -R 777 logs
echo -e "${GREEN}✔ Logs directory created at $APP_DIR/logs${NC}"

# Install PM2
echo -e "\n${YELLOW}🚀 Installing PM2 for process management...${NC}"
npm install -g pm2

# Start the application with PM2
echo -e "\n${YELLOW}🚀 Starting the VPS Agent with PM2...${NC}"
pm2 start ecosystem.js
pm2 save
pm2 startup

echo -e "\n${CYAN}$divider${NC}"
echo -e "${GREEN}🎉 Installation Complete! VPS Agent is now running.${NC}"
echo -e "${CYAN}$divider${NC}\n"

echo -e "${YELLOW}🔎 Useful PM2 Commands:${NC}"
echo -e "${CYAN}➜ View logs: pm2 logs vps-agent${NC}"
echo -e "${CYAN}➜ Check running processes: pm2 list${NC}"
echo -e "${CYAN}➜ Restart the app: pm2 restart vps-agent${NC}"
echo -e "${CYAN}➜ Stop the app: pm2 stop vps-agent${NC}"
echo -e "${CYAN}➜ Delete the app: pm2 delete vps-agent${NC}"

echo -e "\n${GREEN}✅ VPS Agent is successfully installed and running.${NC}"