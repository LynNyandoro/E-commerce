const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Artist = require('../models/Artist');
const Artwork = require('../models/Artwork');

const seedSampleData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Create sample artists
    const artists = [
      {
        name: 'Vincent van Gogh',
        bio: 'Dutch post-impressionist painter who is among the most famous and influential figures in the history of Western art.',
        avatar: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=200&h=200&fit=crop&crop=face',
        website: 'https://www.vangoghmuseum.nl',
        socialMedia: {
          instagram: 'https://instagram.com/vangoghmuseum',
          twitter: 'https://twitter.com/vangoghmuseum'
        },
        isActive: true,
        totalSales: 0,
        totalRevenue: 0
      },
      {
        name: 'Pablo Picasso',
        bio: 'Spanish painter, sculptor, printmaker, ceramicist and theatre designer who spent most of his adult life in France.',
        avatar: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200&h=200&fit=crop&crop=face',
        website: 'https://www.picasso.fr',
        socialMedia: {
          instagram: 'https://instagram.com/picasso',
          twitter: 'https://twitter.com/picasso'
        },
        isActive: true,
        totalSales: 0,
        totalRevenue: 0
      },
      {
        name: 'Frida Kahlo',
        bio: 'Mexican painter known for her many portraits, self-portraits, and works inspired by the nature and artifacts of Mexico.',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
        website: 'https://www.fridakahlo.org',
        socialMedia: {
          instagram: 'https://instagram.com/fridakahlo',
          facebook: 'https://facebook.com/fridakahlo'
        },
        isActive: true,
        totalSales: 0,
        totalRevenue: 0
      }
    ];

    // Create artists
    const createdArtists = await Artist.insertMany(artists);
    console.log(`Created ${createdArtists.length} artists`);

    // Create sample artworks
    const artworks = [
      {
        title: 'Starry Night',
        description: 'An oil on canvas painting by Dutch post-impressionist painter Vincent van Gogh.',
        price: 899.99,
        category: 'painting',
        images: [{
          url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
          alt: 'Starry Night by Vincent van Gogh',
          isPrimary: true
        }],
        dimensions: {
          width: 73.7,
          height: 92.1,
          unit: 'cm'
        },
        medium: 'Oil on Canvas',
        year: 1889,
        artist: createdArtists[0]._id,
        isAvailable: true,
        isFeatured: true,
        tags: ['impressionist', 'night', 'stars', 'landscape'],
        views: 0,
        likes: 0
      },
      {
        title: 'The Weeping Woman',
        description: 'An oil on canvas painting by Pablo Picasso, depicting a woman in tears.',
        price: 1299.99,
        category: 'painting',
        images: [{
          url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
          alt: 'The Weeping Woman by Pablo Picasso',
          isPrimary: true
        }],
        dimensions: {
          width: 60,
          height: 49,
          unit: 'cm'
        },
        medium: 'Oil on Canvas',
        year: 1937,
        artist: createdArtists[1]._id,
        isAvailable: true,
        isFeatured: true,
        tags: ['cubist', 'portrait', 'emotion', 'modern'],
        views: 0,
        likes: 0
      },
      {
        title: 'Self-Portrait with Thorn Necklace',
        description: 'A self-portrait by Frida Kahlo, one of her most famous works.',
        price: 1599.99,
        category: 'painting',
        images: [{
          url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop',
          alt: 'Self-Portrait with Thorn Necklace by Frida Kahlo',
          isPrimary: true
        }],
        dimensions: {
          width: 61.25,
          height: 47,
          unit: 'cm'
        },
        medium: 'Oil on Canvas',
        year: 1940,
        artist: createdArtists[2]._id,
        isAvailable: true,
        isFeatured: true,
        tags: ['self-portrait', 'surrealist', 'symbolic', 'mexican'],
        views: 0,
        likes: 0
      }
    ];

    // Create artworks
    const createdArtworks = await Artwork.insertMany(artworks);
    console.log(`Created ${createdArtworks.length} artworks`);

    console.log('Sample data seeded successfully!');

  } catch (error) {
    console.error('Error seeding sample data:', error);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the script
seedSampleData();
