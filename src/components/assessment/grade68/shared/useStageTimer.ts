"use client";

import { useRef, useCallback } from "react";

export function useStageTimer() {
  const startRef = useRef(Date.now());

  const reset = useCallback(() => {
    startRef.current = Date.now();
  }, []);

  const elapsed = useCallback(() => Date.now() - startRef.current, []);

  const elapsedSeconds = useCallback(
    () => Math.round((Date.now() - startRef.current) / 1000),
    []
  );

  return { reset, elapsed, elapsedSeconds };
}
