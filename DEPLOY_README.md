# 🚀 Quick Deploy Guide

Deploy your Art E-commerce application using GitHub's free tier in just a few steps!

## ⚡ Quick Start

### 1. Set up MongoDB Atlas
- Follow [MONGODB_SETUP.md](MONGODB_SETUP.md)
- Get your connection string

### 2. Set up Heroku
- Create account at [heroku.com](https://heroku.com)
- Create a new app
- Get your API key from Account Settings

### 3. Configure GitHub Secrets
Go to your repo → Settings → Secrets and variables → Actions, add:

```
HEROKU_API_KEY=your_heroku_api_key
HEROKU_APP_NAME=your_heroku_app_name  
HEROKU_EMAIL=your_heroku_email
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/art_ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_very_secure_jwt_secret_key
REACT_APP_API_URL=https://your-heroku-app-name.herokuapp.com/api
```

### 4. Enable GitHub Pages
- Go to repo Settings → Pages
- Set Source to "GitHub Actions"

### 5. Deploy! 🎉
- Push to `main` branch
- GitHub Actions will automatically deploy both frontend and backend

## 📍 Your URLs
- **Frontend**: `https://yourusername.github.io/your-repo-name`
- **Backend**: `https://your-heroku-app-name.herokuapp.com/api`

## 🛠️ Manual Deploy
Run the deployment script:
```bash
./deploy.sh
```

## 📚 Full Documentation
- [GitHub Deployment Guide](GITHUB_DEPLOYMENT.md)
- [MongoDB Setup](MONGODB_SETUP.md)
- [Original Deployment Guide](DEPLOYMENT.md)

## 🔧 Troubleshooting
- Check GitHub Actions logs
- Verify all secrets are set correctly
- Ensure MongoDB Atlas allows connections from Heroku
- Check Heroku app logs: `heroku logs --tail -a your-app-name`

## 🆓 Free Tier Limits
- **GitHub Pages**: 100GB bandwidth/month
- **Heroku**: 550-1000 hours/month (sleeps after 30min inactivity)
- **MongoDB Atlas**: 512MB storage

---
**Need help?** Check the detailed guides or create an issue! 🆘
