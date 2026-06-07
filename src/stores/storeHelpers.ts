import { Class, Grades, Student, Teacher } from "../../mockData/types";
import { schoolLevel } from "../app/pages/const";
import { useClassStore } from "./useClassStore";
import { useStudentStore } from "./useStudentStore";
import { useTeacherStore } from "./useTeacherStore";
import { useSchoolStore } from "./useSchoolStore";
import { useUnitsStore } from "./useUnitsStore";
import { useAppStore } from "./useAppStore";
import { mockApiData } from "../../mockData";
import { useAuthStore } from "./useAuthStore";

export interface StudentForAcademics {
  id: number;
  name: string;
  className: string;
  grade: Grades;
  teacher: string;
  teacherId: string;
  classId: number;
  atelier: number;
  enVoie: boolean;
}

export interface TeacherPerformance {
  id: string;
  name: string;
  numClasses: number;
  grades: Grades[];
  classes: string[];
  students: number;
  avgCompleted: number;
  avgAtelier: number;
  enVoie: number;
}

export const getStudentsForAcademics = (): StudentForAcademics[] => {
  const students = useStudentStore.getState().students;
  const classes: Class[] = useClassStore.getState().classes;
  const teachers: Teacher[] = useTeacherStore.getState().teachers || [];

  // Map grades to schoolLevel categories
  const gradeLevelMap: Record<Grades, keyof typeof schoolLevel> = {
    "Maternelle": "kindergarden",
    "Jardin": "seniorKindergarden",
    "1re année": "gradeOne",
    "2e année": "gradeTwo",
    "3e année": "gradeTwo",
  };

  // Track class names by grade for consistent naming
  const gradeClassCount: Record<string, number> = {};
  const classNameCache: Record<number, string> = {};

  // Pre-generate class names
  classes.forEach((cls: Class) => {
    if (!gradeClassCount[cls.grade]) {
      gradeClassCount[cls.grade] = 0;
    }
    const letter = String.fromCharCode(65 + gradeClassCount[cls.grade]); // A, B, C, etc.
    classNameCache[cls.id] = `${cls.grade}`;
    gradeClassCount[cls.grade]++;
  });

  return students.map((student) => {
    // Get the first class (primary class) for the student
    const primaryClassId = student['class_id'][0];
    const primaryClass = classes.find((cls: Class) => cls.id === primaryClassId);

    const grade = primaryClass?.grade || "Maternelle";
    const className = classNameCache[primaryClassId] || "Unknown Class";

    // Get teacher for this class
    const teacher = teachers.find((t: Teacher) => t.id === primaryClass?.teacherId);
    const teacherName = teacher?.name || "Unknown Teacher";

    // Calculate current atelier from successful evaluations
    let atelier = 0;
    if (student.evaluations && student.evaluations.length > 0) {
      const successfulEvaluations = student.evaluations.filter(
        (evaluation) => evaluation.status === "success" || evaluation.status === "adequate"
      ).length;
      atelier = successfulEvaluations;
    }

    // Determine enVoie status
    const levelKey = gradeLevelMap[grade as Grades];
    const benchmarks = schoolLevel[levelKey];
    const enVoie = atelier >= benchmarks.onTrack;

    return {
      id: student.id,
      name: student.name,
      className,
      grade,
      teacher: teacherName,
      teacherId: primaryClass?.teacherId || '',
      classId: primaryClassId,
      atelier,
      enVoie,
    };
  });
};

