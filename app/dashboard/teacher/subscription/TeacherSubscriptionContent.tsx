"use client";

import { useEffect } from "react";
import React from "react";
import { toast } from "sonner";
import { CheckCircle, Star, Zap, Check } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../../src/components/ui/card";
import { Button } from "../../../../src/components/ui/button";
import { useTeacherSubscription } from "../../../../src/hooks/useTeacherSubscription";
import TeacherNavbar from "../../../../src/components/TeacherNavbar";

interface SubscriptionTier {
  id: number;
  name: string;
  price: number;
  features: string[];
}

export default function TeacherSubscriptionContent() {
  const { getSubscriptions, subscriptionDetail, startPayment, loading } = useTeacherSubscription();

  // Static subscription tiers matching React repo exactly
  const subscriptionTiers: SubscriptionTier[] = [
    {
      id: 1,
      name: "Basic Plan",
      price: 299,
      features: [
        "Apply for up to 2 tuitions",
        "Free pedagogy training & certification",
        "Profile listing + demo lesson upload"
      ]
    },
    {
      id: 2,
      name: "Standard Plan", 
      price: 599,
      features: [
        "Apply for up to 4 tuitions",
        "Everything in Basic + verified badge",
        "Priority listing in local searches",
        'Access to "mock interview" support for school jobs'
      ]
    },
    {
      id: 3,
      name: "Pro Plan",
      price: 999,
      features: [
        "Apply for up to 6 tuitions",
        "Everything in Standard + Fast track support",
        "Free advanced pedagogy workshops (skill upgrades)",
        "Health insurance cover"
      ]
    }
  ];

  useEffect(() => {
    getSubscriptions();
  }, []);

  const handleSubscribe = (tierId: number) => {
    // Default to 6 months as per React repo
    startPayment(tierId, 6);
  };

  if (subscriptionDetail && !subscriptionDetail.length) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TeacherNavbar />
        <div className="flex justify-center items-center h-screen">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span>Loading subscription plans...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherNavbar />
      
      <div className="container mx-auto mt-7 p-4">
        {/* Header */}
        <div className="flex justify-center mb-10 w-full">
          <h1 className="text-2xl font-semibold underline">Subscription Tiers</h1>
        </div>

        {/* Subscription Plans */}
        <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-6 w-full md:w-auto">
          {subscriptionTiers.map((tier) => (
            <Card key={tier.id} className="relative flex flex-col w-full md:w-[30%]">
              <CardHeader className="bg-muted/50">
                <CardTitle className="text-lg text-center">{tier.name}</CardTitle>
              </CardHeader>
              
              <CardContent className="flex flex-col flex-grow p-6">
                <div className="text-center mb-6">
                  <span className="text-4xl font-bold">₹{tier.price}</span>
                  <span className="text-muted-foreground">/six-months</span>
                </div>
                
                <ul className="flex-grow space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              
              <CardFooter>
                <Button 
                  onClick={() => handleSubscribe(tier.id)}
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600"
                >
                  {loading ? "Processing..." : "Apply Now"}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}