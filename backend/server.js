const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware - Allow all origins for now to fix CORS issue
app.use(cors({
  origin: true, // Allow all origins temporarily
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully');
    // Seed database in production if needed
    if (process.env.NODE_ENV === 'production') {
      const { exec } = require('child_process');
      exec('npm run seed', (error, stdout, stderr) => {
        if (error) {
          console.log('Database already seeded or seeding failed:', error.message);
        } else {
          console.log('Database seeded successfully');
        }
      });
    }
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Server will continue without database connection');
  });
} else {
  console.log('No MONGO_URI provided - running in mock mode');
}

// Mock data middleware for when MongoDB is not available
const mockDataMiddleware = (req, res, next) => {
  if (!process.env.MONGO_URI) {
    // Mock responses for demo purposes
    if (req.path === '/api/artworks' && req.method === 'GET') {
      return res.json({
        artworks: [
          {
            _id: 'mock1',
            title: 'Sample Artwork',
            description: 'This is a demo artwork',
            price: 299.99,
            category: 'painting',
            images: [{ url: 'https://picsum.photos/400/300?random=1', alt: 'Sample Art', isPrimary: true }],
            dimensions: { width: 24, height: 18, unit: 'inches' },
            medium: 'Oil on Canvas',
            year: 2024,
            artist: { _id: 'artist1', name: 'Demo Artist' },
            isAvailable: true,
            isFeatured: true,
            tags: ['demo', 'sample'],
            views: 0,
            likes: 0
          }
        ],
        pagination: { currentPage: 1, totalPages: 1, totalItems: 1, itemsPerPage: 12, hasNext: false, hasPrev: false }
      });
    }
    if (req.path === '/api/artists' && req.method === 'GET') {
      return res.json({
        artists: [
          {
            _id: 'artist1',
            name: 'Demo Artist',
            bio: 'This is a demo artist',
            avatar: 'https://picsum.photos/200/200?random=2',
            website: '',
            socialMedia: {},
            isActive: true,
            totalSales: 0,
            totalRevenue: 0
          }
        ],
        pagination: { currentPage: 1, totalPages: 1, totalItems: 1, itemsPerPage: 12, hasNext: false, hasPrev: false }
      });
    }
    if (req.path.startsWith('/api/auth/') && req.method === 'POST') {
      return res.status(400).json({ message: 'Database not available - demo mode only' });
    }
    if (req.path.startsWith('/api/orders') && req.method === 'POST') {
      return res.status(400).json({ message: 'Database not available - demo mode only' });
    }
  }
  next();
};

// Routes
app.use(mockDataMiddleware);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/artworks', require('./routes/artworks'));
app.use('/api/artists', require('./routes/artists'));
app.use('/api/orders', require('./routes/orders'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ message: 'Art E-commerce API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler for API routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
