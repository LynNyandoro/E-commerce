#!/usr/bin/env node

/**
 * Production build script for backend
 * This script ensures the backend is ready for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Building backend for production...');

// Check if all required environment variables are set
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.warn('⚠️  Warning: Missing environment variables:', missingVars.join(', '));
  console.warn('   These should be set in your production environment.');
}

// Ensure build directory exists
const buildDir = path.join(__dirname, 'dist');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Copy package.json to dist
fs.copyFileSync(
  path.join(__dirname, 'package.json'),
  path.join(buildDir, 'package.json')
);

// Copy server.js to dist
fs.copyFileSync(
  path.join(__dirname, 'server.js'),
  path.join(buildDir, 'server.js')
);

// Copy all directories except node_modules
const dirsToCopy = ['routes', 'models', 'middleware', 'scripts', 'utils'];
dirsToCopy.forEach(dir => {
  const srcDir = path.join(__dirname, dir);
  const destDir = path.join(buildDir, dir);
  
  if (fs.existsSync(srcDir)) {
    fs.mkdirSync(destDir, { recursive: true });
    copyDir(srcDir, destDir);
  }
});

console.log('✅ Backend build completed successfully!');

function copyDir(src, dest) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
