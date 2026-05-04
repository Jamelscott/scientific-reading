import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface School {
  id: number;
  name: string;
}

interface SchoolStore {
  activeSchoolId: number;
  setActiveSchoolId: (id: number) => void;
}

export const useSchoolStore = create<SchoolStore>()(
  persist(
    (set) => ({
      activeSchoolId: 1, // default to 1 for now
      setActiveSchoolId: (id) => set({ activeSchoolId: id }),
    }),
    {
      name: "school-storage",
    }
  )
);
