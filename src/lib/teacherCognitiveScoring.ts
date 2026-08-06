export interface TeacherAssessmentPayload {
  task1_pacing: {
    rt_band: number;
    h_band: number;
    ac: number;
    correctness: boolean;
  };
  task2_scaffolding: {
    corr_band: number;
    idle_band: number;
    t_band: number;
  };
  task3_sequencing: {
    s_band: number;
    m_band: number;
    tp_band: number;
    t_band: number;
  };
  task4_feedback: {
    rt_band: number;
    h_band: number;
    ac: number;
    correctness: boolean;
  };
  task5_explanation: {
    rt_band: number;
    h_band: number;
    ac: number;
    correctness: boolean;
  };
  task6_adaptability: {
    rt_band: number;
    h_band: number;
    ac: number;
    correctness: boolean;
  };
  task7_patience: {
    rt_band: number;
    h_band: number;
    ac: number;
    correctness: boolean;
  };
}

export interface TeacherCognitiveParameter {
  raw_score: number;
  band: string;
  score_range: string;
  label: string;
  interpretation: string;
  final_score: number;
}

export interface TeacherAssessmentResponse {
  pacing: TeacherCognitiveParameter;
  scaffolding: TeacherCognitiveParameter;
  feedback_style: TeacherCognitiveParameter;
  diagnostic_questioning: TeacherCognitiveParameter; // was explanation_style
  motivation_style: TeacherCognitiveParameter;
  cognitive_flexibility: TeacherCognitiveParameter; // was adaptability
  psychological_safety: TeacherCognitiveParameter;
  patience: TeacherCognitiveParameter;
  final_summary: string;
}

function rawToParameter(rawScore: number, key: string): TeacherCognitiveParameter {
  const clamped = Math.max(0, Math.min(10, rawScore));

  let band: string, label: string, finalScore: number, scoreRange: string;
  if (clamped <= 2) {
    band = "B1"; label = "Very Low"; finalScore = 10; scoreRange = "0-20";
  } else if (clamped <= 4) {
    band = "B2"; label = "Emerging"; finalScore = 30; scoreRange = "21-40";
  } else if (clamped <= 6) {
    band = "B3"; label = "Developing"; finalScore = 50; scoreRange = "41-60";
  } else if (clamped <= 8) {
    band = "B4"; label = "Proficient"; finalScore = 70; scoreRange = "61-80";
  } else {
    band = "B5"; label = "Advanced"; finalScore = 90; scoreRange = "81-100";
  }

  const interpretations: Record<string, Record<string, string>> = {
    pacing: {
      B1: "Tends to rush through material. Needs to develop awareness of student comprehension signals.",
      B2: "Sometimes moves too quickly. Beginning to recognize when students need more time.",
      B3: "Moderate pacing awareness. Adjusts speed in some situations but not consistently.",
      B4: "Strong pacing skills. Intuitively adjusts instruction speed based on student needs.",
      B5: "Exceptional pacing mastery. Fluidly adapts rhythm to optimize comprehension for each student.",
    },
    scaffolding: {
      B1: "Provides minimal structure. Students may feel lost without additional guidance frameworks.",
      B2: "Offers basic structure but may not break down complex tasks sufficiently.",
      B3: "Provides adequate scaffolding for most learners. Some students may need more support.",
      B4: "Strong scaffolding skills. Effectively layers support and gradually releases responsibility.",
      B5: "Expert scaffolder. Creates optimal support structures that empower independent learning.",
    },
    feedback_style: {
      B1: "Feedback tends to be vague or purely evaluative. Limited actionable guidance.",
      B2: "Provides some specific feedback but may focus too heavily on correctness alone.",
      B3: "Balanced feedback approach. Gives both task-level and some process-level guidance.",
      B4: "Effective multi-level feedback. Addresses task, process, and metacognitive dimensions.",
      B5: "Masterful feedback provider. Tailors feedback type to student needs and growth stage.",
    },
    diagnostic_questioning: {
      B1: "Asks basic recall questions. Limited probing of student understanding depth.",
      B2: "Uses some diagnostic questions but may not follow up on misconceptions.",
      B3: "Good questioning skills. Probes understanding and identifies some knowledge gaps.",
      B4: "Strong diagnostic questioner. Effectively uncovers misconceptions and adjusts instruction.",
      B5: "Master diagnostician. Questions reveal precise understanding levels and guide next steps perfectly.",
    },
    motivation_style: {
      B1: "Limited motivational techniques. May rely heavily on external rewards or pressure.",
      B2: "Uses some motivational strategies but may not sustain student engagement long-term.",
      B3: "Adequate motivational approach. Combines intrinsic and extrinsic motivation reasonably well.",
      B4: "Strong motivator. Effectively builds intrinsic motivation and maintains student engagement.",
      B5: "Inspiring motivator. Creates deep intrinsic drive and genuine love of learning in students.",
    },
    cognitive_flexibility: {
      B1: "Rigid teaching approach. Tends to stick to planned methods regardless of student response.",
      B2: "Some flexibility but changes are limited. May struggle when plan fails.",
      B3: "Moderately adaptive. Can shift strategies when needed but may take time to adjust.",
      B4: "Highly flexible teacher. Quickly recognizes when to change approach and does so effectively.",
      B5: "Exceptionally flexible. Seamlessly pivots strategies in real-time based on student signals.",
    },
    psychological_safety: {
      B1: "Students may feel anxious about making mistakes. Learning environment feels evaluative.",
      B2: "Some safety elements present but students may still hesitate to take risks.",
      B3: "Reasonably safe environment. Most students feel comfortable attempting new challenges.",
      B4: "Strong psychological safety. Students freely ask questions and learn from mistakes.",
      B5: "Exceptional safe space creator. Students thrive, take intellectual risks, and embrace challenges.",
    },
    patience: {
      B1: "Low tolerance for repeated errors. May show frustration that impacts student confidence.",
      B2: "Generally patient but may lose composure with persistent difficulties.",
      B3: "Good patience for typical challenges. Maintains composure in most teaching situations.",
      B4: "Very patient. Maintains calm, supportive presence even with repeated errors.",
      B5: "Extraordinary patience. Views every error as a learning opportunity, never shows frustration.",
    },
  };

  return {
    raw_score: Math.round(clamped * 10) / 10,
    band,
    score_range: scoreRange,
    label,
    interpretation: interpretations[key]?.[band] || `${label} level for this parameter.`,
    final_score: finalScore,
  };
}

