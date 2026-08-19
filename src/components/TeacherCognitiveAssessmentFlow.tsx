"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Brain, ArrowRight, CheckCircle, GraduationCap } from "lucide-react";
import { useTeacherCognitiveAssessment, TeacherAssessmentPayload, TeacherAssessmentResponse } from "@/hooks/useTeacherCognitiveAssessment";
import { authAPI } from "@/lib/api";
import {
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

type AssessmentState = {
  pacing: BaseTrackingState;
  scaffolding: ClassificationTrackingState;
  sequencing: SeriationTrackingState;
  feedback: BaseTrackingState;
  explanation: BaseTrackingState;
  adaptability: BaseTrackingState;
  patience: BaseTrackingState;
};

const TOTAL_SCREENS = 9;

export const TeacherCognitiveAssessmentFlow: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState(1);

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
    pacing: createInitialTrackingState(),
    scaffolding: { ...createInitialTrackingState(), corrections: 0, lastGroupAssignment: {} },
    sequencing: {
      ...createInitialTrackingState(),
      swaps: 0,
      misplacements: 0,
      firstCorrectTime: null,
      currentOrder: [],
      correctOrder: ["intro", "guided", "practice", "independent", "assessment"],
    },
    feedback: createInitialTrackingState(),
    explanation: createInitialTrackingState(),
    adaptability: createInitialTrackingState(),
    patience: createInitialTrackingState(),
  });

  const [results, setResults] = useState<TeacherAssessmentResponse | null>(null);
  const { submitAssessment, loading, error, alreadyCompleted } = useTeacherCognitiveAssessment();
  const router = useRouter();

  const getProgressPercentage = () => ((currentScreen - 1) / (TOTAL_SCREENS - 1)) * 100;

  const nextScreen = () => {
    if (currentScreen < TOTAL_SCREENS) setCurrentScreen(currentScreen + 1);
  };

  const handleFinishAssessment = async () => {
    const { pacing, scaffolding, sequencing, feedback, explanation, adaptability, patience } = assessmentState;

    const pacingRT = pacing.firstActionTime && pacing.startTime ? pacing.firstActionTime - pacing.startTime : 0;
    const scaffoldingTime = scaffolding.startTime ? Date.now() - scaffolding.startTime : 0;
    const sequencingTime = sequencing.startTime ? Date.now() - sequencing.startTime : 0;
    const feedbackRT = feedback.firstActionTime && feedback.startTime ? feedback.firstActionTime - feedback.startTime : 0;
    const explanationRT = explanation.firstActionTime && explanation.startTime ? explanation.firstActionTime - explanation.startTime : 0;
    const adaptabilityRT = adaptability.firstActionTime && adaptability.startTime ? adaptability.firstActionTime - adaptability.startTime : 0;
    const patienceRT = patience.firstActionTime && patience.startTime ? patience.firstActionTime - patience.startTime : 0;

    const payload: TeacherAssessmentPayload = {
      task1_pacing: {
        rt_band: calculateRTBand(pacingRT),
        h_band: calculateHBand(pacing.totalHoverTime),
        ac: calculateACBand(pacing.answerChanges),
        correctness: pacing.currentAnswer === "C",
      },
      task2_scaffolding: {
        corr_band: calculateCorrBand(scaffolding.corrections),
        idle_band: calculateIdleBand(detectIdlePeriods(scaffolding.actionTimestamps)),
        t_band: calculateTBand(scaffoldingTime),
      },
      task3_sequencing: {
        s_band: calculateSBand(sequencing.swaps),
        m_band: calculateMBand(sequencing.misplacements),
        tp_band: sequencing.firstCorrectTime && sequencing.startTime ? calculateTPBand(sequencing.firstCorrectTime - sequencing.startTime) : 2,
        t_band: calculateTBand(sequencingTime),
      },
      task4_feedback: {
        rt_band: calculateRTBand(feedbackRT),
        h_band: calculateHBand(feedback.totalHoverTime),
        ac: calculateACBand(feedback.answerChanges),
        correctness: feedback.currentAnswer === "B",
      },
      task5_explanation: {
        rt_band: calculateRTBand(explanationRT),
        h_band: calculateHBand(explanation.totalHoverTime),
        ac: calculateACBand(explanation.answerChanges),
        correctness: explanation.currentAnswer === "C",
      },
      task6_adaptability: {
        rt_band: calculateRTBand(adaptabilityRT),
        h_band: calculateHBand(adaptability.totalHoverTime),
        ac: calculateACBand(adaptability.answerChanges),
        correctness: adaptability.currentAnswer === "B",
      },
      task7_patience: {
        rt_band: calculateRTBand(patienceRT),
        h_band: calculateHBand(patience.totalHoverTime),
        ac: calculateACBand(patience.answerChanges),
        correctness: patience.currentAnswer === "C",
      },
    };

    const response = await submitAssessment(payload);
    if (response) {
      setResults(response);
      nextScreen();
    }
  };

  useEffect(() => {
    if (currentScreen >= 2 && currentScreen <= 8) {
      const startTime = Date.now();
      const screenKey = ["pacing", "scaffolding", "sequencing", "feedback", "explanation", "adaptability", "patience"][currentScreen - 2] as keyof AssessmentState;
      setAssessmentState((prev) => ({
        ...prev,
        [screenKey]: { ...prev[screenKey], startTime, actionTimestamps: [] },
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
            <p className="text-gray-600 mb-4">You&apos;ve already completed your Teaching Profile assessment.</p>
            <Button onClick={() => router.push("/dashboard/teacher")} className="w-full">Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <GraduationCap className="w-8 h-8 text-emerald-600 mr-2" />
            <CardTitle className="text-2xl font-serif">Teaching Style Profile</CardTitle>
          </div>
          {currentScreen > 1 && currentScreen < 9 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Task {currentScreen - 1} of 7</span>
                <span>{Math.round(getProgressPercentage())}% complete</span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>
          )}
        </CardHeader>
        <CardContent className="p-6">
          {currentScreen === 1 && <WelcomeScreen onStart={nextScreen} />}
          {currentScreen === 2 && <PacingScreen state={assessmentState.pacing} setState={(s) => setAssessmentState((prev) => ({ ...prev, pacing: s }))} onNext={nextScreen} />}
          {currentScreen === 3 && <ScaffoldingScreen state={assessmentState.scaffolding} setState={(s) => setAssessmentState((prev) => ({ ...prev, scaffolding: s }))} onNext={nextScreen} />}
          {currentScreen === 4 && <SequencingScreen state={assessmentState.sequencing} setState={(s) => setAssessmentState((prev) => ({ ...prev, sequencing: s }))} onNext={nextScreen} />}
          {currentScreen === 5 && <FeedbackScreen state={assessmentState.feedback} setState={(s) => setAssessmentState((prev) => ({ ...prev, feedback: s }))} onNext={nextScreen} />}
          {currentScreen === 6 && <ExplanationScreen state={assessmentState.explanation} setState={(s) => setAssessmentState((prev) => ({ ...prev, explanation: s }))} onNext={nextScreen} />}
          {currentScreen === 7 && <AdaptabilityScreen state={assessmentState.adaptability} setState={(s) => setAssessmentState((prev) => ({ ...prev, adaptability: s }))} onNext={nextScreen} />}
          {currentScreen === 8 && <PatienceScreen state={assessmentState.patience} setState={(s) => setAssessmentState((prev) => ({ ...prev, patience: s }))} onFinish={handleFinishAssessment} loading={loading} error={error} />}
          {currentScreen === 9 && results && (
            <ResultsScreen
              results={results}
              onComplete={async () => {
                // Reload user profile to get updated onboarding_completed flag
                try {
                  await authAPI.me();
                } catch {
                  // Continue anyway
                }
                router.push("/dashboard/teacher");
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const WelcomeScreen: React.FC<{ onStart: () => void }> = ({ onStart }) => (
  <div className="text-center space-y-6">
    <div className="w-48 h-48 mx-auto bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
      <GraduationCap className="w-24 h-24 text-emerald-600" />
    </div>
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 font-serif">Discover Your Teaching Style</h2>
      <p className="text-lg text-gray-600">This takes about 2 minutes</p>
      <p className="text-sm text-gray-500 max-w-md mx-auto">
        7 quick scenarios will map your teaching profile across 8 dimensions — helping match you with compatible students.
      </p>
    </div>
    <Button onClick={onStart} size="lg" className="px-8 bg-emerald-600 hover:bg-emerald-700 rounded-full">
      Start Assessment <ArrowRight className="w-4 h-4 ml-2" />
    </Button>
  </div>
);

function MCQScreen({ title, subtitle, scenario, options, correctId, state, setState, onNext, onFinish, loading, error }: {
  title: string; subtitle: string; scenario: string; options: { id: string; label: string }[];
  correctId?: string; state: BaseTrackingState; setState: (s: BaseTrackingState) => void;
  onNext?: () => void; onFinish?: () => void; loading?: boolean; error?: string | null;
}) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const handleOptionSelect = (option: string) => {
    const now = Date.now();
    const { answerChanges, currentAnswer } = trackAnswerChange(state.currentAnswer, option, state.answerChanges);
    setState({ ...state, firstActionTime: state.firstActionTime || now, answerChanges, currentAnswer, actionTimestamps: trackAction(state.actionTimestamps), lastActionTime: now });
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
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600">{subtitle}</p>
      </div>
      <div className="bg-emerald-50 p-6 rounded-lg">
        <p className="text-gray-700 text-center leading-relaxed">{scenario}</p>
      </div>
      <RadioGroup value={selectedAnswer || ""} onValueChange={handleOptionSelect} className="space-y-3">
        {options.map((option) => (
          <div key={option.id} className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer" onMouseEnter={() => handleOptionHover(option.id, true)} onMouseLeave={() => handleOptionHover(option.id, false)}>
            <RadioGroupItem value={option.id} id={`${title}-${option.id}`} className="mt-1" />
            <Label htmlFor={`${title}-${option.id}`} className="flex-1 cursor-pointer text-left leading-relaxed">{option.label}</Label>
          </div>
        ))}
      </RadioGroup>
      {error && <div className="text-red-500 text-center p-3 bg-red-50 rounded-lg">{error}</div>}
      <div className="flex justify-end">
        <Button onClick={onFinish || onNext} disabled={!selectedAnswer || loading} size={onFinish ? "lg" : "default"}>
          {loading ? "Processing..." : onFinish ? "Finish Assessment" : "Next"}
          {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
        </Button>
      </div>
    </div>
  );
}

const PacingScreen: React.FC<{ state: BaseTrackingState; setState: (s: BaseTrackingState) => void; onNext: () => void }> = ({ state, setState, onNext }) => (
  <MCQScreen
    title="Pacing Task"
    subtitle="Consider this teaching scenario:"
    scenario="You've just finished explaining a new concept. You notice a student looking confused, fidgeting, and not making eye contact. What do you do?"
    options={[
      { id: "A", label: "Continue to the next topic — they'll catch up with homework practice" },
      { id: "B", label: "Repeat the same explanation, but louder and slower" },
      { id: "C", label: "Pause, ask what part is unclear, and try a different approach (analogy, diagram, etc.)" },
      { id: "D", label: "Move on but assign extra tutoring sessions for this student" },
    ]}
    state={state} setState={setState} onNext={onNext}
  />
);

const ScaffoldingScreen: React.FC<{ state: ClassificationTrackingState; setState: (s: ClassificationTrackingState) => void; onNext: () => void }> = ({ state, setState, onNext }) => {
  const scenarios = [
    { id: "s1", text: "Give step-by-step instructions with checkpoints", correct: "High" },
    { id: "s2", text: "Let student figure out the approach independently", correct: "Low" },
    { id: "s3", text: "Provide a worked example before practice", correct: "High" },
    { id: "s4", text: "Ask open-ended questions without hints", correct: "Low" },
    { id: "s5", text: "Break complex task into smaller guided sub-tasks", correct: "High" },
    { id: "s6", text: "Assign project with minimal constraints", correct: "Low" },
  ];
  const groups = ["High Structure", "Low Structure"];
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleItemClick = (itemId: string) => {
    const now = Date.now();
    setState({ ...state, firstActionTime: state.firstActionTime || now, actionTimestamps: trackAction(state.actionTimestamps), lastActionTime: now });
    setSelectedItem(itemId);
  };

  const handleGroupClick = (group: string) => {
    if (!selectedItem) return;
    const now = Date.now();
    const prev = state.lastGroupAssignment[selectedItem];
    const corrections = prev && prev !== group ? state.corrections + 1 : state.corrections;
    setAssignments({ ...assignments, [selectedItem]: group });
    setState({ ...state, corrections, lastGroupAssignment: { ...state.lastGroupAssignment, [selectedItem]: group }, actionTimestamps: trackAction(state.actionTimestamps), lastActionTime: now });
    setSelectedItem(null);
  };

  const assignedCount = Object.keys(assignments).length;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Scaffolding Task</h3>
        <p className="text-gray-600">Sort these teaching approaches into High Structure or Low Structure. Click an item, then click a category.</p>
      </div>
      <div className="space-y-2">
        {scenarios.map((s) => (
          <button key={s.id} onClick={() => handleItemClick(s.id)} className={`w-full text-left p-3 rounded-lg border-2 transition-all text-sm ${selectedItem === s.id ? "border-emerald-500 bg-emerald-50" : assignments[s.id] ? "border-green-200 bg-green-50" : "border-gray-200 hover:border-gray-400"}`}>
            <span>{s.text}</span>
            {assignments[s.id] && <span className="ml-2 text-xs text-green-600 font-medium">({assignments[s.id]})</span>}
          </button>
        ))}
      </div>
      {selectedItem && (
        <div className="flex gap-3 justify-center">
          {groups.map((g) => (
            <Button key={g} variant="outline" onClick={() => handleGroupClick(g)} className="px-6">{g}</Button>
          ))}
        </div>
      )}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">{assignedCount}/6 classified</span>
        <Button onClick={onNext} disabled={assignedCount < 6}>Next <ArrowRight className="w-4 h-4 ml-2" /></Button>
      </div>
    </div>
  );
};

const SequencingScreen: React.FC<{ state: SeriationTrackingState; setState: (s: SeriationTrackingState) => void; onNext: () => void }> = ({ state, setState, onNext }) => {
  const steps = [
    { id: "independent", label: "Independent Practice", height: 140 },
    { id: "intro", label: "Introduction", height: 40 },
    { id: "assessment", label: "Assessment", height: 160 },
    { id: "guided", label: "Guided Practice", height: 80 },
    { id: "practice", label: "Scaffolded Tasks", height: 120 },
  ];

  const [order, setOrder] = useState(steps.map((s) => s.id));
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const handleClick = (idx: number) => {
    const now = Date.now();
    if (selectedIdx === null) {
      setSelectedIdx(idx);
      setState({ ...state, firstActionTime: state.firstActionTime || now, actionTimestamps: trackAction(state.actionTimestamps), lastActionTime: now });
    } else {
      const newOrder = [...order];
      [newOrder[selectedIdx], newOrder[idx]] = [newOrder[idx], newOrder[selectedIdx]];
      const swaps = state.swaps + 1;
      const misplacements = countMisplacements(newOrder, state.correctOrder);
      const isCorrect = isSequenceCorrect(newOrder, state.correctOrder);
      const firstCorrectTime = isCorrect && !state.firstCorrectTime ? now : state.firstCorrectTime;
      setOrder(newOrder);
      setSelectedIdx(null);
      setState({ ...state, swaps, misplacements, firstCorrectTime, currentOrder: newOrder, actionTimestamps: trackAction(state.actionTimestamps), lastActionTime: now });
    }
  };

  const isCorrect = isSequenceCorrect(order, state.correctOrder);
  const labels: Record<string, string> = { intro: "1. Intro", guided: "2. Guided", practice: "3. Scaffold", independent: "4. Independent", assessment: "5. Assess" };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h3 className="text-xl font-semibold">Lesson Sequencing Task</h3>
        <p className="text-gray-600">Arrange these lesson steps from most structured (left) to least structured (right). Click two items to swap.</p>
      </div>
      <div className="flex justify-center items-end gap-3 p-6 bg-gray-50 rounded-lg min-h-[200px]">
        {order.map((stepId, idx) => {
          const step = steps.find((s) => s.id === stepId)!;
          return (
            <button key={stepId} onClick={() => handleClick(idx)} className={`w-20 rounded-t-md transition-all flex items-end justify-center pb-2 ${selectedIdx === idx ? "bg-emerald-500 ring-2 ring-emerald-300" : isCorrect ? "bg-green-500" : "bg-emerald-400 hover:bg-emerald-500"}`} style={{ height: `${step.height}px` }}>
              <span className="text-white text-xs font-medium text-center leading-tight">{labels[stepId] || stepId}</span>
            </button>
          );
        })}
      </div>
      {isCorrect && <p className="text-center text-green-600 font-medium">Correct sequence!</p>}
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">Swaps: {state.swaps}</span>
        <Button onClick={onNext} disabled={!isCorrect}>Next <ArrowRight className="w-4 h-4 ml-2" /></Button>
      </div>
    </div>
  );
};

const FeedbackScreen: React.FC<{ state: BaseTrackingState; setState: (s: BaseTrackingState) => void; onNext: () => void }> = ({ state, setState, onNext }) => (
  <MCQScreen
    title="Feedback Style Task"
    subtitle="A student submits work with an error:"
    scenario="A student solved 24 ÷ 6 = 3 (incorrect, answer is 4). They showed their working: '6 × 3 = 18... wait, 6 × 4 = 24'. How do you respond?"
    options={[
      { id: "A", label: "\"That's wrong. The answer is 4.\"" },
      { id: "B", label: "\"I can see you were on the right track — you even wrote 6×4=24. What does that tell you about the answer?\"" },
      { id: "C", label: "\"Good effort! You'll get it next time.\"" },
      { id: "D", label: "\"Try again and check your multiplication tables.\"" },
    ]}
    state={state} setState={setState} onNext={onNext}
  />
);

const ExplanationScreen: React.FC<{ state: BaseTrackingState; setState: (s: BaseTrackingState) => void; onNext: () => void }> = ({ state, setState, onNext }) => (
  <MCQScreen
    title="Explanation Style Task"
    subtitle="A student asks a conceptual question:"
    scenario="A 10-year-old asks: 'Why does 3 × 4 equal 4 × 3? That doesn't make sense — 3 groups of 4 isn't the same as 4 groups of 3!' What's your approach?"
    options={[
      { id: "A", label: "Explain the commutative property: 'It's a mathematical rule that multiplication is commutative'" },
      { id: "B", label: "Say 'Just memorize it — it's always true for any numbers'" },
      { id: "C", label: "Draw it: 'Let's make a 3×4 grid of dots, then turn it sideways — see, it's now 4×3 with the same dots!'" },
      { id: "D", label: "Give more examples until they accept it: 2×5=10, 5×2=10, etc." },
    ]}
    state={state} setState={setState} onNext={onNext}
  />
);

const AdaptabilityScreen: React.FC<{ state: BaseTrackingState; setState: (s: BaseTrackingState) => void; onNext: () => void }> = ({ state, setState, onNext }) => (
  <MCQScreen
    title="Adaptability Task"
    subtitle="Your planned approach isn't working:"
    scenario="You're 15 minutes into a lesson on fractions. You planned to use pie charts, but 3 out of 5 students look lost. One says 'I don't get what the slices mean.' What do you do?"
    options={[
      { id: "A", label: "Push through — they'll understand once you show more pie chart examples" },
      { id: "B", label: "Switch to a different representation: 'Okay, let's try with chocolate bars instead — much easier to break into pieces!'" },
      { id: "C", label: "Stop and ask the confused students to explain what part they don't understand" },
      { id: "D", label: "Assign the pie chart worksheet for homework and move to the next topic" },
    ]}
    state={state} setState={setState} onNext={onNext}
  />
);

const PatienceScreen: React.FC<{ state: BaseTrackingState; setState: (s: BaseTrackingState) => void; onFinish: () => void; loading: boolean; error: string | null }> = ({ state, setState, onFinish, loading, error }) => (
  <MCQScreen
    title="Patience Task"
    subtitle="A recurring challenge:"
    scenario="A student has made the same type of mistake for the 5th time today, despite 4 different explanations. They look frustrated and say 'I'm just stupid.' What is your response?"
    options={[
      { id: "A", label: "\"Let's move on to something else — we can come back to this later when you're ready.\"" },
      { id: "B", label: "\"You're not stupid. Let's try a completely different angle — can you teach ME what you think is happening?\"" },
      { id: "C", label: "\"You're not stupid at all. Making mistakes 5 times means you tried 5 times — that takes courage. Let's find YOUR way to understand this.\"" },
      { id: "D", label: "\"Practice makes perfect. Do 10 more problems and it'll click.\"" },
    ]}
    state={state} setState={setState} onFinish={onFinish} loading={loading} error={error}
  />
);

const ResultsScreen: React.FC<{ results: TeacherAssessmentResponse; onComplete: () => void }> = ({ results, onComplete }) => {
  const params = [
    { key: "pacing", name: "Pacing (Mastery-Based Instructional Progression)", parameter: results.pacing },
    { key: "scaffolding", name: "Scaffolding (Contingent Support Calibration)", parameter: results.scaffolding },
    { key: "feedback_style", name: "Feedback Style (Corrective/Elaborative/Encouraging)", parameter: results.feedback_style },
    { key: "diagnostic_questioning", name: "Diagnostic Questioning", parameter: results.diagnostic_questioning },
    { key: "motivation_style", name: "Motivation Style (Autonomy-Supportive vs Controlled)", parameter: results.motivation_style },
    { key: "cognitive_flexibility", name: "Cognitive Flexibility", parameter: results.cognitive_flexibility },
    { key: "psychological_safety", name: "Psychological Safety", parameter: results.psychological_safety },
    { key: "patience", name: "Patience & Error Tolerance", parameter: results.patience },
  ];

  const getBarWidth = (finalScore: number) => {
    const scoreMap: Record<number, number> = { 10: 20, 30: 40, 50: 60, 70: 80, 90: 100 };
    return scoreMap[finalScore] || 60;
  };

  const getScoreColor = (finalScore: number) => {
    if (finalScore >= 70) return "bg-emerald-600";
    if (finalScore >= 50) return "bg-emerald-500";
    if (finalScore >= 30) return "bg-emerald-400";
    return "bg-emerald-300";
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center">
            <GraduationCap className="w-12 h-12 text-emerald-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 font-serif">Your Teaching Profile</h2>
        <p className="text-gray-600">Here&apos;s your teaching style across 8 dimensions</p>
      </div>

      <div className="space-y-3">
        {params.map((item) => (
          <div key={item.key} className="bg-gray-50/80 p-4 rounded-md border border-gray-100 shadow-sm hover:shadow-md transition-all hover:bg-white/90">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-gray-800 text-base">{item.name}</span>
              <div className={`px-2 py-1 rounded-md text-xs font-medium text-white ${getScoreColor(item.parameter.final_score)}`}>{item.parameter.label}</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
              <div className={`h-2 rounded-full transition-all duration-700 ${getScoreColor(item.parameter.final_score)}`} style={{ width: `${getBarWidth(item.parameter.final_score)}%` }} />
            </div>
            <div className="bg-white/70 p-3 rounded-md border-l-4 border-l-emerald-300">
              <p className="text-sm text-gray-700 leading-relaxed">{item.parameter.interpretation}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-emerald-50/70 p-5 rounded-md border border-emerald-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Summary</h3>
        <p className="text-sm text-gray-700 leading-relaxed">{results.final_summary}</p>
      </div>

      <div className="flex justify-center">
        <Button onClick={onComplete} size="lg" className="px-8 bg-emerald-600 hover:bg-emerald-700 rounded-full">
          Continue to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};
