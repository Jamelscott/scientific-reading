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
          useUnitsStore.getState().setResources();

          if (userType === 'teacher') {
            await useTeacherStore.getState().setSupabaseTeacher(authUser.id, userType);
            await useClassStore.getState().setSupabaseClasses(authUser.id, userType);
            await useStudentStore.getState().setSupabaseStudents(authUser.id, userType);
            await useUnitsStore.getState().setSupabaseStudentAnswers(authUser.id, userType);
            useStudentStore.getState().setStudentEvaluations();
          } else if (userType === 'school') {
            await useTeacherStore.getState().setSupabaseTeacher(authUser.id, userType);
            await useClassStore.getState().setSupabaseClasses(authUser.id, userType);
            await useStudentStore.getState().setSupabaseStudents(authUser.id, userType);
            await useUnitsStore.getState().setSupabaseStudentAnswers(authUser.id, userType);
            useStudentStore.getState().setStudentEvaluations();
          }

          await useUnitsStore.getState().setUnitsData();
          
          return authUser;
        }),
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
