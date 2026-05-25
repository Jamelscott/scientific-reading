import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthUser } from "../../mockData/types";
import { useClassStore } from "./useClassStore";
import { useStudentStore } from "./useStudentStore";
import { useUnitsStore } from "./useUnitsStore";

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
      login: (user) => {
        set({ currentUser: user });
        
        // Set classes and students based on teacher ID
        if (user.type === 'teacher') {
          useClassStore.getState().setClasses(user.id);
          useStudentStore.getState().setStudents(user.id);
          useUnitsStore.getState().setStudentAnswers(user.id)
          useUnitsStore.getState().setUnitsData()
          useUnitsStore.getState().setResources()
        }
        if (user.type === 'school') {
          // useClassStore.getState().setClasses(user.id);
        }
      },
      logout: () => set({ currentUser: null }),
      getCurrentUser: () => get().currentUser,
    }),
    {
      name: "auth-storage",
    },
  ),
);
