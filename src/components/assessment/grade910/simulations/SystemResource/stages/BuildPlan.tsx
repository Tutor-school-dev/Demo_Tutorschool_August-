"use client";

import { useState, useCallback } from "react";
import { buildAnswer, type QuestionAnswer } from "../../../types";
import InfoPanel from "../../../../grade68/shared/InfoPanel";
import ResourceAllocator, { type Category } from "../../../../grade68/shared/ResourceAllocator";
import { useInspectionTracker } from "../../../../grade68/shared/useInspectionTracker";
import { useStageTimer } from "../../../../grade68/shared/useStageTimer";

interface BuildPlanProps {
  onComplete: (answer: QuestionAnswer, allocation: Record<string, number>) => void;
}

const INFO_PANELS = [
  {
    id: "venue_a",
    title: "Auditorium",
    icon: "🏛️",
    summary: "Capacity 200, Days 1-3",
    detail:
      "Available all 3 days. Requires sound system rental (₹10,000). Ideal for talks and large demos. The auditorium has fixed seating — not suitable for hands-on workshops.",
  },
  {
    id: "venue_b",
    title: "Science Lab",
    icon: "🧪",
    summary: "Capacity 40, Days 1-2 only",
    detail:
      "Available Day 1 and Day 2 only (Day 3: blocked for exams). Lab equipment already available. Ideal for workshops and experiments. Cannot be used for large gatherings.",
  },
  {
    id: "venue_c",
    title: "Sports Ground",
    icon: "🏟️",
    summary: "Capacity 500, Days 2-3",
    detail:
      "Available Day 2 and Day 3 (Day 1: forecast rain). Requires tent rental (₹15,000). Ideal for exhibits and competitions. Open-air — weather dependent.",
  },
  {
    id: "activities",
    title: "Activity Requirements",
    icon: "📌",
    summary: "5 activities to schedule",
    detail:
      "(1) Keynote Talk: Needs large venue, 1 volunteer. (2) Robotics Workshop: Needs lab equipment, 3 volunteers. (3) Science Quiz: Any venue, 2 volunteers. (4) Innovation Exhibit: Needs large space, 2 volunteers. (5) Coding Challenge: Needs computers or lab, 2 volunteers.",
  },
  {
    id: "volunteers",
    title: "Volunteer Constraints",
    icon: "🙋",
    summary: "8 volunteers, max 3 per activity",
    detail:
      "8 student volunteers available. Each can work 1 activity per day. Some activities need 2-3 volunteers. Total volunteer-slots needed: 1+3+2+2+2 = 10. With 8 volunteers across 3 days = 24 person-days available. But no volunteer can be in two places at once on the same day.",
  },
  {
    id: "sponsor",
    title: "Sponsor Requirements",
    icon: "💰",
    summary: "Optional: Funding depends on attendance",
    detail:
      "TechCorp sponsor contributes ₹20,000 IF their logo is prominently displayed at the highest-attendance event. If the largest event draws fewer than 100 attendees, TechCorp may withdraw funding. This would reduce your budget to ₹55,000.",
  },
];

const BUDGET_CATEGORIES: Category[] = [
  { key: "keynote", label: "Keynote Talk", emoji: "🎙️", min: 5 },
  { key: "robotics", label: "Robotics Workshop", emoji: "🤖", min: 5 },
  { key: "quiz", label: "Science Quiz", emoji: "❓", min: 3 },
  { key: "exhibit", label: "Innovation Exhibit", emoji: "💡", min: 5 },
  { key: "coding", label: "Coding Challenge", emoji: "💻", min: 3 },
];

const PRIME_OPTIONS = [
  { key: "keynote", label: "Keynote Talk — largest audience potential" },
  { key: "quiz", label: "Science Quiz — broad appeal, energetic start" },
  { key: "exhibit", label: "Innovation Exhibit — impressive showcase" },
];

