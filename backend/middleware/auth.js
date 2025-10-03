const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - verify JWT token (with mock mode support)
const protect = async (req, res, next) => {
  // Mock mode: allow access if an Authorization header is present, attach a mock user
  if (!process.env.MONGO_URI) {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      req.user = {
        _id: 'mock-user-id',
        name: process.env.MOCK_USER_NAME || 'Demo User',
        email: process.env.MOCK_USER_EMAIL || 'demo@example.com',
        role: 'user',
        isActive: true,
      };
      return next();
    }
    return res.status(401).json({ message: 'Not authorized (mock mode)' });
  }

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      if (!req.user.isActive) {
        return res.status(401).json({ message: 'Not authorized, user account is inactive' });
      }
      return next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  return res.status(401).json({ message: 'Not authorized, no token' });
};

// Admin only middleware
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
};

// Optional auth - doesn't fail if no token (supports mock mode)
const optionalAuth = async (req, res, next) => {
  if (!process.env.MONGO_URI) {
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      req.user = {
        _id: 'mock-user-id',
        name: process.env.MOCK_USER_NAME || 'Demo User',
        email: process.env.MOCK_USER_EMAIL || 'demo@example.com',
        role: 'user',
        isActive: true,
      };
    } else {
      req.user = null;
    }
    return next();
  }

  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      req.user = null;
    }
  }
  return next();
};

module.exports = { protect, adminOnly, optionalAuth };
