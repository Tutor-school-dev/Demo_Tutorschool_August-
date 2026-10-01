"use client";

interface NarrativeScreenProps {
  emoji: string;
  title: string;
  narrative: string;
  buttonLabel?: string;
  onContinue: () => void;
}

export default function NarrativeScreen({ emoji, title, narrative, buttonLabel = "Begin", onContinue }: NarrativeScreenProps) {
  return (
    <div className="min-h-[480px] w-full bg-gradient-to-br from-slate-900 to-indigo-900 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 text-center">
      <span className="text-6xl mb-6 animate-bounce">{emoji}</span>
      <h2 className="text-2xl font-bold text-white mb-4">{title}</h2>
      <p className="text-indigo-200 max-w-lg leading-relaxed text-base mb-8">{narrative}</p>
      <button
        onClick={onContinue}
        className="px-8 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98] cursor-pointer"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
