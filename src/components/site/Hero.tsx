import {
  Sparkles,
  ArrowRight,
  PlayCircle,
  CheckCircle2,
  Star,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { heroImage } from "@/content/marketing";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      <div className="pointer-events-none absolute -top-20 -left-32 w-[520px] h-[520px] rounded-full bg-emerald-100/60 blur-3xl" />
      <div className="pointer-events-none absolute top-40 -right-40 w-[560px] h-[560px] rounded-full bg-emerald-50 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            India&apos;s #1 verified tutor matching platform
          </div>

          <h1 className="mt-6 font-serif text-[46px] sm:text-6xl lg:text-[68px] leading-[1.05] tracking-tight text-slate-900">
            Every child learns
            <br />
            differently.{" "}
            <span className="text-emerald-600">
              Find the
              <br />
              tutor who fits.
            </span>
          </h1>

          <p className="mt-6 text-lg text-slate-600 max-w-xl leading-relaxed">
            Expert home & online tutors for CBSE, ICSE & State boards — Class 1
            to 12. Hand-picked for your child&apos;s learning style. Free trial
            class. No advance payment.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 px-6 font-semibold shadow-[0_10px_30px_-8px_rgba(5,150,105,0.55)] group"
            >
              <a href="#match">
                Get Free Tutor Match
                <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full h-12 px-6 border-slate-300 hover:border-slate-900 hover:bg-slate-50 font-semibold text-slate-900"
            >
              <a href="#how-it-works">
                <PlayCircle className="w-5 h-5 mr-1 text-emerald-600" />
                See How It Works
              </a>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-600">
            {[
              "Verified tutors only",
              "Match in 24 hours",
              "100% money-back trial",
            ].map((t) => (
              <div key={t} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {t}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="relative rounded-[28px] overflow-hidden border-4 border-slate-900 shadow-[0_30px_80px_-30px_rgba(15,23,42,0.45)] rotate-1">
            <img
              src={heroImage}
              alt="Students learning with a tutor"
              className="w-full h-[520px] object-cover"
            />
          </div>

          <div className="absolute -top-4 right-4 lg:right-0 bg-white rounded-2xl shadow-xl border border-slate-100 px-4 py-3">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4 fill-emerald-500 text-emerald-500"
                />
              ))}
            </div>
            <div className="text-xs mt-1 text-slate-700">
              <span className="font-bold">4.9/5</span> · 1,800+ parents
            </div>
          </div>

          <div className="absolute -bottom-5 left-2 lg:-left-6 bg-white rounded-2xl shadow-xl border border-slate-100 px-5 py-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </span>
            <div>
              <div className="text-xl font-extrabold text-slate-900 leading-none">
                +30%
              </div>
              <div className="text-xs text-slate-500 mt-1">
                avg score improvement
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
