"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";

const Navbar = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <Image src="/tutorschool-logo.png" alt="TutorSchool" width={48} height={48} className="h-12 w-auto" />
            <div>
              <div className="font-bold text-lg text-foreground">Gitopadesh</div>
              <div className="text-xs text-muted-foreground">Global Sloka Competition</div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('about')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              About
            </button>
            <button 
              onClick={() => scrollToSection('guidelines')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Guidelines
            </button>
            <button 
              onClick={() => scrollToSection('prizes')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Prizes
            </button>
            <button 
              onClick={() => scrollToSection('timeline')}
              className="text-foreground hover:text-primary transition-colors font-medium"
            >
              Timeline
            </button>
            <Button 
              onClick={() => scrollToSection('registration-form')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
            >
              Submit
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            onClick={() => scrollToSection('registration-form')}
            className="md:hidden bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6"
          >
            Submit
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;