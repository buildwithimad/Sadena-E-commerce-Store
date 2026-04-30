'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      user: null, // inject from outside

      // =========================
      // SET USER (important)
      // =========================
      setUser: (user) => set({ user }),

      // =========================
      // CART UI
      // =========================
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // =========================
      // ADD ITEM
      // =========================
      addItem: async (item) => {
        const { items, user } = get();

        const existing = items.find((i) => i.id === item.id && i.sku === item.sku);

        let updated;

        if (existing) {
          updated = items.map((i) =>
            i.id === item.id && i.sku === item.sku
              ? { ...i, quantity: i.quantity + (item.quantity || 1) }
              : i
          );
        } else {
          updated = [...items, { ...item, quantity: item.quantity || 1 }];
        }

        // optimistic update
        set({ items: updated });

        // 🔒 If logged in → sync to DB
        if (user) {
          try {
            await fetch('/api/cart', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ item }),
            });
          } catch (err) {
            console.error('Cart sync error:', err);
          }
        }
      },

      // =========================
      // REMOVE ITEM
      // =========================
      removeItem: async (id, sku) => {
        const { items, user } = get();

        const updated = items.filter((i) => !(i.id === id && i.sku === sku));

        set({ items: updated });

        if (user) {
          try {
            await fetch(`/api/cart/${id}`, {
              method: 'DELETE',
            });
          } catch (err) {
            console.error('Cart remove error:', err);
          }
        }
      },

      // =========================
      // UPDATE QUANTITY
      // =========================
      updateQuantity: async (id, sku, quantity) => {
        const { items, user } = get();

        const updated =
          quantity <= 0
            ? items.filter((i) => !(i.id === id && i.sku === sku))
            : items.map((i) => (i.id === id && i.sku === sku ? { ...i, quantity } : i));

        set({ items: updated });

        if (user) {
          try {
            await fetch('/api/cart/update', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id, sku, quantity }),
            });
          } catch (err) {
            console.error('Cart update error:', err);
          }
        }
      },

      // =========================
      // CLEAR CART
      // =========================
      clearCart: async () => {
        const { user } = get();

        set({ items: [] });

        if (user) {
          try {
            await fetch('/api/cart/clear', {
              method: 'DELETE',
            });
          } catch (err) {
            console.error('Cart clear error:', err);
          }
        }
      },

      // =========================
      // TOTALS (derived)
      // =========================
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'sadena-cart', // localStorage key
    }
  )
);

// Export both the store and a useCart hook for compatibility
export const useCart = () => useCartStore();
export default useCartStore;
