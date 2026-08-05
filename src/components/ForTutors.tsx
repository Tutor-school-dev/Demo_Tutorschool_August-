"use client";

import { Button } from "@/components/ui/button";
import { Star, Users, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function AnimatedStat({ value, label, sublabel }: { value: string; label: string; sublabel: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="text-3xl md:text-4xl font-bold text-primary mb-1">{value}</div>
      <p className="font-semibold text-foreground text-sm mb-0.5">{label}</p>
      <p className="text-xs text-muted-foreground">{sublabel}</p>
    </div>
  );
}

const ForTutors = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll(".reveal").forEach((el, i) => {
              setTimeout(() => el.classList.add("revealed"), i * 120);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      icon: CheckCircle2,
      title: "100% Earnings Retention",
      description: "Keep every rupee you earn - no commission deductions",
    },
    {
      icon: Users,
      title: "Consistent Student Flow",
      description: "Get matched with students actively seeking quality tutors",
    },
    {
      icon: Star,
      title: "Verified Platform",
      description: "Build credibility with our trusted verification system",
    },
  ];

  const stats = [
    { value: "0", label: "Commission Fee", sublabel: "Unlike others who charge 15-30%" },
    { value: "1,800+", label: "Active Tutors", sublabel: "Growing community nationwide" },
    { value: "4.9", label: "Tutor Rating", sublabel: "Average platform satisfaction" },
    { value: "24hr", label: "Quick Approval", sublabel: "Start teaching fast" },
  ];

  return (
    <section
      id="tutors"
      ref={sectionRef}
      className="py-20 lg:py-28 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-white to-primary/[0.02]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/[0.03] rounded-full blur-3xl -translate-y-1/4 translate-x-1/4" />

      <div className="container mx-auto px-4 lg:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wider">
            For Tutors
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 tracking-tight">
            Zero Commission. Keep 100% of Your Earnings
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Join 1,800+ tutors who are earning more with TutorSchool. No hidden fees, no commission cuts - your hard work, your money.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="reveal text-center p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-border/50 card-hover group"
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-bold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mb-16 reveal">
          <Button
            size="lg"
            className="rounded-full font-semibold px-8 shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-[1.02] transition-all duration-200 group"
            onClick={() => window.open("https://app.tutorschool.in", "_blank")}
          >
            Apply as Tutor Now
            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-border/50 shadow-sm">
            {stats.map((stat, index) => (
              <AnimatedStat key={index} value={stat.value} label={stat.label} sublabel={stat.sublabel} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForTutors;
