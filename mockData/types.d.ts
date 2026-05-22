// Value types allowed inside question maps
export type PrimitiveAnswer = boolean | null;

export interface WordItem {
  word: string;
  sound: string;
  correct?: boolean | string;
}

// When the word is used as the map key (e.g. "maison": { sound: "..." })
export interface KeyedWordItem {
  sound: string;
  correct?: boolean | string;
}

export interface CorrectFlag {
  correct?: boolean | string;
}

export interface SoundRowItem {
  letters: string;
  sound: string;
  correct?: boolean | string;
}

export interface QAItem {
  question: string;
  answer: string;
  correct?: boolean | string;
}

export interface FormsItem {
  forms: string[];
  correct?: boolean | string;
}

export interface NameSoundFlags {
  name?: boolean;
  sound?: boolean;
}

export type QuestionValue = PrimitiveAnswer | NameSoundFlags | WordItem | KeyedWordItem | CorrectFlag | SoundRowItem | QAItem | FormsItem | string[] | string;

// A single question map maps string keys to QuestionValue
export type QuestionMap = Record<string, QuestionValue>;

// A question category may be a map, a single value, or an array of values
export type QuestionCategory = QuestionMap | QuestionValue | QuestionValue[];

// MockQuestions is a map of question categories to their values
export type MockQuestions = Record<string, QuestionCategory>;

// Backwards-compatible aliases for older code expecting the previous shapes
export type MockEvalationQuestions = Record<string, Record<string, boolean | null>>;
export type MockEvaluation = Record<string, MockEvalationQuestions>;
export type LegacyMockQuestions = MockEvaluation;

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

export interface Student {
  id: number;
  name: string;
  classIds: number[]; // Array of class IDs the student belongs to
  schoolId: number; // School ID the student is associated with
}

export interface ResourceActivity {
  id: number;
  name: string;
  fileName: string;
  description: string;
}

export interface Resource {
  id: number;
  title: string;
  activities: ResourceActivity[];
}

export interface ResourceCategory {
  id: number;
  title: string;
  color: string;
  resources: Resource[];
}

export interface UnitData {
  id: number;
  unit: number;
  title: string;
  evaluation: number;
  questions: MockQuestions; // Object with categories (bigLetters, smallLetters, etc.)
}

export type Grades = "Maternelle" | "Jardin" | "1re année" | "2e année" | "3e année";

export interface Class {
  id: number;
  grade: Grades;
  subject?: string;
  studentCount: number;
  schoolYear: string;
  studentIds: number[]; // Array of student IDs in this class
}