const steps = [
  {
    num: "1",
    title: "Build your child's profile",
    desc: "A 3-minute set of questions on pace, confidence, and how they focus best.",
  },
  {
    num: "2",
    title: "We score every tutor",
    desc: "Each tutor's teaching style is compared against that profile — not a generic average.",
  },
  {
    num: "3",
    title: "You see the full report",
    desc: "Pace match, teaching style, and confidence fit, broken down per tutor.",
  },
  {
    num: "4",
    title: "Scores improve after sessions",
    desc: "Feedback after each class sharpens future matches for your child.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#f7f4ec]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-amber-100/70 border border-amber-200 text-amber-900 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            How the fit score works
          </div>
          <h2 className="mt-6 font-serif text-4xl sm:text-5xl leading-[1.1] text-slate-900 tracking-tight">
            A short profile, then a score for every tutor
          </h2>
          <p className="mt-5 text-slate-600 text-lg leading-relaxed">
            The fit score isn&apos;t a rating of the tutor — it&apos;s a measure
            of the tutor against your child specifically.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s) => (
            <div
              key={s.num}
              className="group bg-white rounded-2xl p-7 border border-slate-200/70 shadow-[0_10px_30px_-20px_rgba(15,23,42,0.2)] hover:shadow-[0_20px_50px_-25px_rgba(15,23,42,0.3)] hover:-translate-y-1 transition-all duration-300"
            >
              <span className="inline-flex w-9 h-9 rounded-lg bg-amber-100 text-amber-900 items-center justify-center font-bold text-sm">
                {s.num}
              </span>
              <h3 className="mt-6 font-serif text-xl text-slate-900 leading-tight">
                {s.title}
              </h3>
              <p className="mt-3 text-slate-600 text-[15px] leading-relaxed">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
