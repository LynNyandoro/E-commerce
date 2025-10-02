const express = require('express');
const { body, validationResult } = require('express-validator');
const Order = require('../models/Order');
const Artwork = require('../models/Artwork');
const Artist = require('../models/Artist');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post('/', protect, [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.artwork').isMongoId().withMessage('Valid artwork ID is required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('shippingAddress.name').trim().notEmpty().withMessage('Shipping name is required'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Street address is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').trim().notEmpty().withMessage('ZIP code is required'),
  body('shippingAddress.country').trim().notEmpty().withMessage('Country is required')
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

    const { items, shippingAddress, notes } = req.body;

    // Validate all artworks exist and are available
    const artworkIds = items.map(item => item.artwork);
    const artworks = await Artwork.find({ 
      _id: { $in: artworkIds },
      isAvailable: true 
    });

    if (artworks.length !== artworkIds.length) {
      return res.status(400).json({ message: 'One or more artworks are not available' });
    }

    // Calculate totals
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const artwork = artworks.find(art => art._id.toString() === item.artwork);
      const itemTotal = artwork.price * item.quantity;
      
      processedItems.push({
        artwork: artwork._id,
        quantity: item.quantity,
        price: artwork.price
      });
      
      subtotal += itemTotal;
    }

    // Calculate tax (8% for example)
    const tax = subtotal * 0.08;
    
    // Calculate shipping (free over $100, otherwise $10)
    const shipping = subtotal >= 100 ? 0 : 10;
    
    const total = subtotal + tax + shipping;

    // Generate order number
    const count = await Order.countDocuments();
    const orderNumber = `ART-${Date.now()}-${String(count + 1).padStart(4, '0')}`;

    // Create order
    const order = await Order.create({
      orderNumber,
      user: req.user._id,
      items: processedItems,
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress,
      notes
    });

    await order.populate({
      path: 'items.artwork',
      populate: {
        path: 'artist',
        select: 'name'
      }
    });

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders
// @desc    Get user's orders or all orders (admin)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { status, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    // Build filter
    const filter = {};
    if (req.user.role !== 'admin') {
      filter.user = req.user._id;
    }
    
    if (status) {
      filter.status = status;
    }

    // Build sort
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate({
        path: 'items.artwork',
        populate: {
          path: 'artist',
          select: 'name'
        }
      })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / limit);

    res.json({
      orders,
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
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const filter = { _id: req.params.id };
    if (req.user.role !== 'admin') {
      filter.user = req.user._id;
    }

    const order = await Order.findOne(filter)
      .populate('user', 'name email')
      .populate({
        path: 'items.artwork',
        populate: {
          path: 'artist',
          select: 'name'
        }
      })
      .lean();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ order });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin only)
router.put('/:id/status', protect, adminOnly, [
  body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).withMessage('Invalid status'),
  body('paymentStatus').optional().isIn(['pending', 'paid', 'failed', 'refunded']).withMessage('Invalid payment status')
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

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const { status, paymentStatus } = req.body;
    
    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    await order.save();

    // Update artist sales/revenue if order is delivered and paid
    if (status === 'delivered' && paymentStatus === 'paid' && order.paymentStatus !== 'paid') {
      for (const item of order.items) {
        const artwork = await Artwork.findById(item.artwork).populate('artist');
        if (artwork && artwork.artist) {
          artwork.artist.totalSales += item.quantity;
          artwork.artist.totalRevenue += item.price * item.quantity;
          await artwork.artist.save();
        }
      }
    }

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/orders/stats/overview
// @desc    Get orders statistics overview
// @access  Private (Admin only)
router.get('/stats/overview', protect, adminOnly, async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

    const totalRevenue = await Order.aggregate([
      { $match: { status: 'delivered', paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const averageOrderValue = totalOrders > 0 ? 
      (await Order.aggregate([
        { $group: { _id: null, avg: { $avg: '$total' } } }
      ]))[0]?.avg || 0 : 0;

    // Recent orders (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentOrders = await Order.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        averageOrderValue: Math.round(averageOrderValue * 100) / 100,
        recentOrders
      }
    });
  } catch (error) {
    console.error('Get orders stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
