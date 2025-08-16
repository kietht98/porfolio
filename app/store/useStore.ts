// store/useStore.ts
import { create } from "zustand";

interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
}

export const useStore = create<ThemeStore>((set) => ({
  theme: "light", // default state
  setTheme: (theme) => set({ theme }),
}));
