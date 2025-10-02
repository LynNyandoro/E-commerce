# MongoDB Atlas Setup Guide

This guide will help you set up MongoDB Atlas for your Art E-commerce application.

## Step 1: Create MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" or "Start Free"
3. Sign up with your email or use Google/GitHub

## Step 2: Create a Cluster

1. After logging in, click "Build a Database"
2. Choose "M0 Sandbox" (Free tier)
3. Select your preferred cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region closest to your users
5. Click "Create"

## Step 3: Configure Database Access

1. Go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create a username and strong password
5. Under "Database User Privileges", select "Atlas admin" or "Read and write to any database"
6. Click "Add User"

## Step 4: Configure Network Access

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for Render deployment)
   - This adds `0.0.0.0/0` to allow connections from any IP
4. Click "Confirm"

## Step 5: Get Connection String

1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as the driver
5. Copy the connection string
6. Replace `<password>` with your database user password
7. Replace `<dbname>` with `art_ecommerce`

Example connection string:
```
mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/art_ecommerce?retryWrites=true&w=majority
```

## Step 6: Update Environment Variables

In your Render service, update the `MONGODB_URI` environment variable with your connection string from Step 5.

## Troubleshooting

### Common Issues

1. **"Invalid scheme" error**: Make sure your connection string starts with `mongodb+srv://` or `mongodb://`

2. **Authentication failed**: Verify your username and password are correct

3. **Network access denied**: Make sure you've added `0.0.0.0/0` to your network access list

4. **Connection timeout**: Check if your cluster is running and accessible

### Testing Connection

You can test your connection string locally by:

1. Creating a `.env` file in your backend directory:
   ```
   MONGODB_URI=mongodb+srv://yourusername:yourpassword@cluster0.xxxxx.mongodb.net/art_ecommerce?retryWrites=true&w=majority
   ```

2. Running the seed script:
   ```bash
   cd backend
   npm run seed
   ```

If successful, you should see the database seeding messages.

## Security Notes

- Never commit your actual connection string to version control
- Use environment variables for all sensitive data
- Consider using IP whitelisting for production (instead of 0.0.0.0/0)
- Regularly rotate your database passwords
