import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Artwork } from '../types';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (artwork: Artwork, quantity?: number) => void;
  removeItem: (artworkId: string) => void;
  updateQuantity: (artworkId: string, quantity: number) => void;
  clearCart: () => void;
  isInCart: (artworkId: string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (artwork: Artwork, quantity: number = 1) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.artwork._id === artwork._id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.artwork._id === artwork._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { artwork, quantity }];
      }
    });
  };

  const removeItem = (artworkId: string) => {
    setItems(prevItems => prevItems.filter(item => item.artwork._id !== artworkId));
  };

  const updateQuantity = (artworkId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(artworkId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.artwork._id === artworkId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (artworkId: string) => {
    return items.some(item => item.artwork._id === artworkId);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.artwork.price * item.quantity), 0);

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
