import axios from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { getAppUrl } from "@/lib/utils";

export interface FormData {
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  childName: string;
  childAge: string;
  theme: string;
  video: File | null;
  slokaRecited: string;
}

export const useFormSubmit = () => {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(10);

  const submitForm = async (data: FormData) => {
    try {
      setLoading(true);
      setProgress(10);
      
      // Get API URL from environment variables with fallback
      const apiUrl = getAppUrl();
      
      console.log('API URL:', apiUrl); // Debug log for production

      // Submit form data to match React repo exactly
      const response = await axios.post(`${apiUrl}/campaign/submission`, {
        parentName: data.parentName,
        parentEmail: data.parentEmail,
        parentPhone: data.parentPhone,
        childName: data.childName,
        childAge: data.childAge,
        theme: data.theme,
        slokaRecited: data.slokaRecited
      });

      // Upload video if provided and upload URL is returned
      if (response.data.upload_url && data.video) {
        setProgress(30);
        await axios.put(response.data.upload_url, data.video, {
          headers: {
            'Content-Type': 'video/mp4'
          }
        });
      }
      
      setProgress(70);
      
      toast.success("Gitopadesh submitted successfully!");
      
      setProgress(100);
      return true;
    } catch (error: any) {
      console.error("Form submission error:", error);
      const message = error.response?.data?.message || "Failed to submit form. Please try again.";
      toast.error(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitForm, loading, progress };
};