import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StudentAnswers, UnitData } from "../../mockData/types";
import { unitData } from "../../mockData/unitData";
import { downloadableResources } from "../../mockData/resources";
import type { ResourceCategory } from "../../mockData/types";
import getScoreFromEvaluations from "../app/utils/getScoreFromEvaluations";
import { useStudentStore } from "./useStudentStore";
import {answers as studentT1Answers} from '../../mockData/teacher-t-1/answers'
import {answers as studentT2Answers} from '../../mockData/teacher-t-2/answers'

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

function fromMockResponse(r: StudentAnswers): StudentAnswers & { status: "success" | "adequate" | "needs-improvement" | null } {
  const status = getScoreFromEvaluations(r.answers);
  return {
    id: r.id,
    lastModified: r.lastModified,
    studentId: r.studentId,
    classId: r.classId,
    unitDataId: r.unitDataId,
    answers: { ...r.answers },
    comment: r.comment || "",
    required: r.required ?? true,
    status: status,
  };
}

interface UnitsStore {
  unitsData: UnitData[];
  answers: StudentAnswers[];
  resources: ResourceCategory[];
  setUnitsData: () => void;
  setStudentAnswers: (userId: string) => void;
  updateAnswer: (
    studentId: number,
    classId: number,
    unitDataId: number,
    answers: StudentAnswers["answers"],
    comment: string,
    required: boolean,
  ) => void;
  getAnswersByStudent: (
    studentId: number,
  ) => StudentAnswers[];
  getAnswersByEvaluation: (
    evaluationId: number,
  ) => StudentAnswers[];
  getAnswersByClass: (
    classId: number,
  ) => StudentAnswers[];
  setResources: () => void;
}

export const useUnitsStore = create<UnitsStore>()(
  persist(
    (set, get) => {
      // Memoization cache for filtered results
      let lastAllAnswers: StudentAnswers[] | null = null;
      const memoCache = new Map<number, StudentAnswers[]>();
      const studentAnswersCache = new Map<number, StudentAnswers[]>();
      
      return {
        unitsData: [],
        answers: [],
        resources: [],
        setUnitsData: () => set((state) => {
          return {
            ...state, unitsData: unitData
          }
        }),
        setStudentAnswers: (userId) => set((state) => {
          if (userId === 't-1') {
            return { ...state, answers: studentT1Answers.map(fromMockResponse)};
          } else if (userId === 't-2') {
            return { ...state, answers: studentT2Answers.map(fromMockResponse)};
          } else if (userId === 't-2') {
            return { ...state, answers: studentT2Answers.map(fromMockResponse)};
          } else if (userId.startsWith('b') || userId.startsWith('s')) {
            const allStudents = [...studentT1Answers, ...studentT2Answers]
            return { ...state, answers: allStudents.map(fromMockResponse)};
          } else {
            return { ...state, answers: [] };
          }
        }),
        setResources: () => set((state) => {
          return {
            ...state, resources: downloadableResources
          }
        }),       
        getStudentAnswers: (classId:number) => {
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
          const filtered = currentAnswers.filter(answer => answer.classId === classId);
          
          // Enrich with student info from mockApiData
          const enriched = filtered.map(answer => {
            const student = useStudentStore.getState().students.find(s => s.id === answer.studentId);
            return {
              ...answer,
              studentName: student?.name || "Unknown",
            };
          });
          
          studentAnswersCache.set(classId, enriched as any);
          return enriched as any;
        },

        updateAnswer: (studentId, classId, unitDataId, answers, comment, required) =>
          set((state) => {
            const status = getScoreFromEvaluations(answers);
            const existing = state.answers.find(
              (a) => a.studentId === studentId && a.classId === classId && a.unitDataId === unitDataId
            );

            if (existing) {
              // Update existing answer
              return {
                answers: state.answers.map((a) =>
                  a.studentId === studentId && a.classId === classId && a.unitDataId === unitDataId
                    ? { ...a, answers, comment, required, lastModified: new Date().toISOString(), status }
                    : a
                ),
              };
            } else {
              // Create new answer
              const newAnswer: StudentAnswers & { status: "success" | "adequate" | "needs-improvement" | null } = {
                id: Math.max(0, ...state.answers.map((a) => a.id)) + 1,
                lastModified: new Date().toISOString(),
                studentId,
                classId,
                unitDataId,
                answers,
                comment,
                required,
                status,
              };
              return {
                answers: [...state.answers, newAnswer as any],
              };
            }
          }),
        getAnswersByClass: (classId) =>
          get().answers.filter(
            (e) => e.classId === classId,
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
          const filtered = currentAnswers.filter((e) => e.studentId === studentId);
          memoCache.set(studentId, filtered);
          return filtered;
        },
        getAnswersByEvaluation: (evaluationId) =>
          get().answers.filter(
            (e) => e.unitDataId === evaluationId,
          ),
      };
    },
    {
      name: "units-storage",   
    },
  ),
);
