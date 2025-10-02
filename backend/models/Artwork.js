const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['painting', 'sculpture', 'digital', 'photography', 'mixed-media'],
    default: 'painting'
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  dimensions: {
    width: {
      type: Number,
      required: [true, 'Width is required']
    },
    height: {
      type: Number,
      required: [true, 'Height is required']
    },
    unit: {
      type: String,
      enum: ['cm', 'in', 'ft'],
      default: 'cm'
    }
  },
  medium: {
    type: String,
    required: [true, 'Medium is required'],
    maxlength: [100, 'Medium cannot be more than 100 characters']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1000, 'Year must be valid'],
    max: [new Date().getFullYear(), 'Year cannot be in the future']
  },
  artist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: [true, 'Artist is required']
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search functionality
artworkSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for formatted dimensions
artworkSchema.virtual('formattedDimensions').get(function() {
  return `${this.dimensions.width} × ${this.dimensions.height} ${this.dimensions.unit}`;
});

// Virtual for primary image
artworkSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0] ? this.images[0].url : '');
});

// Ensure virtual fields are serialized
artworkSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Artwork', artworkSchema);
