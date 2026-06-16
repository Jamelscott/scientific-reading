import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StudentAnswers, UnitData } from "../../types";
import { downloadableResources } from "../../mockData/resources";
import type { ResourceCategory } from "../../types";
import getScoreFromEvaluations from "../app/utils/getScoreFromEvaluations";
import { useStudentStore } from "./useStudentStore";
import { supabase } from "../utils/supabase";
import { useAuthStore } from "./useAuthStore";
import { withLoading } from "../utils/withLoading";

/** Derive a 0–100 score from per-question answers. Null/unanswered counts as wrong. */
export function computeScore(evaluation: StudentAnswers): number {
  let totalChecks = 0;
  let correctChecks = 0;

  if (!evaluation.answers) throw new Error("Evaluation has no answers");
  // Iterate through all categories (bigLetters, smallLetters, wordPairs, etc.)
  Object.values(evaluation.answers).forEach((category) => {
    if (typeof category === 'object' && category !== null) {
      // Iterate through all questions in this category
      Object.values(category).forEach((question) => {
        if (typeof question === 'object' && question !== null) {
          // Count each boolean property (name, sound, correct, etc.)
          Object.values(question).forEach((value) => {
            if (typeof value === 'boolean') {
              totalChecks++;
              if (value === true) {
                correctChecks++;
              }
            }
          });
        }
      });
    }
  });

  if (totalChecks === 0) return 0;
  return Math.round((correctChecks / totalChecks) * 100);
}

function addEvaluationStatus(r: StudentAnswers): StudentAnswers & { status: "success" | "adequate" | "needs-improvement" | null } {
  const status = getScoreFromEvaluations(r.answers);
  return {
    ...r,
    status: status,
  };
}

interface UnitsStore {
  unitsData: UnitData[];
  answers: StudentAnswers[];
  resources: ResourceCategory[];
  setUnitsData: () => void;
  setSupabaseStudentAnswers: (userId: string, userType:string) => void;
  updateAnswer: (
    studentId: string,
    classId: string,
    unitDataId: string,
    answers: StudentAnswers["answers"],
    comment: string,
    required: boolean,
    schoolId?: string,
  ) => Promise<void>;
  getAnswersByStudent: (
    studentId: string,
  ) => StudentAnswers[];
  getAnswersByEvaluation: (
    evaluationId: string,
  ) => StudentAnswers[];
  getAnswersByClass: (
    classId: string,
  ) => StudentAnswers[];
  setResources: () => void;
}

