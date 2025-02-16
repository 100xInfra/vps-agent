#!/bin/bash

# Exit script on error
set -e

# Variables
APP_DIR="$HOME/infra-vps-agent"
REPO_URL="https://github.com/100xInfra/vps-agent.git"
BRANCH="main" 

# Color codes (Use \033 instead of \e)
GREEN="\033[1;32m"
RED="\033[1;31m"
NC="\033[0m"

echo -e "${GREEN}Checking and installing required dependencies...${NC}"

# Check if Homebrew is installed
if ! command -v brew &>/dev/null; then
    echo -e "${RED}Homebrew not found! Installing Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo -e "${GREEN}Homebrew is already installed.${NC}"
fi

# Install dependencies if not installed
for pkg in git curl unzip node; do
    if ! brew list --formula | grep -q "^${pkg}$"; then
        echo -e "${GREEN}Installing $pkg...${NC}"
        brew install "$pkg"
    else
        echo -e "${GREEN}$pkg is already installed.${NC}"
    fi
done

# Show installed versions
echo -e "${GREEN}Node.js version: $(node -v)${NC}"
echo -e "${GREEN}NPM version: $(npm -v)${NC}"

echo -e "${GREEN}Cloning the repository...${NC}"
if [ -d "$APP_DIR" ]; then
    echo -e "${RED}Existing installation found! Removing...${NC}"
    rm -rf "$APP_DIR"
fi
git clone --branch $BRANCH $REPO_URL "$APP_DIR"
cd "$APP_DIR"

echo -e "${GREEN}Installing project dependencies...${NC}"
npm install

echo -e "${GREEN}Building the application...${NC}"
npm run build

echo -e "${GREEN}Setting up logging directories...${NC}"
mkdir -p logs
chmod -R 777 logs

echo -e "${GREEN}Installing PM2 for process management...${NC}"
npm install -g pm2

echo -e "${GREEN}Starting application with PM2...${NC}"
pm2 start ecosystem.js

pm2 save
pm2 startup

echo -e "${GREEN}Installation complete! VPS Agent is now running.${NC}"
echo -e "Use ${GREEN}pm2 logs vps-agent${NC} to view logs."