# Deployment Guide for Art E-commerce Platform

This guide will help you deploy the Art E-commerce platform to Render.

## Prerequisites

- GitHub repository with your code
- Render account (free tier available)

## Deployment Steps

### 1. Database Setup

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "PostgreSQL"
3. Configure:
   - **Name**: `art-ecommerce-db`
   - **Database**: `art_ecommerce`
   - **User**: `art_user`
   - **Plan**: Free
4. Save the database and note the **External Database URL**

### 2. Backend API Deployment

1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `art-ecommerce-api`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

4. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=<your_database_url_from_step_1>
   JWT_SECRET=<generate_a_strong_secret_key>
   JWT_EXPIRE=7d
   FRONTEND_URL=https://art-ecommerce-web.onrender.com
   ```

5. Deploy the service

### 3. Frontend Deployment

1. Click "New" → "Static Site"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `art-ecommerce-web`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Plan**: Free

4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://art-ecommerce-api.onrender.com/api
   ```

5. Deploy the service

### 4. Database Seeding

After deployment, the backend will automatically seed the database with sample data through the `postinstall` script.

## Alternative: Single Service Deployment

If you prefer to deploy as a single service:

1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `art-ecommerce`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install && cd ../frontend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

4. **Environment Variables**:
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=<your_database_url>
   JWT_SECRET=<generate_a_strong_secret_key>
   JWT_EXPIRE=7d
   FRONTEND_URL=https://your-service-name.onrender.com
   ```

## Important Notes

### Security
- Generate a strong JWT secret key for production
- Use environment variables for all sensitive data
- Never commit `.env` files to version control

### Database
- The free tier has limitations on connections and storage
- Consider upgrading for production use
- Regular backups are recommended

### Performance
- Free tier services may sleep after inactivity
- First request after sleep may be slow
- Consider upgrading for better performance

## Testing Deployment

1. **Health Check**: Visit `https://your-api-url.onrender.com/api/health`
2. **Frontend**: Visit your frontend URL
3. **Login**: Use admin credentials:
   - Email: `admin@artgallery.com`
   - Password: `admin123`

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check Node.js version compatibility
   - Ensure all dependencies are in package.json
   - Check build logs for specific errors

2. **Database Connection**:
   - Verify MongoDB URI is correct
   - Check database credentials
   - Ensure database is running

3. **CORS Issues**:
   - Update CORS configuration in server.js
   - Verify frontend URL in environment variables

4. **Static Files Not Loading**:
   - Check if frontend build completed successfully
   - Verify build directory path
   - Check static file serving configuration

### Logs
- Check Render dashboard logs for detailed error information
- Monitor both build and runtime logs
- Use console.log statements for debugging

## Post-Deployment

1. Test all functionality:
   - User registration/login
   - Artwork browsing
   - Cart functionality
   - Admin dashboard
   - Order management

2. Set up monitoring:
   - Monitor service health
   - Set up uptime monitoring
   - Track performance metrics

3. Regular maintenance:
   - Update dependencies
   - Monitor database usage
   - Backup data regularly

## Environment Variables Reference

### Backend (.env)
```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/art_ecommerce
JWT_SECRET=your_very_secure_jwt_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

## Support

For issues specific to this application, check the repository issues or create a new one.

For Render-specific issues, consult the [Render Documentation](https://render.com/docs).
