export interface LearningPattern {
  subject: string;
  score: number;
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  grade: string;
  board: string;
  avatar: string;
  subjects: string[];
  learningPattern: LearningPattern[];
  matchedTeacherId: string;
  fitScore: number;
  sessionsCompleted: number;
  testsCompleted: number;
  averageScore: number;
  streak: number;
}

export interface TeacherProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  subjects: string[];
  experience: string;
  lessonPrice: number;
  teachingMode: string;
  rating: number;
  totalStudents: number;
  teachingPattern: LearningPattern[];
}

export interface MatchResult {
  studentId: string;
  teacherId: string;
  fitScore: number;
  breakdown: { dimension: string; overlap: number }[];
}

export interface SessionRecord {
  id: string;
  date: string;
  subject: string;
  duration: number;
  teacherName: string;
  score: number;
}

export interface TestResult {
  id: string;
  date: string;
  subject: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeTaken: number;
}

export const DIMENSIONS = [
  "Concept Formation & Abstraction Ability",
  "Reasoning Strategy & Transfer Ability",
  "Working Memory & Retention Stability",
  "Divergent Thinking",
  "Cognitive Flexibility & Logical Reasoning",
  "Expression & Explanation Quality",
];

export const demoStudents: StudentProfile[] = [
  {
    id: "s1",
    name: "Arjun Mehta",
    email: "arjun.mehta@tutorschool.in",
    grade: "Class 10",
    board: "CBSE",
    avatar: "AM",
    subjects: ["Mathematics", "Physics", "Chemistry"],
    learningPattern: [
      { subject: "Concept Formation & Abstraction Ability", score: 82 },
      { subject: "Reasoning Strategy & Transfer Ability", score: 91 },
      { subject: "Working Memory & Retention Stability", score: 68 },
      { subject: "Divergent Thinking", score: 75 },
      { subject: "Cognitive Flexibility & Logical Reasoning", score: 88 },
      { subject: "Expression & Explanation Quality", score: 60 },
    ],
    matchedTeacherId: "t1",
    fitScore: 89,
    sessionsCompleted: 24,
    testsCompleted: 8,
    averageScore: 78,
    streak: 5,
  },
  {
    id: "s2",
    name: "Priya Sharma",
    email: "priya.sharma@tutorschool.in",
    grade: "Class 9",
    board: "ICSE",
    avatar: "PS",
    subjects: ["English", "History", "Geography"],
    learningPattern: [
      { subject: "Concept Formation & Abstraction Ability", score: 76 },
      { subject: "Reasoning Strategy & Transfer Ability", score: 62 },
      { subject: "Working Memory & Retention Stability", score: 89 },
      { subject: "Divergent Thinking", score: 85 },
      { subject: "Cognitive Flexibility & Logical Reasoning", score: 70 },
      { subject: "Expression & Explanation Quality", score: 92 },
    ],
    matchedTeacherId: "t2",
    fitScore: 91,
    sessionsCompleted: 18,
    testsCompleted: 6,
    averageScore: 84,
    streak: 3,
  },
  {
    id: "s3",
    name: "Rahul Verma",
    email: "rahul.verma@tutorschool.in",
    grade: "Class 11",
    board: "CBSE",
    avatar: "RV",
    subjects: ["Physics", "Mathematics", "Computer Science"],
    learningPattern: [
      { subject: "Concept Formation & Abstraction Ability", score: 70 },
      { subject: "Reasoning Strategy & Transfer Ability", score: 85 },
      { subject: "Working Memory & Retention Stability", score: 72 },
      { subject: "Divergent Thinking", score: 90 },
      { subject: "Cognitive Flexibility & Logical Reasoning", score: 94 },
      { subject: "Expression & Explanation Quality", score: 55 },
    ],
    matchedTeacherId: "t3",
    fitScore: 86,
    sessionsCompleted: 31,
    testsCompleted: 12,
    averageScore: 72,
    streak: 8,
  },
  {
    id: "s4",
    name: "Ananya Iyer",
    email: "ananya.iyer@tutorschool.in",
    grade: "Class 8",
    board: "State Board",
    avatar: "AI",
    subjects: ["Science", "Mathematics", "English"],
    learningPattern: [
      { subject: "Concept Formation & Abstraction Ability", score: 88 },
      { subject: "Reasoning Strategy & Transfer Ability", score: 74 },
      { subject: "Working Memory & Retention Stability", score: 82 },
      { subject: "Divergent Thinking", score: 78 },
      { subject: "Cognitive Flexibility & Logical Reasoning", score: 71 },
      { subject: "Expression & Explanation Quality", score: 86 },
    ],
    matchedTeacherId: "t1",
    fitScore: 82,
    sessionsCompleted: 15,
    testsCompleted: 5,
    averageScore: 81,
    streak: 2,
  },
  {
    id: "s5",
    name: "Karthik Nair",
    email: "karthik.nair@tutorschool.in",
    grade: "Class 12",
    board: "CBSE",
    avatar: "KN",
    subjects: ["Chemistry", "Biology", "Physics"],
    learningPattern: [
      { subject: "Concept Formation & Abstraction Ability", score: 92 },
      { subject: "Reasoning Strategy & Transfer Ability", score: 78 },
      { subject: "Working Memory & Retention Stability", score: 95 },
      { subject: "Divergent Thinking", score: 65 },
      { subject: "Cognitive Flexibility & Logical Reasoning", score: 80 },
      { subject: "Expression & Explanation Quality", score: 73 },
    ],
    matchedTeacherId: "t4",
    fitScore: 93,
    sessionsCompleted: 42,
    testsCompleted: 15,
    averageScore: 88,
    streak: 12,
  },
];

