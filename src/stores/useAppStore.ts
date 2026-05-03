import { create } from "zustand";
import { persist } from "zustand/middleware";
import i18n from "../i18n";

interface AppStore {
  language: string;
  theme: "light" | "dark";
  sidebarOpen: boolean;
  setLanguage: (lang: string) => void;
  setTheme: (theme: "light" | "dark") => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      language: i18n.language || "fr",
      theme: "light",
      sidebarOpen: true,
      setLanguage: (lang) => {
        i18n.changeLanguage(lang);
        set({ language: lang });
      },
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: "app-settings",
    },
  ),
);
