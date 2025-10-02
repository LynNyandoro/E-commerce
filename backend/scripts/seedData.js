const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

// Load environment variables
dotenv.config();

// Import models
const User = require('../models/User');
const Artist = require('../models/Artist');
const Artwork = require('../models/Artwork');
const Order = require('../models/Order');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/art-ecommerce');

const seedData = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Artist.deleteMany({});
    await Artwork.deleteMany({});
    await Order.deleteMany({});

    console.log('Cleared existing data');

    // Create users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@artgallery.com',
        password: 'admin123',
        role: 'admin'
      },
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'user123',
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'user123',
        role: 'user'
      },
      {
        name: 'Bob Johnson',
        email: 'bob@example.com',
        password: 'user123',
        role: 'user'
      },
      {
        name: 'Alice Brown',
        email: 'alice@example.com',
        password: 'user123',
        role: 'user'
      }
    ]);

    console.log(`Created ${users.length} users`);

    // Create artists
    const artists = await Artist.create([
      {
        name: 'Vincent Van Gogh',
        bio: 'Dutch post-impressionist painter who is among the most famous and influential figures in the history of Western art.',
        website: 'https://vangoghgallery.com',
        socialMedia: {
          instagram: 'https://instagram.com/vangogh',
          twitter: 'https://twitter.com/vangogh'
        }
      },
      {
        name: 'Pablo Picasso',
        bio: 'Spanish painter, sculptor, printmaker, ceramicist and stage designer considered one of the greatest and most influential artists of the 20th century.',
        website: 'https://picasso.org',
        socialMedia: {
          instagram: 'https://instagram.com/picasso',
          facebook: 'https://facebook.com/picasso'
        }
      },
      {
        name: 'Frida Kahlo',
        bio: 'Mexican painter known for her many portraits, self-portraits, and works inspired by the nature and artifacts of Mexico.',
        website: 'https://fridakahlo.org',
        socialMedia: {
          instagram: 'https://instagram.com/fridakahlo',
          twitter: 'https://twitter.com/fridakahlo'
        }
      },
      {
        name: 'Leonardo da Vinci',
        bio: 'Italian polymath of the High Renaissance who was active as a painter, draughtsman, engineer, scientist, theorist, sculptor and architect.',
        website: 'https://leonardodavinci.net',
        socialMedia: {
          instagram: 'https://instagram.com/leonardodavinci'
        }
      },
      {
        name: 'Georgia O\'Keeffe',
        bio: 'American modernist artist. She was known for her paintings of enlarged flowers, New York skyscrapers, and New Mexico landscapes.',
        website: 'https://okeeffemuseum.org',
        socialMedia: {
          instagram: 'https://instagram.com/georgiaokeeffe',
          twitter: 'https://twitter.com/georgiaokeeffe'
        }
      }
    ]);

    console.log(`Created ${artists.length} artists`);

    // Create artworks
    const artworks = await Artwork.create([
      {
        title: 'The Starry Night',
        description: 'An oil-on-canvas painting depicting a swirling night sky with a village below and a cypress tree in the foreground.',
        price: 1500000,
        category: 'painting',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
            alt: 'The Starry Night painting',
            isPrimary: true
          }
        ],
        dimensions: {
          width: 73.7,
          height: 92.1,
          unit: 'cm'
        },
        medium: 'Oil on canvas',
        year: 1889,
        artist: artists[0]._id,
        isFeatured: true,
        tags: ['night', 'sky', 'village', 'cypress', 'swirls']
      },
      {
        title: 'Guernica',
        description: 'A large oil painting on canvas depicting the suffering wrought by violence and chaos, featuring a gored horse, a bull, screaming women, and dismemberment.',
        price: 2000000,
        category: 'painting',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
            alt: 'Guernica painting',
            isPrimary: true
          }
        ],
        dimensions: {
          width: 349.3,
          height: 776.6,
          unit: 'cm'
        },
        medium: 'Oil on canvas',
        year: 1937,
        artist: artists[1]._id,
        isFeatured: true,
        tags: ['war', 'suffering', 'chaos', 'monochrome']
      },
      {
        title: 'Self-Portrait with Thorn Necklace',
        description: 'A self-portrait featuring the artist with a thorn necklace and a hummingbird, symbolizing pain and resilience.',
        price: 800000,
        category: 'painting',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
            alt: 'Self-Portrait with Thorn Necklace',
            isPrimary: true
          }
        ],
        dimensions: {
          width: 61.8,
          height: 47.9,
          unit: 'cm'
        },
        medium: 'Oil on masonite',
        year: 1940,
        artist: artists[2]._id,
        isFeatured: true,
        tags: ['self-portrait', 'thorn', 'hummingbird', 'resilience']
      },
      {
        title: 'Mona Lisa',
        description: 'A half-length portrait painting depicting a seated woman with an enigmatic expression, considered the most famous painting in the world.',
        price: 5000000,
        category: 'painting',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
            alt: 'Mona Lisa portrait',
            isPrimary: true
          }
        ],
        dimensions: {
          width: 77,
          height: 53,
          unit: 'cm'
        },
        medium: 'Oil on poplar panel',
        year: 1503,
        artist: artists[3]._id,
        isFeatured: true,
        tags: ['portrait', 'enigmatic', 'famous', 'renaissance']
      },
      {
        title: 'Red Canna',
        description: 'A large-scale painting of a red canna lily, showcasing O\'Keeffe\'s signature style of magnifying natural forms.',
        price: 600000,
        category: 'painting',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
            alt: 'Red Canna painting',
            isPrimary: true
          }
        ],
        dimensions: {
          width: 91.4,
          height: 76.2,
          unit: 'cm'
        },
        medium: 'Oil on canvas',
        year: 1924,
        artist: artists[4]._id,
        isFeatured: true,
        tags: ['flower', 'red', 'magnified', 'nature']
      },
      {
        title: 'Sunflowers',
        description: 'A series of still life paintings of sunflowers in a vase, painted in vibrant yellows and oranges.',
        price: 750000,
        category: 'painting',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
            alt: 'Sunflowers painting',
            isPrimary: true
          }
        ],
        dimensions: {
          width: 92,
          height: 73,
          unit: 'cm'
        },
        medium: 'Oil on canvas',
        year: 1888,
        artist: artists[0]._id,
        isFeatured: false,
        tags: ['sunflowers', 'still life', 'yellow', 'vase']
      },
      {
        title: 'Les Demoiselles d\'Avignon',
        description: 'A large oil painting depicting five nude female prostitutes in a brothel, marking the beginning of Cubism.',
        price: 1200000,
        category: 'painting',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
            alt: 'Les Demoiselles d\'Avignon',
            isPrimary: true
          }
        ],
        dimensions: {
          width: 243.9,
          height: 233.7,
          unit: 'cm'
        },
        medium: 'Oil on canvas',
        year: 1907,
        artist: artists[1]._id,
        isFeatured: false,
        tags: ['cubism', 'nude', 'prostitutes', 'revolutionary']
      },
      {
        title: 'The Two Fridas',
        description: 'A double self-portrait showing two versions of Frida seated side by side, connected by their hands and hearts.',
        price: 900000,
        category: 'painting',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
            alt: 'The Two Fridas',
            isPrimary: true
          }
        ],
        dimensions: {
          width: 173.5,
          height: 173,
          unit: 'cm'
        },
        medium: 'Oil on canvas',
        year: 1939,
        artist: artists[2]._id,
        isFeatured: false,
        tags: ['double portrait', 'identity', 'heart', 'connection']
      },
      {
        title: 'The Last Supper',
        description: 'A mural painting depicting the scene of the Last Supper of Jesus with his apostles, painted on the wall of a monastery.',
        price: 3000000,
        category: 'painting',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
            alt: 'The Last Supper mural',
            isPrimary: true
          }
        ],
        dimensions: {
          width: 460,
          height: 880,
          unit: 'cm'
        },
        medium: 'Tempera on gesso, pitch and mastic',
        year: 1495,
        artist: artists[3]._id,
        isFeatured: false,
        tags: ['religious', 'apostles', 'jesus', 'mural']
      },
      {
        title: 'Black Iris',
        description: 'A close-up painting of a black iris flower, demonstrating O\'Keeffe\'s mastery of form and color.',
        price: 550000,
        category: 'painting',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
            alt: 'Black Iris painting',
            isPrimary: true
          }
        ],
        dimensions: {
          width: 76.2,
          height: 91.4,
          unit: 'cm'
        },
        medium: 'Oil on canvas',
        year: 1926,
        artist: artists[4]._id,
        isFeatured: false,
        tags: ['iris', 'black', 'close-up', 'form']
      }
    ]);

    console.log(`Created ${artworks.length} artworks`);

    // Create sample orders
    const orders = await Order.create([
      {
        orderNumber: 'ART-001-0001',
        user: users[1]._id,
        items: [
          { artwork: artworks[0]._id, quantity: 1, price: artworks[0].price },
          { artwork: artworks[5]._id, quantity: 1, price: artworks[5].price }
        ],
        subtotal: artworks[0].price + artworks[5].price,
        tax: (artworks[0].price + artworks[5].price) * 0.08,
        shipping: 0,
        total: (artworks[0].price + artworks[5].price) * 1.08,
        shippingAddress: {
          name: 'John Doe',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        status: 'delivered',
        paymentStatus: 'paid'
      },
      {
        orderNumber: 'ART-001-0002',
        user: users[2]._id,
        items: [
          { artwork: artworks[1]._id, quantity: 1, price: artworks[1].price }
        ],
        subtotal: artworks[1].price,
        tax: artworks[1].price * 0.08,
        shipping: 0,
        total: artworks[1].price * 1.08,
        shippingAddress: {
          name: 'Jane Smith',
          street: '456 Oak Ave',
          city: 'Los Angeles',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        status: 'shipped',
        paymentStatus: 'paid'
      },
      {
        orderNumber: 'ART-001-0003',
        user: users[3]._id,
        items: [
          { artwork: artworks[2]._id, quantity: 1, price: artworks[2].price }
        ],
        subtotal: artworks[2].price,
        tax: artworks[2].price * 0.08,
        shipping: 0,
        total: artworks[2].price * 1.08,
        shippingAddress: {
          name: 'Bob Johnson',
          street: '789 Pine Rd',
          city: 'Chicago',
          state: 'IL',
          zipCode: '60601',
          country: 'USA'
        },
        status: 'processing',
        paymentStatus: 'paid'
      },
      {
        orderNumber: 'ART-001-0004',
        user: users[4]._id,
        items: [
          { artwork: artworks[3]._id, quantity: 1, price: artworks[3].price }
        ],
        subtotal: artworks[3].price,
        tax: artworks[3].price * 0.08,
        shipping: 0,
        total: artworks[3].price * 1.08,
        shippingAddress: {
          name: 'Alice Brown',
          street: '321 Elm St',
          city: 'Boston',
          state: 'MA',
          zipCode: '02101',
          country: 'USA'
        },
        status: 'pending',
        paymentStatus: 'pending'
      },
      {
        orderNumber: 'ART-001-0005',
        user: users[1]._id,
        items: [
          { artwork: artworks[4]._id, quantity: 1, price: artworks[4].price }
        ],
        subtotal: artworks[4].price,
        tax: artworks[4].price * 0.08,
        shipping: 10,
        total: artworks[4].price * 1.08 + 10,
        shippingAddress: {
          name: 'John Doe',
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        status: 'delivered',
        paymentStatus: 'paid'
      }
    ]);

    console.log(`Created ${orders.length} orders`);

    // Update artist sales statistics
    for (const order of orders) {
      if (order.status === 'delivered' && order.paymentStatus === 'paid') {
        for (const item of order.items) {
          const artwork = await Artwork.findById(item.artwork).populate('artist');
          if (artwork && artwork.artist) {
            artwork.artist.totalSales += item.quantity;
            artwork.artist.totalRevenue += item.price * item.quantity;
            await artwork.artist.save();
          }
        }
      }
    }

    console.log('Updated artist sales statistics');
    console.log('Database seeding completed successfully!');
    
    // Display summary
    console.log('\n✅ === SEED SUMMARY ===');
    console.log(`👥 Users: ${users.length}`);
    console.log(`🎨 Artists: ${artists.length}`);
    console.log(`🖼️  Artworks: ${artworks.length}`);
    console.log(`📦 Orders: ${orders.length}`);
    console.log('\n🔑 Admin Login:');
    console.log('Email: admin@artgallery.com');
    console.log('Password: admin123');
    console.log('\n👤 User Logins:');
    users.slice(1).forEach(user => {
      console.log(`Email: ${user.email}, Password: user123`);
    });
    console.log('\n🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    mongoose.connection.close();
  }
};

seedData();
