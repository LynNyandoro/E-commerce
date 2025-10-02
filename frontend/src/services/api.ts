import axios from 'axios';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  ArtworksResponse,
  ArtistsResponse,
  OrdersResponse,
  FeaturedArtworksResponse,
  CategoriesResponse,
  Artwork,
  Artist,
  Order,
  User,
  ArtistStats,
  OrderStats,
  ShippingAddress,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', credentials);
    return response.data;
  },

  getMe: async (): Promise<{ user: User }> => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Artworks API
export const artworksAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    category?: string;
    artist?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    featured?: boolean;
    available?: boolean;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ArtworksResponse> => {
    const response = await api.get('/artworks', { params });
    return response.data;
  },

  getById: async (id: string): Promise<{ artwork: Artwork }> => {
    const response = await api.get(`/artworks/${id}`);
    return response.data;
  },

  create: async (artwork: Partial<Artwork>): Promise<{ artwork: Artwork; message: string }> => {
    const response = await api.post('/artworks', artwork);
    return response.data;
  },

  update: async (id: string, artwork: Partial<Artwork>): Promise<{ artwork: Artwork; message: string }> => {
    const response = await api.put(`/artworks/${id}`, artwork);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/artworks/${id}`);
    return response.data;
  },

  getFeatured: async (limit?: number): Promise<FeaturedArtworksResponse> => {
    const response = await api.get('/artworks/featured/list', { params: { limit } });
    return response.data;
  },

  getCategories: async (): Promise<CategoriesResponse> => {
    const response = await api.get('/artworks/categories/list');
    return response.data;
  },
};

// Artists API
export const artistsAPI = {
  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<ArtistsResponse> => {
    const response = await api.get('/artists', { params });
    return response.data;
  },

  getById: async (id: string, params?: {
    artworkPage?: number;
    artworkLimit?: number;
  }): Promise<{ artist: Artist; artworks: Artwork[]; artworkPagination: any }> => {
    const response = await api.get(`/artists/${id}`, { params });
    return response.data;
  },

  create: async (artist: Partial<Artist>): Promise<{ artist: Artist; message: string }> => {
    const response = await api.post('/artists', artist);
    return response.data;
  },

  update: async (id: string, artist: Partial<Artist>): Promise<{ artist: Artist; message: string }> => {
    const response = await api.put(`/artists/${id}`, artist);
    return response.data;
  },

  delete: async (id: string): Promise<{ message: string }> => {
    const response = await api.delete(`/artists/${id}`);
    return response.data;
  },

  getTopSales: async (limit?: number): Promise<{ topArtists: Artist[] }> => {
    const response = await api.get('/artists/top/sales', { params: { limit } });
    return response.data;
  },

  getStats: async (): Promise<{ stats: ArtistStats }> => {
    const response = await api.get('/artists/stats/overview');
    return response.data;
  },
};

// Orders API
export const ordersAPI = {
  create: async (orderData: {
    items: Array<{ artwork: string; quantity: number }>;
    shippingAddress: ShippingAddress;
    notes?: string;
  }): Promise<{ order: Order; message: string }> => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: string;
  }): Promise<OrdersResponse> => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getById: async (id: string): Promise<{ order: Order }> => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, statusData: {
    status?: string;
    paymentStatus?: string;
  }): Promise<{ order: Order; message: string }> => {
    const response = await api.put(`/orders/${id}/status`, statusData);
    return response.data;
  },

  getStats: async (): Promise<{ stats: OrderStats }> => {
    const response = await api.get('/orders/stats/overview');
    return response.data;
  },
};

export default api;
