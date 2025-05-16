import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type Theme = "light" | "dark";
type Language = "en" | "ar";

interface UIState {
  theme: Theme;
  language: Language;
  isSidebarOpen: boolean;
  isMobileMenuOpen: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  setLanguage: (language: Language) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        // State
        theme: "light",
        language: "en",
        isSidebarOpen: true,
        isMobileMenuOpen: false,

        // Actions
        setTheme: (theme) => set({ theme }),
        setLanguage: (language) => set({ language }),
        toggleSidebar: () =>
          set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
        toggleMobileMenu: () =>
          set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
        closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      }),
      {
        name: "ui-storage",
        partialize: (state) => ({
          theme: state.theme,
          language: state.language,
        }),
      }
    ),
    {
      name: "ui-store",
    }
  )
);
