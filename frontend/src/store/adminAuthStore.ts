import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { adminAxiosInstance } from "../lib/axios";

interface AdminAuthState {
  isAdminAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setAdminAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Async actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  devtools(
    persist(
      (set) => ({
        // State
        isAdminAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        setAdminAuthenticated: (isAuthenticated) =>
          set({ isAdminAuthenticated: isAuthenticated }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),

        // Async actions
        login: async (email, password) => {
          try {
            set({ isLoading: true, error: null });
            const response = await adminAxiosInstance.post(`/auth/signin`, {
              email,
              password,
            });

            if (response.status < 200 || response.status >= 300) {
              throw new Error("Invalid credentials");
            }

            const auth = response.data;
            localStorage.setItem("adminAuth", JSON.stringify(auth));
            set({ isAdminAuthenticated: true, isLoading: false, error: null });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Login failed",
              isLoading: false,
              isAdminAuthenticated: false,
            });
            throw error;
          }
        },

        logout: async () => {
          try {
            set({ isLoading: true, error: null });
            await adminAxiosInstance.post(`/auth/signout`);
            localStorage.removeItem("adminAuth");
            set({
              isAdminAuthenticated: false,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Logout failed",
              isLoading: false,
              isAdminAuthenticated: false,
            });
            throw error;
          }
        },

        checkAuth: async () => {
          try {
            set({ isLoading: true, error: null });
            const auth = localStorage.getItem("adminAuth");
            if (!auth) {
              throw new Error("Not authenticated");
            }
            set({
              isAdminAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              isAdminAuthenticated: false,
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Authentication check failed",
            });
          }
        },
      }),
      {
        name: "admin-auth-storage",
      }
    )
  )
);
