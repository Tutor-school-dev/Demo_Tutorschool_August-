import { GraduationCap } from "lucide-react";

const columns = [
  {
    title: "For parents",
    links: ["How it works", "Find a tutor", "Pricing", "Refund policy"],
  },
  {
    title: "For tutors",
    links: ["Become a tutor", "Tutor login", "Payouts", "Community"],
  },
  {
    title: "Company",
    links: ["About", "Careers", "Press", "Contact"],
  },
  {
    title: "Support",
    links: ["Help center", "WhatsApp us", "Terms", "Privacy"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-6 gap-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </span>
              <span className="text-xl font-bold text-white">TutorSchool</span>
            </div>
            <p className="mt-4 text-slate-400 leading-relaxed max-w-xs">
              India&apos;s #1 verified tutor matching platform for CBSE, ICSE
              and State board students, Class 1 to 12.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div className="text-white font-semibold">{col.title}</div>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-slate-400 hover:text-emerald-400 transition-colors text-sm"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-500">
          <div>&copy; 2026 TutorSchool. All rights reserved.</div>
          <div>Made in India · with care for parents</div>
        </div>
      </div>
    </footer>
  );
}
