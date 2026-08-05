import { Quote, MapPin } from "lucide-react";
import { testimonials } from "@/mock/mock";

function ScorePill({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone: "green" | "muted";
}) {
  const green = tone === "green";
  return (
    <div
      className={`px-3 py-2 rounded-xl text-center min-w-[68px] ${
        green
          ? "bg-emerald-600 text-white"
          : "bg-white text-slate-500 border border-slate-200"
      }`}
    >
      <div
        className={`text-[10px] font-medium ${green ? "text-emerald-100" : "text-slate-400"}`}
      >
        {label}
      </div>
      <div className="text-lg font-bold leading-none mt-0.5">{value}%</div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section id="results" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl">
          <div className="text-emerald-700 text-sm font-semibold tracking-wider uppercase">
            Real students. Real grades.
          </div>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl leading-[1.1] text-slate-900 tracking-tight">
            Stop reading testimonials.{" "}
            <span className="text-emerald-600">Start seeing results.</span>
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <article
              key={t.name}
              className="rounded-2xl bg-slate-50 border border-slate-200 p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                <span>{t.subject}</span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500 normal-case tracking-normal">
                  {t.duration}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <ScorePill label="Before" value={t.before} tone="muted" />
                <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden relative">
                  <div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"
                    style={{ width: `${t.after}%` }}
                  />
                </div>
                <ScorePill label="After" value={t.after} tone="green" />
              </div>

              <Quote className="w-6 h-6 text-emerald-600/40 mt-6" />
              <p className="mt-2 text-slate-700 leading-relaxed text-[15px] flex-1">
                {t.quote}
              </p>

              <div className="mt-6 pt-5 border-t border-slate-200 flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-white shadow"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 truncate">
                    {t.name}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {t.role}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                    <MapPin className="w-3 h-3" /> {t.city}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {t.board}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
