import Navbar from "@/components/site/Navbar";
import Hero from "@/components/site/Hero";
import Stats from "@/components/site/Stats";
import TrustedBy from "@/components/site/TrustedBy";
import HowItWorks from "@/components/site/HowItWorks";
import TutorCards from "@/components/site/TutorCards";
import Features from "@/components/site/Features";
import Testimonials from "@/components/site/Testimonials";
import MatchForm from "@/components/site/MatchForm";
import BottomCards from "@/components/site/BottomCards";
import Footer from "@/components/site/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <TrustedBy />
        <HowItWorks />
        <TutorCards />
        <Features />
        <Testimonials />
        <MatchForm />
        <BottomCards />
      </main>
      <Footer />
    </div>
  );
}
