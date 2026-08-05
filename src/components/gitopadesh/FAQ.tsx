"use client";

import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqs = [
    {
      question: "Who can participate in the Gitopadesh competition?",
      answer: "The competition is open to school-going children aged 6 to 17 years worldwide. Participants can enter individually or as part of a school team."
    },
    {
      question: "What is the format of the competition?",
      answer: "Participants need to submit a 3-minute video reciting and explaining a selected sloka from the Bhagavad Gita based on their age group's theme."
    },
    {
      question: "How are the age categories divided?",
      answer: "Category 1: 6-8 years, Category 2: 9-11 years, Category 3: 12-14 years, Category 4: 15-17 years. Each category has specific themes and modules."
    },
    {
      question: "What prizes are available?",
      answer: "Winners receive rolling trophies, certificates, and medals. All participants receive recognition certificates, and there are exciting gifts for winners and runners-up."
    },
    {
      question: "Is there a registration fee?",
      answer: "No, the competition is completely free to enter. We believe in making spiritual education accessible to all children worldwide."
    },
    {
      question: "What are the judging criteria?",
      answer: "Videos are judged on pronunciation & clarity (25 pts), understanding of meaning (25 pts), clarity of explanation (25 pts), connection to theme (15 pts), and presentation skills (10 pts)."
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-secondary/20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-center text-muted-foreground text-lg mb-12">
            Find answers to common questions about the competition
          </p>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="border-2 border-secondary/20 hover:border-primary/20 transition-all">
                <Collapsible open={openItems.includes(index)} onOpenChange={() => toggleItem(index)}>
                  <CollapsibleTrigger className="w-full p-6 text-left">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-foreground pr-4">
                        {faq.question}
                      </h3>
                      <ChevronDown 
                        className={`w-5 h-5 text-primary transition-transform ${
                          openItems.includes(index) ? 'rotate-180' : ''
                        }`} 
                      />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="px-6 pb-6">
                      <p className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;