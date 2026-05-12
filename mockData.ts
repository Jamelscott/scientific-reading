// Mock API data - simulates backend responses
export type MockEvalationQuestions = Record<string, Record<string, boolean | null>>;
export type MockEvaluation = Record<string, MockEvalationQuestions>;

export type MockQuestions = MockEvaluation
export interface MockStudent {
  id: number;
  name: string;
  classIds: number[]; // Array of class IDs the student belongs to
  schoolId: number; // School ID the student is associated with
}

export interface MockClass {
  id: number;
  name: string;
  grade: string;
  subject?: string;
  studentCount:number;
  schoolYear:string;
  studentIds: number[]; // Array of student IDs in this class
}

export interface MockTeacher {
  id: number;
  name: string;
  email: string;
  school: string;
  subjects: string[];
  yearsExperience?: number;
}

export interface MockSchool {
  id: number;
  name: string;
}

// A questionnaire assigned to a class on a given date.
export interface UnitData {
  id: number;
  unit:number;
  title: string;
  evaluation:number;
  questions: MockQuestions; // Object with categories (bigLetters, smallLetters, etc.)
}
export interface StudentAnswers {
  id: number;
  studentId: number;
  classId: number;
  unitDataId: number;
  answers: MockQuestions;
  comment:string;
  required: boolean;
}

export type TeacherUser = {
  type: "teacher";
  id: string;
  name: string;
  email: string;
  school: string;
  boardName: string;
  subjects: string[];
  phoneNumber?: string;
  startDate?: string;
  yearsExperience?: number;
};

export type BoardUser = {
  type: "board";
  id: string;
  name: string;
  email: string;
  schools: string[];
};

export type SchoolUser = {
  id: string;
  type: "school";
  name: string;
  email: string;
  teachers: string[];
};

export type AdminUser = {
  type: "admin";
  id: string;
  name: string;
  email: string;
};

export type User = TeacherUser | BoardUser | SchoolUser | AdminUser;

type NotificationType = "evalCompleted" | "newStudent" | "reportReady" | "meetingScheduled";

export interface MockNotification {
  id: number;
  type: NotificationType;
  time: string;
  read: boolean;
}

