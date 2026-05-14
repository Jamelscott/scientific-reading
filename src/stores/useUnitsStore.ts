import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockApiData, StudentAnswers, UnitData } from "../../mockData";
import getScoreFromEvaluations from "../app/utils/getScoreFromEvaluations";

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
  getAllAnswers: StudentAnswers[];
  getStudentAnswers: (classId:number) => StudentAnswers[];
  /** Update or create a student answer with complete answers object */
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
  getUnitsData: UnitData[];
  getUnitAnswers: (classId:number) => StudentAnswers[];
}

export const useUnitsStore = create<UnitsStore>()(
  persist(
    (set, get) => {
      // Memoization cache for filtered results
      let lastAllAnswers: StudentAnswers[] | null = null;
      const memoCache = new Map<number, StudentAnswers[]>();
      const studentAnswersCache = new Map<number, StudentAnswers[]>();

      return {
        getAllAnswers: mockApiData.answers.map(fromMockResponse),
        getStudentAnswers: (classId:number) => {
          const currentAnswers = get().getAllAnswers;
          
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
            const student = mockApiData.students.find(s => s.id === answer.studentId);
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
            const existing = state.getAllAnswers.find(
              (a) => a.studentId === studentId && a.classId === classId && a.unitDataId === unitDataId
            );

            if (existing) {
              // Update existing answer
              return {
                getAllAnswers: state.getAllAnswers.map((a) =>
                  a.studentId === studentId && a.classId === classId && a.unitDataId === unitDataId
                    ? { ...a, answers, comment, required, lastModified: new Date().toISOString(), status }
                    : a
                ),
              };
            } else {
              // Create new answer
              const newAnswer: StudentAnswers & { status: "success" | "adequate" | "needs-improvement" | null } = {
                id: Math.max(0, ...state.getAllAnswers.map((a) => a.id)) + 1,
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
                getAllAnswers: [...state.getAllAnswers, newAnswer as any],
              };
            }
          }),
        getAnswersByClass: (classId) =>
          get().getAllAnswers.filter(
            (e) => e.classId === classId,
          ),
        getAnswersByStudent: (studentId) => {
          const currentAnswers = get().getAllAnswers;
          
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
          get().getAllAnswers.filter(
            (e) => e.unitDataId === evaluationId,
          ),
        getUnitsData: mockApiData.unitData,
        getUnitAnswers: (classId:number) => mockApiData.answers.filter(answer => answer.classId === classId),
      };
    },
    {
      name: "units-storage",
    },
  ),
);
