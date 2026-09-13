import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { PRODUCTS } from '../data/products';

interface WishlistContextType {
  favorites: string[]; // List of product IDs or slugs
  favoriteProducts: Product[];
  favoritesCount: number;
  isFavorite: (idOrSlug: string) => boolean;
  toggleFavorite: (idOrSlug: string) => void;
  addToFavorites: (idOrSlug: string) => void;
  removeFromFavorites: (idOrSlug: string) => void;
  clearFavorites: () => void;
  isFavoritesOverlayOpen: boolean;
  openFavorites: () => void;
  closeFavorites: () => void;
}

const STORAGE_KEY = 'elora_wishlist_favorites_v1';

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to read wishlist from localStorage:', e);
      return [];
    }
  });

  const [isFavoritesOverlayOpen, setIsFavoritesOverlayOpen] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to persist wishlist to localStorage:', e);
    }
  }, [favorites]);

  // Listen to custom window events for opening overlay
  useEffect(() => {
    const handleOpenFavorites = () => setIsFavoritesOverlayOpen(true);
    window.addEventListener('open-favorites-overlay', handleOpenFavorites);
    return () => window.removeEventListener('open-favorites-overlay', handleOpenFavorites);
  }, []);

  const isFavorite = (idOrSlug: string) => {
    return favorites.includes(idOrSlug);
  };

  const toggleFavorite = (idOrSlug: string) => {
    setFavorites((prev) => {
      if (prev.includes(idOrSlug)) {
        return prev.filter((item) => item !== idOrSlug);
      } else {
        return [...prev, idOrSlug];
      }
    });
  };

  const addToFavorites = (idOrSlug: string) => {
    setFavorites((prev) => {
      if (!prev.includes(idOrSlug)) {
        return [...prev, idOrSlug];
      }
      return prev;
    });
  };

  const removeFromFavorites = (idOrSlug: string) => {
    setFavorites((prev) => prev.filter((item) => item !== idOrSlug));
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const openFavorites = () => setIsFavoritesOverlayOpen(true);
  const closeFavorites = () => setIsFavoritesOverlayOpen(false);

  // Derive favorite Products
  const favoriteProducts = useMemo(() => {
    return PRODUCTS.filter((p) => favorites.includes(p.id) || favorites.includes(p.slug));
  }, [favorites]);

  return (
    <WishlistContext.Provider
      value={{
        favorites,
        favoriteProducts,
        favoritesCount: favoriteProducts.length,
        isFavorite,
        toggleFavorite,
        addToFavorites,
        removeFromFavorites,
        clearFavorites,
        isFavoritesOverlayOpen,
        openFavorites,
        closeFavorites,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
