"use client";

import { useState, useCallback } from "react";

interface InfoPanelProps {
  id: string;
  title: string;
  summary: string;
  detail: string;
  icon?: string;
  locked?: boolean;
  onToggle?: (id: string, isOpen: boolean) => void;
}

export default function InfoPanel({ id, title, summary, detail, icon, locked, onToggle }: InfoPanelProps) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => {
    if (locked) return;
    const next = !open;
    setOpen(next);
    onToggle?.(id, next);
  }, [open, id, locked, onToggle]);

  return (
    <div
      className={`rounded-xl border transition-all duration-200 ${
        open ? "border-indigo-300 bg-indigo-50/50 shadow-md" : "border-gray-200 bg-white shadow-sm"
      } ${locked ? "opacity-60" : "cursor-pointer hover:shadow-md"}`}
      onClick={toggle}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {icon && <span className="text-xl">{icon}</span>}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm text-gray-800">{title}</h4>
          <p className="text-xs text-gray-500 truncate">{summary}</p>
        </div>
        {locked ? (
          <span className="text-gray-300 text-sm">🔒</span>
        ) : (
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>
      {open && (
        <div className="px-4 pb-3 pt-0 border-t border-indigo-100">
          <p className="text-sm text-gray-700 leading-relaxed">{detail}</p>
        </div>
      )}
    </div>
  );
}
