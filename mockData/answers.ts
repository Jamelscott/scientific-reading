import { StudentAnswers } from "./types";

// Static answer patterns - 96% (25 correct: A-Y)
const answers85 = {
  bigLetters: { A: { name: true, sound: true }, B: { name: true, sound: true }, C: { name: true, sound: true }, D: { name: true, sound: true }, E: { name: true, sound: true }, F: { name: true, sound: true }, G: { name: true, sound: true }, H: { name: true, sound: true }, I: { name: true, sound: true }, J: { name: true, sound: true }, K: { name: true, sound: true }, L: { name: true, sound: true }, M: { name: true, sound: true }, N: { name: true, sound: true }, O: { name: true, sound: true }, P: { name: true, sound: true }, Q: { name: true, sound: true }, R: { name: true, sound: true }, S: { name: true, sound: true }, T: { name: true, sound: true }, U: { name: true, sound: true }, V: { name: true, sound: true }, W: { name: true, sound: true }, X: { name: true, sound: true }, Y: { name: true, sound: true }, Z: { name: false, sound: false } },
  smallLetters: { a: { name: true, sound: true }, b: { name: true, sound: true }, c: { name: true, sound: true }, d: { name: true, sound: true }, e: { name: true, sound: true }, f: { name: true, sound: true }, g: { name: true, sound: true }, h: { name: true, sound: true }, i: { name: true, sound: true }, j: { name: true, sound: true }, k: { name: true, sound: true }, l: { name: true, sound: true }, m: { name: true, sound: true }, n: { name: true, sound: true }, o: { name: true, sound: true }, p: { name: true, sound: true }, q: { name: true, sound: true }, r: { name: true, sound: true }, s: { name: true, sound: true }, t: { name: true, sound: true }, u: { name: true, sound: true }, v: { name: true, sound: true }, w: { name: true, sound: true }, x: { name: true, sound: true }, y: { name: true, sound: true }, z: { name: false, sound: false } }
};

// Static answer patterns - 75% (20 correct: A-T)
const answers40 = {
  bigLetters: { A: { name: true, sound: true }, B: { name: true, sound: true }, C: { name: true, sound: true }, D: { name: true, sound: true }, E: { name: true, sound: true }, F: { name: true, sound: true }, G: { name: true, sound: true }, H: { name: true, sound: true }, I: { name: true, sound: true }, J: { name: true, sound: true }, K: { name: true, sound: true }, L: { name: true, sound: true }, M: { name: true, sound: true }, N: { name: true, sound: true }, O: { name: true, sound: true }, P: { name: true, sound: true }, Q: { name: true, sound: true }, R: { name: true, sound: true }, S: { name: true, sound: true }, T: { name: true, sound: true }, U: { name: false, sound: false }, V: { name: false, sound: false }, W: { name: false, sound: false }, X: { name: false, sound: false }, Y: { name: false, sound: false }, Z: { name: false, sound: false } },
  smallLetters: { a: { name: true, sound: true }, b: { name: true, sound: true }, c: { name: true, sound: true }, d: { name: true, sound: true }, e: { name: true, sound: true }, f: { name: true, sound: true }, g: { name: true, sound: true }, h: { name: true, sound: true }, i: { name: true, sound: true }, j: { name: true, sound: true }, k: { name: true, sound: true }, l: { name: true, sound: true }, m: { name: true, sound: true }, n: { name: true, sound: true }, o: { name: true, sound: true }, p: { name: true, sound: true }, q: { name: true, sound: true }, r: { name: true, sound: true }, s: { name: true, sound: true }, t: { name: true, sound: true }, u: { name: false, sound: false }, v: { name: false, sound: false }, w: { name: false, sound: false }, x: { name: false, sound: false }, y: { name: false, sound: false }, z: { name: false, sound: false } }
};

// Static answer patterns - 90% (23 correct: A-W)
const answers70 = {
  bigLetters: { A: { name: true, sound: true }, B: { name: true, sound: true }, C: { name: true, sound: true }, D: { name: true, sound: true }, E: { name: true, sound: true }, F: { name: true, sound: true }, G: { name: true, sound: true }, H: { name: true, sound: true }, I: { name: true, sound: true }, J: { name: true, sound: true }, K: { name: true, sound: true }, L: { name: true, sound: true }, M: { name: true, sound: true }, N: { name: true, sound: true }, O: { name: true, sound: true }, P: { name: true, sound: true }, Q: { name: true, sound: true }, R: { name: true, sound: true }, S: { name: true, sound: true }, T: { name: true, sound: true }, U: { name: true, sound: true }, V: { name: true, sound: true }, W: { name: true, sound: true }, X: { name: false, sound: false }, Y: { name: false, sound: false }, Z: { name: false, sound: false } },
  smallLetters: { a: { name: true, sound: true }, b: { name: true, sound: true }, c: { name: true, sound: true }, d: { name: true, sound: true }, e: { name: true, sound: true }, f: { name: true, sound: true }, g: { name: true, sound: true }, h: { name: true, sound: true }, i: { name: true, sound: true }, j: { name: true, sound: true }, k: { name: true, sound: true }, l: { name: true, sound: true }, m: { name: true, sound: true }, n: { name: true, sound: true }, o: { name: true, sound: true }, p: { name: true, sound: true }, q: { name: true, sound: true }, r: { name: true, sound: true }, s: { name: true, sound: true }, t: { name: true, sound: true }, u: { name: true, sound: true }, v: { name: true, sound: true }, w: { name: true, sound: true }, x: { name: false, sound: false }, y: { name: false, sound: false }, z: { name: false, sound: false } }
};

