import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser, Teacher } from "../../mockData/types";
import { teachers as allTeachers } from "../../mockData/users";
import { supabase } from "../utils/supabase";
import { withLoading } from "../utils/withLoading";

interface TeacherStore {
  teacher: Teacher | null;
  teachers: Teacher[] | null;
  setSupabaseTeacher: (userId: string, userType: string) => Promise<void>;
  setTeachersForSchool: (schoolId: string) => void;
  addTeacher: (teacher: Partial<Teacher>) => void;
  updateTeacher: (updates: Partial<Teacher>) => Promise<void>;
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
      setSupabaseTeacher: async (userId: string, userType: string) => {
        if (userType === 'teacher') {
          const { data: teacher, error } = await supabase
            .from('teachers')
            .select('*, school:schools(name), board:boards(name)')
            .eq('id', userId)
            .single();
          if (error) {
            console.error('Error fetching teacher:', error.message);
            alert('Failed to fetch teacher: ' + error.message);
            return;
          }

          if (teacher) {
            set({ teacher: teacher as Teacher });
            return;
          }
        } else if (userType === 'school') {
          const { data: teachers, error } = await supabase
            .from('teachers')
            .select('*, school:schools(name), board:boards(name)')
            .eq('school_id', userId)
            .order('id', { ascending: true });
          if (error) {
            console.error('Error fetching teachers for school:', error.message);
            alert('Failed to fetch teachers: ' + error.message);
            return;
          }

          if (teachers) {
            set({ teachers: teachers as Teacher[] });
            return;
          } else {
            set({ teachers: null });
            return;
          }
        }
      },
      setTeachersForSchool: (schoolId) => {
        const filteredTeachers = allTeachers.filter(
          (teacher) => teacher.school_id === schoolId
        );
        set({ teachers: filteredTeachers });
      },
      updateTeacher: withLoading(async (updates: Partial<Teacher>) => {
        const currentTeacher = get().teacher;
        if (!currentTeacher) {
          console.error('No teacher to update');
          return;
        }

        const { data, error } = await supabase
          .from('teachers')
          .update(updates)
          .eq('id', currentTeacher.id)
          .select()
          .single();

        if (error) {
          console.error('Error updating teacher:', error.message);
          alert('Failed to update teacher: ' + error.message);
          return;
        }

        if (data) {
          set((state) => ({
            teacher: state.teacher ? { ...state.teacher, ...data } : null,
          }));
        }
      }),
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
      addTeacher: withLoading(async (teacher) => {
        const { data, error } = await supabase
          .from('teachers')
          .insert([teacher])
          .select()
          .single();

        if (error) {
          console.error('Error adding teacher:', error.message);
          alert('Failed to add teacher: ' + error.message);
          return;
        }

        if (data) {
          set((state) => ({
            teachers: state.teachers ? [...state.teachers, data as Teacher] : [data as Teacher],
          }));
        }
      }),
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
