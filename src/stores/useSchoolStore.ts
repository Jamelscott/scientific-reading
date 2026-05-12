import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockApiData } from "../../mockData";
import { MockSchool as School } from "../../mockData";

interface SchoolStore {
  activeSchool: School;
  setActiveSchool: (school: School) => void;
}

export const useSchoolStore = create<SchoolStore>()(
  persist(
    (set) => ({
      activeSchool: mockApiData.schools[0] || null, // default to 1 for now
      setActiveSchool: (school) => set({ activeSchool: school }),
    }),
    {
      name: "school-storage",
    }
  )
);
