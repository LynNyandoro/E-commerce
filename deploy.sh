#!/bin/bash

# Art E-commerce Deployment Script
# This script helps deploy the application to GitHub Pages and Heroku

set -e

echo "🚀 Starting Art E-commerce deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ] && [ ! -d "frontend" ] && [ ! -d "backend" ]; then
    echo -e "${RED}❌ Error: Please run this script from the project root directory${NC}"
    exit 1
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo -e "${YELLOW}🔍 Checking prerequisites...${NC}"

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed. Please install npm first.${NC}"
    exit 1
fi

if ! command_exists git; then
    echo -e "${RED}❌ Git is not installed. Please install Git first.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Prerequisites check passed${NC}"

# Function to deploy frontend
deploy_frontend() {
    echo -e "${YELLOW}🎨 Building and deploying frontend...${NC}"
    
    cd frontend
    
    # Install dependencies
    echo "📦 Installing frontend dependencies..."
    npm ci
    
    # Build the application
    echo "🔨 Building frontend..."
    npm run build
    
    # Check if build was successful
    if [ ! -d "build" ]; then
        echo -e "${RED}❌ Frontend build failed${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Frontend build completed${NC}"
    
    # Instructions for GitHub Pages
    echo -e "${YELLOW}📝 To deploy to GitHub Pages:${NC}"
    echo "1. Push your code to GitHub"
    echo "2. Enable GitHub Pages in repository settings"
    echo "3. Set source to 'GitHub Actions'"
    echo "4. The workflow will automatically deploy your frontend"
    
    cd ..
}

# Function to deploy backend
deploy_backend() {
    echo -e "${YELLOW}⚙️ Preparing backend for deployment...${NC}"
    
    cd backend
    
    # Install dependencies
    echo "📦 Installing backend dependencies..."
    npm ci
    
    # Check if Procfile exists
    if [ ! -f "Procfile" ]; then
        echo -e "${RED}❌ Procfile not found. Please ensure Procfile exists in backend directory${NC}"
        exit 1
    fi
    
    echo -e "${GREEN}✅ Backend preparation completed${NC}"
    
    # Instructions for Heroku
    echo -e "${YELLOW}📝 To deploy to Heroku:${NC}"
    echo "1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli"
    echo "2. Login to Heroku: heroku login"
    echo "3. Create Heroku app: heroku create your-app-name"
    echo "4. Set environment variables:"
    echo "   heroku config:set MONGODB_URI='your_mongodb_connection_string'"
    echo "   heroku config:set JWT_SECRET='your_jwt_secret'"
    echo "   heroku config:set NODE_ENV='production'"
    echo "5. Deploy: git subtree push --prefix backend heroku main"
    
    cd ..
}

# Function to show environment setup
show_env_setup() {
    echo -e "${YELLOW}🔧 Environment Variables Setup:${NC}"
    echo ""
    echo "Backend (Heroku):"
    echo "NODE_ENV=production"
    echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/art_ecommerce?retryWrites=true&w=majority"
    echo "JWT_SECRET=your_very_secure_jwt_secret_key"
    echo "JWT_EXPIRE=7d"
    echo ""
    echo "Frontend (GitHub Pages):"
    echo "REACT_APP_API_URL=https://your-heroku-app-name.herokuapp.com/api"
    echo ""
    echo "GitHub Secrets (for automatic deployment):"
    echo "HEROKU_API_KEY=your_heroku_api_key"
    echo "HEROKU_APP_NAME=your_heroku_app_name"
    echo "HEROKU_EMAIL=your_heroku_email"
    echo "MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/art_ecommerce?retryWrites=true&w=majority"
    echo "JWT_SECRET=your_very_secure_jwt_secret_key"
    echo "REACT_APP_API_URL=https://your-heroku-app-name.herokuapp.com/api"
}

# Main menu
echo ""
echo -e "${GREEN}🎯 Art E-commerce Deployment Options:${NC}"
echo "1. Deploy frontend only"
echo "2. Deploy backend only"
echo "3. Deploy both (prepare for deployment)"
echo "4. Show environment variables setup"
echo "5. Exit"
echo ""

read -p "Choose an option (1-5): " choice

case $choice in
    1)
        deploy_frontend
        ;;
    2)
        deploy_backend
        ;;
    3)
        deploy_frontend
        echo ""
        deploy_backend
        ;;
    4)
        show_env_setup
        ;;
    5)
        echo -e "${GREEN}👋 Goodbye!${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid option. Please choose 1-5.${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}🎉 Deployment preparation completed!${NC}"
echo -e "${YELLOW}📚 For detailed instructions, see GITHUB_DEPLOYMENT.md${NC}"
