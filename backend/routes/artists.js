const express = require('express');
const { body, validationResult } = require('express-validator');
const Artist = require('../models/Artist');
const Artwork = require('../models/Artwork');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/artists
// @desc    Get all artists
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;
    
    const { search, sortBy = 'name', sortOrder = 'asc' } = req.query;

    // Build filter object
    const filter = { isActive: true };
    
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const artists = await Artist.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Artist.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      artists,
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
    console.error('Get artists error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/artists/:id
// @desc    Get single artist with their artworks
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id).lean();
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Get artist's artworks
    const page = parseInt(req.query.artworkPage) || 1;
    const limit = parseInt(req.query.artworkLimit) || 6;
    const skip = (page - 1) * limit;

    const artworks = await Artwork.find({ 
      artist: req.params.id,
      isAvailable: true 
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const totalArtworks = await Artwork.countDocuments({ 
      artist: req.params.id,
      isAvailable: true 
    });

    res.json({
      artist,
      artworks,
      artworkPagination: {
        currentPage: page,
        totalPages: Math.ceil(totalArtworks / limit),
        totalItems: totalArtworks,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Get artist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/artists
// @desc    Create new artist
// @access  Private (Admin only)
router.post('/', protect, adminOnly, [
  body('name').trim().notEmpty().withMessage('Artist name is required'),
  body('bio').trim().notEmpty().withMessage('Bio is required'),
  body('website').optional().isURL().withMessage('Website must be a valid URL'),
  body('socialMedia.instagram').optional().isURL().withMessage('Instagram must be a valid URL'),
  body('socialMedia.twitter').optional().isURL().withMessage('Twitter must be a valid URL'),
  body('socialMedia.facebook').optional().isURL().withMessage('Facebook must be a valid URL')
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

    const artist = await Artist.create(req.body);

    res.status(201).json({
      message: 'Artist created successfully',
      artist
    });
  } catch (error) {
    console.error('Create artist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/artists/:id
// @desc    Update artist
// @access  Private (Admin only)
router.put('/:id', protect, adminOnly, [
  body('name').optional().trim().notEmpty().withMessage('Artist name cannot be empty'),
  body('bio').optional().trim().notEmpty().withMessage('Bio cannot be empty'),
  body('website').optional().isURL().withMessage('Website must be a valid URL'),
  body('socialMedia.instagram').optional().isURL().withMessage('Instagram must be a valid URL'),
  body('socialMedia.twitter').optional().isURL().withMessage('Twitter must be a valid URL'),
  body('socialMedia.facebook').optional().isURL().withMessage('Facebook must be a valid URL')
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

    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    const updatedArtist = await Artist.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      message: 'Artist updated successfully',
      artist: updatedArtist
    });
  } catch (error) {
    console.error('Update artist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/artists/:id
// @desc    Delete artist (soft delete)
// @access  Private (Admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const artist = await Artist.findById(req.params.id);
    if (!artist) {
      return res.status(404).json({ message: 'Artist not found' });
    }

    // Soft delete - mark as inactive
    artist.isActive = false;
    await artist.save();

    res.json({ message: 'Artist deactivated successfully' });
  } catch (error) {
    console.error('Delete artist error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/artists/top/sales
// @desc    Get top artists by sales
// @access  Public
router.get('/top/sales', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const topArtists = await Artist.find({ isActive: true })
      .sort({ totalSales: -1 })
      .limit(limit)
      .select('name avatar totalSales totalRevenue')
      .lean();

    res.json({ topArtists });
  } catch (error) {
    console.error('Get top artists error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/artists/stats/overview
// @desc    Get artists statistics overview
// @access  Private (Admin only)
router.get('/stats/overview', protect, adminOnly, async (req, res) => {
  try {
    const totalArtists = await Artist.countDocuments({ isActive: true });
    const totalInactiveArtists = await Artist.countDocuments({ isActive: false });
    
    const totalSales = await Artist.aggregate([
      { $group: { _id: null, total: { $sum: '$totalSales' } } }
    ]);

    const totalRevenue = await Artist.aggregate([
      { $group: { _id: null, total: { $sum: '$totalRevenue' } } }
    ]);

    const averageRevenue = totalArtists > 0 ? (totalRevenue[0]?.total || 0) / totalArtists : 0;

    res.json({
      stats: {
        totalArtists,
        totalInactiveArtists,
        totalSales: totalSales[0]?.total || 0,
        totalRevenue: totalRevenue[0]?.total || 0,
        averageRevenue: Math.round(averageRevenue * 100) / 100
      }
    });
  } catch (error) {
    console.error('Get artists stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
