import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockApiData } from "../../mockData";

export interface Teacher {
  id: number;
  name: string;
  email: string;
  school: string;
  subjects: string[];
  phoneNumber?: string;
  startDate?: string;
  yearsExperience?: number;
}

interface TeacherStore {
  teacher: Teacher | null;
  setTeacher: (teacher: Teacher) => void;
  updateTeacher: (updates: Partial<Teacher>) => void;
}

export const useTeacherStore = create<TeacherStore>()(
  persist(
    (set) => ({
      teacher: mockApiData.teacher,
      setTeacher: (teacher) => set({ teacher }),
      updateTeacher: (updates) =>
        set((state) => ({
          teacher: state.teacher ? { ...state.teacher, ...updates } : null,
        })),
    }),
    {
      name: "teacher-storage",
    },
  ),
);
