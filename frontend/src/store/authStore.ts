import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import axiosInstance from "../lib/axios";

export interface User {
  _id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Async actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  register: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        // State
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Actions
        setUser: (user) => set({ user }),
        setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
        setLoading: (isLoading) => set({ isLoading }),
        setError: (error) => set({ error }),

        // Async actions
        login: async (email, password) => {
          try {
            set({ isLoading: true, error: null });
            const response = await fetch(
              `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/signin`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
              }
            );
            const data = await response.json();
            if (response.status !== 200) {
              const message =
                typeof data.message === "object"
                  ? Object.values(data.message)[0]
                  : data.message;
              throw new Error(message);
            }

            console.log(data);

            set({
              user: data,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Login failed",
              isLoading: false,
              isAuthenticated: false,
              user: null,
            });
            throw error;
          }
        },

        logout: async () => {
          try {
            set({ isLoading: true, error: null });
            await fetch(
              `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/signout`,
              {
                method: "POST",
                credentials: "include",
              }
            );
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : "Logout failed",
              isLoading: false,
              isAuthenticated: false,
              user: null,
            });
            throw error;
          }
        },

        checkAuth: async () => {
          try {
            set({ isLoading: true, error: null });
            const response = await fetch(
              `${import.meta.env.VITE_SERVER_URL}/api/v1/profile`,
              {
                credentials: "include",
              }
            );

            if (!response.ok) {
              throw new Error("Not authenticated");
            }

            const data = await response.json();
            set({
              user: data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Authentication check failed",
            });
          }
        },

        register: async (email: string, password: string, username: string) => {
          try {
            set({ isLoading: true, error: null });
            const response = await fetch(
              `${import.meta.env.VITE_SERVER_URL}/api/v1/auth/signup`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password, username }),
              }
            );

            const data = await response.json();
            if (response.status !== 201 && response.status !== 200) {
              const message =
                typeof data.message === "object"
                  ? Object.values(data.message)[0]
                  : data.message;
              throw new Error(message);
            }

            // Call login using the store's method
            const store = useAuthStore.getState();
            await store.login(email, password);
          } catch (error) {
            set({
              error:
                error instanceof Error ? error.message : "Registration failed",
              isLoading: false,
              isAuthenticated: false,
              user: null,
            });
            throw error;
          }
        },

        forgotPassword: async (email: string) => {
          try {
            set({ isLoading: true, error: null });
            await axiosInstance.post("/auth/forgot-password", { email });
            set({ isLoading: false, error: null });
          } catch (error: any) {
            set({
              error:
                error.response?.data?.message || "Failed to send reset email",
              isLoading: false,
            });
            throw error;
          }
        },

        resetPassword: async (token: string, newPassword: string) => {
          try {
            set({ isLoading: true, error: null });
            await axiosInstance.post(`/auth/reset-password/${token}`, {
              password: newPassword,
            });
            set({ isLoading: false, error: null });
          } catch (error: any) {
            set({
              error:
                error.response?.data?.message || "Failed to reset password",
              isLoading: false,
            });
            throw error;
          }
        },
      }),
      {
        name: "auth-storage",
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: "auth-store",
    }
  )
);
