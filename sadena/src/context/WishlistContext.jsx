'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getWishlist, toggleWishlistItem, clearWishlist } from '@/lib/wishlistService';
import { useUser } from './UserContext';
import { PRODUCTS } from '@/data/products';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useUser();

  // Load wishlist when user changes
  const loadWishlist = useCallback(async () => {
    setIsLoading(true);
    try {
      const ids = await getWishlist(user);
      // Convert IDs to full product objects
      const products = ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
      setWishlist(products);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadWishlist();
  }, [loadWishlist]);

  // Sync local wishlist to DB when user logs in
  useEffect(() => {
    if (isAuthenticated && user && wishlist.length > 0) {
      // 🔒 Future: Sync local wishlist to DB
      console.log(
        'TODO: Sync local wishlist to DB for user:',
        user.id,
        wishlist.map((p) => p.id)
      );
    }
  }, [isAuthenticated, user, wishlist]);

  const addToWishlist = async (product) => {
    // Check if already in wishlist
    if (wishlist.find((item) => item.id === product.id)) {
      return; // Already in wishlist
    }

    // Optimistic update
    setWishlist((prev) => [...prev, product]);

    try {
      await toggleWishlistItem(product.id, user);
    } catch (error) {
      // Revert on error
      setWishlist((prev) => prev.filter((item) => item.id !== product.id));
      console.error('Error adding to wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    // Optimistic update
    const previousWishlist = [...wishlist];
    setWishlist((prev) => prev.filter((item) => item.id !== productId));

    try {
      await toggleWishlistItem(productId, user);
    } catch (error) {
      // Revert on error
      setWishlist(previousWishlist);
      console.error('Error removing from wishlist:', error);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => item.id === productId);
  };

  const clearWishlist = async () => {
    const previousWishlist = [...wishlist];
    setWishlist([]);

    try {
      await clearWishlist(user);
    } catch (error) {
      // Revert on error
      setWishlist(previousWishlist);
      console.error('Error clearing wishlist:', error);
    }
  };

  const value = {
    wishlist,
    totalItems: wishlist.length,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside provider');
  return ctx;
}
