import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cartItems: [],

  addToCart: (product) => {
    const items = get().cartItems;
    const existing = items.find((item) => item._id === product._id);

    if (existing) {
      const updatedCart = items.map((item) =>
        item._id === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      set({ cartItems: updatedCart });
    } else {
      set({ cartItems: [...items, { ...product, quantity: 1 }] });
    }
  },

  removeFromCart: (productId) => {
    const updatedCart = get().cartItems.filter(
      (item) => item._id !== productId
    );
    set({ cartItems: updatedCart });
  },

  clearCart: () => set({ cartItems: [] }),

  updateQuantity: (productId, quantity) => {
    const updatedCart = get().cartItems.map((item) =>
      item._id === productId ? { ...item, quantity } : item
    );
    set({ cartItems: updatedCart });
  },

  cartTotal: () => {
    return get().cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  },
  resetCart: () => set({ cartItems: [] }),
    }),
    {
      name: "cart-storage",
      getStorage: () => localStorage,
    }
  )
);
