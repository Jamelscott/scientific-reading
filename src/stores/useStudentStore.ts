import { create } from "zustand";
import { persist } from "zustand/middleware";
import { students } from '../../mockData/students';
import type {Grades, Student} from "../../mockData/types";


interface StudentStore {
  students: Student[];
  addStudent: (firstName: string, lastName: string, classIds?: number[], schoolId?: number, grade?: Grades) => void;
  addStudentToClass: (studentId: number, classId: number) => void;
  removeStudentFromClass: (studentId: number, classId: number) => void;
  getStudentById: (studentId: string) => Student | undefined;
  getStudentCountByClass: (classId: number) => number;
}

export const useStudentStore = create<StudentStore>()(
  persist(
    (set, get) => ({
      students: students,
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
      addStudentToClass: (studentId, classId) =>
        set((state) => ({
          students: state.students.map((student) =>
            student.id === studentId
              ? {
                  ...student,
                  classIds: student.classIds.includes(classId)
                    ? student.classIds
                    : [...student.classIds, classId],
                }
              : student
          ),
        })),
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
        }
    }),
    {
      name: "student-storage",
    },
  ),
);
