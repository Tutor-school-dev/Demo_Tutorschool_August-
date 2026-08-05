"use client";

import { create } from "zustand";
import { toast } from "sonner";
import axios from "axios";
import { getApiUrl } from "@/lib/utils";

interface Teacher {
  id: string;
  name: string;
  email: string;
  p_contact: string;
  profile_pic?: string;
  basic_done: boolean;
  location_done: boolean;
  subscription_validity?: string;
  lesson_price?: number;
  introduction?: string;
  teaching_desc?: string;
  latitude?: number;
  longitude?: number;
  area?: string;
  state?: string;
  pincode?: string;
}

interface TeacherSession {
  id: string;
  parent_name: string;
  admin_side_status: string;
  subject: string;
  created_at: string;
  removed_at?: string;
  child_name: string;
  class: string;
  board: string;
  timings: string;
  week_days: string;
}

interface TeacherSubject {
  subject_name: string;
  subject_code: string;
}

interface TeacherSubscription {
  name: string;
  validity?: string;
}

interface TeacherPayment {
  amount: number;
  status: string;
  updated_at: string;
  is_refund: boolean;
}

interface Parent {
  id: string;
  name: string;
  email: string;
}

interface DashboardState {
  teacher: Teacher | null;
  teacher_sessions: TeacherSession[] | null;
  teacher_certifications: any[] | null;
  teacher_subjects: TeacherSubject[] | null;
  teacher_subscription: TeacherSubscription | null;
  teacher_payments: TeacherPayment[] | null;
  job_message: any | null;
  parent: Parent | null;
  parent_sessions: any[] | null;
  parent_invitations: any[] | null;
  loading: boolean;
  error: any | null;
  
  set_dashboard_data: (data: any, model: string) => void;
  get_dashboard_data: (jwt_Token: string, force?: boolean) => Promise<any>;
  get_teacher_subs: (jwt_Token: string) => Promise<void>;
  update_teacher_subs: (jwt_Token: string, data: any) => Promise<void>;
  get_teacher_profile_pic: (jwt_Token: string) => Promise<void>;
  update_teacher_desc: (introduction: string, teaching_desc: string) => void;
  update_teacher_cert: (cert_data: any, sub_name: string) => void;
  get_teacher_payment: (jwt_Token: string) => Promise<void>;
  update_teacher_lesson_price: (jwt_Token: string, price: number) => Promise<void>;
  update_location_data: (latitude: number, longitude: number, area: string, state: string, pincode: string, model: string) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  teacher: null,
  teacher_sessions: null,
  teacher_certifications: null,
  teacher_subjects: null,
  teacher_subscription: null,
  teacher_payments: null,
  job_message: null,
  parent: null,
  parent_sessions: null,
  parent_invitations: null,
  loading: false,
  error: null,