export default function BuildPlan({ onComplete }: BuildPlanProps) {
  const [allocation, setAllocation] = useState<Record<string, number>>({
    keynote: 15, robotics: 15, quiz: 15, exhibit: 15, coding: 15,
  });
  const [primeActivity, setPrimeActivity] = useState("");
  const [touched, setTouched] = useState(false);
  const [openedSponsor, setOpenedSponsor] = useState(false);

  const tracker = useInspectionTracker(6);
  const timer = useStageTimer();

  const used = Object.values(allocation).reduce((s, v) => s + v, 0);
  const remaining = 75 - used;
  const canSubmit = touched && remaining === 0 && primeActivity !== "";

  const handleToggle = useCallback(
    (id: string, isOpen: boolean) => {
      tracker.toggle(id, isOpen);
      if (id === "sponsor" && isOpen) setOpenedSponsor(true);
    },
    [tracker]
  );

  const handleAllocationChange = useCallback((vals: Record<string, number>) => {
    setAllocation(vals);
    setTouched(true);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;

    const inspected = tracker.panelsInspected();
    const dwellMs = tracker.totalDwellMs();

    let constraintsSatisfied = 0;
    if (allocation.robotics >= 8) constraintsSatisfied++;
    if (allocation.keynote >= 10) constraintsSatisfied++;
    if (allocation.exhibit >= 5) constraintsSatisfied++;
    const aboveMin = Object.entries(allocation).filter(
      ([k, v]) => v > (BUDGET_CATEGORIES.find((c) => c.key === k)?.min ?? 0)
    ).length;
    if (aboveMin >= 3) constraintsSatisfied++;
    const constraintScore = Math.min(1, constraintsSatisfied / 4);

    let violations = 0;
    if (allocation.robotics < 5) violations++;
    if (allocation.keynote < 5) violations++;
    const budgetCoherence = Math.min(1, Math.max(0, 1 - violations * 0.3));

    const answer = buildAnswer(
      "g910-system-s1-build",
      JSON.stringify({ allocation, primeActivity }),
      "ATT",
      "WM",
      [
        { param: "ATT", metric: "info_sampling", value: Math.min(1, inspected / 6), weight: 1.0 },
        { param: "WM", metric: "multi_constraint_integration", value: constraintScore, weight: 1.0 },
        { param: "STR", metric: "optional_sponsor_checked", value: openedSponsor ? 1.0 : 0.0, weight: 0.6 },
        { param: "WM", metric: "budget_coherence", value: budgetCoherence, weight: 0.5 },
      ],
      {
        panelsInspected: inspected,
        openedSponsor: openedSponsor ? 1 : 0,
        totalDwellMs: dwellMs,
        keynote: allocation.keynote,
        robotics: allocation.robotics,
        quiz: allocation.quiz,
        exhibit: allocation.exhibit,
        coding: allocation.coding,
        primeChoice: PRIME_OPTIONS.findIndex((o) => o.key === primeActivity),
        elapsedMs: timer.elapsed(),
      }
    );

    onComplete(answer, allocation);
  }, [canSubmit, allocation, primeActivity, openedSponsor, tracker, timer, onComplete]);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-gray-800">Stage 1: Build the Master Plan</h2>
        <p className="text-sm text-gray-500">
          Allocate the budget and assign the prime venue. Read all the information carefully.
        </p>
      </div>

      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
        <p className="text-sm text-indigo-800">
          <strong>Innovation Week:</strong> 3-day event. Total budget: <strong>&#8377;75,000</strong> (shown as 75 units of &#8377;1,000). 3 venues, 5 activities, 8 volunteers. Information is spread across multiple sources below.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {INFO_PANELS.map((p) => (
          <InfoPanel
            key={p.id}
            id={p.id}
            title={p.title}
            icon={p.icon}
            summary={p.summary}
            detail={p.detail}
            onToggle={handleToggle}
          />
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">
          Budget Allocation (&#8377;1,000 per unit, total 75)
        </h4>
        <ResourceAllocator
          categories={BUDGET_CATEGORIES}
          total={75}
          initialValues={allocation}
          onChange={handleAllocationChange}
        />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <h4 className="text-sm font-semibold text-gray-600 mb-3">
          Which activity gets the Auditorium on Day 1?
        </h4>
        <div className="space-y-2">
          {PRIME_OPTIONS.map((opt) => (
            <label
              key={opt.key}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                primeActivity === opt.key
                  ? "border-indigo-400 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="prime"
                value={opt.key}
                checked={primeActivity === opt.key}
                onChange={() => setPrimeActivity(opt.key)}
                className="accent-indigo-500"
              />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-200 ${
          canSubmit
            ? "bg-indigo-600 hover:bg-indigo-500 shadow-md hover:shadow-lg cursor-pointer active:scale-[0.98]"
            : "bg-gray-300 cursor-not-allowed"
        }`}
      >
        {remaining > 0
          ? `${remaining} units left to allocate`
          : primeActivity === ""
          ? "Select a prime venue activity"
          : "Finalize Plan"}
      </button>
    </div>
  );
}
