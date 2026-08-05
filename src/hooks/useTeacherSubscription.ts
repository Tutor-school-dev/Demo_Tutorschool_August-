"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { getAppUrl } from "@/lib/utils";

export const useTeacherSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [subscriptionDetail, setSubscriptionDetail] = useState([]);

  const getSubscriptions = async () => {
    try {
      setLoading(true);
      const apiUrl = getAppUrl();
      const jwtToken = Cookies.get("jwt_Token");
      
      if (!jwtToken) {
        toast.error("Authentication required. Please login again.");
        return;
      }

      const response = await axios.get(`${apiUrl}/subscriptions`, {
        headers: { authorization: `bearer ${jwtToken}` }
      });
      
      setSubscriptionDetail(response.data.data);
    } catch (err: any) {
      console.error("Get subscriptions error:", err);
      toast.error(err.response?.data?.message || "Failed to fetch subscription plans");
    } finally {
      setLoading(false);
    }
  };

  const startPayment = async (tierId: number, duration: number) => {
    try {
      setLoading(true);
      const apiUrl = getAppUrl();
      const jwtToken = Cookies.get("jwt_Token");
      
      if (!jwtToken) {
        toast.error("Authentication required. Please login again.");
        return;
      }

      const response = await axios.post(`${apiUrl}/payment/start`, {
        sub_id: tierId,
        duration: duration
      }, { 
        headers: { authorization: `bearer ${jwtToken}` } 
      });

      // Store order details for payment verification
      if (typeof window !== 'undefined') {
        localStorage.setItem('order_id', response.data.order_id);
        localStorage.setItem('tier_id', tierId.toString());
      }

      // Redirect to payment gateway
      const paymentUrl = response.data.url;
      window.location.href = paymentUrl;
      
    } catch (err: any) {
      console.error("Payment start error:", err);
      toast.error(err.response?.data?.message || "Failed to start payment process");
    } finally {
      setLoading(false);
    }
  };

  return { 
    getSubscriptions, 
    subscriptionDetail, 
    startPayment, 
    loading 
  };
};