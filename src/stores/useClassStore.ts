import { create } from "zustand";
import { persist } from "zustand/middleware";
import { classes as teachert1Classes } from "../../mockData/teacher-t-1/classes";
import { classes as teachert2Classes } from "../../mockData/teacher-t-2/classes";
import { Class, Grades } from "../../mockData/types";
import { useStudentStore } from "./useStudentStore";
import { useTeacherStore } from "./useTeacherStore";
import { schoolLevel } from "../app/pages/const";

export interface ClassPerformance {
  id: number;
  grade: Grades;
  teacher: string;
  teacherId: string;
  students: number;
  enVoie: number;
}

interface ClassStore {
  classes: Class[];
  addClass: (classData: Omit<Class, "id">) => void;
  updateClass: (classId: number, updates: Partial<Omit<Class, "id">>) => void;
  setClasses: (userId: string) => void;
  getClassById: (classId: number) => Class | undefined;
  getClassBenchmarks: () => Record<Grades, number | null>;
  getClassPerformance: () => ClassPerformance[];
}

export const useClassStore = create<ClassStore>()(
  persist(
    (set, get) => ({
      classes: [],
      setClasses: (userId) => set(() => {
        if (userId === 't-1') {
          return { classes: teachert1Classes };
        } else if (userId === 't-2') {
          return { classes: teachert2Classes };
        } else if (userId.startsWith('b') || userId.startsWith('s')) {
          return { classes: [...teachert1Classes, ...teachert2Classes] };
        } else {
          return { classes: [] };
        }
      }),
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
                schoolYear: classData.schoolYear,
                studentIds: [],
              },
            ],
          };
        }),
      updateClass: (classId, updates) =>
        set((state) => ({
          classes: state.classes.map((cls) =>
            cls.id === classId ? { ...cls, ...updates } : cls
          ),
        })),
      getClassById: (classId) => {
        const cls = get().classes.find((c) => c.id === classId);
        return cls;
      },
      getClassBenchmarks: () => {
        const classes = get().classes;
        const students = useStudentStore.getState().students;
        
        // Map grades to schoolLevel categories
        const gradeLevelMap: Record<Grades, keyof typeof schoolLevel> = {
          "Maternelle": "kindergarden",
          "Jardin": "seniorKindergarden",
          "1re année": "gradeOne",
          "2e année": "gradeTwo",
          "3e année": "gradeTwo", // Using gradeTwo as fallback for 3e année
        };
        
        // Initialize results for each grade
        const results: Record<Grades, number | null> = {
          "Maternelle": null,
          "Jardin": null,
          "1re année": null,
          "2e année": null,
          "3e année": null,
        };
        
        // Group classes by grade
        const gradeGroups: Record<Grades, number[]> = {
          "Maternelle": [],
          "Jardin": [],
          "1re année": [],
          "2e année": [],
          "3e année": [],
        };
        
        // Collect all class IDs for each grade
        classes.forEach((cls) => {
          gradeGroups[cls.grade].push(cls.id);
        });
        
        // Calculate percentage for each grade
        Object.entries(gradeGroups).forEach(([grade, classIds]) => {
          if (classIds.length === 0) {
            results[grade as Grades] = null;
            return;
          }
          
          // Get all students in this grade
          const gradeStudents = students.filter((student) =>
            student.classIds.some((classId) => classIds.includes(classId))
          );
          
          if (gradeStudents.length === 0) {
            results[grade as Grades] = null;
            return;
          }
          
          // Get the benchmark thresholds for this grade
          const levelKey = gradeLevelMap[grade as Grades];
          const benchmarks = schoolLevel[levelKey];
          
          // Count students who are onTrack or strongMaster
          let onTrackOrBetter = 0;
          
          gradeStudents.forEach((student) => {
            if (!student.evaluations || student.evaluations.length === 0) {
              return; // Student has no evaluations, not onTrack
            }
            
            // Count successful evaluations (success or adequate status)
            const successfulEvaluations = student.evaluations.filter(
              (evaluation) => evaluation.status === "success" || evaluation.status === "adequate"
            ).length;
            
            // Check if student is onTrack or strongMaster based on successful evaluations
            if (successfulEvaluations >= benchmarks.onTrack) {
              onTrackOrBetter++;
            }
          });
          
          // Calculate percentage
          const percentage = (onTrackOrBetter / gradeStudents.length) * 100;
          results[grade as Grades] = Math.round(percentage);
        });
        
        return results;
      },
      getClassPerformance: () => {
        const classes = get().classes;
        const students = useStudentStore.getState().students;
        const teachers = useTeacherStore.getState().teachers || [];
        
        // Map grades to schoolLevel categories
        const gradeLevelMap: Record<Grades, keyof typeof schoolLevel> = {
          "Maternelle": "kindergarden",
          "Jardin": "seniorKindergarden",
          "1re année": "gradeOne",
          "2e année": "gradeTwo",
          "3e année": "gradeTwo",
        };
        
        // Group classes by grade to assign letters (A, B, C, etc.)
        const gradeGroups: Record<string, number> = {};
        
        return classes.map((cls) => {
          // Get students in this class
          const classStudents = students.filter((student) =>
            student.classIds.includes(cls.id)
          );
          
          // Get teacher name
          const teacher = teachers.find((t) => t.id === cls.teacherId);
          const teacherName = teacher?.name || "Enseignant inconnu";
          
          // Generate class name (e.g., "Maternelle A", "Jardin B")
          if (!gradeGroups[cls.grade]) {
            gradeGroups[cls.grade] = 0;
          }
          const letterIndex = gradeGroups[cls.grade];
          gradeGroups[cls.grade]++;
          
          // Get benchmark for this grade
          const levelKey = gradeLevelMap[cls.grade];
          const benchmarks = schoolLevel[levelKey];
          
          // Count students who are onTrack or better
          let onTrackOrBetter = 0;
          
          classStudents.forEach((student) => {
            if (!student.evaluations || student.evaluations.length === 0) {
              return;
            }
            
            // Count successful evaluations
            const successfulEvaluations = student.evaluations.filter(
              (evaluation) => evaluation.status === "success" || evaluation.status === "adequate"
            ).length;
            
            if (successfulEvaluations >= benchmarks.onTrack) {
              onTrackOrBetter++;
            }
          });
          
          // Calculate percentage
          const percentage = classStudents.length > 0
            ? Math.round((onTrackOrBetter / classStudents.length) * 100)
            : 0;
          
          return {
            id: cls.id,
            grade: cls.grade,
            teacher: teacherName,
            teacherId: cls.teacherId,
            students: classStudents.length,
            enVoie: percentage,
          };
        });
      },
    }),
    {
      name: "class-storage",
    },
  ),
);
