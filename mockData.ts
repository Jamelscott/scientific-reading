// Mock API data - simulates backend responses

export interface MockStudent {
  id: number;
  name: string;
  classIds: number[]; // Array of class IDs the student belongs to
}

export interface MockClass {
  id: number;
  name: string;
  grade: string;
  studentCount: number;
  subject?: string;
  studentIds: number[]; // Array of student IDs in this class
}

export interface MockEvaluation {
  id: number;
  studentId: number;
  classId: number;
  evaluations: ("success" | "adequate" | "needs-improvement" | null)[]; // Always 10 evaluations
}

export interface MockTeacher {
  id: number;
  name: string;
  email: string;
  school: string;
  subjects: string[];
  yearsExperience?: number;
}

type NotificationType = "evalCompleted" | "newStudent" | "reportReady" | "meetingScheduled";

export interface MockNotification {
  id: number;
  type: NotificationType;
  time: string;
  read: boolean;
}

// Mock API responses
export const mockApiData = {
  students: [
    { id: 1, name: "Amélie Dubois", classIds: [1, 2] },
    { id: 2, name: "Benjamin Tremblay", classIds: [1] },
    { id: 3, name: "Charlotte Gagnon", classIds: [1] },
    { id: 4, name: "David Roy", classIds: [1, 3] },
    { id: 5, name: "Émilie Côté", classIds: [1] },
    { id: 6, name: "François Bouchard", classIds: [1] },
    { id: 7, name: "Gabrielle Gauthier", classIds: [1, 2] },
    { id: 8, name: "Hugo Morin", classIds: [1] },
    { id: 9, name: "Isabelle Fortin", classIds: [1] },
    { id: 10, name: "Julien Cloutier", classIds: [1] },
    { id: 11, name: "Léa Bergeron", classIds: [2] },
    { id: 12, name: "Marc Lefebvre", classIds: [2, 3] },
    { id: 13, name: "Sophie Martin", classIds: [2] },
    { id: 14, name: "Thomas Lavoie", classIds: [3] },
    { id: 15, name: "Valérie Beaulieu", classIds: [3] },
  ] as MockStudent[],

  classes: [
    {
      id: 1,
      name: "1re année",
      grade: "1",
      studentCount: 10,
      studentIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    },
    {
      id: 2,
      name: "2e année",
      grade: "2",
      studentCount: 5,
      subject: "Mathématiques",
      studentIds: [1, 7, 11, 12, 13],
    },
    {
      id: 3,
      name: "3e année",
      grade: "3",
      studentCount: 4,
      subject: "Sciences",
      studentIds: [4, 12, 14, 15],
    },
  ] as MockClass[],

  evaluations: [
    // Class 1 evaluations
    {
      id: 1,
      studentId: 1,
      classId: 1,
      evaluations: ["success", "success", "adequate", "success", "success", "adequate", "success", "success", null, null],
    },
    {
      id: 2,
      studentId: 2,
      classId: 1,
      evaluations: ["adequate", "success", "success", "adequate", "success", "success", "adequate", null, null, null],
    },
    {
      id: 3,
      studentId: 3,
      classId: 1,
      evaluations: ["success", "adequate", "adequate", "needs-improvement", "adequate", "success", null, null, null, null],
    },
    {
      id: 4,
      studentId: 4,
      classId: 1,
      evaluations: ["needs-improvement", "adequate", "adequate", "adequate", "success", null, null, null, null, null],
    },
    {
      id: 5,
      studentId: 5,
      classId: 1,
      evaluations: ["success", "success", "success", "success", "success", "success", "success", "success", null, null],
    },
    {
      id: 6,
      studentId: 6,
      classId: 1,
      evaluations: ["adequate", "adequate", "success", "adequate", "adequate", "success", "adequate", null, null, null],
    },
    {
      id: 7,
      studentId: 7,
      classId: 1,
      evaluations: ["success", "success", "adequate", "success", "success", "adequate", "success", null, null, null],
    },
    {
      id: 8,
      studentId: 8,
      classId: 1,
      evaluations: ["needs-improvement", "adequate", "needs-improvement", "adequate", "adequate", null, null, null, null, null],
    },
    {
      id: 9,
      studentId: 9,
      classId: 1,
      evaluations: ["success", "success", "success", "adequate", "success", "success", "success", "success", null, null],
    },
    {
      id: 10,
      studentId: 10,
      classId: 1,
      evaluations: ["adequate", "adequate", "adequate", "success", "adequate", "adequate", null, null, null, null],
    },
    // Class 2 evaluations
    {
      id: 11,
      studentId: 1,
      classId: 2,
      evaluations: ["success", "adequate", "success", "success", "adequate", "success", null, null, null, null],
    },
    {
      id: 12,
      studentId: 7,
      classId: 2,
      evaluations: ["adequate", "success", "success", "adequate", "success", null, null, null, null, null],
    },
    {
      id: 13,
      studentId: 11,
      classId: 2,
      evaluations: ["success", "adequate", "success", "success", null, null, null, null, null, null],
    },
    {
      id: 14,
      studentId: 12,
      classId: 2,
      evaluations: ["adequate", "needs-improvement", "adequate", "adequate", "adequate", null, null, null, null, null],
    },
    {
      id: 15,
      studentId: 13,
      classId: 2,
      evaluations: ["success", "success", "adequate", "success", "success", null, null, null, null, null],
    },
    // Class 3 evaluations
    {
      id: 16,
      studentId: 4,
      classId: 3,
      evaluations: ["needs-improvement", "needs-improvement", "adequate", "needs-improvement", null, null, null, null, null, null],
    },
    {
      id: 17,
      studentId: 12,
      classId: 3,
      evaluations: ["needs-improvement", "needs-improvement", "needs-improvement", "adequate", "needs-improvement", null, null, null, null, null],
    },
    {
      id: 18,
      studentId: 14,
      classId: 3,
      evaluations: ["needs-improvement", "needs-improvement", "needs-improvement", "needs-improvement", "adequate", "needs-improvement", null, null, null, null],
    },
    {
      id: 19,
      studentId: 15,
      classId: 3,
      evaluations: ["needs-improvement", "adequate", "needs-improvement", "needs-improvement", "needs-improvement", null, null, null, null, null],
    },
  ] as MockEvaluation[],

  teacher: {
    id: 1,
    name: "Madame Gisèle Tremblay",
    email: "gisele.tremblay@ecole.qc.ca",
    school: "École Primaire Saint-Laurent",
    subjects: ["Français", "Mathématiques", "Sciences"],
    phoneNumber: "(514) 555-0123",
    startDate: "Septembre 2018",
    yearsExperience: 12,
  } as MockTeacher,

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
  ): Promise<MockStudent> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    const newStudent: MockStudent = {
      id: mockApiData.students.length + 1,
      name,
      classIds,
    };
    mockApiData.students.push(newStudent);
    
    // Add student to classes and create evaluation records
    classIds.forEach(classId => {
      const classData = mockApiData.classes.find(c => c.id === classId);
      if (classData) {
        classData.studentIds.push(newStudent.id);
        classData.studentCount = classData.studentIds.length;
        
        // Create evaluation record for this student in this class
        mockApiData.evaluations.push({
          id: mockApiData.evaluations.length + 1,
          studentId: newStudent.id,
          classId: classId,
          evaluations: Array(10).fill(null),
        });
      }
    });
    
    return newStudent;
  },

  // Evaluations
  getEvaluationsByClassId: async (classId: number): Promise<MockEvaluation[]> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    return mockApiData.evaluations.filter((e) => e.classId === classId);
  },

  getEvaluationByStudentAndClass: async (
    studentId: number,
    classId: number,
  ): Promise<MockEvaluation | null> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    return (
      mockApiData.evaluations.find(
        (e) => e.studentId === studentId && e.classId === classId,
      ) || null
    );
  },

  updateStudentEvaluation: async (
    studentId: number,
    classId: number,
    evaluationIndex: number,
    status: "success" | "adequate" | "needs-improvement" | null,
  ): Promise<MockEvaluation | null> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    const evaluation = mockApiData.evaluations.find(
      (e) => e.studentId === studentId && e.classId === classId,
    );
    if (evaluation && evaluation.evaluations[evaluationIndex] !== undefined) {
      evaluation.evaluations[evaluationIndex] = status;
      return evaluation;
    }
    return null;
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

  // Teacher
  getTeacher: async (): Promise<MockTeacher> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    return mockApiData.teacher;
  },

  updateTeacher: async (
    updates: Partial<MockTeacher>,
  ): Promise<MockTeacher> => {
    await new Promise((resolve) => setTimeout(resolve, API_DELAY));
    mockApiData.teacher = { ...mockApiData.teacher, ...updates };
    return mockApiData.teacher;
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
};
