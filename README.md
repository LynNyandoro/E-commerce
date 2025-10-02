# Art E-Commerce Platform

A full-stack art marketplace built with the MERN stack (MongoDB, Express.js, React, Node.js) where customers can browse and purchase artworks, while admins manage artworks, artists, and sales.

## 🎨 Features

### Public Storefront
- **Homepage**: Featured artworks with hero section and statistics
- **Art Listing**: Grid view with filtering by category, price range, and search
- **Artwork Detail**: Detailed view with images, artist info, and add to cart
- **Artist Pages**: Artist profiles with their artwork collections
- **Shopping Cart**: Add/remove items, stored in localStorage
- **Checkout**: Mock checkout process with order placement
- **Authentication**: User registration and login with JWT

### Admin Dashboard
- **Dashboard Overview**: Sales statistics, charts, and key metrics
- **Artwork Management**: CRUD operations for artworks
- **Artist Management**: Manage artist profiles and information
- **Order Management**: View and update order statuses
- **Analytics**: Revenue charts, category distribution, top artists

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **express-validator** for input validation
- **multer** for file uploads

### Frontend
- **React 19** with TypeScript
- **Chakra UI** for component library
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Recharts** for analytics charts
- **Axios** for API calls

## 📁 Project Structure

```
E-Commerce/
├── backend/
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   ├── scripts/         # Database seeding
│   └── server.js        # Express server
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   ├── services/    # API services
│   │   ├── types/       # TypeScript types
│   │   ├── utils/       # Utility functions
│   │   └── theme.ts     # Chakra UI theme
│   └── public/          # Static assets
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd E-Commerce
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. **Backend Environment Setup**
   ```bash
   cd backend
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5001
   MONGODB_URI=mongodb://localhost:27017/art-ecommerce
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRE=7d
   NODE_ENV=development
   ```

2. **Frontend Environment Setup**
   ```bash
   cd frontend
   ```
   
   Create `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:5001/api
   ```

### Database Setup

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Seed the database** with sample data
   ```bash
   cd backend
   npm run seed
   ```

   This will create:
   - 1 admin user (admin@artgallery.com / admin123)
   - 4 regular users
   - 5 artists
   - 10 artworks
   - 5 sample orders

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   Server will run on http://localhost:5001

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm start
   ```
   Frontend will run on http://localhost:3000

## 🔐 Default Credentials

### Admin Account
- **Email**: admin@artgallery.com
- **Password**: admin123

### User Accounts
- **Email**: john@example.com
- **Password**: user123
- **Email**: jane@example.com
- **Password**: user123
- **Email**: bob@example.com
- **Password**: user123
- **Email**: alice@example.com
- **Password**: user123

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Artworks
- `GET /api/artworks` - Get all artworks (with filtering)
- `GET /api/artworks/:id` - Get single artwork
- `POST /api/artworks` - Create artwork (Admin only)
- `PUT /api/artworks/:id` - Update artwork (Admin only)
- `DELETE /api/artworks/:id` - Delete artwork (Admin only)
- `GET /api/artworks/featured/list` - Get featured artworks
- `GET /api/artworks/categories/list` - Get categories

### Artists
- `GET /api/artists` - Get all artists
- `GET /api/artists/:id` - Get single artist
- `POST /api/artists` - Create artist (Admin only)
- `PUT /api/artists/:id` - Update artist (Admin only)
- `DELETE /api/artists/:id` - Delete artist (Admin only)
- `GET /api/artists/top/sales` - Get top artists by sales
- `GET /api/artists/stats/overview` - Get artist statistics

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get orders (user's orders or all for admin)
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (Admin only)
- `GET /api/orders/stats/overview` - Get order statistics

## 🎯 Key Features Implementation

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (user/admin)
- Protected routes and middleware
- Password hashing with bcryptjs

### Shopping Cart
- LocalStorage persistence
- Add/remove items functionality
- Quantity management
- Cart totals calculation

### Admin Dashboard
- Real-time statistics and charts
- CRUD operations for all entities
- Order management with status updates
- Analytics and reporting

### Responsive Design
- Mobile-first approach
- Chakra UI components
- Dark/light mode support
- Optimized for all screen sizes

## 🚀 Deployment

### Backend Deployment (Render/Heroku)
1. Connect your repository to Render/Heroku
2. Set environment variables in the dashboard
3. Deploy from the main branch

### Frontend Deployment (Vercel/Netlify)
1. Connect your repository to Vercel/Netlify
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Add environment variables

### Database (MongoDB Atlas)
1. Create a MongoDB Atlas cluster
2. Get connection string
3. Update `MONGODB_URI` in environment variables

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 📝 Available Scripts

### Backend
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with sample data

### Frontend
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Chakra UI](https://chakra-ui.com/) for the component library
- [Recharts](https://recharts.org/) for the charts
- [Unsplash](https://unsplash.com/) for placeholder images
- [React](https://reactjs.org/) and [Express.js](https://expressjs.com/) communities

## 🚀 Deployment

### Render Deployment (Recommended)

This project is configured for easy deployment on Render. See the detailed deployment guide:

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment instructions
- **[PRODUCTION_CONFIG.md](./PRODUCTION_CONFIG.md)** - Production configuration guide
- **[render.yaml](./render.yaml)** - Render configuration file

### Quick Deploy to Render

1. **Fork/Clone** this repository
2. **Connect** to Render and import your repository
3. **Create Database**: New PostgreSQL database
4. **Deploy Backend**: Web service with Node.js
5. **Deploy Frontend**: Static site or combined service
6. **Set Environment Variables** as described in deployment guide

### Alternative Deployment Options

- **Vercel** (Frontend) + **Railway** (Backend)
- **Netlify** (Frontend) + **Heroku** (Backend)
- **DigitalOcean App Platform**
- **AWS** or **Google Cloud Platform**

## 📞 Support

If you have any questions or need help, please open an issue or contact the development team.

---

**Happy Coding! 🎨✨**
