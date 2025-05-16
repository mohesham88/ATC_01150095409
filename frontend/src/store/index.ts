import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Define the store state type
interface AppState {
  // Auth state
  isAuthenticated: boolean;
  user: any | null;
  setUser: (user: any | null) => void;
  setAuthenticated: (isAuthenticated: boolean) => void;

  // UI state
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;
  language: "en" | "ar";
  setLanguage: (language: "en" | "ar") => void;

  // Event state
  selectedEvent: any | null;
  setSelectedEvent: (event: any | null) => void;
  events: any[];
  setEvents: (events: any[]) => void;
}

// Create the store with middleware
export const useStore = create<AppState>()(
  devtools(
    persist(
      (set) => ({
        // Auth state
        isAuthenticated: false,
        user: null,
        setUser: (user) => set({ user }),
        setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),

        // UI state
        theme: "light",
        setTheme: (theme) => set({ theme }),
        language: "en",
        setLanguage: (language) => set({ language }),

        // Event state
        selectedEvent: null,
        setSelectedEvent: (event) => set({ selectedEvent: event }),
        events: [],
        setEvents: (events) => set({ events }),
      }),
      {
        name: "app-storage", // unique name for localStorage
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
        }), // only persist these fields
      }
    )
  )
);