// Static answer patterns - 92% (24 correct: A-X)
const answers76 = {
  bigLetters: { A: { name: true, sound: true }, B: { name: true, sound: true }, C: { name: true, sound: true }, D: { name: true, sound: true }, E: { name: true, sound: true }, F: { name: true, sound: true }, G: { name: true, sound: true }, H: { name: true, sound: true }, I: { name: true, sound: true }, J: { name: true, sound: true }, K: { name: true, sound: true }, L: { name: true, sound: true }, M: { name: true, sound: true }, N: { name: true, sound: true }, O: { name: true, sound: true }, P: { name: true, sound: true }, Q: { name: true, sound: true }, R: { name: true, sound: true }, S: { name: true, sound: true }, T: { name: true, sound: true }, U: { name: true, sound: true }, V: { name: true, sound: true }, W: { name: true, sound: true }, X: { name: true, sound: true }, Y: { name: false, sound: false }, Z: { name: false, sound: false } },
  smallLetters: { a: { name: true, sound: true }, b: { name: true, sound: true }, c: { name: true, sound: true }, d: { name: true, sound: true }, e: { name: true, sound: true }, f: { name: true, sound: true }, g: { name: true, sound: true }, h: { name: true, sound: true }, i: { name: true, sound: true }, j: { name: true, sound: true }, k: { name: true, sound: true }, l: { name: true, sound: true }, m: { name: true, sound: true }, n: { name: true, sound: true }, o: { name: true, sound: true }, p: { name: true, sound: true }, q: { name: true, sound: true }, r: { name: true, sound: true }, s: { name: true, sound: true }, t: { name: true, sound: true }, u: { name: true, sound: true }, v: { name: true, sound: true }, w: { name: true, sound: true }, x: { name: true, sound: true }, y: { name: false, sound: false }, z: { name: false, sound: false } }
};

// Static answer patterns - 88% (23 correct: A-W)
const answers65 = {
  bigLetters: { A: { name: true, sound: true }, B: { name: true, sound: true }, C: { name: true, sound: true }, D: { name: true, sound: true }, E: { name: true, sound: true }, F: { name: true, sound: true }, G: { name: true, sound: true }, H: { name: true, sound: true }, I: { name: true, sound: true }, J: { name: true, sound: true }, K: { name: true, sound: true }, L: { name: true, sound: true }, M: { name: true, sound: true }, N: { name: true, sound: true }, O: { name: true, sound: true }, P: { name: true, sound: true }, Q: { name: true, sound: true }, R: { name: true, sound: true }, S: { name: true, sound: true }, T: { name: true, sound: true }, U: { name: true, sound: true }, V: { name: true, sound: true }, W: { name: true, sound: true }, X: { name: false, sound: false }, Y: { name: false, sound: false }, Z: { name: false, sound: false } },
  smallLetters: { a: { name: true, sound: true }, b: { name: true, sound: true }, c: { name: true, sound: true }, d: { name: true, sound: true }, e: { name: true, sound: true }, f: { name: true, sound: true }, g: { name: true, sound: true }, h: { name: true, sound: true }, i: { name: true, sound: true }, j: { name: true, sound: true }, k: { name: true, sound: true }, l: { name: true, sound: true }, m: { name: true, sound: true }, n: { name: true, sound: true }, o: { name: true, sound: true }, p: { name: true, sound: true }, q: { name: true, sound: true }, r: { name: true, sound: true }, s: { name: true, sound: true }, t: { name: true, sound: true }, u: { name: true, sound: true }, v: { name: true, sound: true }, w: { name: true, sound: true }, x: { name: false, sound: false }, y: { name: false, sound: false }, z: { name: false, sound: false } }
};

// Static answer patterns - 92% (24 correct: A-X)
const answers78 = answers76;

