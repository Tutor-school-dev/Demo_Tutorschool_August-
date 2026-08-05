"use client";

import { useState, useMemo } from "react";
import { Star, Lock } from "lucide-react";

const tutors = [
  {
    initials: "RS",
    name: "Rahul Sharma",
    subject: "Mathematics",
    experience: "7 yrs experience",
    mode: "HOME TUITION",
    tags: ["Visual learner fit", "Patient pace"],
    rating: 4.9,
    sessions: 128,
    gradient: "from-emerald-700 via-emerald-600 to-emerald-800",
    fit: 92,
    subjectKey: "mathematics",
    modeKey: "home",
  },
  {
    initials: "NP",
    name: "Neha Patil",
    subject: "Science",
    experience: "5 yrs experience",
    mode: "LIVE ONLINE",
    tags: ["Hands-on style", "High energy"],
    rating: 4.8,
    sessions: 94,
    gradient: "from-blue-700 via-blue-500 to-slate-500",
    fit: 88,
    subjectKey: "science",
    modeKey: "online",
  },
  {
    initials: "AV",
    name: "Aman Verma",
    subject: "English",
    experience: "4 yrs experience",
    mode: "HOME TUITION",
    tags: ["Structured", "Exam-focused"],
    rating: 4.6,
    sessions: 61,
    gradient: "from-amber-700 via-amber-600 to-yellow-800",
    fit: 81,
    subjectKey: "english",
    modeKey: "home",
  },
  {
    initials: "SK",
    name: "Sanya Kapoor",
    subject: "Coding",
    experience: "3 yrs experience",
    mode: "AI TUTOR",
    tags: ["Project-based", "Curious mind fit"],
    rating: 4.9,
    sessions: 77,
    gradient: "from-emerald-700 via-emerald-800 to-green-900",
    fit: 90,
    subjectKey: "coding",
    modeKey: "ai",
  },
  {
    initials: "PM",
    name: "Priya Mehta",
    subject: "Mathematics",
    experience: "9 yrs experience",
    mode: "LIVE ONLINE",
    tags: ["Calm & steady", "Confidence-building"],
    rating: 5.0,
    sessions: 203,
    gradient: "from-purple-700 via-purple-500 to-fuchsia-700",
    fit: 95,
    subjectKey: "mathematics",
    modeKey: "online",
  },
  {
    initials: "KJ",
    name: "Karan Joshi",
    subject: "Science",
    experience: "6 yrs experience",
    mode: "HOME TUITION",
    tags: ["Fast pace", "Competitive exam prep"],
    rating: 4.7,
    sessions: 85,
    gradient: "from-amber-700 via-orange-600 to-amber-800",
    fit: 84,
    subjectKey: "science",
    modeKey: "home",
  },
];

const filters = [
  { label: "All subjects", key: "all" },
  { label: "Mathematics", key: "mathematics" },
  { label: "Science", key: "science" },
  { label: "English", key: "english" },
  { label: "Coding", key: "coding" },
  { label: "Home tuition", key: "home", type: "mode" },
  { label: "Live online", key: "online", type: "mode" },
  { label: "AI tutor", key: "ai", type: "mode" },
];

function StarRow({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <Star
            key={i}
            className={`w-3.5 h-3.5 ${
              filled ? "fill-slate-900 text-slate-900" : "text-slate-300"
            }`}
          />
        );
      })}
    </div>
  );
}

export default function TutorCards() {
  const [active, setActive] = useState("all");

  const filtered = useMemo(() => {
    if (active === "all") return tutors;
    return tutors.filter(
      (t) => t.subjectKey === active || t.modeKey === active
    );
  }, [active]);

  return (
    <section id="fit-cards" className="py-24 bg-[#f7f4ec]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl">
          <h2 className="font-serif text-4xl sm:text-5xl leading-[1.1] text-slate-900 tracking-tight">
            Every card carries a fit score for your child
          </h2>
          <p className="mt-5 text-slate-600 text-lg leading-relaxed">
            Hover any tutor&apos;s report to see the shape of their score. Sign
            in once — with your child&apos;s learning profile — to reveal the
            number and the full breakdown.
          </p>
        </div>

        {/* Filter chips */}
        <div className="mt-10 flex flex-wrap gap-3">
          {filters.map((f) => {
            const isActive = active === f.key;
            return (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={`px-5 h-11 rounded-full text-sm font-medium border transition-all ${
                  isActive
                    ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-400"
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((t) => (
            <article
              key={t.name}
              className="group rounded-3xl overflow-hidden bg-white border border-slate-200/70 shadow-[0_10px_30px_-15px_rgba(15,23,42,0.15)] hover:shadow-[0_20px_50px_-20px_rgba(15,23,42,0.3)] hover:-translate-y-1 transition-all duration-300"
            >
              {/* Colored header */}
              <div
                className={`relative h-44 bg-gradient-to-br ${t.gradient} p-5`}
              >
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm text-slate-800 text-[10px] font-bold tracking-widest px-3 py-1.5 rounded-full">
                  {t.mode}
                </div>
                <div className="absolute -bottom-6 left-5">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                    <span className="font-bold text-slate-900 tracking-wide">
                      {t.initials}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 pt-10">
                <h3 className="font-serif text-2xl text-slate-900">
                  {t.name}
                </h3>
                <p className="mt-1.5 text-slate-600 text-sm">
                  {t.subject} · {t.experience}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs font-medium bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-full border border-emerald-100"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <StarRow rating={t.rating} />
                  <span className="text-sm font-bold text-slate-900">
                    {t.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-slate-500">
                    ({t.sessions} sessions)
                  </span>
                </div>

                {/* Your fit locked reveal */}
                <div className="mt-5 relative rounded-xl bg-[#f2ede0] border border-[#e6dfcc] px-4 py-3 flex items-center justify-between overflow-hidden">
                  <span className="text-[10px] font-bold tracking-[0.15em] text-slate-500">
                    YOUR FIT
                  </span>
                  <div className="relative">
                    <div className="text-lg font-bold text-slate-900 blur-md select-none">
                      {t.fit}%
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>
                  {/* Hover reveal */}
                  <div className="absolute inset-0 bg-slate-900/95 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-between px-4">
                    <span className="text-[10px] font-bold tracking-[0.15em] text-emerald-300">
                      YOUR FIT
                    </span>
                    <span className="text-2xl font-bold">{t.fit}%</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