export const demoTeachers: TeacherProfile[] = [
  {
    id: "t1",
    name: "Dr. Rakesh Kumar",
    email: "rakesh.kumar@tutorschool.in",
    avatar: "RK",
    subjects: ["Mathematics", "Physics"],
    experience: "12 years",
    lessonPrice: 800,
    teachingMode: "Both",
    rating: 4.9,
    totalStudents: 45,
    teachingPattern: [
      { subject: "Concept Formation & Abstraction Ability", score: 85 },
      { subject: "Reasoning Strategy & Transfer Ability", score: 92 },
      { subject: "Working Memory & Retention Stability", score: 70 },
      { subject: "Divergent Thinking", score: 78 },
      { subject: "Cognitive Flexibility & Logical Reasoning", score: 90 },
      { subject: "Expression & Explanation Quality", score: 65 },
    ],
  },
  {
    id: "t2",
    name: "Meera Deshpande",
    email: "meera.deshpande@tutorschool.in",
    avatar: "MD",
    subjects: ["English", "History", "Geography"],
    experience: "8 years",
    lessonPrice: 600,
    teachingMode: "Online",
    rating: 4.8,
    totalStudents: 32,
    teachingPattern: [
      { subject: "Concept Formation & Abstraction Ability", score: 80 },
      { subject: "Reasoning Strategy & Transfer Ability", score: 65 },
      { subject: "Working Memory & Retention Stability", score: 88 },
      { subject: "Divergent Thinking", score: 90 },
      { subject: "Cognitive Flexibility & Logical Reasoning", score: 72 },
      { subject: "Expression & Explanation Quality", score: 95 },
    ],
  },
  {
    id: "t3",
    name: "Prof. Sanjay Gupta",
    email: "sanjay.gupta@tutorschool.in",
    avatar: "SG",
    subjects: ["Physics", "Computer Science", "Mathematics"],
    experience: "15 years",
    lessonPrice: 1000,
    teachingMode: "Both",
    rating: 4.7,
    totalStudents: 58,
    teachingPattern: [
      { subject: "Concept Formation & Abstraction Ability", score: 75 },
      { subject: "Reasoning Strategy & Transfer Ability", score: 88 },
      { subject: "Working Memory & Retention Stability", score: 68 },
      { subject: "Divergent Thinking", score: 92 },
      { subject: "Cognitive Flexibility & Logical Reasoning", score: 95 },
      { subject: "Expression & Explanation Quality", score: 60 },
    ],
  },
  {
    id: "t4",
    name: "Dr. Sunita Patel",
    email: "sunita.patel@tutorschool.in",
    avatar: "SP",
    subjects: ["Chemistry", "Biology"],
    experience: "10 years",
    lessonPrice: 750,
    teachingMode: "Offline",
    rating: 4.9,
    totalStudents: 38,
    teachingPattern: [
      { subject: "Concept Formation & Abstraction Ability", score: 94 },
      { subject: "Reasoning Strategy & Transfer Ability", score: 80 },
      { subject: "Working Memory & Retention Stability", score: 92 },
      { subject: "Divergent Thinking", score: 68 },
      { subject: "Cognitive Flexibility & Logical Reasoning", score: 82 },
      { subject: "Expression & Explanation Quality", score: 76 },
    ],
  },
];

