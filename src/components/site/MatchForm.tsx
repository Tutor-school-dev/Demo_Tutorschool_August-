"use client";

import { useState } from "react";
import {
  CheckCircle2,
  MessageCircle,
  ArrowRight,
  Home,
  Monitor,
  PartyPopper,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { classes, subjects } from "@/mock/mock";

const benefits = [
  "Free first trial class",
  "No advance payment, ever",
  "Switch tutors anytime in month 1",
  "100% money-back if not satisfied",
];

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-sm font-medium text-slate-700">{label}</Label>
      <div className="mt-2">{children}</div>
    </div>
  );
}

function ModeBtn({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-12 rounded-xl border flex items-center justify-center gap-2 text-sm font-medium transition-all ${
        active
          ? "border-emerald-600 bg-emerald-50 text-emerald-800"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default function MatchForm() {
  const { toast } = useToast();
  const [mode, setMode] = useState("home");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    grade: "",
    subject: "",
    city: "",
  });

  const update =
    (k: keyof typeof form) => (v: string) =>
      setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.grade || !form.subject) {
      toast({
        title: "Please fill required fields",
        description: "Name, phone, class and subject are required.",
      });
      return;
    }
    try {
      const list = JSON.parse(localStorage.getItem("ts_leads") || "[]");
      list.push({ ...form, mode, at: new Date().toISOString() });
      localStorage.setItem("ts_leads", JSON.stringify(list));
    } catch {
      // ignore
    }
    setSubmitted(true);
    toast({
      title: "Match request received!",
      description: "We'll WhatsApp 3 matched tutors within 24 hours.",
    });
  };

  return (
    <section
      id="match"
      className="py-24 bg-gradient-to-b from-emerald-50/60 to-white"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-14 items-start">
        <div>
          <div className="text-emerald-700 text-sm font-semibold tracking-wider uppercase">
            Start this week
          </div>
          <h2 className="mt-4 font-serif text-4xl sm:text-5xl leading-[1.1] text-slate-900 tracking-tight">
            Your child&apos;s first improved grade is{" "}
            <span className="text-emerald-600">one form away.</span>
          </h2>
          <p className="mt-5 text-slate-600 text-lg">
            Fill this in 60 seconds. We&apos;ll WhatsApp you 3 matched tutors
            within 24 hours.
          </p>

          <ul className="mt-8 space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 text-slate-800">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </span>
                {b}
              </li>
            ))}
          </ul>

          <a
            href="https://wa.me/919942012342"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 text-emerald-700 font-semibold hover:text-emerald-800"
          >
            <MessageCircle className="w-5 h-5" />
            Or WhatsApp us directly: 99420-12342
          </a>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-[0_30px_70px_-30px_rgba(15,23,42,0.25)] p-8 lg:p-10">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <PartyPopper className="w-8 h-8" />
              </div>
              <h3 className="mt-5 font-serif text-3xl text-slate-900">
                You&apos;re all set!
              </h3>
              <p className="mt-3 text-slate-600 max-w-sm mx-auto">
                We&apos;ve received your request. Our team will WhatsApp you 3
                matched tutors within 24 hours.
              </p>
              <Button
                onClick={() => {
                  setSubmitted(false);
                  setForm({
                    name: "",
                    phone: "",
                    grade: "",
                    subject: "",
                    city: "",
                  });
                }}
                variant="outline"
                className="mt-6 rounded-full"
              >
                Submit another request
              </Button>
            </div>
          ) : (
            <>
              <h3 className="font-serif text-3xl text-slate-900">
                Get free tutor match
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Free · No advance payment · Match in 24 hours
              </p>

              <form className="mt-6 space-y-5" onSubmit={onSubmit}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Parent name">
                    <Input
                      value={form.name}
                      onChange={(e) => update("name")(e.target.value)}
                      placeholder="Your full name"
                      className="h-12 rounded-xl"
                    />
                  </Field>
                  <Field label="Phone (WhatsApp)">
                    <Input
                      value={form.phone}
                      onChange={(e) => update("phone")(e.target.value)}
                      placeholder="10-digit mobile"
                      className="h-12 rounded-xl"
                    />
                  </Field>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Class / Grade">
                    <Select
                      value={form.grade}
                      onValueChange={update("grade")}
                    >
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent>
                        {classes.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Subject needed">
                    <Select
                      value={form.subject}
                      onValueChange={update("subject")}
                    >
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>
                </div>

                <Field label="Tutoring mode">
                  <div className="grid grid-cols-2 gap-3">
                    <ModeBtn
                      active={mode === "home"}
                      onClick={() => setMode("home")}
                      icon={<Home className="w-4 h-4" />}
                      label="Home tutor"
                    />
                    <ModeBtn
                      active={mode === "online"}
                      onClick={() => setMode("online")}
                      icon={<Monitor className="w-4 h-4" />}
                      label="Online tutor"
                    />
                  </div>
                </Field>

                <Field label="City (optional)">
                  <Input
                    value={form.city}
                    onChange={(e) => update("city")(e.target.value)}
                    placeholder="e.g. Bangalore"
                    className="h-12 rounded-xl"
                  />
                </Field>

                <Button
                  type="submit"
                  className="w-full h-13 py-4 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-base group"
                >
                  Get My Free Tutor Match
                  <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Button>
                <p className="text-xs text-center text-slate-500">
                  By submitting, you agree to be contacted via WhatsApp/call.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