// Static answer patterns - 95% (25 correct: A-Y)
const answers82 = {
  bigLetters: { A: { name: true, sound: true }, B: { name: true, sound: true }, C: { name: true, sound: true }, D: { name: true, sound: true }, E: { name: true, sound: true }, F: { name: true, sound: true }, G: { name: true, sound: true }, H: { name: true, sound: true }, I: { name: true, sound: true }, J: { name: true, sound: true }, K: { name: true, sound: true }, L: { name: true, sound: true }, M: { name: true, sound: true }, N: { name: true, sound: true }, O: { name: true, sound: true }, P: { name: true, sound: true }, Q: { name: true, sound: true }, R: { name: true, sound: true }, S: { name: true, sound: true }, T: { name: true, sound: true }, U: { name: true, sound: true }, V: { name: true, sound: true }, W: { name: true, sound: true }, X: { name: true, sound: true }, Y: { name: true, sound: true }, Z: { name: false, sound: false } },
  smallLetters: { a: { name: true, sound: true }, b: { name: true, sound: true }, c: { name: true, sound: true }, d: { name: true, sound: true }, e: { name: true, sound: true }, f: { name: true, sound: true }, g: { name: true, sound: true }, h: { name: true, sound: true }, i: { name: true, sound: true }, j: { name: true, sound: true }, k: { name: true, sound: true }, l: { name: true, sound: true }, m: { name: true, sound: true }, n: { name: true, sound: true }, o: { name: true, sound: true }, p: { name: true, sound: true }, q: { name: true, sound: true }, r: { name: true, sound: true }, s: { name: true, sound: true }, t: { name: true, sound: true }, u: { name: true, sound: true }, v: { name: true, sound: true }, w: { name: true, sound: true }, x: { name: true, sound: true }, y: { name: true, sound: true }, z: { name: false, sound: false } }
};

// Static answer patterns - 85% (22 correct: A-V)
const answers58 = {
  bigLetters: { A: { name: true, sound: true }, B: { name: true, sound: true }, C: { name: true, sound: true }, D: { name: true, sound: true }, E: { name: true, sound: true }, F: { name: true, sound: true }, G: { name: true, sound: true }, H: { name: true, sound: true }, I: { name: true, sound: true }, J: { name: true, sound: true }, K: { name: true, sound: true }, L: { name: true, sound: true }, M: { name: true, sound: true }, N: { name: true, sound: true }, O: { name: true, sound: true }, P: { name: true, sound: true }, Q: { name: true, sound: true }, R: { name: true, sound: true }, S: { name: true, sound: true }, T: { name: true, sound: true }, U: { name: true, sound: true }, V: { name: true, sound: true }, W: { name: false, sound: false }, X: { name: false, sound: false }, Y: { name: false, sound: false }, Z: { name: false, sound: false } },
  smallLetters: { a: { name: true, sound: true }, b: { name: true, sound: true }, c: { name: true, sound: true }, d: { name: true, sound: true }, e: { name: true, sound: true }, f: { name: true, sound: true }, g: { name: true, sound: true }, h: { name: true, sound: true }, i: { name: true, sound: true }, j: { name: true, sound: true }, k: { name: true, sound: true }, l: { name: true, sound: true }, m: { name: true, sound: true }, n: { name: true, sound: true }, o: { name: true, sound: true }, p: { name: true, sound: true }, q: { name: true, sound: true }, r: { name: true, sound: true }, s: { name: true, sound: true }, t: { name: true, sound: true }, u: { name: true, sound: true }, v: { name: true, sound: true }, w: { name: false, sound: false }, x: { name: false, sound: false }, y: { name: false, sound: false }, z: { name: false, sound: false } }
};

// Static answer patterns - 90% (23 correct: A-W)
const answers71 = answers70;

// Static answer patterns - 95% (25 correct: A-Y)
const answers81 = answers82;

