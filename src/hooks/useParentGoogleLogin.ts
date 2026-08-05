import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useDashboardStore } from "./useDashboardStore";
import { getApiUrl } from "@/lib/utils";

export const useParentGoogleLogin = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { set_dashboard_data } = useDashboardStore();

  const handleGoogleLogin = async (response: any) => {
    const token = response.credential;
    setLoading(true);

    try {
      const apiUrl = getApiUrl();
      const res = await axios.post(`${apiUrl}/auth/parent/google`, {
        id_token: token,
      });

      const { data } = res;
      toast.info(data.message || "Google login successful!");

      // Handle new user registration flow
      if (data.access_hash) {
        Cookies.set("access_hash", data.access_hash, { expires: 1 }); // 1 day
        // For now, show message instead of redirecting
        // In future: router.push(`/onboarding?model=parent`);
        toast.info("Account creation required. Please complete registration.");
        return;
      }

      // Set JWT token for existing user
      Cookies.set("jwt_Token", data.jwt_token, { expires: 7 }); // Fixed: use jwt_Token for consistency

      // Store user data
      if (typeof window !== 'undefined') {
        localStorage.setItem("model", "Parent");
        localStorage.setItem("name", data.parent.name);
      }

      set_dashboard_data(data.parent, "parent");

      // Navigate to parent dashboard
      router.push('/dashboard/parent');

    } catch (err: any) {
      console.error('Google login error:', err);
      const message = err.response?.data?.message || "Google login failed. Please try again.";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleFailure = (error: any) => {
    console.error("Google Login Failed:", error);
    toast.error("Google login failed. Please try again.");
  };

  return { handleGoogleLogin, handleFailure, loading };
};