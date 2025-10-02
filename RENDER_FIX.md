# 🔧 Fix Render Deployment - MongoDB Connection Error

The error you're seeing is because the MongoDB connection string in your Render service is still using placeholder values instead of your actual MongoDB Atlas credentials.

## 🚨 Current Error
```
MongoParseError: Invalid scheme, expected connection string to start with "mongodb://" or "mongodb+srv://"
```

## ✅ Solution: Update MongoDB URI in Render

### Step 1: Get Your MongoDB Atlas Connection String

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Sign in to your account
3. Click on your cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with `art_ecommerce`

**Example connection string:**
```
mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/art_ecommerce?retryWrites=true&w=majority
```

### Step 2: Update Render Environment Variables

1. Go to your [Render Dashboard](https://dashboard.render.com)
2. Find your `art-ecommerce` service
3. Click on it to open the service details
4. Go to the "Environment" tab
5. Find the `MONGODB_URI` variable
6. Click "Edit" and replace the value with your actual MongoDB Atlas connection string
7. Click "Save Changes"

### Step 3: Redeploy

1. Go to the "Manual Deploy" tab
2. Click "Deploy latest commit"
3. Wait for the deployment to complete

## 🔍 Alternative: Update render.yaml and Redeploy

If you prefer to update the configuration file:

1. **Update `render.yaml`:**
   ```yaml
   - key: MONGODB_URI
     value: mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/art_ecommerce?retryWrites=true&w=majority
   ```

2. **Commit and push:**
   ```bash
   git add render.yaml
   git commit -m "Update MongoDB URI with actual connection string"
   git push origin main
   ```

## 🧪 Test the Fix

After updating the MongoDB URI, check:

1. **Build logs** - Should show successful MongoDB connection
2. **Service logs** - Should show "MongoDB connected successfully"
3. **Health check** - Visit `https://your-app-name.onrender.com/api/health`

## 🆘 Still Having Issues?

### Check MongoDB Atlas Settings

1. **Network Access:**
   - Go to Network Access in MongoDB Atlas
   - Add `0.0.0.0/0` to allow connections from anywhere
   - Or add Render's IP ranges

2. **Database User:**
   - Ensure user has read/write permissions
   - Check username and password are correct

3. **Connection String:**
   - Must start with `mongodb+srv://` or `mongodb://`
   - No spaces or special characters in password
   - Database name should be `art_ecommerce`

### Common Connection String Formats

**MongoDB Atlas (Recommended):**
```
mongodb+srv://username:password@cluster.mongodb.net/art_ecommerce?retryWrites=true&w=majority
```

**Local MongoDB (for testing):**
```
mongodb://localhost:27017/art-ecommerce
```

## 📝 Quick Checklist

- [ ] MongoDB Atlas cluster is running
- [ ] Database user has correct permissions
- [ ] Network access allows connections from anywhere (0.0.0.0/0)
- [ ] Connection string is properly formatted
- [ ] MONGODB_URI environment variable is updated in Render
- [ ] Service has been redeployed

## 🎯 Expected Result

After fixing the MongoDB URI, you should see:
```
🌱 Starting database seeding...
MongoDB connected successfully
Created 5 users
Created 5 artists
Created 10 artworks
Created 5 orders
Database seeding completed successfully!
```

Your deployment should then be successful! 🎉
