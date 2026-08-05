export const calculateRTBand = (reactionTimeMs: number): number => {
  const reactionTimeSec = reactionTimeMs / 1000;
  if (reactionTimeSec <= 5) return 0;
  if (reactionTimeSec <= 12) return 1;
  return 2;
};

export const calculateHBand = (hoverTimeMs: number): number => {
  const hoverTimeSec = hoverTimeMs / 1000;
  if (hoverTimeSec < 1) return 0;
  if (hoverTimeSec <= 4) return 1;
  return 2;
};

export const calculateACBand = (answerChanges: number): number => {
  if (answerChanges === 0) return 0;
  if (answerChanges === 1) return 1;
  return 2;
};

export const calculateSBand = (swaps: number): number => {
  if (swaps <= 2) return 0;
  if (swaps <= 5) return 1;
  return 2;
};

export const calculateMBand = (misplacements: number): number => {
  if (misplacements <= 1) return 0;
  if (misplacements <= 3) return 1;
  return 2;
};

export const calculateTPBand = (timeToFirstCorrectMs: number): number => {
  const timeToFirstCorrectSec = timeToFirstCorrectMs / 1000;
  if (timeToFirstCorrectSec < 3) return 0;
  if (timeToFirstCorrectSec <= 7) return 1;
  return 2;
};

export const calculateTBand = (totalTimeMs: number): number => {
  const totalTimeSec = totalTimeMs / 1000;
  if (totalTimeSec < 5) return 0;
  if (totalTimeSec <= 12) return 1;
  return 2;
};

export const calculateCorrBand = (corrections: number): number => {
  if (corrections <= 2) return 0;
  if (corrections <= 5) return 1;
  return 2;
};

export const calculateIdleBand = (idlePeriods: number): number => {
  if (idlePeriods === 0) return 0;
  if (idlePeriods <= 2) return 1;
  return 2;
};

export interface BaseTrackingState {
  startTime: number | null;
  firstActionTime: number | null;
  lastActionTime: number | null;
  actionTimestamps: number[];
  answerChanges: number;
  currentAnswer: string | null;
  hoverTimes: { [optionId: string]: number };
  hoverStartTimes: { [optionId: string]: number };
  totalHoverTime: number;
  idlePeriods: number;
}

export interface ConservationTrackingState extends BaseTrackingState {
  correctness: boolean | null;
}

export interface ClassificationTrackingState extends BaseTrackingState {
  corrections: number;
  lastGroupAssignment: { [shapeId: string]: string };
}

export interface SeriationTrackingState extends BaseTrackingState {
  swaps: number;
  misplacements: number;
  firstCorrectTime: number | null;
  currentOrder: string[];
  correctOrder: string[];
}

export const detectIdlePeriods = (actionTimestamps: number[]): number => {
  if (actionTimestamps.length <= 1) return 0;
  let idlePeriods = 0;
  for (let i = 1; i < actionTimestamps.length; i++) {
    const gap = actionTimestamps[i] - actionTimestamps[i - 1];
    if (gap > 2000) {
      idlePeriods++;
    }
  }
  return idlePeriods;
};

export const calculateTotalHoverTime = (hoverTimes: { [optionId: string]: number }): number => {
  return Object.values(hoverTimes).reduce((total, time) => total + time, 0);
};

export const trackAnswerChange = (
  currentAnswer: string | null,
  newAnswer: string,
  answerChanges: number
): { answerChanges: number; currentAnswer: string } => {
  if (currentAnswer !== null && currentAnswer !== newAnswer) {
    return { answerChanges: answerChanges + 1, currentAnswer: newAnswer };
  }
  return { answerChanges, currentAnswer: newAnswer };
};

export const trackAction = (actionTimestamps: number[]): number[] => {
  return [...actionTimestamps, Date.now()];
};

export const startHover = (
  optionId: string,
  hoverStartTimes: { [optionId: string]: number }
): { [optionId: string]: number } => {
  return { ...hoverStartTimes, [optionId]: Date.now() };
};

export const endHover = (
  optionId: string,
  hoverStartTimes: { [optionId: string]: number },
  hoverTimes: { [optionId: string]: number }
): { hoverTimes: { [optionId: string]: number }; hoverStartTimes: { [optionId: string]: number } } => {
  const startTime = hoverStartTimes[optionId];
  if (!startTime) return { hoverTimes, hoverStartTimes };

  const duration = Date.now() - startTime;
  const newHoverTimes = {
    ...hoverTimes,
    [optionId]: (hoverTimes[optionId] || 0) + duration
  };

  const { [optionId]: _, ...remainingStartTimes } = hoverStartTimes;
  return { hoverTimes: newHoverTimes, hoverStartTimes: remainingStartTimes };
};

export const isSequenceCorrect = (currentOrder: string[], correctOrder: string[]): boolean => {
  if (currentOrder.length !== correctOrder.length) return false;
  return currentOrder.every((item, index) => item === correctOrder[index]);
};

export const countMisplacements = (currentOrder: string[], correctOrder: string[]): number => {
  let misplacements = 0;
  for (let i = 0; i < Math.min(currentOrder.length, correctOrder.length); i++) {
    if (currentOrder[i] !== correctOrder[i]) {
      misplacements++;
    }
  }
  return misplacements;
};
