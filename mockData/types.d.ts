export type MockEvalationQuestions = Record<string, Record<string, boolean | null>>;
export type MockEvaluation = Record<string, MockEvalationQuestions>;

export type MockQuestions = MockEvaluation

export interface StudentAnswers {
  id: number;
  studentId: number;
  classId: number;
  unitDataId: number;
  answers: MockQuestions;
  comment:string;
  required: boolean;
  lastModified: string,
  status?: "success" | "adequate" | "needs-improvement" | null;
}

export interface MockStudent {
  id: number;
  name: string;
  classIds: number[]; // Array of class IDs the student belongs to
  schoolId: number; // School ID the student is associated with
  grade: "Maternelle" | "Jardin" | "1re année" | "2e année";
}
