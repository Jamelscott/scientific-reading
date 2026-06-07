// Re-export all stores from a single entry point
export { useStudentStore } from "./useStudentStore";
export { useClassStore } from "./useClassStore";
export { useTeacherStore } from "./useTeacherStore";
export { useAppStore } from "./useAppStore";
export { useUnitsStore } from "./useUnitsStore";
export { useAuthStore } from "./useAuthStore";
export { useSchoolStore } from "./useSchoolStore";

// Export helper functions
export { resetAllStores, getStudentsForAcademics, getTeachersPerformance } from "./storeHelpers";
export type { StudentForAcademics, TeacherPerformance } from "./storeHelpers";