  set_dashboard_data: (data: any, model: string) => {
    if (model === "job_message") {
      if (get().job_message) {
        return;
      }
      set({ job_message: data });
    }
    if (model === "teacher") {
      const teacher = data;
      const sessions = data.parent;
      const certificates = data.certificates;
      const subscription = data.subscription;

      delete teacher.parent;
      delete teacher.subscription;
      delete teacher.certifications;

      set({
        teacher: teacher,
        teacher_certifications: certificates,
        teacher_sessions: sessions,
        teacher_subscription: subscription,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem("model", "Teacher");
        localStorage.setItem("email", teacher.email);
        localStorage.setItem("name", teacher.name);
      }
    }
    if (model === "parent") {
      const parent = data;
      const sessions = data.teachers;

      delete parent.teacher;
      set({
        parent: parent,
        parent_sessions: sessions,
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem("model", "Parent");
        localStorage.setItem("email", parent.email);
        localStorage.setItem("name", parent.name);
      }
    }
  },

  get_dashboard_data: async (jwt_Token: string, force?: boolean) => {
    try {
      if (!force && (get().teacher || get().loading || get().parent)) return;

      set({ loading: true, error: null });
      
      const apiUrl = getApiUrl();
      const res = await axios.get(`${apiUrl}/dashboard`, {
        headers: { authorization: `Bearer ${jwt_Token}` }
      });

      if (res.data.model === 'teacher') {
        const teacher = res.data.teacher;
        const sessions = teacher.parent;
        const certificates = teacher.certificates;
        const subscription = teacher.subscription;

        delete teacher.parent;
        delete teacher.subscription;
        delete teacher.certifications;

        set({
          teacher: teacher,
          teacher_certifications: certificates,
          teacher_sessions: sessions,
          teacher_subscription: subscription,
        });

        const stepNames = {
          basic_done: teacher.basic_done,
          location_done: teacher.location_done
        };

        if (typeof window !== 'undefined') {
          localStorage.setItem("model", "Teacher");
          localStorage.setItem("email", teacher.email);
          localStorage.setItem("name", teacher.name);
        }

        return { stepNames, go_to_dashboard: res.data.go_to_dashboard, model: res.data.model };
      }

      if (res.data.model === 'parent') {
        const parent = res.data.parent;
        const session = parent.teachers;

        delete parent.teachers;
        set({
          parent: parent,
          parent_sessions: session,
        });

        if (typeof window !== 'undefined') {
          localStorage.setItem("model", "Parent");
          localStorage.setItem("email", parent.email);
          localStorage.setItem("name", parent.name);
        }

        return { go_to_dashboard: res.data.go_to_dashboard, model: res.data.model };
      }

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch dashboard data");
      console.error(error);
      set({ error: error });
    } finally {
      set({ loading: false });
    }
  },

  update_location_data: (latitude: number, longitude: number, area: string, state: string, pincode: string, model: string) => {
    if (model === "teacher") {
      set((prev) => ({
        teacher: prev.teacher ? {
          ...prev.teacher,
          latitude: latitude,
          longitude: longitude,
          area: area,
          state: state,
          pincode: pincode
        } : null
      }));
    } else if (model === "parent") {
      set((prev) => ({
        parent: prev.parent ? {
          ...prev.parent,
          latitude: latitude,
          longitude: longitude,
          area: area,
          state: state,
          pincode: pincode
        } : null
      }));
    }
  },

  get_teacher_subs: async (jwt_Token: string) => {
    try {
      if (get().teacher_subjects) return;

      set({ loading: true, error: null });
      
      const apiUrl = getApiUrl();
      const res = await axios.get(`${apiUrl}/subject/teacher`, {
        headers: {
          Authorization: `Bearer ${jwt_Token}`
        }
      });

      set({ teacher_subjects: res.data, loading: false });

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch teacher subjects");
      console.error(error);
      set({ error: error, loading: false });
    }
  },

  update_teacher_subs: async (jwt_Token: string, data: any) => {
    try {
      set({ loading: true, error: null });
      
      const apiUrl = getApiUrl();
      const res = await axios.post(`${apiUrl}/subject/teacher`, data, {
        headers: {
          Authorization: `Bearer ${jwt_Token}`
        }
      });

      set({ teacher_subjects: data, loading: false });
      toast.success(res.data.message);

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update teacher subjects");
      console.error(error);
      set({ error: error, loading: false });
    }
  },

  get_teacher_profile_pic: async (jwt_Token: string) => {
    try {
      set({ loading: true, error: null });
      
      const apiUrl = getApiUrl();
      const res = await axios.get(`${apiUrl}/teacher/profile/pic`, {
        headers: { authorization: `Bearer ${jwt_Token}` }
      });

      set(state => ({
        teacher: state.teacher ? {
          ...state.teacher,
          profile_pic: res.data.url
        } : null,
        loading: false
      }));

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch profile picture");
      console.error(error);
      set({ error: error, loading: false });
    }
  },

  update_teacher_desc: (introduction: string, teaching_desc: string) => {
    set((prev) => ({
      teacher: prev.teacher ? {
        ...prev.teacher,
        introduction: introduction,
        teaching_desc: teaching_desc
      } : null
    }));
  },

  update_teacher_cert: (cert_data: any, sub_name: string) => {
    const data = {
      subject_code: cert_data.subject,
      certification_name: cert_data.certificationName,
      start_year: cert_data.fromYear,
      end_year: cert_data.toYear,
      subject_name: sub_name
    };

    set((prev) => ({
      teacher_certifications: prev.teacher_certifications ? [...prev.teacher_certifications, data] : [data]
    }));
  },

  get_teacher_payment: async (jwt_Token: string) => {
    try {
      if (get().teacher_payments) return;

      set({ loading: true, error: null });
      
      const apiUrl = getApiUrl();
      const res = await axios.get(`${apiUrl}/payment`, {
        headers: { authorization: `Bearer ${jwt_Token}` }
      });

      set({ teacher_payments: res.data, loading: false });

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to fetch payment history");
      console.error(error);
      set({ error: error, loading: false });
    }
  },

  update_teacher_lesson_price: async (jwt_token: string, price: number) => {
    try {
      if (get().loading) return;
      set({ loading: true, error: null });

      const apiUrl = getApiUrl();
      const response = await axios.post(`${apiUrl}/onboarding/teacher/pricing`, {
        lesson_price: price
      }, { headers: { authorization: `bearer ${jwt_token}` } });

      set((prev) => ({
        teacher: prev.teacher ? {
          ...prev.teacher,
          lesson_price: price
        } : null,
        loading: false
      }));

      toast.success(response.data.message);

    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update lesson price");
      console.error(error);
      set({ error: error, loading: false });
    }
  }
}));