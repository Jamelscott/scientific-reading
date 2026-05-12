import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockApiData, StudentAnswers, UnitData } from "../../mockData";

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

function fromMockResponse(r: StudentAnswers): StudentAnswers {
  return {
    id: r.id,
    studentId: r.studentId,
    classId: r.classId,
    unitDataId: r.unitDataId,
    answers: { ...r.answers },
    comment: r.comment || "",
    required: r.required ?? true,
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
    (set, get) => ({
      getAllAnswers: mockApiData.answers.map(fromMockResponse),
      getStudentAnswers: (classId:number) => mockApiData.answers.filter(answer => answer.classId === classId),

      updateAnswer: (studentId, classId, unitDataId, answers, comment, required) =>
        set((state) => {
          const existing = state.getAllAnswers.find(
            (a) => a.studentId === studentId && a.classId === classId && a.unitDataId === unitDataId
          );

          if (existing) {
            // Update existing answer
            return {
              getAllAnswers: state.getAllAnswers.map((a) =>
                a.studentId === studentId && a.classId === classId && a.unitDataId === unitDataId
                  ? { ...a, answers, comment, required }
                  : a
              ),
            };
          } else {
            // Create new answer
            const newAnswer: StudentAnswers = {
              id: Math.max(0, ...state.getAllAnswers.map((a) => a.id)) + 1,
              studentId,
              classId,
              unitDataId,
              answers,
              comment,
              required,
            };
            return {
              getAllAnswers: [...state.getAllAnswers, newAnswer],
            };
          }
        }),
      getAnswersByClass: (classId) =>
        get().getAllAnswers.filter(
          (e) => e.classId === classId,
        ),
      getAnswersByStudent: (studentId) =>
        get().getAllAnswers.filter(
          (e) => e.studentId === studentId,
        ),
      getAnswersByEvaluation: (evaluationId) =>
        get().getAllAnswers.filter(
          (e) => e.unitDataId === evaluationId,
        ),
      getUnitsData: mockApiData.unitData,
      getUnitAnswers: (classId:number) => mockApiData.answers.filter(answer => answer.classId === classId),
    }),
    {
      name: "units-storage",
    },
  ),
);
