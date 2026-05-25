import { create } from "zustand";
import { persist } from "zustand/middleware";
import { classes as teachert1Classes } from "../../mockData/teacher-t-1/classes";
import { classes as teachert2Classes } from "../../mockData/teacher-t-2/classes";
import { Class } from "../../mockData/types";

interface ClassStore {
  classes: Class[];
  addClass: (classData: Omit<Class, "id">) => void;
  updateClass: (classId: number, updates: Partial<Omit<Class, "id">>) => void;
  setClasses: (userId: string) => void;
  getClassById: (classId: number) => Class | undefined;
}

export const useClassStore = create<ClassStore>()(
  persist(
    (set, get) => ({
      classes: [],
      setClasses: (userId) => set(() => {
        if (userId === 't-1') {
          return { classes: teachert1Classes };
        } else if (userId === 't-2') {
          return { classes: teachert2Classes };
        } else if (userId.startsWith('b') || userId.startsWith('s')) {
          return { classes: [...teachert1Classes, ...teachert2Classes] };
        } else {
          return { classes: [] };
        }
      }),
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
      getClassById: (classId) => {
        const cls = get().classes.find((c) => c.id === classId);
        return cls;
      }
    }),
    {
      name: "class-storage",
    },
  ),
);
