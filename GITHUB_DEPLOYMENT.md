# GitHub Free Tier Deployment Guide

This guide will help you deploy your Art E-commerce application using GitHub's free tier services.

## Overview

We'll use:
- **GitHub Pages** for frontend (static hosting)
- **Heroku** for backend (free tier with GitHub Actions)
- **MongoDB Atlas** for database (free tier)

## Prerequisites

- GitHub repository with your code
- Heroku account (free tier available)
- MongoDB Atlas account (free tier available)

## Step 1: Set up MongoDB Atlas

1. Follow the guide in `MONGODB_SETUP.md`
2. Get your MongoDB connection string
3. Note it down for later use

## Step 2: Set up Heroku for Backend

1. Go to [Heroku](https://heroku.com) and create an account
2. Create a new app:
   - Click "New" → "Create new app"
   - Choose a unique app name (e.g., `your-art-ecommerce-api`)
   - Select region closest to you
   - Click "Create app"

3. Get your Heroku credentials:
   - Go to Account Settings → API Key
   - Copy your API key
   - Note your Heroku email and app name

## Step 3: Configure GitHub Secrets

1. Go to your GitHub repository
2. Click "Settings" → "Secrets and variables" → "Actions"
3. Add these secrets:

   ```
   HEROKU_API_KEY=your_heroku_api_key
   HEROKU_APP_NAME=your_heroku_app_name
   HEROKU_EMAIL=your_heroku_email
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/art_ecommerce?retryWrites=true&w=majority
   JWT_SECRET=your_very_secure_jwt_secret_key
   REACT_APP_API_URL=https://your-heroku-app-name.herokuapp.com/api
   ```

## Step 4: Enable GitHub Pages

1. Go to your repository settings
2. Scroll down to "Pages" section
3. Under "Source", select "GitHub Actions"
4. Save the settings

## Step 5: Deploy

1. Push your code to the `main` branch
2. GitHub Actions will automatically:
   - Build and deploy the frontend to GitHub Pages
   - Deploy the backend to Heroku
   - Seed the database with sample data

## Step 6: Access Your Application

- **Frontend**: `https://yourusername.github.io/your-repo-name`
- **Backend API**: `https://your-heroku-app-name.herokuapp.com/api`
- **Health Check**: `https://your-heroku-app-name.herokuapp.com/api/health`

## Manual Deployment

If you prefer manual deployment:

### Frontend (GitHub Pages)
1. Build the frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. Push the `build` folder to a `gh-pages` branch:
   ```bash
   git subtree push --prefix frontend/build origin gh-pages
   ```

### Backend (Heroku)
1. Install Heroku CLI
2. Login to Heroku:
   ```bash
   heroku login
   ```

3. Set environment variables:
   ```bash
   heroku config:set MONGODB_URI="your_mongodb_connection_string" -a your-app-name
   heroku config:set JWT_SECRET="your_jwt_secret" -a your-app-name
   heroku config:set NODE_ENV="production" -a your-app-name
   ```

4. Deploy:
   ```bash
   cd backend
   git subtree push --prefix backend heroku main
   ```

## Environment Variables

### Backend (Heroku)
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/art_ecommerce?retryWrites=true&w=majority
JWT_SECRET=your_very_secure_jwt_secret_key
JWT_EXPIRE=7d
```

### Frontend (GitHub Pages)
```
REACT_APP_API_URL=https://your-heroku-app-name.herokuapp.com/api
```

## Troubleshooting

### Common Issues

1. **GitHub Pages not updating**:
   - Check if GitHub Actions workflow completed successfully
   - Verify Pages source is set to "GitHub Actions"
   - Wait a few minutes for changes to propagate

2. **Heroku deployment fails**:
   - Check Heroku logs: `heroku logs --tail -a your-app-name`
   - Verify all environment variables are set
   - Ensure MongoDB Atlas allows connections from Heroku

3. **CORS errors**:
   - Update CORS configuration in `backend/server.js`
   - Add your GitHub Pages URL to allowed origins

4. **Database connection issues**:
   - Verify MongoDB Atlas connection string
   - Check network access settings in MongoDB Atlas
   - Ensure database user has proper permissions

### Checking Deployment Status

1. **GitHub Actions**: Go to "Actions" tab in your repository
2. **Heroku**: Check app logs in Heroku dashboard
3. **GitHub Pages**: Check Pages settings and build logs

## Free Tier Limitations

### GitHub Pages
- ✅ Free static hosting
- ✅ Custom domains supported
- ✅ HTTPS enabled by default
- ⚠️ Build time: 10 minutes max
- ⚠️ Bandwidth: 100GB/month

### Heroku
- ✅ Free dyno (sleeps after 30 min inactivity)
- ✅ 512MB RAM
- ⚠️ 550-1000 dyno hours/month
- ⚠️ App sleeps after 30 min of inactivity

### MongoDB Atlas
- ✅ 512MB storage
- ✅ Shared clusters
- ✅ No time limits

## Upgrading (Optional)

For production use, consider upgrading:
- **Heroku**: Paid dynos for 24/7 uptime
- **GitHub Pages**: Pro plan for private repositories
- **MongoDB Atlas**: M10+ clusters for better performance

## Security Notes

- Never commit `.env` files or secrets to GitHub
- Use GitHub Secrets for sensitive data
- Regularly rotate your JWT secrets
- Monitor your application logs for security issues

## Support

- GitHub Actions: [GitHub Documentation](https://docs.github.com/en/actions)
- Heroku: [Heroku Dev Center](https://devcenter.heroku.com/)
- MongoDB Atlas: [MongoDB Documentation](https://docs.atlas.mongodb.com/)