// Mock API responses
export const mockApiData = {
  board: {
    id: 1,
    name: "Commission scolaire de Montréal",
    contactEmail: "",
  },
  schools: [
    { 
      id: 1, 
      name: "École Primaire Saint-Laurent"
    },
  ] as MockSchool[],
  students: [
    { id: 1, name: "Amélie Dubois", classIds: [1, 2], schoolId: 1 },
    { id: 2, name: "Benjamin Tremblay", classIds: [1], schoolId: 1 },
    { id: 3, name: "Charlotte Gagnon", classIds: [1], schoolId: 1 },
    { id: 4, name: "David Roy", classIds: [1, 3], schoolId: 1 },
    { id: 5, name: "Émilie Côté", classIds: [1], schoolId: 1 },
    { id: 6, name: "François Bouchard", classIds: [1], schoolId: 1 },
    { id: 7, name: "Gabrielle Gauthier", classIds: [1, 2], schoolId: 1 },
    { id: 8, name: "Hugo Morin", classIds: [1], schoolId: 1 },
    { id: 9, name: "Isabelle Fortin", classIds: [1], schoolId: 1 },
    { id: 10, name: "Julien Cloutier", classIds: [1], schoolId: 1 },
    { id: 11, name: "Léa Bergeron", classIds: [2], schoolId: 1 },
    { id: 12, name: "Marc Lefebvre", classIds: [2, 3], schoolId: 1 },
    { id: 13, name: "Sophie Martin", classIds: [2], schoolId: 1 },
    { id: 14, name: "Thomas Lavoie", classIds: [3], schoolId: 1 },
    { id: 15, name: "Valérie Beaulieu", classIds: [3], schoolId: 1 },
  ] as MockStudent[],

  classes: [
    {
      id: 1,
      name: "1re année",
      grade: "1",
      schoolYear: "2023-2024",
      studentCount: 10,
      studentIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
      id: 2,
      name: "2e année",
      grade: "2",
      subject: "Mathématiques",
      schoolYear: "2023-2024",
      studentCount: 6,
      studentIds: [1, 7, 11, 12, 13],
    },
    {
      id: 3,
      name: "3e année",
      grade: "3",
      schoolYear: "2023-2024",
      subject: "Sciences",
      studentIds: [4, 12, 14, 15],
    },
  ] as MockClass[],

  unitData: [
        { 
          id: 1, 
          unit: 1,
          evaluation:1, 
          title:"units.unit1-1",
          questions: {
            bigLetters: {
              "A": { name: true, sound: true },
              "B": { name: true, sound: true },
              "C": { name: true, sound: true },
              "D": { name: true, sound: true },
              "E": { name: true, sound: true },
              "F": { name: true, sound: true },
              "G": { name: true, sound: true },
              "H": { name: true, sound: true },
              "I": { name: true, sound: true },
              "J": { name: true, sound: true },
              "K": { name: true, sound: true },
              "L": { name: true, sound: true },
              "M": { name: true, sound: true },
              "N": { name: true, sound: true },
              "O": { name: true, sound: true },
              "P": { name: true, sound: true },
              "Q": { name: true, sound: true },
              "R": { name: true, sound: true },
              "S": { name: true, sound: true },
              "T": { name: true, sound: true },
              "U": { name: true, sound: true },
              "V": { name: true, sound: true },
              "W": { name: true, sound: true },
              "X": { name: true, sound: true },
              "Y": { name: true, sound: true },
              "Z": { name: true, sound: true },
            },
            smallLetters: {
              "A": { name: true, sound: true },
              "B": { name: true, sound: true },
              "C": { name: true, sound: true },
              "D": { name: true, sound: true },
              "E": { name: true, sound: true },
              "F": { name: true, sound: true },
              "G": { name: true, sound: true },
              "H": { name: true, sound: true },
              "I": { name: true, sound: true },
              "J": { name: true, sound: true },
              "K": { name: true, sound: true },
              "L": { name: true, sound: true },
              "M": { name: true, sound: true },
              "N": { name: true, sound: true },
              "O": { name: true, sound: true },
              "P": { name: true, sound: true },
              "Q": { name: true, sound: true },
              "R": { name: true, sound: true },
              "S": { name: true, sound: true },
              "T": { name: true, sound: true },
              "U": { name: true, sound: true },
              "V": { name: true, sound: true },
              "W": { name: true, sound: true },
              "X": { name: true, sound: true },
              "Y": { name: true, sound: true },
              "Z": { name: true, sound: true },
            },
          },
        },
        { 
          id: 2, 
          unit: 1, 
          evaluation:2,
          title:"units.unit1-2",
          questions: {
            bigLetters: {
              "A": { correct: true },
              "B": { correct: true },
              "C": { correct: true },
              "D": { correct: true },
              "E": { correct: true },
              "F": { correct: true },
              "G": { correct: true },
              "H": { correct: true },
              "I": { correct: true },
              "J": { correct: true },
              "K": { correct: true },
              "L": { correct: true },
              "M": { correct: true },
              "N": { correct: true },
              "O": { correct: true },
              "P": { correct: true },
              "Q": { correct: true },
              "R": { correct: true },
              "S": { correct: true },
              "T": { correct: true },
              "U": { correct: true },
              "V": { correct: true },
              "W": { correct: true },
              "X": { correct: true },
              "Y": { correct: true },
              "Z": { correct: true },
            },
            smallLetters: {
              "A": { correct: true },
              "B": { correct: true },
              "C": { correct: true },
              "D": { correct: true },
              "E": { correct: true },
              "F": { correct: true },
              "G": { correct: true },
              "H": { correct: true },
              "I": { correct: true },
              "J": { correct: true },
              "K": { correct: true },
              "L": { correct: true },
              "M": { correct: true },
              "N": { correct: true },
              "O": { correct: true },
              "P": { correct: true },
              "Q": { correct: true },
              "R": { correct: true },
              "S": { correct: true },
              "T": { correct: true },
              "U": { correct: true },
              "V": { correct: true },
              "W": { correct: true },
              "X": { correct: true },
              "Y": { correct: true },
              "Z": { correct: true },
            },
          },
        },
        { 
          id: 3, 
          unit: 1,
          evaluation:3,
          title:"units.unit1-3",
          questions: {
            wordPairs: {
              "chat/rat": { correct: true },
              "fleur/table": { correct: true },
              "bateau/chapeau": { correct: true },
              "pain/main": { correct: true },
              "lune/porte": { correct: true },
            },
            syllables: {
              "ma-man": { correct: true },
              "ta-ble": { correct: true },
              "cha-peau": { correct: true },
              "voi-ture": { correct: true },
              "ba-na-ne": { correct: true },
            },
            numOfSyllables:{
              "chat": { correct: true },
              "livre": { correct: true },
              "éléphant": { correct: true },
              "chocolat": { correct: true },
              "papillon": { correct: true },
            }
          },
        },
        { 
          id: 4, 
          unit: 1,
          evaluation:4,
          title:"units.unit1-4",
          questions: {
          },
        },
        { 
          id: 5, 
          unit: 2,
          evaluation:5,
          title:"units.unit2-1",
          questions: {
          },
        },
        { 
          id: 6, 
          unit: 3, 
          evaluation:6,
          title:"units.unit3-1",
          questions: {
          },
        },
        { 
          id: 7, 
          unit: 4, 
          evaluation:7,
          title:"units.unit4-1",
          questions: {
          },
        },
        { 
          id: 8, 
          unit: 5, 
          evaluation:8,
          title:"units.unit5-1",
          questions: {
          },
        },
        { 
          id: 9, 
          unit: 6, 
          evaluation:9,
          title:"units.unit6-1",
          questions: {
          },
        },
        { 
          id: 10, 
          unit: 7,
          evaluation:10, 
          title:"units.unit7-1",
          questions: {
          },
        },
        { 
          id: 11, 
          unit: 8,
          evaluation:11, 
          title:"units.unit8-1",
          questions: {
          },
        },
        { 
          id: 12, 
          unit: 9, 
          evaluation:12,
          title:"units.unit9-1",
          questions: {
          },
        },
        { 
          id: 13, 
          unit: 10, 
          evaluation:13,
          title:"units.unit10-1",
          questions: {
          },
        }
  ] as UnitData[],

  answers: [
    { 
      id: 1,  
      studentId: 1,  
      classId: 1, 
      unitDataId: 1,
      required:true,
      answers: {
        bigLetters: {
          "A": { name: false, sound: false },
          "B": { name: false, sound: false },
          "C": { name: false, sound: false },
          "D": { name: false, sound: false },
          "E": { name: true, sound: true },
          "F": { name: true, sound: true },
          "G": { name: false, sound: false },
          "H": { name: true, sound: true },
          "I": { name: true, sound: true },
          "J": { name: true, sound: true },
          "K": { name: false, sound: true },
          "L": { name: true, sound: true },
          "M": { name: true, sound: true },
          "N": { name: true, sound: true },
          "O": { name: false, sound: false },
          "P": { name: true, sound: true },
          "Q": { name: false, sound: false },
          "R": { name: true, sound: true },
          "S": { name: true, sound: true },
          "T": { name: true, sound: false },
          "U": { name: true, sound: true },
          "V": { name: true, sound: true },
          "W": { name: true, sound: true },
          "X": { name: true, sound: true },
          "Y": { name: false, sound: true },
          "Z": { name: true, sound: true },
        },
        smallLetters: {
          "A": { name: true, sound: true },
          "B": { name: true, sound: true },
          "C": { name: true, sound: true },
          "D": { name: true, sound: true },
          "E": { name: true, sound: true },
          "F": { name: true, sound: true },
          "G": { name: true, sound: true },
          "H": { name: true, sound: true },
          "I": { name: true, sound: true },
          "J": { name: true, sound: true },
          "K": { name: true, sound: true },
          "L": { name: true, sound: true },
          "M": { name: true, sound: true },
          "N": { name: true, sound: true },
          "O": { name: true, sound: true },
          "P": { name: true, sound: true },
          "Q": { name: true, sound: true },
          "R": { name: true, sound: true },
          "S": { name: true, sound: true },
          "T": { name: true, sound: true },
          "U": { name: true, sound: true },
          "V": { name: true, sound: true },
          "W": { name: true, sound: true },
          "X": { name: true, sound: true },
          "Y": { name: true, sound: true },
          "Z": { name: true, sound: true },
        },
      },
      comment: "Great work on the uppercase letters! Let's focus a bit more on the sounds for B, C, K, T, and Y."
    },
    { 
      id: 2,  
      studentId: 2,  
      classId: 1, 
      unitDataId: 1,
      answers: {
        bigLetters: {
          "A": { name: false, sound: false },
          "B": { name: false, sound: false },
          "C": { name: false, sound: false },
          "D": { name: false, sound: false },
          "E": { name: false, sound: false },
          "F": { name: false, sound: false },
          "G": { name: false, sound: false },
          "H": { name: false, sound: false },
          "I": { name: false, sound: false },
          "J": { name: false, sound: false },
          "K": { name: false, sound: false },
          "L": { name: false, sound: false },
          "M": { name: false, sound: false },
          "N": { name: false, sound: false },
          "O": { name: false, sound: false },
          "P": { name: false, sound: false },
          "Q": { name: false, sound: false },
          "R": { name: false, sound: false },
          "S": { name: false, sound: false },
          "T": { name: false, sound: false },
          "U": { name: false, sound: false },
          "V": { name: false, sound: false },
          "W": { name: false, sound: false },
          "X": { name: false, sound: false },
          "Y": { name: false, sound: false },
          "Z": { name: false, sound: false },
        },
        smallLetters: {
          "a": { name: false, sound: false },
          "b": { name: false, sound: false },
          "c": { name: false, sound: false },
          "d": { name: false, sound: false },
          "e": { name: false, sound: false },
          "f": { name: false, sound: false },
          "g": { name: false, sound: false },
          "h": { name: false, sound: false },
          "i": { name: false, sound: false },
          "j": { name: false, sound: false },
          "k": { name: false, sound: false },
          "l": { name: false, sound: false },
          "m": { name: false, sound: false },
          "n": { name: false, sound: false },
          "o": { name: false, sound: false },
          "p": { name: false, sound: false },
          "q": { name: false, sound: false },
          "r": { name: false, sound: false },
          "s": { name: false, sound: false },
          "t": { name: false, sound: false },
          "u": { name: false, sound: false },
          "v": { name: false, sound: false },
          "w": { name: false, sound: false },
          "x": { name: false, sound: false },
          "y": { name: false, sound: false },
          "z": { name: false, sound: false },
        },
      },
      comment: "It looks like we have some work to do on both letter recognition and sounds. Let's start with the uppercase letters and then move on to the lowercase ones."
    },
  ] as StudentAnswers[],

  users: [
    {
      type: "teacher" as const,
      id: "t-1",
      name: "Madame Gisèle Tremblay",
      email: "gisele.tremblay@ecole.qc.ca",
      school: "École Primaire Saint-Laurent",
      boardName: "Commission scolaire de Montréal",
      subjects: ["Français", "Mathématiques", "Sciences"],
      phoneNumber: "(514) 555-0123",
      startDate: "Septembre 2018",
      yearsExperience: 12,
    },
    {
      type: "board" as const,
      id: "b-1",
      name: "Commission scolaire de Montréal",
      email: "jean-luc.bouchard@ecole.qc.ca",
      schools: ["École Primaire Saint-Laurent", "École Secondaire Mont-Royal"],
    },
    {
      type: "school" as const,
      id: "s-1",
      name: "École Primaire Saint-Laurent",
      email: "direction@saint-laurent.qc.ca",
      teachers: ["Madame Gisèle Tremblay"],
    },
    {
      type: "admin" as const,
      id: "a-1",
      name: "Admin",
      email: "admin@ecole.qc.ca",
    },
  ] as User[],

  notifications: [
    {
      id: 1,
      type: "evalCompleted",
      time: "2h",
      read: false,
    },
    {
      id: 2,
      type: "newStudent",
      time: "5h",
      read: false,
    },
    {
      id: 3,
      type: "reportReady",
      time: "1d",
      read: true,
    },
    {
      id: 4,
      type: "meetingScheduled",
      time: "2d",
      read: true,
    },
  ] as MockNotification[],
};

