"use client";

export type SignalColor = "RED" | "YELLOW" | "GREEN" | "STATIC";

interface SignalCardProps {
  id: string;
  color: SignalColor;
  duplicate?: boolean;
  onClick: (id: string, color: SignalColor) => void;
}

const COLOR_MAP: Record<SignalColor, { bg: string; ring: string; text: string; label: string }> = {
  RED:    { bg: "bg-red-500",    ring: "ring-red-300",    text: "text-white", label: "RED" },
  YELLOW: { bg: "bg-yellow-400", ring: "ring-yellow-200", text: "text-gray-900", label: "YLW" },
  GREEN:  { bg: "bg-green-500",  ring: "ring-green-300",  text: "text-white", label: "GRN" },
  STATIC: { bg: "bg-gray-400",   ring: "ring-gray-200",   text: "text-white", label: "---" },
};

export default function SignalCard({ id, color, duplicate, onClick }: SignalCardProps) {
  const style = COLOR_MAP[color];

  return (
    <button
      onClick={() => onClick(id, color)}
      className={`relative w-16 h-20 rounded-xl ${style.bg} ${style.text} ring-2 ${style.ring}
        flex flex-col items-center justify-center gap-1 shadow-lg
        hover:scale-105 active:scale-95 transition-transform duration-100 cursor-pointer select-none`}
    >
      <span className="text-[10px] font-mono opacity-70">{id.slice(-4)}</span>
      <span className="text-xs font-bold">{style.label}</span>
      {duplicate && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full text-[8px] font-bold flex items-center justify-center text-white">
          2x
        </span>
      )}
    </button>
  );
}
