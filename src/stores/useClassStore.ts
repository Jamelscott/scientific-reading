import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Class, Grades } from "../../mockData/types";
import { useStudentStore } from "./useStudentStore";
import { useTeacherStore } from "./useTeacherStore";
import { useUnitsStore } from "./useUnitsStore";
import { schoolGradeBenchmarks } from "../app/pages/const";
import { supabase } from "../utils/supabase";
import { withLoading } from "../utils/withLoading";

export interface ClassPerformance {
  id: string;
  grade: Grades;
  teacher: string;
  teacherId: string;
  students: number;
  enVoie: number;
}

interface ClassStore {
  classes: Class[];
  addClass: (grade: Grades, schoolYear: number, teacherId: string, boardId: string, schoolId: string) => Promise<void>;
  updateClass: (classId: string, updates: Partial<Omit<Class, "id">>) => Promise<void>;
  removeClass: (classId: string) => Promise<void>;
  getClassById: (classId: string) => Class | undefined;
  getClassBenchmarks: () => Record<Grades, number | null>;
  getClassPerformance: () => ClassPerformance[];
  setSupabaseClasses: (userId: string, userType: string) => Promise<void>;
}

export const useClassStore = create<ClassStore>()(
  persist(
    (set, get) => ({
      classes: [],
      setSupabaseClasses: async (userId, userType) => {
        if (userType === 'teacher') {
          const { data: teacherClasses, error }: { data: Class[] | null; error: any } = await supabase
          .from(`classes`)
          .select("*")
          .eq('teacher_id', userId)
          .order('grade', { ascending: true })

          if (error) {
            throw new Error('Failed to fetch classes: ' + error.message);
          }
          set(() => ({ classes: teacherClasses || [] }))
          return
        } else if (userId === 'board') {
          // return { students: studentsT2 };
        } else if (userType === 'school') {
          const { data: schoolClasses, error }: { data: Class[] | null; error: any } = await supabase
            .from(`classes`)
            .select("*")
            .eq('school_id', userId)
            .order('grade', { ascending: true })

          if (error) {
            throw new Error('Failed to fetch classes: ' + error.message);
          }
          set(() => ({ classes: schoolClasses || [] }))
          return
        } else if (userType === 'admin') {
          // return { students: [] };
          // return { students: [...studentsT1, ...studentsT2]}
        }
    },
      addClass: withLoading(async ( grade, schoolYear, teacherId, boardId, schoolId) => {
        const { data: newClass, error } = await supabase
          .from('classes')
          .insert([
            {
              grade: grade,
              teacher_id: teacherId,
              board_id: boardId,
              school_id: schoolId,
              year: schoolYear,
            }
          ])
          .select()
          .single();

        if (error) {
          console.error('Error adding class:', error.message);
          alert('Failed to add class: ' + error.message);
          return;
        }

        if (newClass) {
          set((state) => ({
            classes: [...state.classes, newClass as Class]
          }));
        }
      }),
      updateClass: withLoading(async (classId: string, updates: Partial<Omit<Class, "id">>) => {
        const { data: updatedClass, error } = await supabase
          .from('classes')
          .update(updates)
          .eq('id', classId)
          .select()
          .single();

        if (error) {
          console.error('Error updating class:', error.message);
          alert('Failed to update class: ' + error.message);
          return;
        }

        if (updatedClass) {
          set((state) => ({
            classes: state.classes.map((cls) =>
              cls.id === classId ? updatedClass as Class : cls
            )
          }));
        }
      }),
      removeClass: withLoading(async (classId: string) => {
        const { error } = await supabase
          .from('classes')
          .delete()
          .eq('id', classId);

        if (error) {
          console.error('Error removing class:', error.message);
          alert('Failed to remove class: ' + error.message);
          return;
        }

        set((state) => ({
          classes: state.classes.filter((cls) => cls.id !== classId)
        }));
      }),
      getClassById: (classId) => {
        const cls = get().classes.find((c) => c.id === classId);
        return cls;
      },
      getClassBenchmarks: () => {
        const classes = get().classes;
        const students = useStudentStore.getState().students;
        const allAnswers = useUnitsStore.getState().answers;
        const uniqueAnswers = Object.values(
          allAnswers.reduce<Record<string, (typeof allAnswers)[number]>>((acc, answer) => {
            const key = `${answer.student_id}::${answer.class_id}::${answer.unit_data_id}`;
            const current = acc[key];
            if (!current) {
              acc[key] = answer;
              return acc;
            }

            const currentUpdatedAt = current.updated_at ?? "";
            const nextUpdatedAt = answer.updated_at ?? "";
            const shouldReplace = nextUpdatedAt > currentUpdatedAt || String(answer.id) > String(current.id);
            if (shouldReplace) {
              acc[key] = answer;
            }

            return acc;
          }, {}),
        );
        // Map grades to schoolGradeBenchmarks categories
        const gradeLevelMap: Record<Grades, keyof typeof schoolGradeBenchmarks> = {
          "Maternelle": "kindergarden",
          "Jardin": "seniorKindergarden",
          "1re année": "gradeOne",
          "2e année": "gradeTwo",
          "3e année": "gradeThree", // Using gradeTwo as fallback for 3e année
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
        const gradeGroups: Record<Grades, string[]> = {
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

        console.log(gradeGroups)
        
        // Calculate percentage for each grade
        Object.entries(gradeGroups).forEach(([grade, classIds]) => {
          if (classIds.length === 0) {
            results[grade as Grades] = null;
            return;
          }
          
          // Get all students in this grade
          const gradeStudents = students.filter((student) =>
            classIds.includes(student.class_id)
          );
          
          if (gradeStudents.length === 0) {
            results[grade as Grades] = null;
            return;
          }
          
          // Get the benchmark thresholds for this grade
          const levelKey = gradeLevelMap[grade as Grades];
          const benchmarks = schoolGradeBenchmarks[levelKey];
          
          // Count students who are onTrack or strongMaster
          let onTrackOrBetter = 0;
          
          gradeStudents.forEach((student) => {
            const studentAnswers = uniqueAnswers.filter(
              (answer) =>
                answer.student_id === student.id &&
                classIds.includes(answer.class_id),
            );

            if (studentAnswers.length === 0) {
              return; // Student has no evaluations, not onTrack
            }
            
            // Count successful evaluations (success or adequate status)
            const successfulEvaluations = studentAnswers.filter(
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
        const allAnswers = useUnitsStore.getState().answers;
        const uniqueAnswers = Object.values(
          allAnswers.reduce<Record<string, (typeof allAnswers)[number]>>((acc, answer) => {
            const key = `${answer.student_id}::${answer.class_id}::${answer.unit_data_id}`;
            const current = acc[key];
            if (!current) {
              acc[key] = answer;
              return acc;
            }

            const currentUpdatedAt = current.updated_at ?? "";
            const nextUpdatedAt = answer.updated_at ?? "";
            const shouldReplace = nextUpdatedAt > currentUpdatedAt || String(answer.id) > String(current.id);
            if (shouldReplace) {
              acc[key] = answer;
            }

            return acc;
          }, {}),
        );
        
        // Map grades to schoolGradeBenchmarks categories
        const gradeLevelMap: Record<Grades, keyof typeof schoolGradeBenchmarks> = {
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
            student.class_id === cls.id
          );
          
          // Get teacher name
          const teacher = teachers.find((t) => t.id === cls.teacher_id);
          const teacherName = teacher?.name || "Enseignant inconnu";
          
          if (!gradeGroups[cls.grade]) {
            gradeGroups[cls.grade] = 0;
          }
          gradeGroups[cls.grade]++;
          
          // Get benchmark for this grade
          const levelKey = gradeLevelMap[cls.grade];
          const benchmarks = schoolGradeBenchmarks[levelKey];
          
          // Count students who are onTrack or better
          let onTrackOrBetter = 0;
          
          classStudents.forEach((student) => {
            const studentAnswers = uniqueAnswers.filter(
              (answer) =>
                answer.student_id === student.id && answer.class_id === cls.id,
            );

            if (studentAnswers.length === 0) {
              return;
            }
            
            // Count successful evaluations
            const successfulEvaluations = studentAnswers.filter(
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
            teacherId: cls.teacher_id,
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
