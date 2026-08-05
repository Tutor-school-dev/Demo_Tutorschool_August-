"use client";

import Navbar from "./Navbar";
import Hero from "./Hero";
import About from "./About";
import Timeline from "./Timeline";
import Quote from "./Quote";
import Prizes from "./Prizes";
import Courses from "./Courses";
import RegistrationForm from "./RegistrationForm";
import FAQ from "./FAQ";
import FloatingSubmitButton from "./FloatingSubmitButton";

export default function GitopadeshLanding() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Timeline />
      <Quote />
      <Prizes />
      {/* <Courses /> */}
      <RegistrationForm />
      <FAQ />
      <FloatingSubmitButton />
    </main>
  );
}
