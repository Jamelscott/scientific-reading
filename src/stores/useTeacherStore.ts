import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser, Teacher } from "../../mockData/types";
import { teachers as allTeachers } from "../../mockData/users";

interface TeacherStore {
  teacher: Teacher | null;
  teachers: Teacher[] | null;
  setTeacher: (teacher: AuthUser | null) => void;
  setTeachersForSchool: (schoolId: string) => void;
  updateTeacher: (updates: Teacher) => void;
  updateTeachers: (updates: Teacher) => void;
  removeTeacher: (teacherId: string) => void;
  getTeacherById: (teacherId: string | number) => Teacher | null | void;
}

const normalizeTeacherId = (value: string | number) => {
  const raw = String(value);
  const digitsOnly = raw.replace(/\D+/g, "");
  return digitsOnly || raw;
};
  
export const useTeacherStore = create<TeacherStore>()(
  persist(
    (set, get) => ({
      teacher: null,
      teachers: null,
      setTeacher: (user) => {
        if (user && user.type === "teacher") {
          const teacher: Teacher = {
            id: normalizeTeacherId(user.id),
            type: user.type,
            password: user.password,
            boardName: user.boardName,
            name: user.name,
            email: user.email,
            school: user.school,
            schoolId: user.schoolId,
            boardId: user.boardId,
            subjects: user.subjects,
            yearsExperience: user.yearsExperience,
          };
          set({ teacher });
        } else {
          set({ teacher: null, teachers: null });
        }
      },
      setTeachersForSchool: (schoolId) => {
        const filteredTeachers = allTeachers.filter(
          (teacher) => teacher.schoolId === schoolId
        );
        set({ teachers: filteredTeachers });
      },
      updateTeacher: (updates) =>
        set((state) => ({
          teacher: state.teacher ? { ...state.teacher, ...updates } : null,
        })),
      updateTeachers: (updates) =>
        set((state) => {
          if (!state.teachers || state.teachers.length === 0) {
            return { teachers: [updates] };
          }
          
          const teacherExists = state.teachers.some((teacher) => teacher.id === updates.id);
          
          if (teacherExists) {
            const updatedTeachers = state.teachers.map((teacher) => 
              teacher.id === updates.id 
                ? { ...teacher, ...updates } 
                : teacher
            );
            return { teachers: updatedTeachers };
          } else {
            return { teachers: [...state.teachers, updates] };
          }
        }),
      removeTeacher: (teacherId) =>
        set((state) => ({
          teachers: state.teachers
            ? state.teachers.filter((teacher) => teacher.id !== teacherId)
            : null,
        })),
      getTeacherById: (teacherId: string | number) => {
        const activeTeacher = get().teacher;
        if (Array.isArray(activeTeacher)) {
          return console.error("Expected a single teacher but found an array. Please check the data structure.");
        }

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