// Simulated API delay (in ms)
const API_DELAY = 500;

// Mock API functions that simulate server calls
export const mockApi = {
  // Students
  getStudents: async (): Promise<MockStudent[]> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    return mockApiData.students;
  },

  getStudentById: async (id: number): Promise<MockStudent | null> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    return mockApiData.students.find((s) => s.id === id) || null;
  },

  getStudentsByClassId: async (classId: number): Promise<MockStudent[]> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    const classData = mockApiData.classes.find((c) => c.id === classId);
    if (!classData) return [];
    return mockApiData.students.filter((s) => classData.studentIds.includes(s.id));
  },

  createStudent: async (
    name: string,
    classIds: number[] = [],
    schoolId: number = 1,
  ): Promise<MockStudent> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    const newStudent: MockStudent = {
      id: mockApiData.students.length + 1,
      name,
      classIds,
      schoolId,
    };
    mockApiData.students.push(newStudent);
    
    // Add student to classes (responses are created individually per template completion)
    classIds.forEach(classId => {
      const classData = mockApiData.classes.find(c => c.id === classId);
      if (classData) {
        classData.studentIds.push(newStudent.id);
        classData.studentCount = classData.studentIds.length;
      }
    });
    
    return newStudent;
  },

  // Student Responses
  // Fetch all responses for every student in a class (used to populate the class table).
  getStudentResponsesByClassId: async (classId: number): Promise<StudentAnswers[]> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    return mockApiData.answers.filter((answer) => answer.classId === classId);
  },

  // Fetch all responses for one student across all templates in a class (used for the edit modal).
  getStudentResponsesByStudentAndClass: async (
    studentId: number,
    classId: number,
  ): Promise<StudentAnswers[]> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    return mockApiData.answers.filter(
      (r) => r.studentId === studentId && r.classId === classId,
    );
  },

  // Update a single question's answer within a response record.
  // category: e.g., "bigLetters", "smallLetters", "wordPairs"
  // questionLabel: e.g., "A", "B", "chat/rat"
  // property: e.g., "name", "sound", "correct"
  // value: boolean value to set
  updateStudentResponse: async (
    id: number,
    category: string,
    questionLabel: string,
    property: string,
    value: boolean,
  ): Promise<StudentAnswers | null> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    const record = mockApiData.answers.find((answer) => answer.id === id);
    if (!record) return null;
    
    // Navigate to the nested structure: answers[category][questionLabel][property]
    if (record.answers[category] && record.answers[category][questionLabel]) {
      record.answers[category][questionLabel][property] = value;
    }
    
    return record;
  },

  // Classes
  getClasses: async (): Promise<MockClass[]> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    return mockApiData.classes;
  },

  getClassById: async (id: number): Promise<MockClass | null> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    return mockApiData.classes.find((c) => c.id === id) || null;
  },

  createClass: async (classData: Omit<MockClass, "id">): Promise<MockClass> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    const newClass = {
      ...classData,
      id: mockApiData.classes.length + 1,
    };
    mockApiData.classes.push(newClass);
    return newClass;
  },

  // Notifications
  getNotifications: async (): Promise<MockNotification[]> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    return mockApiData.notifications;
  },

  markNotificationAsRead: async (id: number): Promise<MockNotification | null> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    const notification = mockApiData.notifications.find((n) => n.id === id);
    if (notification) {
      notification.read = true;
      return notification;
    }
    return null;
  },

  markAllNotificationsAsRead: async (): Promise<MockNotification[]> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    mockApiData.notifications.forEach((n) => (n.read = true));
    return mockApiData.notifications;
  },

  // Auth
  getUserByType: async (type: User["type"]): Promise<User | null> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY / 2));
    return mockApiData.users.find((u) => u.type === type) || null;
  },
};
