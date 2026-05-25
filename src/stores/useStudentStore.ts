import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {Grades, Student} from "../../mockData/types";
import { students as studentsT1 } from "../../mockData/teacher-t-1/students";
import { students as studentsT2 } from "../../mockData/teacher-t-2/students";


interface StudentStore {
  students: Student[];
  setStudents: (userId: string) => void;
  addStudent: (firstName: string, lastName: string, classIds?: number[], schoolId?: number, grade?: Grades) => void;
  removeStudentFromClass: (studentId: number, classId: number) => void;
  getStudentById: (studentId: string) => Student | undefined;
  getStudentCountByClass: (classId: number) => number;
  getStudentByClass: (classId: number) => Student[];
}

export const useStudentStore = create<StudentStore>()(
  persist(
    (set, get) => ({
      students: [],        
      setStudents: (userId) => set(() => {
          if (userId === 't-1') {
            return { students: studentsT1 };
          } else if (userId === 't-2') {
            return { students: studentsT2 };
        } else if (userId.startsWith('b') || userId.startsWith('s')) {
            return { students: [...studentsT1, ...studentsT2]}
          } else {
            return { students: [] };
          }
      }),
      addStudent: (firstName: string, lastName: string, classIds = [], schoolId = 1, grade) =>
        set((state) => {
          const maxId = state.students.reduce(
            (max, student) => Math.max(max, student.id),
            0
          );
          const newStudentId = maxId + 1;
          return {
            students: [
              ...state.students,
              {
                id: newStudentId,
                name: `${firstName} ${lastName}`,
                classIds: classIds,
                schoolId: schoolId,
                grade: grade || "1re année"
              },
            ],
          };
        }),
      removeStudentFromClass: (studentId, classId) =>
        set((state) => ({
          students: state.students.map((student) =>
            student.id === studentId
              ? {
                  ...student,
                  classIds: student.classIds.filter((id) => id !== classId),
                }
              : student
          ),
        })),
        getStudentById(studentId: string): Student | undefined {
          const student = get().students.find((s: Student) => s.id === parseInt(studentId));
          return student;
        },
        getStudentCountByClass(classId: number): number {
          return get().students.filter((student) => student.classIds.includes(classId)).length;
        },
        getStudentByClass(classId: number): Student[] {
          return get().students.filter((student) => student.classIds.includes(classId));
        },
    }),
    {
      name: "student-storage",
    },
  ),
);
