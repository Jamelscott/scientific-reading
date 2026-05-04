import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockApiData } from "../../mockData";
import { useClassStore } from "./useClassStore";

export interface Student {
  id: number;
  name: string;
  classIds: number[];
  schoolId: number;
}

interface StudentStore {
  students: Student[];
  addStudent: (firstName: string, lastName: string, classIds?: number[], schoolId?: number) => void;
  removeClassFromStudent: (studentId: number, classId: number) => void;
}

export const useStudentStore = create<StudentStore>()(
  persist(
    (set) => ({
      students: mockApiData.students,
      addStudent: (firstName: string, lastName: string, classIds = [], schoolId = 1) =>
        set((state) => {
          const maxId = state.students.reduce(
            (max, student) => Math.max(max, student.id),
            0
          );
          const newStudentId = maxId + 1;
          // Update class store for each classId
          classIds.forEach((classId) => {
            useClassStore.getState().addStudentToClass(classId, newStudentId);
          });
          return {
            students: [
              ...state.students,
              {
                id: newStudentId,
                name: `${firstName} ${lastName}`,
                classIds: classIds,
                schoolId: schoolId,
              },
            ],
          };
        }),
      removeClassFromStudent: (studentId, classId) =>
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
    }),
    {
      name: "student-storage",
    },
  ),
);
