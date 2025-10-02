const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Artist name is required'],
    trim: true,
    maxlength: [100, 'Artist name cannot be more than 100 characters']
  },
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  avatar: {
    type: String,
    default: ''
  },
  website: {
    type: String,
    default: ''
  },
  socialMedia: {
    instagram: { type: String, default: '' },
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalSales: {
    type: Number,
    default: 0
  },
  totalRevenue: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Virtual for artwork count
artistSchema.virtual('artworkCount', {
  ref: 'Artwork',
  localField: '_id',
  foreignField: 'artist',
  count: true
});

// Ensure virtual fields are serialized
artistSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Artist', artistSchema);
