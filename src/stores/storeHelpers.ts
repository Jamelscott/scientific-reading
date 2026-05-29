import { Class, Grades, Student, Teacher } from "../../mockData/types";
import { schoolLevel } from "../app/pages/const";
import { useClassStore } from "./useClassStore";
import { useStudentStore } from "./useStudentStore";
import { useTeacherStore } from "./useTeacherStore";

export interface StudentForAcademics {
  id: number;
  name: string;
  className: string;
  grade: Grades;
  teacher: string;
  atelier: number;
  enVoie: boolean;
}

export interface TeacherPerformance {
  id: string;
  name: string;
  grade: Grades;
  classes: string[];
  students: number;
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
    classNameCache[cls.id] = `${cls.grade} ${letter}`;
    gradeClassCount[cls.grade]++;
  });

  return students.map((student) => {
    // Get the first class (primary class) for the student
    const primaryClassId = student.classIds[0];
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

    // Get unique grade (assume teacher teaches one grade)
    const grade = teacherClasses[0]?.grade || "Maternelle";

    // Generate class names
    const gradeClassCount: Record<string, number> = {};
    const classNames = teacherClasses.map((cls: Class) => {
      if (!gradeClassCount[cls.grade]) {
        gradeClassCount[cls.grade] = 0;
      }
      const letter = String.fromCharCode(65 + gradeClassCount[cls.grade]); // A, B, C, etc.
      gradeClassCount[cls.grade]++;
      return `${cls.grade} ${letter}`;
    });

    // Get all students in teacher's classes
    const classIds = teacherClasses.map((cls: Class) => cls.id);
    const teacherStudents = students.filter((student: Student) =>
      student.classIds.some((classId: number) => classIds.includes(classId))
    );

    // Calculate average atelier
    let totalSuccessful = 0;
    let studentsWithEvals = 0;

    teacherStudents.forEach((student: Student) => {
      if (student.evaluations && student.evaluations.length > 0) {
        const successfulEvaluations = student.evaluations.filter(
          (evaluation) => evaluation.status === "success" || evaluation.status === "adequate"
        ).length;
        totalSuccessful += successfulEvaluations;
        studentsWithEvals++;
      }
    });

    const avgAtelier = studentsWithEvals > 0 ? totalSuccessful / studentsWithEvals : 0;

    // Calculate enVoie percentage
    const levelKey = gradeLevelMap[grade as Grades];
    const benchmarks = schoolLevel[levelKey];

    let onTrackOrBetter = 0;
    teacherStudents.forEach((student: Student) => {
      if (student.evaluations && student.evaluations.length > 0) {
        const successfulEvaluations = student.evaluations.filter(
          (evaluation) => evaluation.status === "success" || evaluation.status === "adequate"
        ).length;

        if (successfulEvaluations >= benchmarks.onTrack) {
          onTrackOrBetter++;
        }
      }
    });

    const enVoie = teacherStudents.length > 0
      ? Math.round((onTrackOrBetter / teacherStudents.length) * 100)
      : 0;

    return {
      id: teacher.id,
      name: teacher.name,
      grade,
      classes: classNames,
      students: teacherStudents.length,
      avgAtelier: Math.round(avgAtelier * 10) / 10, // Round to 1 decimal
      enVoie,
    };
  });
};
