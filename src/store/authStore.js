import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

const BASE_URL = "https://shamsi-store-backend.vercel.app";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      loading: false,
      error: null,

      // ✅ CLEAR ERROR (NEW)
      clearError: () => set({ error: null }),

      registerUser: async (formData, callback) => {
        try {
          set({ loading: true, error: null });

          const res = await axios.post(`${BASE_URL}/auth/register`, formData);

          set({ loading: false });

          if (callback) {
            callback(
              res?.data?.message ||
                "Registration successful! Please verify your email."
            );
          }
        } catch (err) {
          set({
            error: err?.response?.data?.message || "Registration failed",
            loading: false,
          });
        }
      },

      loginUser: async (formData, callback) => {
        try {
          set({ loading: true, error: null });

          const res = await axios.post(`${BASE_URL}/auth/login`, formData);

          const { token, userName, role } = res.data;

          set({
            user: userName,
            token,
            role,
            loading: false,
          });

          if (callback) callback(role);
        } catch (err) {
          set({
            error: err?.response?.data?.message || "Login failed",
            loading: false,
          });
        }
      },

      logoutUser: () => {
        set({
          user: null,
          token: null,
          role: null,
          error: null,
        });
      },
    }),
    {
      name: "auth-storage",
      getStorage: () => localStorage,
    }
  )
);
