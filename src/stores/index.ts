// Re-export all stores from a single entry point
export { useStudentStore } from "./useStudentStore";
export type { Student } from "./useStudentStore";

export { useClassStore } from "./useClassStore";
export type { Class } from "./useClassStore";

export { useTeacherStore } from "./useTeacherStore";
export type { Teacher } from "./useTeacherStore";

export { useAppStore } from "./useAppStore";

export { useUnitsStore } from "./useUnitsStore";
export type { Unit } from "./useUnitsStore";

export { useAuthStore } from "./useAuthStore";
export type { AuthUser, TeacherUser, BoardUser, AdminUser } from "./useAuthStore";

export { useSchoolStore } from "./useSchoolStore";
export type { School } from "./useSchoolStore";