function invertBand(band: number): number {
  return 2 - band;
}

export function computeTeacherCognitiveScores(payload: TeacherAssessmentPayload): TeacherAssessmentResponse {
  const { task1_pacing: t1, task2_scaffolding: t2, task3_sequencing: t3, task4_feedback: t4, task5_explanation: t5, task6_adaptability: t6, task7_patience: t7 } = payload;

  // Pacing: RT speed + deliberation (from tasks 1, 4, 5)
  const avgRT = (t1.rt_band + t4.rt_band + t5.rt_band) / 3;
  const pacingRaw = (invertBand(Math.round(avgRT)) * 3 + (t1.correctness ? 4 : 0) + invertBand(t1.ac)) ;

  // Scaffolding: structure/corrections from classification task
  const scaffoldingRaw = (invertBand(t2.corr_band) * 3 + invertBand(t2.t_band) * 2 + invertBand(t3.m_band) * 2) / 7 * 10;

  // Feedback Style: quality of feedback choices
  const feedbackRaw = (t4.correctness ? 5 : 0) + invertBand(t4.ac) * 2 + invertBand(t4.rt_band);

  // Explanation Style: abstraction handling
  const explanationRaw = (t5.correctness ? 5 : 0) + invertBand(t5.ac) * 2 + invertBand(Math.round((t5.h_band + t1.h_band) / 2));

  // Motivation Style: derived from patience + adaptability + feedback approach
  const motivationRaw = ((t7.correctness ? 3 : 0) + (t4.correctness ? 3 : 0) + invertBand(Math.round((t7.h_band + t4.h_band) / 2)) * 2) / 8 * 10;

  // Adaptability: how well they handle changing scenarios
  const adaptabilityRaw = (t6.correctness ? 5 : 0) + invertBand(t6.ac) * 2 + invertBand(t6.rt_band);

  // Psychological Safety: hover exploration + patience indicators
  const avgHover = (t1.h_band + t4.h_band + t7.h_band) / 3;
  const psySafetyRaw = (t7.correctness ? 4 : 0) + avgHover * 2 + invertBand(Math.round((t1.ac + t7.ac) / 2));

  // Patience: time taken + tolerance indicators from patience task
  const patienceRaw = (t7.correctness ? 5 : 0) + invertBand(t7.rt_band) * 2 + invertBand(t7.ac);

  const pacing = rawToParameter(pacingRaw, "pacing");
  const scaffolding = rawToParameter(scaffoldingRaw, "scaffolding");
  const feedback_style = rawToParameter(feedbackRaw, "feedback_style");
  const diagnostic_questioning = rawToParameter(explanationRaw, "diagnostic_questioning");
  const motivation_style = rawToParameter(motivationRaw, "motivation_style");
  const cognitive_flexibility = rawToParameter(adaptabilityRaw, "cognitive_flexibility");
  const psychological_safety = rawToParameter(psySafetyRaw, "psychological_safety");
  const patience = rawToParameter(patienceRaw, "patience");

  const params = [pacing, scaffolding, feedback_style, diagnostic_questioning, cognitive_flexibility, patience];
  const avgScore = params.reduce((sum, p) => sum + p.final_score, 0) / params.length;

  let summary: string;
  if (avgScore >= 70) {
    summary = "You demonstrate strong teaching competencies across multiple dimensions. Your approach combines effective pacing, solid scaffolding, and patient engagement. Students likely feel supported and motivated in your classes. Consider challenging yourself with more diverse learner profiles to further refine your cognitive flexibility.";
  } else if (avgScore >= 50) {
    summary = "You show developing teaching skills with clear strengths in several areas. Your profile suggests a teacher who is growing and refining their approach. Focused attention on your lower-scoring dimensions will help you become more effective with a wider range of students.";
  } else {
    summary = "You are in the early stages of developing your teaching methodology. This is a great starting point for growth. Consider observing experienced teachers, seeking mentoring, and practicing specific techniques for scaffolding, feedback, and pacing to build your teaching toolkit.";
  }

  return {
    pacing,
    scaffolding,
    feedback_style,
    diagnostic_questioning,
    motivation_style,
    cognitive_flexibility,
    psychological_safety,
    patience,
    final_summary: summary,
  };
}
