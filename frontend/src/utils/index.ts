// Format currency
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Format date
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

// Format relative date
export const formatRelativeDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(dateObj);
};

// Truncate text
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Generate slug from text
export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

// Calculate cart totals
export const calculateCartTotals = (items: Array<{ artwork: { price: number }; quantity: number }>) => {
  const subtotal = items.reduce((total, item) => total + (item.artwork.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal >= 100 ? 0 : 10; // Free shipping over $100
  const total = subtotal + tax + shipping;

  return {
    subtotal,
    tax,
    shipping,
    total,
  };
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }
  return { isValid: true };
};

// Get status color for orders
export const getStatusColor = (status: string): string => {
  const statusColors: { [key: string]: string } = {
    pending: 'yellow',
    processing: 'blue',
    shipped: 'purple',
    delivered: 'green',
    cancelled: 'red',
  };
  return statusColors[status] || 'gray';
};

// Get payment status color
export const getPaymentStatusColor = (status: string): string => {
  const statusColors: { [key: string]: string } = {
    pending: 'yellow',
    paid: 'green',
    failed: 'red',
    refunded: 'orange',
  };
  return statusColors[status] || 'gray';
};

// Debounce function
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// Get image placeholder
export const getImagePlaceholder = (width: number = 400, height: number = 300): string => {
  return `https://picsum.photos/${width}/${height}?random=${Math.random()}`;
};

// Format dimensions
export const formatDimensions = (width: number, height: number, unit: string): string => {
  return `${width} × ${height} ${unit}`;
};

// Get category display name
export const getCategoryDisplayName = (category: string): string => {
  const categoryNames: { [key: string]: string } = {
    painting: 'Painting',
    sculpture: 'Sculpture',
    digital: 'Digital Art',
    photography: 'Photography',
    'mixed-media': 'Mixed Media',
  };
  return categoryNames[category] || category;
};

// Sort options for artworks
export const artworkSortOptions = [
  { value: 'createdAt', label: 'Newest First' },
  { value: '-createdAt', label: 'Oldest First' },
  { value: 'title', label: 'Title A-Z' },
  { value: '-title', label: 'Title Z-A' },
  { value: 'price', label: 'Price Low to High' },
  { value: '-price', label: 'Price High to Low' },
  { value: 'views', label: 'Most Viewed' },
  { value: 'likes', label: 'Most Liked' },
];

// Category options
export const categoryOptions = [
  { value: 'painting', label: 'Painting' },
  { value: 'sculpture', label: 'Sculpture' },
  { value: 'digital', label: 'Digital Art' },
  { value: 'photography', label: 'Photography' },
  { value: 'mixed-media', label: 'Mixed Media' },
];
