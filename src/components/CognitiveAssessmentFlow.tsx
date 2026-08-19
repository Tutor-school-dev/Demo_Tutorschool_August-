"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { useCognitiveAssessment, AssessmentPayload, AssessmentResponse } from "@/hooks/useCognitiveAssessment";
import { authAPI } from "@/lib/api";
import {
  ConservationTrackingState,
  ClassificationTrackingState,
  SeriationTrackingState,
  BaseTrackingState,
  calculateRTBand,
  calculateHBand,
  calculateACBand,
  calculateSBand,
  calculateMBand,
  calculateTPBand,
  calculateTBand,
  calculateCorrBand,
  calculateIdleBand,
  detectIdlePeriods,
  calculateTotalHoverTime,
  trackAnswerChange,
  trackAction,
  startHover,
  endHover,
  isSequenceCorrect,
  countMisplacements,
} from "@/lib/cognitiveUtils";
import AIMatchResults from "./AIMatchResults";

type AssessmentState = {
  conservation: ConservationTrackingState;
  classification: ClassificationTrackingState;
  seriation: SeriationTrackingState;
  reversibility: BaseTrackingState;
  hypothetical: BaseTrackingState;
};

const TOTAL_SCREENS = 7;

export const CognitiveAssessmentFlow: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState(1);
  const [showMatchResults, setShowMatchResults] = useState(false);

  const createInitialTrackingState = (): BaseTrackingState => ({
    startTime: null,
    firstActionTime: null,
    lastActionTime: null,
    actionTimestamps: [],
    answerChanges: 0,
    currentAnswer: null,
    hoverTimes: {},
    hoverStartTimes: {},
    totalHoverTime: 0,
    idlePeriods: 0,
  });

  const [assessmentState, setAssessmentState] = useState<AssessmentState>({
    conservation: { ...createInitialTrackingState(), correctness: null },
    classification: { ...createInitialTrackingState(), corrections: 0, lastGroupAssignment: {} },
    seriation: {
      ...createInitialTrackingState(),
      swaps: 0,
      misplacements: 0,
      firstCorrectTime: null,
      currentOrder: [],
      correctOrder: ["shortest", "short", "medium", "long", "longest"],
    },
    reversibility: createInitialTrackingState(),
    hypothetical: createInitialTrackingState(),
  });

  const [results, setResults] = useState<AssessmentResponse | null>(null);
  const { submitAssessment, loading, error, alreadyCompleted } = useCognitiveAssessment();
  const router = useRouter();

  const getProgressPercentage = () => {
    return ((currentScreen - 1) / (TOTAL_SCREENS - 1)) * 100;
  };

  const nextScreen = () => {
    if (currentScreen < TOTAL_SCREENS) {
      setCurrentScreen(currentScreen + 1);
    }
  };

  const handleFinishAssessment = async () => {
    const { conservation, classification, seriation, reversibility, hypothetical } = assessmentState;

    const conservationRT =
      conservation.firstActionTime && conservation.startTime
        ? conservation.firstActionTime - conservation.startTime
        : 0;
    const classificationTime = classification.startTime ? Date.now() - classification.startTime : 0;
    const seriationTime = seriation.startTime ? Date.now() - seriation.startTime : 0;
    const reversibilityRT =
      reversibility.firstActionTime && reversibility.startTime
        ? reversibility.firstActionTime - reversibility.startTime
        : 0;
    const hypotheticalRT =
      hypothetical.firstActionTime && hypothetical.startTime
        ? hypothetical.firstActionTime - hypothetical.startTime
        : 0;

    const payload: AssessmentPayload = {
      question1_conservation: {
        rt_band: calculateRTBand(conservationRT),
        h_band: calculateHBand(conservation.totalHoverTime),
        ac: calculateACBand(conservation.answerChanges),
        correctness: conservation.correctness || false,
      },
      question2_classification: {
        corr_band: calculateCorrBand(classification.corrections),
        idle_band: calculateIdleBand(detectIdlePeriods(classification.actionTimestamps)),
        t_band: calculateTBand(classificationTime),
      },
      question3_seriation: {
        s_band: calculateSBand(seriation.swaps),
        m_band: calculateMBand(seriation.misplacements),
        tp_band:
          seriation.firstCorrectTime && seriation.startTime
            ? calculateTPBand(seriation.firstCorrectTime - seriation.startTime)
            : 2,
        t_band: calculateTBand(seriationTime),
      },
      question4_reversibility: {
        rt_band: calculateRTBand(reversibilityRT),
        h_band: calculateHBand(reversibility.totalHoverTime),
        ac: calculateACBand(reversibility.answerChanges),
        correctness: reversibility.currentAnswer === "yes",
      },
      question5_hypothetical: {
        rt_band: calculateRTBand(hypotheticalRT),
        h_band: calculateHBand(hypothetical.totalHoverTime),
        ac: calculateACBand(hypothetical.answerChanges),
        correctness: hypothetical.currentAnswer === "D",
      },
    };

    const response = await submitAssessment(payload);
    if (response) {
      setResults(response);
      nextScreen();
    }
  };

  useEffect(() => {
    if (currentScreen >= 2 && currentScreen <= 6) {
      const startTime = Date.now();
      const screenKey = ["conservation", "classification", "seriation", "reversibility", "hypothetical"][
        currentScreen - 2
      ] as keyof AssessmentState;

      setAssessmentState((prev) => ({
        ...prev,
        [screenKey]: {
          ...prev[screenKey],
          startTime,
          actionTimestamps: [],
        },
      }));
    }
  }, [currentScreen]);

  if (alreadyCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Assessment Complete</h2>
            <p className="text-gray-600 mb-4">You&apos;ve already completed your Learning Fingerprint.</p>
            <Button onClick={() => router.push("/dashboard/student")} className="w-full">
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showMatchResults) {
    return <AIMatchResults onClose={() => setShowMatchResults(false)} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-blue-600 mr-2" />
            <CardTitle className="text-2xl">Cognitive Learning Fingerprint</CardTitle>
          </div>
          {currentScreen > 1 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Question {Math.min(currentScreen - 1, 5)} of 5</span>
                <span>{Math.round(getProgressPercentage())}% complete</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-6">
          {currentScreen === 1 && <WelcomeScreen onStart={nextScreen} />}
          {currentScreen === 2 && (
            <ConservationScreen
              state={assessmentState.conservation}
              setState={(s) => setAssessmentState((prev) => ({ ...prev, conservation: s }))}
              onNext={nextScreen}
            />
          )}
          {currentScreen === 3 && (
            <ClassificationScreen
              state={assessmentState.classification}
              setState={(s) => setAssessmentState((prev) => ({ ...prev, classification: s }))}
              onNext={nextScreen}
            />
          )}
          {currentScreen === 4 && (
            <SeriationScreen
              state={assessmentState.seriation}
              setState={(s) => setAssessmentState((prev) => ({ ...prev, seriation: s }))}
              onNext={nextScreen}
            />
          )}
          {currentScreen === 5 && (
            <ReversibilityScreen
              state={assessmentState.reversibility}
              setState={(s) => setAssessmentState((prev) => ({ ...prev, reversibility: s }))}
              onNext={nextScreen}
            />
          )}
          {currentScreen === 6 && (
            <HypotheticalScreen
              state={assessmentState.hypothetical}
              setState={(s) => setAssessmentState((prev) => ({ ...prev, hypothetical: s }))}
              onFinish={handleFinishAssessment}
              loading={loading}
              error={error}
            />
          )}
          {currentScreen === 7 && results && (
            <ResultsScreen
              results={results}
              onComplete={async () => {
                // Reload user profile to get updated onboarding_completed flag
                try {
                  await authAPI.me();
                  router.push("/dashboard/student");
                } catch {
                  router.push("/dashboard/student");
                }
              }}
              onFindTutor={async () => {
                // Save assessment completion flag
                if (typeof window !== "undefined") {
                  localStorage.setItem("assessmentCompleted", "true");
                  localStorage.setItem(
                    "cognitiveAssessmentResults",
                    JSON.stringify({
                      parameters: results,
                      timestamp: Date.now(),
                    })
                  );
                }
                // Reload user profile to get updated onboarding_completed flag
                try {
                  await authAPI.me();
                } catch {
                  // Continue anyway
                }
                router.push("/dashboard/student/matching-results");
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const WelcomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => {
  return (
    <div className="text-center space-y-6">
      <div className="w-48 h-48 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
        <Brain className="w-24 h-24 text-blue-600" />
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Discover Your Learning Fingerprint
        </h2>
        <p className="text-lg text-gray-600">This takes about 90 seconds</p>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          We&apos;ll ask you a few quick questions to create your personalized learning profile
          and find the best tutor match for you.
        </p>
      </div>
      <Button onClick={onStart} size="lg" className="px-8">
        Start Assessment
        <ArrowRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
};

const ConservationScreen: React.FC<{
  state: ConservationTrackingState;
  setState: (state: ConservationTrackingState) => void;
  onNext: () => void;
}> = ({ state, setState, onNext }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    const now = Date.now();
    const { answerChanges, currentAnswer } = trackAnswerChange(state.currentAnswer, option, state.answerChanges);
    setState({
      ...state,
      firstActionTime: state.firstActionTime || now,
      answerChanges,
      currentAnswer,
      correctness: option === "C",
      actionTimestamps: trackAction(state.actionTimestamps),
      lastActionTime: now,
    });
    setSelectedOption(option);
  };

  const handleOptionHover = (optionId: string, isEntering: boolean) => {
    if (isEntering) {
      setState({ ...state, hoverStartTimes: startHover(optionId, state.hoverStartTimes) });
    } else {
      const { hoverTimes, hoverStartTimes } = endHover(optionId, state.hoverStartTimes, state.hoverTimes);
      setState({ ...state, hoverTimes, hoverStartTimes, totalHoverTime: calculateTotalHoverTime(hoverTimes) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Conservation Task</h3>
        <p className="text-gray-600">Look at these two containers with water:</p>
      </div>

      <div className="flex justify-center items-end gap-8 my-8 p-6 bg-blue-50 rounded-lg">
        <div className="text-center">
          <div className="w-20 h-32 border-2 border-blue-400 rounded-b-lg relative overflow-hidden mx-auto">
            <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-blue-300/60" />
          </div>
          <p className="mt-2 font-medium text-sm">Container A</p>
          <p className="text-xs text-gray-500">Wide & Short</p>
        </div>
        <div className="text-center">
          <div className="w-12 h-44 border-2 border-blue-400 rounded-b-lg relative overflow-hidden mx-auto">
            <div className="absolute bottom-0 left-0 right-0 h-[85%] bg-blue-300/60" />
          </div>
          <p className="mt-2 font-medium text-sm">Container B</p>
          <p className="text-xs text-gray-500">Narrow & Tall</p>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-gray-700 font-medium">
          The same amount of water was poured from A into B. Which has more water now?
        </p>
      </div>

      <RadioGroup value={selectedOption || ""} onValueChange={handleOptionSelect} className="space-y-3">
        {[
          { id: "A", label: "Container A has more water" },
          { id: "B", label: "Container B has more water" },
          { id: "C", label: "They have the same amount of water" },
        ].map((option) => (
          <div
            key={option.id}
            className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onMouseEnter={() => handleOptionHover(option.id, true)}
            onMouseLeave={() => handleOptionHover(option.id, false)}
          >
            <RadioGroupItem value={option.id} id={`cons-${option.id}`} />
            <Label htmlFor={`cons-${option.id}`} className="flex-1 cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!selectedOption}>
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const ClassificationScreen: React.FC<{
  state: ClassificationTrackingState;
  setState: (state: ClassificationTrackingState) => void;
  onNext: () => void;
}> = ({ state, setState, onNext }) => {
  const shapes = [
    { id: "red-circle", shape: "circle", color: "red", label: "Red Circle" },
    { id: "blue-circle", shape: "circle", color: "blue", label: "Blue Circle" },
    { id: "red-square", shape: "square", color: "red", label: "Red Square" },
    { id: "blue-square", shape: "square", color: "blue", label: "Blue Square" },
    { id: "red-triangle", shape: "triangle", color: "red", label: "Red Triangle" },
    { id: "blue-triangle", shape: "triangle", color: "blue", label: "Blue Triangle" },
  ];

  const groups = ["By Shape", "By Color"];
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [selectedShape, setSelectedShape] = useState<string | null>(null);

  const handleShapeClick = (shapeId: string) => {
    const now = Date.now();
    setState({
      ...state,
      firstActionTime: state.firstActionTime || now,
      actionTimestamps: trackAction(state.actionTimestamps),
      lastActionTime: now,
    });
    setSelectedShape(shapeId);
  };

  const handleGroupClick = (group: string) => {
    if (!selectedShape) return;
    const now = Date.now();

    const prev = state.lastGroupAssignment[selectedShape];
    const corrections = prev && prev !== group ? state.corrections + 1 : state.corrections;

    const newAssignments = { ...assignments, [selectedShape]: group };
    setAssignments(newAssignments);

    setState({
      ...state,
      corrections,
      lastGroupAssignment: { ...state.lastGroupAssignment, [selectedShape]: group },
      actionTimestamps: trackAction(state.actionTimestamps),
      lastActionTime: now,
    });
    setSelectedShape(null);
  };

  const assignedCount = Object.keys(assignments).length;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Classification Task</h3>
        <p className="text-gray-600">Sort these shapes into groups. Click a shape, then click a group to assign it.</p>
      </div>

      <div className="grid grid-cols-3 gap-3 p-4 bg-gray-50 rounded-lg">
        {shapes.map((s) => (
          <button
            key={s.id}
            onClick={() => handleShapeClick(s.id)}
            className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${
              selectedShape === s.id
                ? "border-blue-500 bg-blue-50 scale-105"
                : assignments[s.id]
                ? "border-green-300 bg-green-50"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <div
              className={`w-8 h-8 ${
                s.shape === "circle" ? "rounded-full" : s.shape === "triangle" ? "triangle-shape" : "rounded-sm"
              }`}
              style={{
                backgroundColor: s.color,
                clipPath: s.shape === "triangle" ? "polygon(50% 0%, 0% 100%, 100% 100%)" : undefined,
              }}
            />
            <span className="text-xs text-gray-600">{s.label}</span>
            {assignments[s.id] && <span className="text-xs text-green-600 font-medium">{assignments[s.id]}</span>}
          </button>
        ))}
      </div>

      {selectedShape && (
        <div className="flex gap-3 justify-center">
          {groups.map((g) => (
            <Button key={g} variant="outline" onClick={() => handleGroupClick(g)} className="px-6">
              {g}
            </Button>
          ))}
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{assignedCount}/6 shapes classified</span>
        <Button onClick={onNext} disabled={assignedCount < 6}>
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const SeriationScreen: React.FC<{
  state: SeriationTrackingState;
  setState: (state: SeriationTrackingState) => void;
  onNext: () => void;
}> = ({ state, setState, onNext }) => {
  const rods = [
    { id: "longest", height: 160, label: "E" },
    { id: "short", height: 80, label: "B" },
    { id: "medium", height: 120, label: "C" },
    { id: "shortest", height: 40, label: "A" },
    { id: "long", height: 140, label: "D" },
  ];

  const [order, setOrder] = useState(rods.map((r) => r.id));
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handleRodClick = (idx: number) => {
    const now = Date.now();

    if (selectedIdx === null) {
      setSelectedIdx(idx);
      setState({
        ...state,
        firstActionTime: state.firstActionTime || now,
        actionTimestamps: trackAction(state.actionTimestamps),
        lastActionTime: now,
      });
    } else {
      const newOrder = [...order];
      [newOrder[selectedIdx], newOrder[idx]] = [newOrder[idx], newOrder[selectedIdx]];
      const swaps = state.swaps + 1;
      const misplacements = countMisplacements(newOrder, state.correctOrder);
      const isCorrect = isSequenceCorrect(newOrder, state.correctOrder);
      const firstCorrectTime = isCorrect && !state.firstCorrectTime ? now : state.firstCorrectTime;

      setOrder(newOrder);
      setSelectedIdx(null);
      setState({
        ...state,
        swaps,
        misplacements,
        firstCorrectTime,
        currentOrder: newOrder,
        actionTimestamps: trackAction(state.actionTimestamps),
        lastActionTime: now,
      });
    }
  };

  const isCorrect = isSequenceCorrect(order, state.correctOrder);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Seriation Task</h3>
        <p className="text-gray-600">Arrange these rods from shortest to longest. Click two rods to swap them.</p>
      </div>

      <div className="flex justify-center items-end gap-4 p-6 bg-gray-50 rounded-lg min-h-[200px]">
        {order.map((rodId, idx) => {
          const rod = rods.find((r) => r.id === rodId)!;
          return (
            <button
              key={rodId}
              onClick={() => handleRodClick(idx)}
              className={`w-10 rounded-t-md transition-all ${
                selectedIdx === idx
                  ? "bg-blue-500 ring-2 ring-blue-300"
                  : isCorrect
                  ? "bg-green-500"
                  : "bg-indigo-400 hover:bg-indigo-500"
              }`}
              style={{ height: `${rod.height}px` }}
            >
              <span className="text-white text-xs font-bold">{rod.label}</span>
            </button>
          );
        })}
      </div>

      {isCorrect && (
        <p className="text-center text-green-600 font-medium">Correct order!</p>
      )}

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Swaps: {state.swaps}</span>
        <Button onClick={onNext} disabled={!isCorrect}>
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const ReversibilityScreen: React.FC<{
  state: BaseTrackingState;
  setState: (state: BaseTrackingState) => void;
  onNext: () => void;
}> = ({ state, setState, onNext }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    const now = Date.now();
    const { answerChanges, currentAnswer } = trackAnswerChange(state.currentAnswer, option, state.answerChanges);
    setState({
      ...state,
      firstActionTime: state.firstActionTime || now,
      answerChanges,
      currentAnswer,
      actionTimestamps: trackAction(state.actionTimestamps),
      lastActionTime: now,
    });
    setSelectedAnswer(option);
  };

  const handleOptionHover = (optionId: string, isEntering: boolean) => {
    if (isEntering) {
      setState({ ...state, hoverStartTimes: startHover(optionId, state.hoverStartTimes) });
    } else {
      const { hoverTimes, hoverStartTimes } = endHover(optionId, state.hoverStartTimes, state.hoverTimes);
      setState({ ...state, hoverTimes, hoverStartTimes, totalHoverTime: calculateTotalHoverTime(hoverTimes) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Reversibility Task</h3>
        <p className="text-gray-600">Think about this scenario:</p>
      </div>

      <div className="bg-amber-50 p-6 rounded-lg">
        <div className="text-lg font-medium mb-4 text-center">Scenario:</div>
        <p className="text-gray-700 text-center leading-relaxed mb-2">
          You have a round ball of clay. You roll it into a long snake shape.
        </p>
        <p className="text-xl font-semibold text-center text-gray-800">
          Is the amount of clay still the same?
        </p>
      </div>

      <RadioGroup value={selectedAnswer || ""} onValueChange={handleOptionSelect} className="space-y-4">
        {[
          { id: "yes", label: "Yes — the amount of clay stays the same, just the shape changed" },
          { id: "no_more", label: "No — the snake has more clay because it's longer" },
          { id: "no_less", label: "No — the snake has less clay because it's thinner" },
          { id: "unsure", label: "I'm not sure" },
        ].map((option) => (
          <div
            key={option.id}
            className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onMouseEnter={() => handleOptionHover(option.id, true)}
            onMouseLeave={() => handleOptionHover(option.id, false)}
          >
            <RadioGroupItem value={option.id} id={`rev-${option.id}`} className="mt-1" />
            <Label htmlFor={`rev-${option.id}`} className="flex-1 cursor-pointer text-left leading-relaxed">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!selectedAnswer}>
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const HypotheticalScreen: React.FC<{
  state: BaseTrackingState;
  setState: (state: BaseTrackingState) => void;
  onFinish: () => void;
  loading: boolean;
  error: string | null;
}> = ({ state, setState, onFinish, loading, error }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    const now = Date.now();
    const { answerChanges, currentAnswer } = trackAnswerChange(state.currentAnswer, option, state.answerChanges);
    setState({
      ...state,
      firstActionTime: state.firstActionTime || now,
      answerChanges,
      currentAnswer,
      actionTimestamps: trackAction(state.actionTimestamps),
      lastActionTime: now,
    });
    setSelectedAnswer(option);
  };

  const handleOptionHover = (optionId: string, isEntering: boolean) => {
    if (isEntering) {
      setState({ ...state, hoverStartTimes: startHover(optionId, state.hoverStartTimes) });
    } else {
      const { hoverTimes, hoverStartTimes } = endHover(optionId, state.hoverStartTimes, state.hoverTimes);
      setState({ ...state, hoverTimes, hoverStartTimes, totalHoverTime: calculateTotalHoverTime(hoverTimes) });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Hypothetical Thinking Task</h3>
        <p className="text-gray-600">Think about this imaginary situation:</p>
      </div>

      <div className="bg-blue-50 p-6 rounded-lg">
        <div className="text-lg font-medium mb-4 text-center">Scenario:</div>
        <p className="text-gray-700 text-center leading-relaxed mb-4">
          A plant grows taller when it gets sunlight.
        </p>
        <p className="text-xl font-semibold text-center text-gray-800">
          If we gave it twice the sunlight, what might happen?
        </p>
      </div>

      <RadioGroup value={selectedAnswer || ""} onValueChange={handleOptionSelect} className="space-y-4">
        {[
          { id: "A", label: "A) Grow twice as tall" },
          { id: "B", label: "B) Grow slightly faster" },
          { id: "C", label: "C) Stay the same" },
          { id: "D", label: "D) Might grow OR might not — depends on other factors" },
        ].map((option) => (
          <div
            key={option.id}
            className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
            onMouseEnter={() => handleOptionHover(option.id, true)}
            onMouseLeave={() => handleOptionHover(option.id, false)}
          >
            <RadioGroupItem value={option.id} id={`hyp-${option.id}`} className="mt-1" />
            <Label htmlFor={`hyp-${option.id}`} className="flex-1 cursor-pointer text-left leading-relaxed">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>

      {error && (
        <div className="text-red-500 text-center p-3 bg-red-50 rounded-lg">{error}</div>
      )}

      <div className="flex justify-end">
        <Button onClick={onFinish} disabled={!selectedAnswer || loading} size="lg">
          {loading ? "Processing Assessment..." : "Finish Assessment"}
          {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
};

const ResultsScreen: React.FC<{
  results: AssessmentResponse;
  onComplete: () => void;
  onFindTutor: () => void;
}> = ({ results, onComplete, onFindTutor }) => {
  const cognitiveParameters = [
    { key: "confidence", name: "Confidence", parameter: results.confidence },
    { key: "working_memory", name: "Working Memory", parameter: results.working_memory },
    { key: "precision", name: "Precision", parameter: results.precision },
    { key: "error_correction_ability", name: "Error Correction", parameter: results.error_correction_ability },
    { key: "impulsivity", name: "Impulsivity", parameter: results.impulsivity },
    { key: "working_memory_load_handling", name: "Load Handling", parameter: results.working_memory_load_handling },
    { key: "processing_speed", name: "Processing Speed", parameter: results.processing_speed },
    { key: "exploratory_nature", name: "Exploration", parameter: results.exploratory_nature },
  ];

  const getBarWidth = (finalScore: number) => {
    const scoreMap: Record<number, number> = { 10: 20, 30: 40, 50: 60, 70: 80, 90: 100 };
    return scoreMap[finalScore] || 60;
  };

  const getScoreColor = (finalScore: number) => {
    if (finalScore >= 70) return "bg-blue-600";
    if (finalScore >= 50) return "bg-blue-500";
    if (finalScore >= 30) return "bg-blue-400";
    return "bg-blue-300";
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Brain className="w-12 h-12 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Your Learning Fingerprint</h2>
        <p className="text-gray-600">Here&apos;s how your brain learns best</p>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-800">Your Learning Profile</h3>
        {cognitiveParameters.map((item) => (
          <div
            key={item.key}
            className="bg-gray-50/80 p-4 rounded-md border border-gray-100 shadow-sm hover:shadow-md transition-all hover:bg-white/90"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-gray-800 text-base">{item.name}</span>
              <div className={`px-2 py-1 rounded-md text-xs font-medium text-white ${getScoreColor(item.parameter.final_score)}`}>
                {item.parameter.label}
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div
                className={`h-2 rounded-full transition-all duration-700 ${getScoreColor(item.parameter.final_score)}`}
                style={{ width: `${getBarWidth(item.parameter.final_score)}%` }}
              />
            </div>
            <div className="bg-white/70 p-3 rounded-md border-l-4 border-l-gray-300">
              <p className="text-sm text-gray-700 leading-relaxed">{item.parameter.interpretation}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-50/70 p-5 rounded-md border border-slate-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Summary</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{results.final_summary}</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center gap-3">
        <Button onClick={onFindTutor} size="lg" variant="outline" className="px-8 border-blue-200 text-blue-700 hover:bg-blue-50">
          <Sparkles className="w-4 h-4 mr-2" />
          Find Your AI Tutor Match
        </Button>
        <Button onClick={onComplete} size="lg" className="px-8">
          Continue to Dashboard
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