export const answers: StudentAnswers[] = [
  // Student 1 (Amélie Dubois) - Good performer (85%)
  { id: 1, lastModified: "2024-05-01T10:00:00Z", studentId: 1, classId: 1, unitDataId: 1, required: true, answers: answers85, comment: "Great work!" },
  { id: 2, lastModified: "2024-05-02T10:00:00Z", studentId: 1, classId: 1, unitDataId: 2, required: true, answers: answers85, comment: "Excellent progress!" },
  { id: 3, lastModified: "2024-05-03T10:00:00Z", studentId: 1, classId: 1, unitDataId: 3, required: true, answers: answers85, comment: "Good understanding" },
  { id: 4, lastModified: "2024-05-04T10:00:00Z", studentId: 1, classId: 1, unitDataId: 4, required: true, answers: answers85, comment: "Keep it up!" },
  { id: 5, lastModified: "2024-05-05T10:00:00Z", studentId: 1, classId: 1, unitDataId: 5, required: true, answers: answers85, comment: "Strong work" },
  { id: 6, lastModified: "2024-05-06T10:00:00Z", studentId: 1, classId: 1, unitDataId: 6, required: true, answers: answers85, comment: "Excellent!" },
  { id: 7, lastModified: "2024-05-07T10:00:00Z", studentId: 1, classId: 1, unitDataId: 7, required: true, answers: answers85, comment: "Great effort" },
  { id: 8, lastModified: "2024-05-08T10:00:00Z", studentId: 1, classId: 1, unitDataId: 8, required: true, answers: answers85, comment: "Good job" },
  { id: 9, lastModified: "2024-05-09T10:00:00Z", studentId: 1, classId: 1, unitDataId: 9, required: true, answers: answers85, comment: "Wonderful!" },
  { id: 10, lastModified: "2024-05-10T10:00:00Z", studentId: 1, classId: 1, unitDataId: 10, required: true, answers: answers85, comment: "Keep going!" },
  { id: 11, lastModified: "2024-05-11T10:00:00Z", studentId: 1, classId: 1, unitDataId: 11, required: true, answers: answers85, comment: "Good work" },
  { id: 12, lastModified: "2024-05-12T10:00:00Z", studentId: 1, classId: 1, unitDataId: 12, required: true, answers: answers85, comment: "Excellent effort!" },
  { id: 13, lastModified: "2024-05-13T10:00:00Z", studentId: 1, classId: 1, unitDataId: 13, required: true, answers: answers85, comment: "Outstanding!" },

  // Student 2 (Benjamin Tremblay) - Struggling (40%)
  { id: 14, lastModified: "2024-05-01T10:00:00Z", studentId: 2, classId: 1, unitDataId: 1, required: true, answers: answers40, comment: "Needs more practice" },
  { id: 15, lastModified: "2024-05-02T10:00:00Z", studentId: 2, classId: 1, unitDataId: 2, required: true, answers: answers40, comment: "Let's work on this together" },
  { id: 16, lastModified: "2024-05-03T10:00:00Z", studentId: 2, classId: 1, unitDataId: 3, required: true, answers: answers40, comment: "Keep practicing" },
  { id: 17, lastModified: "2024-05-04T10:00:00Z", studentId: 2, classId: 1, unitDataId: 4, required: true, answers: answers40, comment: "Getting better!" },
  { id: 18, lastModified: "2024-05-05T10:00:00Z", studentId: 2, classId: 1, unitDataId: 5, required: true, answers: answers40, comment: "Review needed" },
  { id: 19, lastModified: "2024-05-06T10:00:00Z", studentId: 2, classId: 1, unitDataId: 6, required: true, answers: answers40, comment: "Some improvement" },
  { id: 20, lastModified: "2024-05-07T10:00:00Z", studentId: 2, classId: 1, unitDataId: 7, required: true, answers: answers40, comment: "More effort needed" },
  { id: 21, lastModified: "2024-05-08T10:00:00Z", studentId: 2, classId: 1, unitDataId: 8, required: true, answers: answers40, comment: "Continue practicing" },
  { id: 22, lastModified: "2024-05-09T10:00:00Z", studentId: 2, classId: 1, unitDataId: 9, required: true, answers: answers40, comment: "Good effort!" },
  { id: 23, lastModified: "2024-05-10T10:00:00Z", studentId: 2, classId: 1, unitDataId: 10, required: true, answers: answers40, comment: "Keep trying" },
  { id: 24, lastModified: "2024-05-11T10:00:00Z", studentId: 2, classId: 1, unitDataId: 11, required: true, answers: answers40, comment: "Work in progress" },
  { id: 25, lastModified: "2024-05-12T10:00:00Z", studentId: 2, classId: 1, unitDataId: 12, required: true, answers: answers40, comment: "Let's practice more" },
  { id: 26, lastModified: "2024-05-13T10:00:00Z", studentId: 2, classId: 1, unitDataId: 13, required: true, answers: answers40, comment: "Steady progress" },

  // Student 3 (Charlotte Gagnon) - Average (70%)
  { id: 27, lastModified: "2024-05-01T10:00:00Z", studentId: 3, classId: 1, unitDataId: 1, required: true, answers: answers70, comment: "Good effort" },
  { id: 28, lastModified: "2024-05-02T10:00:00Z", studentId: 3, classId: 1, unitDataId: 2, required: true, answers: answers70, comment: "Nice work" },
  { id: 29, lastModified: "2024-05-03T10:00:00Z", studentId: 3, classId: 1, unitDataId: 3, required: true, answers: answers70, comment: "Decent progress" },
  { id: 30, lastModified: "2024-05-04T10:00:00Z", studentId: 3, classId: 1, unitDataId: 4, required: true, answers: answers70, comment: "Solid work" },
  { id: 31, lastModified: "2024-05-05T10:00:00Z", studentId: 3, classId: 1, unitDataId: 5, required: true, answers: answers70, comment: "Keep it up" },
  { id: 32, lastModified: "2024-05-06T10:00:00Z", studentId: 3, classId: 1, unitDataId: 6, required: true, answers: answers70, comment: "Great!" },
  { id: 33, lastModified: "2024-05-07T10:00:00Z", studentId: 3, classId: 1, unitDataId: 7, required: true, answers: answers70, comment: "Good progress" },
  { id: 34, lastModified: "2024-05-08T10:00:00Z", studentId: 3, classId: 1, unitDataId: 8, required: true, answers: answers70, comment: "Nice effort" },
  { id: 35, lastModified: "2024-05-09T10:00:00Z", studentId: 3, classId: 1, unitDataId: 9, required: true, answers: answers70, comment: "Improving!" },
  { id: 36, lastModified: "2024-05-10T10:00:00Z", studentId: 3, classId: 1, unitDataId: 10, required: true, answers: answers70, comment: "Solid effort" },
  { id: 37, lastModified: "2024-05-11T10:00:00Z", studentId: 3, classId: 1, unitDataId: 11, required: true, answers: answers70, comment: "Good work" },
  { id: 38, lastModified: "2024-05-12T10:00:00Z", studentId: 3, classId: 1, unitDataId: 12, required: true, answers: answers70, comment: "Well done!" },
  { id: 39, lastModified: "2024-05-13T10:00:00Z", studentId: 3, classId: 1, unitDataId: 13, required: true, answers: answers70, comment: "Good effort" },

  // Student 4 (David Roy) - Good (76%)
  { id: 40, lastModified: "2024-05-01T10:00:00Z", studentId: 4, classId: 1, unitDataId: 1, required: true, answers: answers76, comment: "Solid work" },
  { id: 41, lastModified: "2024-05-02T10:00:00Z", studentId: 4, classId: 1, unitDataId: 2, required: true, answers: answers76, comment: "Great!" },
  { id: 42, lastModified: "2024-05-03T10:00:00Z", studentId: 4, classId: 1, unitDataId: 3, required: true, answers: answers76, comment: "Nice work" },
  { id: 43, lastModified: "2024-05-04T10:00:00Z", studentId: 4, classId: 1, unitDataId: 4, required: true, answers: answers76, comment: "Good effort" },
  { id: 44, lastModified: "2024-05-05T10:00:00Z", studentId: 4, classId: 1, unitDataId: 5, required: true, answers: answers76, comment: "Well done" },
  { id: 45, lastModified: "2024-05-06T10:00:00Z", studentId: 4, classId: 1, unitDataId: 6, required: true, answers: answers76, comment: "Excellent" },
  { id: 46, lastModified: "2024-05-07T10:00:00Z", studentId: 4, classId: 1, unitDataId: 7, required: true, answers: answers76, comment: "Great progress" },
  { id: 47, lastModified: "2024-05-08T10:00:00Z", studentId: 4, classId: 1, unitDataId: 8, required: true, answers: answers76, comment: "Strong work" },
  { id: 48, lastModified: "2024-05-09T10:00:00Z", studentId: 4, classId: 1, unitDataId: 9, required: true, answers: answers76, comment: "Very good" },
  { id: 49, lastModified: "2024-05-10T10:00:00Z", studentId: 4, classId: 1, unitDataId: 10, required: true, answers: answers76, comment: "Nice effort" },
  { id: 50, lastModified: "2024-05-11T10:00:00Z", studentId: 4, classId: 1, unitDataId: 11, required: true, answers: answers76, comment: "Keep it up" },
  { id: 51, lastModified: "2024-05-12T10:00:00Z", studentId: 4, classId: 1, unitDataId: 12, required: true, answers: answers76, comment: "Wonderful" },
  { id: 52, lastModified: "2024-05-13T10:00:00Z", studentId: 4, classId: 1, unitDataId: 13, required: true, answers: answers76, comment: "Excellent work" },

  // Student 5 (Émilie Côté) - Adequate (65%)
  { id: 53, lastModified: "2024-05-01T10:00:00Z", studentId: 5, classId: 1, unitDataId: 1, required: true, answers: answers65, comment: "Good progress" },
  { id: 54, lastModified: "2024-05-02T10:00:00Z", studentId: 5, classId: 1, unitDataId: 2, required: true, answers: answers65, comment: "Nice work" },
  { id: 55, lastModified: "2024-05-03T10:00:00Z", studentId: 5, classId: 1, unitDataId: 3, required: true, answers: answers65, comment: "Solid effort" },
  { id: 56, lastModified: "2024-05-04T10:00:00Z", studentId: 5, classId: 1, unitDataId: 4, required: true, answers: answers65, comment: "Keep going" },
  { id: 57, lastModified: "2024-05-05T10:00:00Z", studentId: 5, classId: 1, unitDataId: 5, required: true, answers: answers65, comment: "Good work" },
  { id: 58, lastModified: "2024-05-06T10:00:00Z", studentId: 5, classId: 1, unitDataId: 6, required: true, answers: answers65, comment: "Well done" },
  { id: 59, lastModified: "2024-05-07T10:00:00Z", studentId: 5, classId: 1, unitDataId: 7, required: true, answers: answers65, comment: "Nice effort" },
  { id: 60, lastModified: "2024-05-08T10:00:00Z", studentId: 5, classId: 1, unitDataId: 8, required: true, answers: answers65, comment: "Getting better" },
  { id: 61, lastModified: "2024-05-09T10:00:00Z", studentId: 5, classId: 1, unitDataId: 9, required: true, answers: answers65, comment: "Good job" },
  { id: 62, lastModified: "2024-05-10T10:00:00Z", studentId: 5, classId: 1, unitDataId: 10, required: true, answers: answers65, comment: "Improving" },
  { id: 63, lastModified: "2024-05-11T10:00:00Z", studentId: 5, classId: 1, unitDataId: 11, required: true, answers: answers65, comment: "Fine work" },
  { id: 64, lastModified: "2024-05-12T10:00:00Z", studentId: 5, classId: 1, unitDataId: 12, required: true, answers: answers65, comment: "Good effort" },
  { id: 65, lastModified: "2024-05-13T10:00:00Z", studentId: 5, classId: 1, unitDataId: 13, required: true, answers: answers65, comment: "Decent work" },

  // Student 6 (François Bouchard) - Good (78%)
  { id: 66, lastModified: "2024-05-01T10:00:00Z", studentId: 6, classId: 1, unitDataId: 1, required: true, answers: answers78, comment: "Great work" },
  { id: 67, lastModified: "2024-05-02T10:00:00Z", studentId: 6, classId: 1, unitDataId: 2, required: true, answers: answers78, comment: "Excellent" },
  { id: 68, lastModified: "2024-05-03T10:00:00Z", studentId: 6, classId: 1, unitDataId: 3, required: true, answers: answers78, comment: "Very good" },
  { id: 69, lastModified: "2024-05-04T10:00:00Z", studentId: 6, classId: 1, unitDataId: 4, required: true, answers: answers78, comment: "Strong work" },
  { id: 70, lastModified: "2024-05-05T10:00:00Z", studentId: 6, classId: 1, unitDataId: 5, required: true, answers: answers78, comment: "Nice effort" },
  { id: 71, lastModified: "2024-05-06T10:00:00Z", studentId: 6, classId: 1, unitDataId: 6, required: true, answers: answers78, comment: "Wonderful" },
  { id: 72, lastModified: "2024-05-07T10:00:00Z", studentId: 6, classId: 1, unitDataId: 7, required: true, answers: answers78, comment: "Excellent work" },
  { id: 73, lastModified: "2024-05-08T10:00:00Z", studentId: 6, classId: 1, unitDataId: 8, required: true, answers: answers78, comment: "Great progress" },
  { id: 74, lastModified: "2024-05-09T10:00:00Z", studentId: 6, classId: 1, unitDataId: 9, required: true, answers: answers78, comment: "Well done" },
  { id: 75, lastModified: "2024-05-10T10:00:00Z", studentId: 6, classId: 1, unitDataId: 10, required: true, answers: answers78, comment: "Keep it up" },
  { id: 76, lastModified: "2024-05-11T10:00:00Z", studentId: 6, classId: 1, unitDataId: 11, required: true, answers: answers78, comment: "Good job" },
  { id: 77, lastModified: "2024-05-12T10:00:00Z", studentId: 6, classId: 1, unitDataId: 12, required: true, answers: answers78, comment: "Outstanding" },
  { id: 78, lastModified: "2024-05-13T10:00:00Z", studentId: 6, classId: 1, unitDataId: 13, required: true, answers: answers78, comment: "Excellent effort" },

  // Student 7 (Gabrielle Gauthier) - Excellent (82%)
  { id: 79, lastModified: "2024-05-01T10:00:00Z", studentId: 7, classId: 1, unitDataId: 1, required: true, answers: answers82, comment: "Excellent!" },
  { id: 80, lastModified: "2024-05-02T10:00:00Z", studentId: 7, classId: 1, unitDataId: 2, required: true, answers: answers82, comment: "Outstanding!" },
  { id: 81, lastModified: "2024-05-03T10:00:00Z", studentId: 7, classId: 1, unitDataId: 3, required: true, answers: answers82, comment: "Wonderful!" },
  { id: 82, lastModified: "2024-05-04T10:00:00Z", studentId: 7, classId: 1, unitDataId: 4, required: true, answers: answers82, comment: "Fantastic!" },
  { id: 83, lastModified: "2024-05-05T10:00:00Z", studentId: 7, classId: 1, unitDataId: 5, required: true, answers: answers82, comment: "Great work!" },
  { id: 84, lastModified: "2024-05-06T10:00:00Z", studentId: 7, classId: 1, unitDataId: 6, required: true, answers: answers82, comment: "Perfect!" },
  { id: 85, lastModified: "2024-05-07T10:00:00Z", studentId: 7, classId: 1, unitDataId: 7, required: true, answers: answers82, comment: "Excellent progress!" },
  { id: 86, lastModified: "2024-05-08T10:00:00Z", studentId: 7, classId: 1, unitDataId: 8, required: true, answers: answers82, comment: "Exemplary!" },
  { id: 87, lastModified: "2024-05-09T10:00:00Z", studentId: 7, classId: 1, unitDataId: 9, required: true, answers: answers82, comment: "Outstanding work!" },
  { id: 88, lastModified: "2024-05-10T10:00:00Z", studentId: 7, classId: 1, unitDataId: 10, required: true, answers: answers82, comment: "Superb!" },
  { id: 89, lastModified: "2024-05-11T10:00:00Z", studentId: 7, classId: 1, unitDataId: 11, required: true, answers: answers82, comment: "Excellent!" },
  { id: 90, lastModified: "2024-05-12T10:00:00Z", studentId: 7, classId: 1, unitDataId: 12, required: true, answers: answers82, comment: "Magnificent!" },
  { id: 91, lastModified: "2024-05-13T10:00:00Z", studentId: 7, classId: 1, unitDataId: 13, required: true, answers: answers82, comment: "Wonderful work!" },

  // Student 8 (Hugo Morin) - Needs improvement (58%)
  { id: 92, lastModified: "2024-05-01T10:00:00Z", studentId: 8, classId: 1, unitDataId: 1, required: true, answers: answers58, comment: "Some improvement" },
  { id: 93, lastModified: "2024-05-02T10:00:00Z", studentId: 8, classId: 1, unitDataId: 2, required: true, answers: answers58, comment: "Keep trying" },
  { id: 94, lastModified: "2024-05-03T10:00:00Z", studentId: 8, classId: 1, unitDataId: 3, required: true, answers: answers58, comment: "More practice" },
  { id: 95, lastModified: "2024-05-04T10:00:00Z", studentId: 8, classId: 1, unitDataId: 4, required: true, answers: answers58, comment: "Getting there" },
  { id: 96, lastModified: "2024-05-05T10:00:00Z", studentId: 8, classId: 1, unitDataId: 5, required: true, answers: answers58, comment: "Work harder" },
  { id: 97, lastModified: "2024-05-06T10:00:00Z", studentId: 8, classId: 1, unitDataId: 6, required: true, answers: answers58, comment: "Stay focused" },
  { id: 98, lastModified: "2024-05-07T10:00:00Z", studentId: 8, classId: 1, unitDataId: 7, required: true, answers: answers58, comment: "Needs support" },
  { id: 99, lastModified: "2024-05-08T10:00:00Z", studentId: 8, classId: 1, unitDataId: 8, required: true, answers: answers58, comment: "Let's practice" },
  { id: 100, lastModified: "2024-05-09T10:00:00Z", studentId: 8, classId: 1, unitDataId: 9, required: true, answers: answers58, comment: "Keep going" },
  { id: 101, lastModified: "2024-05-10T10:00:00Z", studentId: 8, classId: 1, unitDataId: 10, required: true, answers: answers58, comment: "More effort" },
  { id: 102, lastModified: "2024-05-11T10:00:00Z", studentId: 8, classId: 1, unitDataId: 11, required: true, answers: answers58, comment: "Review basics" },
  { id: 103, lastModified: "2024-05-12T10:00:00Z", studentId: 8, classId: 1, unitDataId: 12, required: true, answers: answers58, comment: "Focus needed" },
  { id: 104, lastModified: "2024-05-13T10:00:00Z", studentId: 8, classId: 1, unitDataId: 13, required: true, answers: answers58, comment: "Keep practicing" },

  // Student 9 (Isabelle Fortin) - Adequate (71%)
  { id: 105, lastModified: "2024-05-01T10:00:00Z", studentId: 9, classId: 1, unitDataId: 1, required: true, answers: answers71, comment: "Nice work" },
  { id: 106, lastModified: "2024-05-02T10:00:00Z", studentId: 9, classId: 1, unitDataId: 2, required: true, answers: answers71, comment: "Good progress" },
  { id: 107, lastModified: "2024-05-03T10:00:00Z", studentId: 9, classId: 1, unitDataId: 3, required: true, answers: answers71, comment: "Well done" },
  { id: 108, lastModified: "2024-05-04T10:00:00Z", studentId: 9, classId: 1, unitDataId: 4, required: true, answers: answers71, comment: "Good effort" },
  { id: 109, lastModified: "2024-05-05T10:00:00Z", studentId: 9, classId: 1, unitDataId: 5, required: true, answers: answers71, comment: "Solid work" },
  { id: 110, lastModified: "2024-05-06T10:00:00Z", studentId: 9, classId: 1, unitDataId: 6, required: true, answers: answers71, comment: "Nice effort" },
  { id: 111, lastModified: "2024-05-07T10:00:00Z", studentId: 9, classId: 1, unitDataId: 7, required: true, answers: answers71, comment: "Great work" },
  { id: 112, lastModified: "2024-05-08T10:00:00Z", studentId: 9, classId: 1, unitDataId: 8, required: true, answers: answers71, comment: "Improving" },
  { id: 113, lastModified: "2024-05-09T10:00:00Z", studentId: 9, classId: 1, unitDataId: 9, required: true, answers: answers71, comment: "Good job" },
  { id: 114, lastModified: "2024-05-10T10:00:00Z", studentId: 9, classId: 1, unitDataId: 10, required: true, answers: answers71, comment: "Well done" },
  { id: 115, lastModified: "2024-05-11T10:00:00Z", studentId: 9, classId: 1, unitDataId: 11, required: true, answers: answers71, comment: "Keep it up" },
  { id: 116, lastModified: "2024-05-12T10:00:00Z", studentId: 9, classId: 1, unitDataId: 12, required: true, answers: answers71, comment: "Excellent effort" },
  { id: 117, lastModified: "2024-05-13T10:00:00Z", studentId: 9, classId: 1, unitDataId: 13, required: true, answers: answers71, comment: "Good work" },

  // Student 10 (Julien Cloutier) - Excellent (81%)
  { id: 118, lastModified: "2024-05-01T10:00:00Z", studentId: 10, classId: 1, unitDataId: 1, required: true, answers: answers81, comment: "Excellent!" },
  { id: 119, lastModified: "2024-05-02T10:00:00Z", studentId: 10, classId: 1, unitDataId: 2, required: true, answers: answers81, comment: "Outstanding!" },
  { id: 120, lastModified: "2024-05-03T10:00:00Z", studentId: 10, classId: 1, unitDataId: 3, required: true, answers: answers81, comment: "Wonderful!" },
  { id: 121, lastModified: "2024-05-04T10:00:00Z", studentId: 10, classId: 1, unitDataId: 4, required: true, answers: answers81, comment: "Great work!" },
  { id: 122, lastModified: "2024-05-05T10:00:00Z", studentId: 10, classId: 1, unitDataId: 5, required: true, answers: answers81, comment: "Fantastic!" },
  { id: 123, lastModified: "2024-05-06T10:00:00Z", studentId: 10, classId: 1, unitDataId: 6, required: true, answers: answers81, comment: "Superb!" },
  { id: 124, lastModified: "2024-05-07T10:00:00Z", studentId: 10, classId: 1, unitDataId: 7, required: true, answers: answers81, comment: "Excellent progress!" },
  { id: 125, lastModified: "2024-05-08T10:00:00Z", studentId: 10, classId: 1, unitDataId: 8, required: true, answers: answers81, comment: "Exemplary!" },
  { id: 126, lastModified: "2024-05-09T10:00:00Z", studentId: 10, classId: 1, unitDataId: 9, required: true, answers: answers81, comment: "Outstanding work!" },
  { id: 127, lastModified: "2024-05-10T10:00:00Z", studentId: 10, classId: 1, unitDataId: 10, required: true, answers: answers81, comment: "Perfect!" },
  { id: 128, lastModified: "2024-05-11T10:00:00Z", studentId: 10, classId: 1, unitDataId: 11, required: true, answers: answers81, comment: "Excellent!" },
  { id: 129, lastModified: "2024-05-12T10:00:00Z", studentId: 10, classId: 1, unitDataId: 12, required: true, answers: answers81, comment: "Magnificent!" },
  { id: 130, lastModified: "2024-05-13T10:00:00Z", studentId: 10, classId: 1, unitDataId: 13, required: true, answers: answers81, comment: "Wonderful work!" },
];