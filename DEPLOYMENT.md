# Deployment Guide for Art E-commerce Platform

This guide will help you deploy the Art E-commerce platform to Render. The app now supports **mock mode** for demo purposes without requiring a database.

## Prerequisites

- GitHub repository with your code
- Render account (free tier available)
- MongoDB Atlas account (optional - for full functionality)

## Deployment Options

### Option 1: Quick Demo Deployment (No Database Required)

Deploy immediately with mock data for demonstration purposes.

### Option 2: Full Production Deployment (Database Required)

Deploy with full functionality including user accounts, orders, and admin features.

## Deployment Steps

### 1. Database Setup (Optional for Demo Mode)

**For full functionality only:**

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a new cluster
3. Create a database user
4. Add IP whitelist (0.0.0.0/0 for all IPs)
5. Get the connection string

### 2. Backend API Deployment

1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name**: `art-ecommerce-api`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free

4. **Environment Variables** (choose one option):

   **Option A: Demo Mode (No Database)**
   ```
   NODE_ENV=production
   PORT=5000
   JWT_SECRET=<generate_a_strong_secret_key>
   CLIENT_URL=https://art-ecommerce-web.onrender.com
   MOCK_USER_NAME=Demo User
   MOCK_USER_EMAIL=demo@example.com
   ```

   **Option B: Full Production (With Database)**
   ```
   NODE_ENV=production
   PORT=5000
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/art_ecommerce
   JWT_SECRET=<generate_a_strong_secret_key>
   CLIENT_URL=https://art-ecommerce-web.onrender.com
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

**Note**: The frontend automatically generates `env.js` at build time from `REACT_APP_API_URL` for runtime configuration.

### 4. Database Seeding (Production Mode Only)

When using a real database (`MONGO_URI` is set), the backend will automatically seed the database with sample data through the `postinstall` script.

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

1. **Health Check**: Visit `https://your-api-url.onrender.com/health`
2. **Frontend**: Visit your frontend URL

### Demo Mode Testing
- **Login**: Use any email/password combination
- **Browse**: View demo artworks and artists
- **Signup**: Temporarily disabled (shows "temporarily disabled" message)

### Production Mode Testing
- **Login**: Use seeded admin credentials:
  - Email: `admin@artgallery.com`
  - Password: `admin123`
- **Signup**: Create new user accounts
- **Admin**: Full admin dashboard access

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

### Backend Environment Variables

**Demo Mode (No Database)**
```
NODE_ENV=production
PORT=5000
JWT_SECRET=your_very_secure_jwt_secret_key_here
CLIENT_URL=https://your-frontend-url.onrender.com
MOCK_USER_NAME=Demo User
MOCK_USER_EMAIL=demo@example.com
```

**Production Mode (With Database)**
```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/art_ecommerce
JWT_SECRET=your_very_secure_jwt_secret_key_here
CLIENT_URL=https://your-frontend-url.onrender.com
```

### Frontend Environment Variables
```
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
```

## Support

For issues specific to this application, check the repository issues or create a new one.

For Render-specific issues, consult the [Render Documentation](https://render.com/docs).
