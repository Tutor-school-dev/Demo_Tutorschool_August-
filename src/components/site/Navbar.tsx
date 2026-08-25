"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Courses", href: "#how-it-works" },
  { label: "For Parents", href: "#results" },
  { label: "For Teachers", href: "#for-tutors" },
  { label: "For Tutors", href: "#for-schools" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-md border-b border-slate-200/70 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <Image
            src="/logo.png"
            alt="TutorSchool Logo"
            width={40}
            height={40}
            className="object-contain transition-transform group-hover:-rotate-6"
          />
          <span className="text-xl font-bold tracking-tight text-slate-900">
            TutorSchool
          </span>
        </a>

        <div className="hidden lg:flex items-center gap-9">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[15px] font-medium text-slate-700 hover:text-emerald-600 transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            className="rounded-full text-slate-700 hover:text-emerald-600 px-5 h-11 font-semibold"
          >
            <a href="/select-role">Login</a>
          </Button>
          <Button
            asChild
            className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-6 h-11 font-semibold shadow-[0_6px_20px_-6px_rgba(5,150,105,0.6)]"
          >
            <a href="#match">Book Demo</a>
          </Button>
        </div>

        <button
          onClick={() => setOpen(!open)}
          className="lg:hidden w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-700"
          aria-label="Menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {open && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-6 py-5 space-y-4">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-slate-800 font-medium"
            >
              {l.label}
            </a>
          ))}
          <a
            href="/select-role"
            onClick={() => setOpen(false)}
            className="block text-center rounded-full border-2 border-emerald-600 text-emerald-600 py-3 font-semibold"
          >
            Login
          </a>
          <a
            href="#match"
            onClick={() => setOpen(false)}
            className="block text-center rounded-full bg-emerald-600 text-white py-3 font-semibold"
          >
            Book Demo
          </a>
        </div>
      )}
    </header>
  );
}
