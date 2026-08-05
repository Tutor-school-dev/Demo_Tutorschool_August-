"use client";

import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";

const FloatingSubmitButton = () => {
  const scrollToRegistration = () => {
    const element = document.getElementById('registration-form');
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        onClick={scrollToRegistration}
        className="bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 py-3 flex items-center gap-2"
      >
        <span className="font-semibold">Submit Entry</span>
        <ArrowDown className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default FloatingSubmitButton;