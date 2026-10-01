"use client";

import { useRef, useCallback } from "react";

interface PanelRecord {
  opened: boolean;
  dwellMs: number;
  openedAt: number | null;
}

export function useInspectionTracker(panelCount: number) {
  const panels = useRef<Map<string, PanelRecord>>(new Map());

  const open = useCallback((id: string) => {
    const rec = panels.current.get(id) ?? { opened: false, dwellMs: 0, openedAt: null };
    rec.opened = true;
    rec.openedAt = Date.now();
    panels.current.set(id, rec);
  }, []);

  const close = useCallback((id: string) => {
    const rec = panels.current.get(id);
    if (!rec || rec.openedAt === null) return;
    rec.dwellMs += Date.now() - rec.openedAt;
    rec.openedAt = null;
    panels.current.set(id, rec);
  }, []);

  const toggle = useCallback(
    (id: string, isOpen: boolean) => {
      if (isOpen) open(id);
      else close(id);
    },
    [open, close]
  );

  const inspectionRatio = useCallback(
    () => {
      let count = 0;
      panels.current.forEach((r) => { if (r.opened) count++; });
      return panelCount > 0 ? count / panelCount : 0;
    },
    [panelCount]
  );

  const totalDwellMs = useCallback(() => {
    let total = 0;
    panels.current.forEach((r) => {
      let d = r.dwellMs;
      if (r.openedAt !== null) d += Date.now() - r.openedAt;
      total += d;
    });
    return total;
  }, []);

  const panelsInspected = useCallback(() => {
    let count = 0;
    panels.current.forEach((r) => { if (r.opened) count++; });
    return count;
  }, []);

  return { open, close, toggle, inspectionRatio, totalDwellMs, panelsInspected };
}
