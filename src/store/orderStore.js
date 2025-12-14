import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./authStore";

const BASE_URL = "https://shamsi-store-backend.vercel.app";

export const useOrderStore = create((set) => ({
  orders: [],
  loading: false,
  error: null,
  orderSuccess: false,

  createOrder: async (orderData) => {
    try {
      set({ loading: true, error: null, orderSuccess: false });

      const token = useAuthStore.getState().token;
      const headers = {};

      // Add auth header only if user is logged in
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await axios.post(`${BASE_URL}/orders`, orderData, { headers });

      set({
        loading: false,
        orderSuccess: true,
        error: null,
      });

      return res.data;
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to create order",
        loading: false,
        orderSuccess: false,
      });
      throw err;
    }
  },

  fetchOrders: async () => {
    try {
      set({ loading: true, error: null });
      const token = useAuthStore.getState().token;

      if (!token) {
        throw new Error("Authentication required");
      }

      const res = await axios.get(`${BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ orders: res.data, loading: false });
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to fetch orders",
        loading: false,
      });
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      set({ loading: true, error: null });
      const token = useAuthStore.getState().token;

      const res = await axios.put(
        `${BASE_URL}/orders/${orderId}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh orders list
      await useOrderStore.getState().fetchOrders();

      set({ loading: false });
      return res.data;
    } catch (err) {
      set({
        error: err?.response?.data?.message || "Failed to update order status",
        loading: false,
      });
      throw err;
    }
  },

  resetOrderSuccess: () => set({ orderSuccess: false }),
}));

