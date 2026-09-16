"use client";

import { useState } from "react";
import Image from "next/image";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { QuestionAnswer } from "@/lib/questionBankScoring";

interface ActionCard {
  id: string;
  emoji: string;
  label: string;
  primarySignal: "high" | "moderate" | "low";
  secondarySignal: "high" | "moderate" | "low";
}

const ACTION_CARDS: ActionCard[] = [
  { id: "rope-ladder", emoji: "\u{1FA22}", label: "Tie rope to ladder to make it longer", primarySignal: "high", secondarySignal: "high" },
  { id: "treats-lure", emoji: "\u{1F431}", label: "Place treats at the roof edge to lure the kitten down", primarySignal: "high", secondarySignal: "moderate" },
  { id: "rope-chimney", emoji: "\u{1FA22}", label: "Throw rope over chimney and climb up", primarySignal: "high", secondarySignal: "high" },
  { id: "ladder-again", emoji: "\u{1FA9C}", label: "Try the ladder again — maybe it'll reach", primarySignal: "low", secondarySignal: "low" },
  { id: "call-neighbor", emoji: "\u{1F3E0}", label: "Call a neighbor for help", primarySignal: "moderate", secondarySignal: "moderate" },
];

function DraggableCard({ card, isUsed }: { card: ActionCard; isUsed: boolean }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: card.id,
    disabled: isUsed,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`p-3 rounded-xl border-2 transition-all select-none ${
        isUsed
          ? "border-gray-200 bg-gray-100 opacity-40 cursor-not-allowed"
          : isDragging
          ? "border-emerald-500 bg-emerald-50 shadow-lg scale-105 cursor-grabbing"
          : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md cursor-grab"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{card.emoji}</span>
        <span className="text-sm font-medium text-gray-700">{card.label}</span>
      </div>
    </div>
  );
}

function DropSlot({ id, label, card, onRemove }: { id: string; label: string; card: ActionCard | null; onRemove: () => void }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={`flex items-center gap-3 p-3 rounded-xl border-2 border-dashed min-h-[56px] transition-all ${
        isOver
          ? "border-emerald-500 bg-emerald-50"
          : card
          ? "border-emerald-400 bg-emerald-50/50"
          : "border-gray-300 bg-gray-50"
      }`}
    >
      <span className="text-sm font-bold text-gray-500 w-14 shrink-0">{label}</span>
      {card ? (
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{card.emoji}</span>
            <span className="text-sm font-medium text-gray-700">{card.label}</span>
          </div>
          <button
            onClick={onRemove}
            className="w-6 h-6 rounded-full bg-gray-200 hover:bg-red-100 flex items-center justify-center text-gray-500 hover:text-red-500 text-xs font-bold transition-colors"
          >
            x
          </button>
        </div>
      ) : (
        <span className="text-sm text-gray-400 italic">Drag an idea here...</span>
      )}
    </div>
  );
}

function DragOverlayCard({ card }: { card: ActionCard }) {
  return (
    <div className="p-3 rounded-xl border-2 border-emerald-500 bg-emerald-50 shadow-xl cursor-grabbing">
      <div className="flex items-center gap-2">
        <span className="text-xl">{card.emoji}</span>
        <span className="text-sm font-medium text-gray-700">{card.label}</span>
      </div>
    </div>
  );
}

interface RescueMissionGameProps {
  onComplete: (answer: QuestionAnswer) => void;
}

export default function RescueMissionGame({ onComplete }: RescueMissionGameProps) {
  const [slot1, setSlot1] = useState<ActionCard | null>(null);
  const [slot2, setSlot2] = useState<ActionCard | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } })
  );

  const usedIds = new Set([slot1?.id, slot2?.id].filter(Boolean));

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const card = ACTION_CARDS.find((c) => c.id === active.id);
    if (!card) return;

    if (over.id === "slot-1" && !slot1) {
      setSlot1(card);
    } else if (over.id === "slot-2" && !slot2) {
      setSlot2(card);
    } else if (over.id === "slot-1" && slot1) {
      setSlot1(card);
    } else if (over.id === "slot-2" && slot2) {
      setSlot2(card);
    }
  };

  const handleNext = () => {
    if (!slot1) return;

    const signalToValue = (s: string) => s === "high" ? 0.8 : s === "moderate" ? 0.5 : 0.2;
    const strategyQuality = signalToValue(slot1.primarySignal);
    const hasSynergy = slot2 && slot1.primarySignal !== "low" && slot2.primarySignal !== "low";
    const planSynergy = hasSynergy ? 0.8 : 0.3;

    let secondarySignal = slot1.secondarySignal;
    if (hasSynergy && secondarySignal === "moderate") secondarySignal = "high";

    const answer: QuestionAnswer = {
      questionId: "Q46",
      selectedKey: slot1.id,
      primaryParam: "STR",
      secondaryParam: "PAC",
      primarySignal: slot1.primarySignal,
      secondarySignal,
      indicators: [
        { param: "STR", metric: "strategyQuality", value: strategyQuality, weight: 1.0 },
        { param: "PAC", metric: "planSynergy", value: planSynergy, weight: 0.5 },
      ],
      rawMetrics: { slot1Signal: strategyQuality, slot2Signal: slot2 ? signalToValue(slot2.primarySignal) : 0 },
    };

    onComplete(answer);
  };

  const activeCard = ACTION_CARDS.find((c) => c.id === activeId) || null;
  const canProceed = slot1 !== null && slot2 !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="mb-4 text-center">
          <h3 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
            <span className="text-2xl">🐱</span> Rescue Mission
          </h3>
          <p className="text-sm text-gray-500 mt-1">Cognitive Learning Activity</p>
        </div>

        <div className="relative w-full aspect-[16/10] rounded-xl overflow-hidden mb-4 border border-gray-200">
          <Image
            src="/images/rescue-mission.png"
            alt="A boy trying to rescue a kitten from a roof. The ladder is too short!"
            fill
            className="object-cover"
            priority
          />
        </div>

        <p className="text-center text-gray-700 font-medium mb-5">
          Oh no! The ladder is too short! What&apos;s your new plan to rescue the kitten?
        </p>

        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="mb-5 space-y-2 p-4 bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-xl border border-emerald-200">
            <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wide mb-2">
              My Plan B
            </h4>
            <DropSlot id="slot-1" label="Step 1:" card={slot1} onRemove={() => setSlot1(null)} />
            <DropSlot id="slot-2" label="Step 2:" card={slot2} onRemove={() => setSlot2(null)} />
          </div>

          <div className="space-y-2 mb-6">
            <h4 className="text-sm font-semibold text-gray-600">
              Your ideas <span className="text-gray-400 font-normal">(drag to Plan B)</span>
            </h4>
            <div className="grid gap-2">
              {ACTION_CARDS.map((card) => (
                <DraggableCard key={card.id} card={card} isUsed={usedIds.has(card.id)} />
              ))}
            </div>
          </div>

          <DragOverlay>
            {activeCard ? <DragOverlayCard card={activeCard} /> : null}
          </DragOverlay>
        </DndContext>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-lg h-12 text-white font-medium transition-colors"
        >
          Complete
        </button>
      </div>
    </div>
  );
}