export const demoSessions: SessionRecord[] = [
  { id: "ss1", date: "2026-08-04", subject: "Mathematics", duration: 60, teacherName: "Dr. Rakesh Kumar", score: 85 },
  { id: "ss2", date: "2026-08-02", subject: "Physics", duration: 45, teacherName: "Dr. Rakesh Kumar", score: 78 },
  { id: "ss3", date: "2026-07-31", subject: "Mathematics", duration: 60, teacherName: "Dr. Rakesh Kumar", score: 82 },
  { id: "ss4", date: "2026-07-29", subject: "Chemistry", duration: 45, teacherName: "Dr. Sunita Patel", score: 90 },
  { id: "ss5", date: "2026-07-27", subject: "Physics", duration: 60, teacherName: "Prof. Sanjay Gupta", score: 76 },
  { id: "ss6", date: "2026-07-25", subject: "Mathematics", duration: 60, teacherName: "Dr. Rakesh Kumar", score: 88 },
];

export const demoTests: TestResult[] = [
  { id: "t1", date: "2026-08-03", subject: "Mathematics", score: 85, totalQuestions: 20, correctAnswers: 17, timeTaken: 35 },
  { id: "t2", date: "2026-08-01", subject: "Physics", score: 72, totalQuestions: 15, correctAnswers: 11, timeTaken: 28 },
  { id: "t3", date: "2026-07-28", subject: "Chemistry", score: 90, totalQuestions: 20, correctAnswers: 18, timeTaken: 32 },
  { id: "t4", date: "2026-07-25", subject: "Mathematics", score: 78, totalQuestions: 25, correctAnswers: 20, timeTaken: 40 },
  { id: "t5", date: "2026-07-22", subject: "Physics", score: 68, totalQuestions: 15, correctAnswers: 10, timeTaken: 25 },
  { id: "t6", date: "2026-07-19", subject: "Mathematics", score: 82, totalQuestions: 20, correctAnswers: 16, timeTaken: 30 },
];

export const teacherDimensions: LearningPattern[] = [
  { subject: "Pacing (Mastery-Based Instructional Progression)", score: 78 },
  { subject: "Scaffolding (Contingent Support Calibration)", score: 85 },
  { subject: "Feedback Style (Corrective/Elaborative/Encouraging)", score: 72 },
  { subject: "Diagnostic Questioning", score: 90 },
  { subject: "Motivation Style (Autonomy-Supportive vs Controlled)", score: 82 },
  { subject: "Cognitive Flexibility", score: 68 },
  { subject: "Psychological Safety", score: 88 },
  { subject: "Patience & Error Tolerance", score: 75 },
];

export const demoTeacherTests: TestResult[] = [
  { id: "tt1", date: "2026-08-04", subject: "Teaching Assessment", score: 82, totalQuestions: 7, correctAnswers: 6, timeTaken: 3 },
  { id: "tt2", date: "2026-07-20", subject: "Student Engagement", score: 75, totalQuestions: 10, correctAnswers: 8, timeTaken: 5 },
  { id: "tt3", date: "2026-07-10", subject: "Pedagogy Quiz", score: 88, totalQuestions: 12, correctAnswers: 11, timeTaken: 8 },
];

export function calculateFitScore(
  studentPattern: LearningPattern[],
  teacherPattern: LearningPattern[]
): number {
  let totalDiff = 0;
  for (let i = 0; i < studentPattern.length; i++) {
    totalDiff += Math.abs(studentPattern[i].score - teacherPattern[i].score);
  }
  const avgDiff = totalDiff / studentPattern.length;
  return Math.round(100 - avgDiff);
}

export function getMatchBreakdown(
  studentPattern: LearningPattern[],
  teacherPattern: LearningPattern[]
): { dimension: string; overlap: number }[] {
  return studentPattern.map((sp, i) => ({
    dimension: sp.subject,
    overlap: Math.round(100 - Math.abs(sp.score - teacherPattern[i].score)),
  }));
}
