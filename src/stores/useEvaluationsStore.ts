import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mockApiData } from "../../mockData";

export interface Evaluation {
  id: number;
  studentId: number;
  classId: number;
  evaluations: ("success" | "adequate" | "needs-improvement" | null)[];
}

interface EvaluationsStore {
  evaluations: Evaluation[];
  setEvaluations: (evaluations: Evaluation[]) => void;
  updateEvaluation: (
    studentId: number,
    classId: number,
    evaluationIndex: number,
    status: "success" | "adequate" | "needs-improvement" | null,
  ) => void;
  getEvaluationByStudentAndClass: (
    studentId: number,
    classId: number,
  ) => Evaluation | undefined;
  removeEvaluationsByStudentAndClass: (
    studentId: number,
    classId: number,
  ) => void;
  clearEvaluations: () => void;
}

export const useEvaluationsStore = create<EvaluationsStore>()(
  persist(
    (set, get) => ({
      evaluations: mockApiData.evaluations,

      setEvaluations: (evaluations) => set({ evaluations }),

      updateEvaluation: (studentId, classId, evaluationIndex, status) =>
        set((state) => {
          const evaluations = [...state.evaluations];
          const evalIndex = evaluations.findIndex(
            (e) => e.studentId === studentId && e.classId === classId,
          );

          if (evalIndex !== -1) {
            // Update existing evaluation
            const updatedEval = { ...evaluations[evalIndex] };
            updatedEval.evaluations = [...updatedEval.evaluations];
            updatedEval.evaluations[evaluationIndex] = status;
            evaluations[evalIndex] = updatedEval;
          } else {
            // Create new evaluation if it doesn't exist
            const newEval: Evaluation = {
              id: Date.now(), // temporary ID
              studentId,
              classId,
              evaluations: Array(10).fill(null),
            };
            newEval.evaluations[evaluationIndex] = status;
            evaluations.push(newEval);
          }

          return { evaluations };
        }),

      getEvaluationByStudentAndClass: (studentId, classId) => {
        return get().evaluations.find(
          (e) => e.studentId === studentId && e.classId === classId,
        );
      },

      removeEvaluationsByStudentAndClass: (studentId, classId) =>
        set((state) => ({
          evaluations: state.evaluations.filter(
            (e) => !(e.studentId === studentId && e.classId === classId),
          ),
        })),

      clearEvaluations: () => set({ evaluations: [] }),
    }),
    {
      name: "evaluations-storage",
    },
  ),
);
