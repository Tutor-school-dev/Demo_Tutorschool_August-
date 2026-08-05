import { stats } from "@/mock/mock";

export default function Stats() {
  return (
    <section className="py-14 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="text-center text-emerald-300 text-sm font-medium tracking-wider uppercase">
          Numbers parents trust
        </div>
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">
                {s.value}
              </div>
              <div className="mt-2 text-sm text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
