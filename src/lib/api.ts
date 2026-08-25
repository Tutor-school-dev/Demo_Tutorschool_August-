import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_GO_APP_URL || "https://tutorschoolfinalbackend-production.up.railway.app/api/v1",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = Cookies.get("jwt_Token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const refreshToken = Cookies.get("refresh_token");
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${api.defaults.baseURL}/auth/refresh`,
            { refresh_token: refreshToken }
          );
          Cookies.set("jwt_Token", data.access_token, { expires: 1 });
          Cookies.set("refresh_token", data.refresh_token, { expires: 7 });
          original.headers.Authorization = `Bearer ${data.access_token}`;
          return api(original);
        } catch {
          Cookies.remove("jwt_Token");
          Cookies.remove("refresh_token");
          localStorage.removeItem("model");
          localStorage.removeItem("email");
          localStorage.removeItem("name");
          window.location.href = "/auth";
        }
      }
    }
    return Promise.reject(error);
  }
);

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserResponse {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  onboarding_completed: boolean;
  avatar_url: string | null;
}

export interface LearningPattern {
  subject: string;
  score: number;
}

export interface ScoreTriple {
  point_estimate: number;
  confidence: number;
  observations: number;
}

export interface StudentScores {
  s1_attention_stability: ScoreTriple | null;
  s2_working_memory: ScoreTriple | null;
  s3_feedback_sensitivity: ScoreTriple | null;
  s4_motivation: ScoreTriple | null;
  s5_abstraction: ScoreTriple | null;
  s6_developmental_stage: ScoreTriple | null;
  s7_persistence: ScoreTriple | null;
}

export interface StudentProfileResponse {
  id: string;
  user_id: string;
  grade_level: number | null;
  school: string | null;
  subjects: Record<string, unknown> | null;
  learning_goals: string | null;
  scores: StudentScores;
}

export interface PairingDetail {
  weight: number;
  s_value: number;
  s_raw: number;
  t_value: number;
  contribution: number;
  inverted: boolean;
}

export interface MatchResultAPI {
  teacher_id: string;
  teacher_name: string;
  compatibility_score: number;
  match_confidence: number;
  offer_probability: number;
  exploration_flag: boolean;
  rank: number;
  breakdown: Record<string, PairingDetail>;
}

export interface ComputeMatchesResponse {
  student_id: string;
  matches: MatchResultAPI[];
  total_teachers_evaluated: number;
}

export const authAPI = {
  register(email: string, password: string, fullName: string, role: string, gradeLevel?: number) {
    return api.post<TokenResponse>("/auth/register", {
      email,
      password,
      full_name: fullName,
      role,
      grade_level: gradeLevel,
    });
  },
  login(email: string, password: string) {
    return api.post<TokenResponse>("/auth/login", { email, password });
  },
  google(credential: string, role: string) {
    return api.post<TokenResponse>("/auth/google", { credential, role });
  },
  me() {
    return api.get<UserResponse>("/auth/me");
  },
  logout(refreshToken: string) {
    return api.post("/auth/logout", { refresh_token: refreshToken });
  },
};

export const studentAPI = {
  getProfile() {
    return api.get<StudentProfileResponse>("/students/me");
  },
  submitQuestionnaire(data: {
    learning_preferences: Record<string, number>;
    self_reported_habits: Record<string, number>;
    background: { grade: number; age: number };
  }) {
    return api.post<StudentProfileResponse>("/students/me/questionnaire", data);
  },
};

export interface ConnectedStudent {
  id: string;
  name: string;
  grade_level: number | null;
  compatibility_score: number;
  sessions_completed: number;
  scores: Record<string, number | null>;
}

export const teacherAPI = {
  getProfile() {
    return api.get("/teachers/me");
  },
  updateProfile(data: { bio?: string; subjects?: Record<string, unknown>; experience_years?: number; hourly_rate?: number; availability?: Record<string, unknown>; max_students?: number }) {
    return api.patch("/teachers/me", data);
  },
  submitQuestionnaire(data: Record<string, unknown>) {
    return api.post("/teachers/me/questionnaire", data);
  },
  getMyStudents() {
    return api.get<ConnectedStudent[]>("/teachers/me/students");
  },
};

export interface TeacherOfferItem {
  id: string;
  student_id: string;
  student_name: string;
  compatibility_score: number;
  status: string;
  created_at: string | null;
}

export const matchingAPI = {
  compute(maxResults = 10, explorationRate = 0.1) {
    return api.post<ComputeMatchesResponse>("/matching/compute", {
      max_results: maxResults,
      exploration_rate: explorationRate,
    });
  },
  getOffers(studentId: string) {
    return api.get(`/matching/offers/${studentId}`);
  },
  getTeacherOffers() {
    return api.get<TeacherOfferItem[]>("/matching/offers/teacher/me");
  },
  getBreakdown(offerId: string) {
    return api.get(`/matching/offers/${offerId}/breakdown`);
  },
  acceptOffer(offerId: string) {
    return api.post(`/matching/offers/${offerId}/accept`);
  },
  declineOffer(offerId: string) {
    return api.post(`/matching/offers/${offerId}/decline`);
  },
};

export const assessmentAPI = {
  submit(data: { parameter_key: string; score: number; confidence: number; raw_data?: Record<string, unknown> }[]) {
    return api.post("/assessments/submit", {
      assessment_type: "cognitive_baseline",
      parameters: data,
    });
  },
};

export const feedbackAPI = {
  createSession(data: { student_id: string; teacher_id: string; scheduled_at: string }) {
    return api.post("/feedback/sessions", data);
  },
  submitTeacherFeedback(sessionId: string, data: Record<string, unknown>) {
    return api.post(`/feedback/teacher/${sessionId}`, data);
  },
  submitStudentFeedback(sessionId: string, data: Record<string, unknown>) {
    return api.post(`/feedback/student/${sessionId}`, data);
  },
};

export default api;
