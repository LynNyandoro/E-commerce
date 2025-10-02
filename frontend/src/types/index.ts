export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Artist {
  _id: string;
  name: string;
  bio: string;
  avatar: string;
  website: string;
  socialMedia: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
  };
  isActive: boolean;
  totalSales: number;
  totalRevenue: number;
  artworkCount?: number;
}

export interface Artwork {
  _id: string;
  title: string;
  description: string;
  price: number;
  category: 'painting' | 'sculpture' | 'digital' | 'photography' | 'mixed-media';
  images: Array<{
    url: string;
    alt: string;
    isPrimary: boolean;
  }>;
  dimensions: {
    width: number;
    height: number;
    unit: string;
  };
  medium: string;
  year: number;
  artist: Artist;
  isAvailable: boolean;
  isFeatured: boolean;
  tags: string[];
  views: number;
  likes: number;
  formattedDimensions?: string;
  primaryImage?: string;
}

export interface CartItem {
  artwork: Artwork;
  quantity: number;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user: User;
  items: Array<{
    artwork: Artwork;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: 'credit-card' | 'paypal' | 'bank-transfer' | 'cash';
  notes?: string;
  itemCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: Array<{ message: string; field?: string }>;
}

export interface ArtworksResponse {
  artworks: Artwork[];
  pagination: Pagination;
}

export interface ArtistsResponse {
  artists: Artist[];
  pagination: Pagination;
}

export interface OrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

export interface FeaturedArtworksResponse {
  featuredArtworks: Artwork[];
}

export interface CategoriesResponse {
  categories: Array<{
    _id: string;
    count: number;
    available: number;
  }>;
}

export interface AuthResponse {
  token: string;
  user: User;
  message: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role?: 'user' | 'admin';
}

export interface DashboardStats {
  totalSales: number;
  totalRevenue: number;
  totalOrders: number;
  totalArtworks: number;
  totalArtists: number;
  averageOrderValue: number;
  recentOrders: number;
}

export interface ArtistStats {
  totalArtists: number;
  totalInactiveArtists: number;
  totalSales: number;
  totalRevenue: number;
  averageRevenue: number;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  recentOrders: number;
}
