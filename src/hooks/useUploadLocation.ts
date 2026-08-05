"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { getApiUrl } from "@/lib/utils";

export const useUploadLocation = (fromSettings = false) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleMapForm = async (values: any, position: { lat: number; lng: number }, model: string) => {
    try {
      setLoading(true);
      const apiUrl = getApiUrl();
      const authToken = Cookies.get("jwt_Token"); // Fixed: use jwt_Token for consistency
      
      if (!authToken) {
        toast.error("Authentication required. Please login again.");
        router.push("/auth?model=teacher");
        return;
      }

      const response = await axios.post(`${apiUrl}/onboarding/${model}/location`, {
        latitude: position.lat,
        longitude: position.lng,
        area: values.area,
        state: values.state,
        pincode: values.pincode
      }, { 
        headers: { 
          authorization: `bearer ${authToken}` 
        } 
      });
      
      toast.success(response.data.message || "Location saved successfully");
      
      if (fromSettings) {
        return;
      }

      if (model === 'teacher') {
        // Since subscription is optional, go directly to dashboard
        router.push('/dashboard/teacher');
      }
    } catch (err: any) {
      console.error("Upload location error:", err);
      const message = err.response?.data?.message || 'Something went wrong, Please try again!';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return { handleMapForm, loading };
};