export const getTeachersPerformance = (): TeacherPerformance[] => {
  const teachers = useTeacherStore.getState().teachers || [];
  const classes: Class[] = useClassStore.getState().classes;
  const students: Student[] = useStudentStore.getState().students;

  // Map grades to schoolLevel categories
  const gradeLevelMap: Record<Grades, keyof typeof schoolLevel> = {
    "Maternelle": "kindergarden",
    "Jardin": "seniorKindergarden",
    "1re année": "gradeOne",
    "2e année": "gradeTwo",
    "3e année": "gradeTwo",
  };

  return teachers.map((teacher) => {
    // Find all classes taught by this teacher
    const teacherClasses = classes.filter((cls: Class) => cls.teacherId === teacher.id);

    // Get all unique grades the teacher teaches
    const uniqueGrades = [...new Set(teacherClasses.map((cls: Class) => cls.grade))] as Grades[];

    // Generate class names
    const gradeClassCount: Record<string, number> = {};
    const classNames = teacherClasses.map((cls: Class) => {
      if (!gradeClassCount[cls.grade]) {
        gradeClassCount[cls.grade] = 0;
      }
      const letter = String.fromCharCode(65 + gradeClassCount[cls.grade]); // A, B, C, etc.
      gradeClassCount[cls.grade]++;
      return `${cls.grade}`;
    });

    // Get all students in teacher's classes
    const classIds = teacherClasses.map((cls: Class) => cls.id);
    const teacherStudents = students.filter((student: Student) =>
      student['class_id'].some((classId: number) => classIds.includes(classId))
    );

    // Calculate average completed and average successful evaluations
    let totalCompleted = 0;
    let totalSuccessful = 0;
    let studentsWithEvals = 0;

    teacherStudents.forEach((student: Student) => {
      if (student.evaluations && student.evaluations.length > 0) {
        // Count completed evaluations (those with any status)
        const completedEvaluations = student.evaluations.filter(
          (evaluation) => evaluation.status !== null && evaluation.status !== undefined
        ).length;
        totalCompleted += completedEvaluations;
        
        // Count successful evaluations (success or adequate)
        const successfulEvaluations = student.evaluations.filter(
          (evaluation) => evaluation.status === "success" || evaluation.status === "adequate"
        ).length;
        totalSuccessful += successfulEvaluations;
        studentsWithEvals++;
      }
    });

    // Calculate percentages based on 15 total evaluations per student
    const avgCompletedCount = studentsWithEvals > 0 ? totalCompleted / studentsWithEvals : 0;
    const avgSuccessfulCount = studentsWithEvals > 0 ? totalSuccessful / studentsWithEvals : 0;
    
    const avgCompleted = (avgCompletedCount / 15) * 100;
    const avgAtelier = (avgSuccessfulCount / 15) * 100;

    // Calculate enVoie percentage - check each student against their own grade's benchmark
    let onTrackOrBetter = 0;
    teacherStudents.forEach((student: Student) => {
      if (student.evaluations && student.evaluations.length > 0) {
        // Find the student's class to determine their grade
        const studentClass = classes.find((cls: Class) => 
          student['class_id'].includes(cls.id) && teacherClasses.some(tc => tc.id === cls.id)
        );
        
        if (studentClass) {
          const studentGrade = studentClass.grade;
          const levelKey = gradeLevelMap[studentGrade as Grades];
          const benchmarks = schoolLevel[levelKey];
          
          const successfulEvaluations = student.evaluations.filter(
            (evaluation) => evaluation.status === "success" || evaluation.status === "adequate"
          ).length;

          if (successfulEvaluations >= benchmarks.onTrack) {
            onTrackOrBetter++;
          }
        }
      }
    });

    const enVoie = teacherStudents.length > 0
      ? Math.round((onTrackOrBetter / teacherStudents.length) * 100)
      : 0;

    return {
      id: teacher.id,
      name: teacher.name,
      numClasses: teacherClasses.length,
      grades: uniqueGrades,
      classes: classNames,
      students: teacherStudents.length,
      avgCompleted: Math.round(avgCompleted * 10) / 10, // Round to 1 decimal
      avgAtelier: Math.round(avgAtelier * 10) / 10, // Round to 1 decimal
      enVoie,
    };
  });
};

/**
 * Reset all stores to their initial state
 * Call this on logout to clear all user data
 */
export const resetAllStores = () => {
  // Clear all stores by setting them to their initial/empty states
  useStudentStore.setState({ students: [] });
  useClassStore.setState({ classes: [] });
  useTeacherStore.setState({ teacher: null, teachers: [] });
  useSchoolStore.setState({ activeSchool: mockApiData.schools[0] || null });
  useAuthStore.setState({ currentUser: null });
  useUnitsStore.setState({ 
    unitsData: [], 
    answers: [], 
    resources: [] 
  });
  
  // Clear persisted storage for user data only
  localStorage.removeItem('auth-storage');
  localStorage.removeItem('student-storage');
  localStorage.removeItem('class-storage');
  localStorage.removeItem('teacher-storage');
  localStorage.removeItem('school-storage');
  localStorage.removeItem('units-storage');
  // Keep 'app-storage' to preserve UI preferences
};
