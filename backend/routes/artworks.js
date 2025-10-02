const express = require('express');
const { body, validationResult } = require('express-validator');
const Artwork = require('../models/Artwork');
const Artist = require('../models/Artist');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/artworks
// @desc    Get all artworks with filtering and pagination
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    const {
      category,
      artist,
      minPrice,
      maxPrice,
      search,
      featured,
      available,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build filter object
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (artist) {
      filter.artist = artist;
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }
    
    if (featured === 'true') {
      filter.isFeatured = true;
    }
    
    if (available === 'true') {
      filter.isAvailable = true;
    }
    
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const artworks = await Artwork.find(filter)
      .populate('artist', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Artwork.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      artworks,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems: total,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    console.error('Get artworks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/artworks/:id
// @desc    Get single artwork
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id)
      .populate('artist', 'name bio avatar website socialMedia')
      .lean();

    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // Increment views (fire and forget)
    Artwork.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).exec();

    res.json({ artwork });
  } catch (error) {
    console.error('Get artwork error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/artworks
// @desc    Create new artwork
// @access  Private (Admin only)
router.post('/', protect, adminOnly, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').isIn(['painting', 'sculpture', 'digital', 'photography', 'mixed-media']).withMessage('Invalid category'),
  body('artist').isMongoId().withMessage('Valid artist ID is required'),
  body('medium').trim().notEmpty().withMessage('Medium is required'),
  body('year').isInt({ min: 1000, max: new Date().getFullYear() }).withMessage('Valid year is required'),
  body('dimensions.width').isNumeric().withMessage('Width is required'),
  body('dimensions.height').isNumeric().withMessage('Height is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    // Verify artist exists
    const artist = await Artist.findById(req.body.artist);
    if (!artist) {
      return res.status(400).json({ message: 'Artist not found' });
    }

    const artwork = await Artwork.create(req.body);
    await artwork.populate('artist', 'name avatar');

    res.status(201).json({
      message: 'Artwork created successfully',
      artwork
    });
  } catch (error) {
    console.error('Create artwork error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/artworks/:id
// @desc    Update artwork
// @access  Private (Admin only)
router.put('/:id', protect, adminOnly, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().trim().notEmpty().withMessage('Description cannot be empty'),
  body('price').optional().isNumeric().withMessage('Price must be a number'),
  body('category').optional().isIn(['painting', 'sculpture', 'digital', 'photography', 'mixed-media']).withMessage('Invalid category'),
  body('artist').optional().isMongoId().withMessage('Valid artist ID is required'),
  body('year').optional().isInt({ min: 1000, max: new Date().getFullYear() }).withMessage('Valid year is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    // If updating artist, verify it exists
    if (req.body.artist) {
      const artist = await Artist.findById(req.body.artist);
      if (!artist) {
        return res.status(400).json({ message: 'Artist not found' });
      }
    }

    const updatedArtwork = await Artwork.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('artist', 'name avatar');

    res.json({
      message: 'Artwork updated successfully',
      artwork: updatedArtwork
    });
  } catch (error) {
    console.error('Update artwork error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/artworks/:id
// @desc    Delete artwork
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) {
      return res.status(404).json({ message: 'Artwork not found' });
    }

    await Artwork.findByIdAndDelete(req.params.id);

    res.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    console.error('Delete artwork error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/artworks/featured/list
// @desc    Get featured artworks
// @access  Public
router.get('/featured/list', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;
    
    const featuredArtworks = await Artwork.find({ 
      isFeatured: true, 
      isAvailable: true 
    })
      .populate('artist', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    res.json({ featuredArtworks });
  } catch (error) {
    console.error('Get featured artworks error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/artworks/categories/list
// @desc    Get all categories with counts
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Artwork.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          available: {
            $sum: {
              $cond: [{ $eq: ['$isAvailable', true] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    res.json({ categories });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
