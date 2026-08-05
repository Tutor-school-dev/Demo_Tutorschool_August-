import { ArrowUpRight, Users, School } from "lucide-react";

const cards = [
  {
    href: "#for-tutors",
    icon: Users,
    kicker: "Are you a tutor?",
    title: "Earn 100% of your fees. Zero commission.",
    desc: "Join 1,800+ tutors getting consistent students every week.",
  },
  {
    href: "#for-schools",
    icon: School,
    kicker: "Are you a school?",
    title: "Hire qualified educators in days, not months.",
    desc: "Access India's largest pool of pre-vetted teachers.",
  },
];

export default function BottomCards() {
  return (
    <section className="py-20 bg-white" id="for-tutors">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-6">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <a
              key={c.kicker}
              href={c.href}
              id={c.href.replace("#", "")}
              className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 hover:bg-emerald-600 transition-colors duration-500 p-8 lg:p-10"
            >
              <div className="flex items-start justify-between">
                <span className="w-14 h-14 rounded-2xl bg-white text-emerald-700 group-hover:bg-emerald-500 group-hover:text-white flex items-center justify-center shadow-sm transition-colors">
                  <Icon className="w-6 h-6" />
                </span>
                <ArrowUpRight className="w-6 h-6 text-slate-400 group-hover:text-white transition-transform group-hover:rotate-45" />
              </div>
              <div className="mt-8 text-sm font-semibold uppercase tracking-wider text-emerald-700 group-hover:text-emerald-100 transition-colors">
                {c.kicker}
              </div>
              <h3 className="mt-3 font-serif text-3xl leading-tight text-slate-900 group-hover:text-white transition-colors">
                {c.title}
              </h3>
              <p className="mt-3 text-slate-600 group-hover:text-emerald-50 transition-colors max-w-md">
                {c.desc}
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
}
