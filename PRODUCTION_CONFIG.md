# Production Configuration Guide

## Environment Variables Setup

### Backend Environment Variables (for Render)

When deploying to Render, set these environment variables in your web service:

```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/art_ecommerce
JWT_SECRET=your_very_secure_jwt_secret_key_here_minimum_32_characters
JWT_EXPIRE=7d
FRONTEND_URL=https://art-ecommerce-web.onrender.com
```

### Frontend Environment Variables (for Render)

When deploying the frontend to Render, set these environment variables:

```bash
REACT_APP_API_URL=https://art-ecommerce-api.onrender.com/api
```

## Database Configuration

### MongoDB Atlas Setup (Recommended)

1. Create a MongoDB Atlas account
2. Create a new cluster
3. Create a database user
4. Whitelist Render's IP addresses (or use 0.0.0.0/0 for all IPs)
5. Get the connection string and use it as MONGODB_URI

### Connection String Format

```
mongodb+srv://username:password@cluster.mongodb.net/database_name?retryWrites=true&w=majority
```

## Security Considerations

### JWT Secret

Generate a strong JWT secret:
```bash
# Using Node.js crypto
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64
```

### CORS Configuration

The backend is configured to accept requests from:
- Development: `http://localhost:3000`
- Production: Your frontend URL and Render's default URL

## Build Configuration

### Backend Build

The backend uses a custom build script that:
- Checks for required environment variables
- Creates a production-ready dist directory
- Copies necessary files for deployment

### Frontend Build

The frontend build process:
1. Installs dependencies
2. Runs `npm run build`
3. Creates optimized production bundle
4. Serves static files through Express in production

## Deployment Checklist

### Pre-Deployment

- [ ] Update all environment variables
- [ ] Test database connection
- [ ] Verify JWT secret is secure
- [ ] Check CORS configuration
- [ ] Test build process locally

### Post-Deployment

- [ ] Verify health check endpoint
- [ ] Test user registration/login
- [ ] Check admin dashboard access
- [ ] Verify database seeding
- [ ] Test all API endpoints
- [ ] Check frontend-backend communication

## Monitoring

### Health Check

The API provides a health check endpoint:
```
GET /api/health
```

Response:
```json
{
  "message": "Art E-commerce API is running!"
}
```

### Logs

Monitor these logs in Render:
- Build logs
- Runtime logs
- Error logs

### Database Monitoring

- Monitor connection count
- Check database size
- Monitor query performance
- Set up alerts for errors

## Performance Optimization

### Database

- Use indexes for frequently queried fields
- Monitor slow queries
- Consider connection pooling
- Regular database maintenance

### Application

- Enable gzip compression
- Use CDN for static assets
- Implement caching where appropriate
- Monitor memory usage

## Backup Strategy

### Database Backups

- Enable automated backups in MongoDB Atlas
- Regular manual exports for important data
- Test backup restoration process

### Code Backups

- Use Git for version control
- Tag releases for easy rollback
- Keep deployment documentation updated

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are listed
   - Check environment variables

2. **Database Connection Issues**
   - Verify MongoDB URI format
   - Check network connectivity
   - Verify database credentials

3. **CORS Errors**
   - Update CORS configuration
   - Check frontend URL
   - Verify HTTPS vs HTTP

4. **Static File Issues**
   - Check build directory exists
   - Verify file permissions
   - Check static file serving configuration

### Debug Commands

```bash
# Check environment variables
echo $NODE_ENV
echo $MONGODB_URI

# Test database connection
node -e "require('mongoose').connect(process.env.MONGODB_URI).then(() => console.log('Connected')).catch(console.error)"

# Test JWT generation
node -e "console.log(require('jsonwebtoken').sign({id: 'test'}, process.env.JWT_SECRET))"
```

## Scaling Considerations

### Free Tier Limitations

- Database connections: Limited
- Memory: 512MB
- CPU: Shared
- Sleep after inactivity

### Upgrade Options

- Paid plans for better performance
- Database scaling options
- CDN for static assets
- Load balancing for high traffic

## Support

For deployment issues:
1. Check Render documentation
2. Review application logs
3. Test locally with production settings
4. Contact support if needed
