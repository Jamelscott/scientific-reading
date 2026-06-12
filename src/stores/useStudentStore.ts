import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {Grades, Student} from "../../mockData/types";
import { students as studentsT1 } from "../../mockData/teacher-t-1/students";
import { students as studentsT2 } from "../../mockData/teacher-t-2/students";
import { useUnitsStore } from "./useUnitsStore";
import { supabase } from "../utils/supabase";
import { withLoading } from "../utils/withLoading";

interface StudentStore {
  students: Student[];
  setSupabaseStudents: (userId: string, userType: string) => Promise<void>;
  setStudentEvaluations: () => void;
  addStudent: (firstName: string, lastName: string, class_id: string, teacher_id: string, school_id: string, board_id: string) => Promise<void>;
  removeStudentFromClass: (student_id: string) => Promise<void>;
  getStudentById: (student_id: string) => Student | undefined;
  getStudentCountByClass: (class_id: string) => number;
  getStudentByClass: (class_id: string) => Student[];
}

export const useStudentStore = create<StudentStore>()(
  persist(
    (set, get) => ({
      students: [] as Student[],        
      setSupabaseStudents: async (user_id, userType) => {
        if (userType === 'teacher') {
          let { data: students, error } = await supabase
          .from('students')
          .select('*')
          .eq('teacher_id', user_id)
          .order('id', { ascending: true })
          if (!students || error) {
            console.error('Error fetching students for teacher:', error?.message);
            alert('Failed to fetch students: ' + error?.message);
            return;
          } else {
            set(() => ({ students }));
          }
        } else if (userType === 'board') {
          let { data: students, error } = await supabase
            .from('students')
            .select('*')
            .eq('board_id', user_id)
            .order('id', { ascending: true })
          if (!students || error) {
            console.error('Error fetching students for board:', error?.message);
            alert('Failed to fetch students: ' + error?.message);
            return;
          } else {
            set(() => ({ students }));
          }
        } else if (userType === 'school') {
          let { data: students, error } = await supabase
            .from('students')
            .select('*')
            .eq('school_id', user_id)
            .order('id', { ascending: true })
          if (!students || error) {
            console.error('Error fetching students for school:', error?.message);
            alert('Failed to fetch students: ' + error?.message);
            return;
          } else {
            console.log(students)
            set(() => ({ students }));
          }
        } else if (userType === 'admin') {
          //TODO: implement fetching all students for admin
          return;
        }
      },
      setStudentEvaluations: () =>
        set((state) => {
          const allAnswers = useUnitsStore.getState().answers;
          
          const studentsWithEvaluations = state.students.map((student) => {
            const studentEvaluations = allAnswers.filter(
              (answer) => answer.student_id === student.id
            );
            
            return {
              ...student,
              evaluations: studentEvaluations || [],
            };
          });
          
          return { students: studentsWithEvaluations };
        }),
      addStudent: withLoading(async (firstName: string, lastName: string, class_id: string, teacher_id: string, school_id: string, board_id: string) => {
        const { data: newStudent, error } = await supabase
          .from('students')
          .insert([
            {
              name: `${firstName} ${lastName}`,
              class_id: class_id,
              teacher_id: teacher_id,
              school_id: school_id,
              board_id: board_id,
            }
          ])
          .select()
          .single();

        if (error) {
          console.error('Error adding student:', error.message);
          alert('Failed to add student: ' + error.message);
          return;
        }

        if (newStudent) {
          set((state) => ({
            students: [...state.students, newStudent as Student]
          }));
          
          // Set evaluations for the newly added student
          get().setStudentEvaluations();
        }
      }),
      removeStudentFromClass: withLoading(async (student_id: string) => {
        const { error } = await supabase
          .from('students')
          .delete()
          .eq('id', student_id);

        if (error) {
          console.error('Error removing student:', error.message);
          alert('Failed to remove student: ' + error.message);
          return;
        }

        set((state) => ({
          students: state.students.filter((student) => student.id !== student_id)
        }));
      }),
      getStudentById(student_id: string): Student | undefined {
        const student = get().students.find((s: Student) => s.id === student_id);
        return student;
      },
      getStudentCountByClass(class_id: string): number {
        return get().students.filter((student) => student.class_id === class_id).length;
      },
      getStudentByClass(class_id: string): Student[] {
        return get().students.filter((student) => student.class_id === class_id);
      },
    }),
    {
      name: "student-storage",
    },
  ),
);
