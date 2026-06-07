import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {Grades, Student} from "../../mockData/types";
import { students as studentsT1 } from "../../mockData/teacher-t-1/students";
import { students as studentsT2 } from "../../mockData/teacher-t-2/students";
import { useUnitsStore } from "./useUnitsStore";
import { supabase } from "../utils/supabase";

interface StudentStore {
  students: Student[];
  setSupabaseStudents: (userId: string, userType: string) => Promise<void>;
  setStudentEvaluations: () => void;
  addStudent: (firstName: string, lastName: string, class_id: string, school_id?: string, grade?: Grades) => void;
  removeStudentFromClass: (student_id: string, class_id: string) => void;
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
            set(() => ({ students }));
          }
        } else if (userType === 'admin') {
          //TODO: implement fetching all students for admin
          return;
        }
      },
      // setStudents: (userId) => set(() => {
      //     if (userId === 't-1') {
      //       return { students: studentsT1 };
      //     } else if (userId === 't-2') {
      //       return { students: studentsT2 };
      //   } else if (userId.startsWith('b') || userId.startsWith('s')) {
      //       return { students: [...studentsT1, ...studentsT2]}
      //     } else {
      //       return { students: [] };
      //     }
      // }),
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
      addStudent: (firstName: string, lastName: string, class_id: string, school_id = "1", grade?: Grades) =>
        set((state) => {
          const maxId = state.students.reduce(
            (max, student) => Math.max(max, parseInt(student.id)),
            0
          );
          const newStudentId = maxId + 1;
          return {
            students: [
              ...state.students,
              {
                id: newStudentId.toString(),
                name: `${firstName} ${lastName}`,
                class_id: class_id,
                school_id: school_id,
                grade: grade || "1re année"
              } as Student,
            ],
          };
        }),
      removeStudentFromClass: (student_id: string, class_id: string) =>
        set((state) => ({
          students: state.students.map((student) =>
            student.id === student_id
              ? {
                  ...student,
                  class_id: student.class_id,
                }
              : student
          ),
        })),
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
