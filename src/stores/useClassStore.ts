import { create } from "zustand";
import { persist } from "zustand/middleware";
import { classes } from "../../mockData/classes";
import { Class } from "../../mockData/types";

interface ClassStore {
  classes: Class[];
  addClass: (classData: Omit<Class, "id">) => void;
  updateClass: (classId: number, updates: Partial<Omit<Class, "id">>) => void;
  setClasses: (classes: Class[]) => void;
}

export const useClassStore = create<ClassStore>()(
  persist(
    (set) => ({
      classes: classes,
      addClass: (classData) =>
        set((state) => {
          const maxId = state.classes.reduce(
            (max, cls) => Math.max(max, cls.id),
            0
          );
          return {
            classes: [
              ...state.classes,
              {
                id: maxId + 1,
                ...classData,
                schoolYear: classData.schoolYear,
                studentIds: [],
              },
            ],
          };
        }),
      updateClass: (classId, updates) =>
        set((state) => ({
          classes: state.classes.map((cls) =>
            cls.id === classId ? { ...cls, ...updates } : cls
          ),
        })),
      setClasses: (classes) => set({ classes }),
    }),
    {
      name: "class-storage",
    },
  ),
);
