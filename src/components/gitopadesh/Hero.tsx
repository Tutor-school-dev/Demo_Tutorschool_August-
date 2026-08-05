"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Star } from "lucide-react";

const Hero = () => {
  const scrollToNext = () => {
    const aboutSection = document.getElementById("about");
    aboutSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(/hero-meditation.jpg)` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-pink-50/50 to-white/60" />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute top-20 left-10 text-4xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>🌸</div>
      <div className="absolute top-32 right-20 text-4xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}>🪷</div>
      <div className="absolute bottom-40 left-20 text-3xl animate-bounce" style={{ animationDelay: '1s', animationDuration: '4s' }}>✨</div>
      <div className="absolute bottom-32 right-32 text-3xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '3.2s' }}>⭐</div>
      
      <div className="container mx-auto px-4 py-32 relative z-10 mt-20">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full border-2 border-primary/30 shadow-lg animate-scale-in">
            <Star className="w-5 h-5 text-primary fill-primary" />
            <span className="text-primary font-bold text-sm tracking-wide">GLOBAL SLOKA COMPETITION 2025</span>
            <Star className="w-5 h-5 text-primary fill-primary" />
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight animate-fade-in-up">
            Gitopadesh Global<br />Sloka Competition
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl text-foreground/80 font-light animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Inspired by the timeless wisdom of the Bhagavad Gita
          </p>

          {/* CTA Button */}
          <div className="pt-6 animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <Button 
              onClick={scrollToNext}
              size="lg"
              variant="outline"
              className="bg-white/90 hover:bg-white border-2 text-foreground hover:text-primary text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Discover More
              <ChevronDown className="ml-2 group-hover:translate-y-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <button 
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer"
      >
        <ChevronDown className="w-8 h-8 text-primary" />
      </button>
    </section>
  );
};

export default Hero;