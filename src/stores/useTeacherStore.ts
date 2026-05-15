import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockApiData, MockTeacher } from "../../mockData";

const normalizeTeacherId = (value: string | number) => {
  const raw = String(value);
  const digitsOnly = raw.replace(/\D+/g, "");
  return digitsOnly || raw;
};

const defaultTeacherUser = mockApiData.users.find((user) => user.type === "teacher");

const defaultTeacher: MockTeacher | null =
  defaultTeacherUser && defaultTeacherUser.type === "teacher"
    ? {
        id: Number(normalizeTeacherId(defaultTeacherUser.id)),
        name: defaultTeacherUser.name,
        email: defaultTeacherUser.email,
        school: defaultTeacherUser.school,
        subjects: defaultTeacherUser.subjects,
        yearsExperience: defaultTeacherUser.yearsExperience,
      }
    : null;

interface TeacherStore {
  teacher: MockTeacher | null;
  setTeacher: (teacher: MockTeacher | null) => void;
  updateTeacher: (updates: Partial<MockTeacher>) => void;
  getTeacherById: (teacherId: string | number) => MockTeacher | null;
}

export const useTeacherStore = create<TeacherStore>()(
  persist(
    (set, get) => ({
      teacher: defaultTeacher,
      setTeacher: (teacher) => set({ teacher }),
      updateTeacher: (updates) =>
        set((state) => ({
          teacher: state.teacher ? { ...state.teacher, ...updates } : null,
        })),
      getTeacherById: (teacherId: string | number) => {
        const activeTeacher = get().teacher;
        if (!activeTeacher) return null;

        const currentTeacherId = normalizeTeacherId(activeTeacher.id);
        const requestedTeacherId = normalizeTeacherId(teacherId);

        return currentTeacherId === requestedTeacherId ? activeTeacher : null;
      },
    }),
    {
      name: "teacher-storage",
    },
  ),
);
