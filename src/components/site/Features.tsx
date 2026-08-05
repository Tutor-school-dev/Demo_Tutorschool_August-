import {
  ShieldCheck,
  Target,
  LineChart,
  Calendar,
  HeartHandshake,
} from "lucide-react";
import { features } from "@/mock/mock";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  ShieldCheck,
  Target,
  LineChart,
  Calendar,
  HeartHandshake,
};

export default function Features() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="max-w-3xl">
          <div className="text-emerald-700 text-sm font-semibold tracking-wider uppercase">
            Why parents choose us
          </div>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl leading-[1.1] text-slate-900 tracking-tight">
            Specifics —{" "}
            <span className="italic text-emerald-600">not promises.</span>
          </h2>
        </div>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => {
            const Icon = iconMap[f.icon] || Target;
            const big = idx === 0;
            return (
              <div
                key={f.title}
                className={`relative p-7 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 ${
                  big ? "lg:col-span-2 lg:row-span-1" : ""
                }`}
              >
                <span className="inline-flex w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 items-center justify-center">
                  <Icon className="w-6 h-6" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-slate-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-slate-600 leading-relaxed">{f.desc}</p>
                {f.tags && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {f.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs font-medium bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
