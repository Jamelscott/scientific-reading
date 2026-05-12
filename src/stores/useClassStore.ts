import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockApiData } from "../../mockData";

export interface Class {
  id: number;
  name: string;
  grade: string;
  studentCount: number;
  studentIds: number[];
  schoolYear: string;
}

interface ClassStore {
  classes: Class[];
  activeClass: Class | null;
  addClass: (classData: Omit<Class, "id">) => void;
  addStudentToClass: (classId: number, studentId: number) => void;
  removeStudentFromClass: (classId: number, studentId: number) => void;
  updateClass: (classId: number, updates: Partial<Omit<Class, "id">>) => void;
  setClasses: (classes: Class[]) => void;
}

export const useClassStore = create<ClassStore>()(
  persist(
    (set) => ({
      classes: mockApiData.classes,
      activeClass: mockApiData.classes[0] || null,
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
                studentIds: [],
              },
            ],
          };
        }),
      addStudentToClass: (classId, studentId) =>
        set((state) => ({
          classes: state.classes.map((cls) =>
            cls.id === classId
              ? {
                  ...cls,
                  studentIds: [...cls.studentIds, studentId],
                  studentCount: cls.studentIds.length + 1,
                }
              : cls
          ),
        })),
      removeStudentFromClass: (classId, studentId) =>
        set((state) => ({
          classes: state.classes.map((cls) =>
            cls.id === classId
              ? {
                  ...cls,
                  studentIds: cls.studentIds.filter((id) => id !== studentId),
                  studentCount: Math.max(0, cls.studentCount - 1),
                }
              : cls
          ),
        })),
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