export const useUnitsStore = create<UnitsStore>()(
  persist(
    (set, get) => {
      // Memoization cache for filtered results
      let lastAllAnswers: StudentAnswers[] | null = null;
      const memoCache = new Map<string, StudentAnswers[]>();
      const studentAnswersCache = new Map<string, StudentAnswers[]>();
      const evaluationAnswersCache = new Map<string, StudentAnswers[]>();
      
      return {
        unitsData: [],
        answers: [],
        resources: [],
        setUnitsData: withLoading(async () => {
          let { data: unitData, error } = await supabase
            .from('unit_data')
            .select('*')
            .order('unit', { ascending: true })

            const unitDataParsed = unitData?.map((unit) => ({ ...unit, id: String(unit.id) })); // Ensure IDs are strings for consistent comparisons

           if (!unitDataParsed || error) {
              console.error('Error fetching unit data:', error?.message);
              alert('Failed to fetch unit data: ' + error?.message);
              return set((state) => ({ ...state, unitsData: [] }));
            }
          return set((state) => {
            return {
              ...state, unitsData: unitDataParsed
            }}
        )}),
        setSupabaseStudentAnswers: withLoading(async (userId, userType) => {
          if (userType === 'teacher') {
              let { data: student_answers, error } = await supabase
                .from('student_answers')
                .select('*')
                .eq('teacher_id', userId)
                .order('id', { ascending: true })
              if (!student_answers || error) {
                console.error('Error fetching student answers for teacher:', error?.message);
                alert('Failed to fetch student answers: ' + error?.message);
                set((state) => ({ ...state, answers: [] }));
                return;
              } else {
                set((state) => ({ ...state, answers: student_answers.map(addEvaluationStatus) }));
                return;
              }
          } else if (userType === 'school') {
              let { data: student_answers, error } = await supabase
                .from('student_answers')
                .select('*')
                .eq('school_id', userId)
                .order('id', { ascending: true })

              if (!student_answers || error) {
                console.error('Error fetching student answers for school:', error?.message);
                alert('Failed to fetch student answers: ' + error?.message);
                set((state) => ({ ...state, answers: [] }));
                return;
              } else {
                set((state) => ({ ...state, answers: student_answers.map(addEvaluationStatus) }));
                return;
              }
          } else if (userType === 'board') {
              let { data: student_answers, error } = await supabase
                .from('student_answers')
                .select('*')
                .eq('board_id', userId)
                .order('id', { ascending: true })
                
              if (!student_answers || error) {
                console.error('Error fetching student answers for board:', error?.message);
                alert('Failed to fetch student answers: ' + error?.message);
                set((state) => ({ ...state, answers: [] }));
                return;
              } else {
                set((state) => ({ ...state, answers: student_answers.map(addEvaluationStatus) }));
                return;
              }
          }
          // Refresh student evaluations after loading answers
          useStudentStore.getState().setStudentEvaluations();
        }),
        setResources: () => set((state) => {
          return {
            ...state, resources: downloadableResources
          }
        }),       
        getStudentAnswers: (classId:string) => {
          const currentAnswers = get().answers;
          
          // If the underlying data changed, clear cache
          if (lastAllAnswers !== currentAnswers) {
            lastAllAnswers = currentAnswers;
            studentAnswersCache.clear();
          }

          // Return cached result if available
          if (studentAnswersCache.has(classId)) {
            return studentAnswersCache.get(classId)!;
          }

          // Filter answers by class and enrich with student data
          const filtered = currentAnswers.filter(answer => answer.class_id === classId);
          
          // Enrich with student info from mockApiData
          const enriched = filtered.map(answer => {
            const student = useStudentStore.getState().students.find(s => s.id === answer.student_id);
            return {
              ...answer,
              studentName: student?.name || "Unknown",
            };
          });
          
          studentAnswersCache.set(classId, enriched as any);
          return enriched as any;
        },

        updateAnswer: withLoading(async (student_id, class_id, unit_data_id, answers, comment, required, school_id) => {
          const user = useAuthStore.getState().currentUser

          if (user?.type !== 'teacher') {
            console.error('Only teachers can update answers');
            alert('You do not have permission to perform this action');
            return;
          }
          const boardId = user.board_id;
          const resolvedSchoolId = school_id ?? user.school_id;

          const status = getScoreFromEvaluations(answers);
          const existing = get().answers.find(
            (a) =>
              a.student_id === student_id &&
              a.class_id === class_id &&
              a.unit_data_id === unit_data_id,
          );

          if (existing) {
            // Update existing answer in Supabase
            const { error } = await supabase
              .from('student_answers')
              .update({ 
                answers, 
                comment, 
                required,
                board_id: boardId,
                school_id: resolvedSchoolId,
                updated_at: new Date().toISOString()
              })
              .eq('id', existing.id);

            if (error) {
              console.error('Error updating answer:', error);
              alert('Failed to save answer: ' + error.message);
              return;
            }

            // Update local state
            set((state) => ({
              answers: state.answers.map((a) =>
                a.id === existing.id
                  ? { ...a, answers, comment, required, status }
                  : a
              ),
            }));
          } else {
            // Create new answer in Supabase
            const teacherId = useAuthStore.getState().currentUser?.id;
            if (!teacherId) {
              console.error('No teacher ID found');
              alert('Failed to save: No teacher logged in');
              return;
            }

            const newAnswer = {
              student_id,
              class_id,
              unit_data_id,
              board_id: boardId,
              school_id: resolvedSchoolId,
              answers,
              comment,
              required,
              teacher_id: teacherId,
            };

            const { data, error } = await supabase
              .from('student_answers')
              .insert([newAnswer])
              .select()
              .single();

            if (error || !data) {
              console.error('Error creating answer:', error);
              alert('Failed to save answer: ' + error?.message);
              return;
            }

            // Add to local state
            set((state) => ({
              answers: [...state.answers, { ...data, status }],
            }));
          }
          
          // Refresh student evaluations after updating answers
          useStudentStore.getState().setStudentEvaluations();
        }),
        getAnswersByClass: (classId) =>
          get().answers.filter(
            (e) => e.class_id === classId,
          ),
        getAnswersByStudent: (studentId) => {
          const currentAnswers = get().answers;
          
          // If the underlying data changed, clear cache
          if (lastAllAnswers !== currentAnswers) {
            lastAllAnswers = currentAnswers;
            memoCache.clear();
          }

          // Return cached result if available
          if (memoCache.has(studentId)) {
            return memoCache.get(studentId)!;
          }

          // Filter and cache the result
          const filtered = currentAnswers.filter((e) => e.student_id === studentId);
          memoCache.set(studentId, filtered);
          return filtered;
        },
        getAnswersByEvaluation: (evaluationId) => {
          const currentAnswers = get().answers;
          
          // If the underlying data changed, clear cache
          if (lastAllAnswers !== currentAnswers) {
            lastAllAnswers = currentAnswers;
            evaluationAnswersCache.clear();
          }

          // Return cached result if available
          if (evaluationAnswersCache.has(evaluationId)) {
            return evaluationAnswersCache.get(evaluationId)!;
          }

          // Filter and cache the result
          const filtered = currentAnswers.filter(
            (e) => e.unit_data_id === evaluationId,
          );
          evaluationAnswersCache.set(evaluationId, filtered);
          return filtered;
        }
      };
    },
    {
      name: "units-storage",   
    },
  ),
);
