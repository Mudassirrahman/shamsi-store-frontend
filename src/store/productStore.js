import { create } from "zustand";
import axios from "axios";
import { useAuthStore } from "./authStore";

const BASE_URL = "http://localhost:8080";

export const useProductStore = create((set) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    try {
      set({ loading: true });

      const token = useAuthStore.getState().token;

      const res = await axios.get(`${BASE_URL}/products`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      set({ products: res.data, loading: false });
    } catch (err) {
      console.error("Fetch Error:", err);
      set({ error: "Failed to fetch", loading: false });
    }
  },

  fetchPublicProducts: async () => {
    try {
      set({ loading: true });

      const res = await axios.get(`${BASE_URL}/products`); 
      set({ products: res.data, loading: false });
    } catch (err) {
      console.error("Public Fetch Error:", err);
      set({ error: "Failed to load products", loading: false });
    }
  },

  addProduct: async (formData) => {
    try {
      set({ loading: true });
      const token = useAuthStore.getState().token;

      await axios.post(`${BASE_URL}/products`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await useProductStore.getState().fetchProducts();
    } catch (err) {
      console.error("Add Error:", err);
      set({ error: "Add failed", loading: false });
    }
  },

  updateProduct: async (id, formData) => {
    try {
      set({ loading: true });
      const token = useAuthStore.getState().token;

      await axios.put(`${BASE_URL}/products/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await useProductStore.getState().fetchProducts();
    } catch (err) {
      console.error("Update Error:", err);
      set({ error: "Update failed", loading: false });
    }
  },

  deleteProduct: async (id) => {
    try {
      set({ loading: true });
      const token = useAuthStore.getState().token;

      await axios.delete(`${BASE_URL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      await useProductStore.getState().fetchProducts();
    } catch (err) {
      console.error("Delete Error:", err);
      set({ error: "Delete failed", loading: false });
    }
  },
}));
