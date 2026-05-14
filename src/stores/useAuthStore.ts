import { create } from "zustand";
import { persist } from "zustand/middleware";

export type TeacherUser = {
  type: "teacher";
  id: string;
  name: string;
  email: string;
  school: string;
  boardName: string;
  subjects: string[];
  phoneNumber?: string;
  startDate?: string;
  yearsExperience?: number;
};

export type BoardUser = {
  type: "board";
  id: string;
  name: string;
  email: string;
  schools: string[];
};

export type SchoolUser = {
  type: "school";
  id: string;
  name: string;
  email: string;
  teachers: string[];
};

export type AdminUser = {
  type: "admin";
  id: string;
  name: string;
  email: string;
};

export type AuthUser = TeacherUser | BoardUser | SchoolUser | AdminUser;

interface AuthStore {
  currentUser: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
  getCurrentUser: () => AuthUser | null;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      login: (user) => set({ currentUser: user }),
      logout: () => set({ currentUser: null }),
      getCurrentUser: () => get().currentUser,
    }),
    {
      name: "auth-storage",
    },
  ),
);
