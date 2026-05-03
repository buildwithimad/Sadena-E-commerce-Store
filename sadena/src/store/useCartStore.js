'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      // UI
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      // =========================
      // ADD ITEM
      // =========================
      addItem: (item) => {
        const { items } = get();

        const existing = items.find((i) => i.id === item.id);

        let updated;

        if (existing) {
          updated = items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + (item.quantity || 1) }
              : i
          );
        } else {
          updated = [...items, { ...item, quantity: item.quantity || 1 }];
        }

        set({ items: updated });
      },

      // =========================
      // REMOVE ITEM
      // =========================
      removeItem: (id) => {
        const { items } = get();
        set({ items: items.filter((i) => i.id !== id) });
      },

      // =========================
      // UPDATE QUANTITY
      // =========================
      updateQuantity: (id, quantity) => {
        const { items } = get();

        const updated =
          quantity <= 0
            ? items.filter((i) => i.id !== id)
            : items.map((i) =>
                i.id === id ? { ...i, quantity } : i
              );

        set({ items: updated });
      },

      // =========================
      // CLEAR CART
      // =========================
      clearCart: () => set({ items: [] }),

      // =========================
      // TOTALS
      // =========================
      totalItems: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),

      totalPrice: () =>
        get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'sadena-cart',
    }
  )
);

export const useCart = () => useCartStore();
export default useCartStore;