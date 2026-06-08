import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AuthUser } from "../../mockData/types";
import { useClassStore } from "./useClassStore";
import { useStudentStore } from "./useStudentStore";
import { useUnitsStore } from "./useUnitsStore";
import { useTeacherStore } from "./useTeacherStore";
import { supabase } from "../utils/supabase";
import { resetAllStores } from "./storeHelpers";
import { withLoading } from "../utils/withLoading";

interface AuthStore {
  currentUser: AuthUser | null;
  isLoading: boolean;
  login: (user: AuthUser) => void;
  logout: () => Promise<void>;
  getCurrentUser: () => AuthUser | null;
  supabaseLogin: (email: string, password: string, userType: string) => Promise<AuthUser | null>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isLoading: false,
      supabaseLogin: withLoading(async (email: string, password: string, userType: string) => {
          const { data: session, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) {
            console.error('Error logging in:', error.message);
            alert('Login failed: ' + error.message);
            return null;
          }
          
          if (userType !== 'teacher' && userType !== 'school' && userType !== 'board' && userType !== 'admin') {
            return null;
          }
          
          if (!session?.user?.id) {
            alert('No user session found');
            return null;
          }
          
          // get user profile
          const { data: user, error: userError }: { data: AuthUser | null; error: any } = await supabase
            .from(`${userType}s`)
            .select("*")
            .eq('id', session.user.id)
            .limit(1)
            .maybeSingle();
          
          if (userError) {
            console.error('Error fetching user data:', userError.message);
            alert('Failed to fetch user data: ' + userError.message);
            return null;
          }
          
          // Add type to user object
          const authUser = { ...user, type: userType } as AuthUser;
          // Set current user in store
          set({ currentUser: authUser });
          useUnitsStore.getState().setUnitsData();
          // get data assocaited to user
          if (userType === 'teacher') {
            useClassStore.getState().setSupabaseClasses(authUser.id, userType);
            useTeacherStore.getState().setSupabaseTeacher(authUser.id, userType);
            useStudentStore.getState().setSupabaseStudents(authUser.id, userType);
            useUnitsStore.getState().setSupabaseStudentAnswers(authUser.id);
          }
          
          return authUser;
        }),
      login: async (user) => {
        set({ currentUser: user });
        
        // Set classes and students based on teacher ID
        if (user.type === 'teacher') {
          useClassStore.getState().setClasses(user.id);
          useStudentStore.getState().setSupabaseStudents(user.id, user.type);
          useUnitsStore.getState().setStudentAnswers(user.id);
        }
        if (user.type === 'school') {
          useTeacherStore.getState().setTeachersForSchool(user.id);
          useClassStore.getState().setClasses(user.id);
          useStudentStore.getState().setSupabaseStudents(user.id, user.type);
          useUnitsStore.getState().setStudentAnswers(user.id);
          useStudentStore.getState().setStudentEvaluations();
        }
        useUnitsStore.getState().setUnitsData()
        useUnitsStore.getState().setResources()
      },
      logout: withLoading(async () => {
        let { error } = await supabase.auth.signOut()
        if (!error) {
          console.log('User logged out successfully');
          resetAllStores(); // Clear all stores on logout
        } else {
          console.error('Error logging out:', error.message);
          alert('Logout failed: ' + error.message);
        }
      }),
      getCurrentUser: () => get().currentUser,
    }),
    {
      name: "auth-storage",
    },
  ),
);
