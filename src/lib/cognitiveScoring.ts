export interface AssessmentPayload {
  question1_conservation: {
    rt_band: number;
    h_band: number;
    ac: number;
    correctness: boolean;
  };
  question2_classification: {
    corr_band: number;
    idle_band: number;
    t_band: number;
  };
  question3_seriation: {
    s_band: number;
    m_band: number;
    tp_band: number;
    t_band: number;
  };
  question4_reversibility: {
    rt_band: number;
    h_band: number;
    ac: number;
    correctness: boolean;
  };
  question5_hypothetical: {
    rt_band: number;
    h_band: number;
    ac: number;
    correctness: boolean;
  };
}

export interface CognitiveParameter {
  raw_score: number;
  band: string;
  score_range: string;
  label: string;
  interpretation: string;
  final_score: number;
}

export interface AssessmentResponse {
  confidence: CognitiveParameter;
  working_memory: CognitiveParameter;
  anxiety: CognitiveParameter;
  precision: CognitiveParameter;
  error_correction_ability: CognitiveParameter;
  impulsivity: CognitiveParameter;
  working_memory_load_handling: CognitiveParameter;
  processing_speed: CognitiveParameter;
  exploratory_nature: CognitiveParameter;
  final_summary: string;
}

function rawToParameter(rawScore: number, key: string): CognitiveParameter {
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
    confidence: {
      B1: "Shows hesitation and uncertainty in responses. Benefits from encouragement and scaffolded challenges.",
      B2: "Beginning to trust their reasoning. Needs consistent positive reinforcement.",
      B3: "Moderately confident. Developing ability to commit to answers without excessive second-guessing.",
      B4: "Strong confidence in reasoning. Makes decisions with appropriate deliberation.",
      B5: "Highly confident and decisive. Trusts their cognitive processes effectively.",
    },
    working_memory: {
      B1: "Struggles to hold and manipulate multiple pieces of information simultaneously.",
      B2: "Can manage simple sequences but finds complex multi-step tasks challenging.",
      B3: "Adequate working memory for age-appropriate tasks. Some difficulty with high-load scenarios.",
      B4: "Strong working memory. Handles multi-step tasks and complex sequences well.",
      B5: "Exceptional working memory capacity. Easily manages complex, multi-element tasks.",
    },
    anxiety: {
      B1: "Very low test anxiety. Approaches tasks with calm composure.",
      B2: "Minimal anxiety indicators. Generally comfortable with assessment situations.",
      B3: "Moderate anxiety signals. Some hesitation but generally manages well.",
      B4: "Elevated anxiety indicators. May benefit from calming strategies during assessments.",
      B5: "High anxiety signals. Needs supportive environment and stress-reduction techniques.",
    },
    precision: {
      B1: "Frequently makes errors. Needs structured guidance to develop accuracy.",
      B2: "Inconsistent accuracy. Beginning to develop careful approach to tasks.",
      B3: "Moderate precision. Gets most tasks right with some occasional errors.",
      B4: "High precision. Careful and accurate in most responses.",
      B5: "Exceptional precision. Consistently accurate with minimal errors.",
    },
    error_correction_ability: {
      B1: "Rarely self-corrects. Does not notice or address own mistakes.",
      B2: "Occasionally self-corrects but misses many errors.",
      B3: "Developing self-monitoring. Catches some errors and makes corrections.",
      B4: "Good self-correction. Actively monitors and fixes mistakes.",
      B5: "Excellent error detection and correction. Strong metacognitive monitoring.",
    },
    impulsivity: {
      B1: "Highly impulsive. Responds very quickly without adequate reflection.",
      B2: "Somewhat impulsive. Could benefit from slowing down to think more carefully.",
      B3: "Balanced approach. Generally takes appropriate time before responding.",
      B4: "Thoughtful and measured. Takes time to consider before committing to answers.",
      B5: "Very deliberate. Extensively considers options before responding.",
    },
    working_memory_load_handling: {
      B1: "Overwhelmed by complex tasks. Needs tasks broken into smaller steps.",
      B2: "Manages simple loads but struggles as complexity increases.",
      B3: "Handles moderate cognitive load. May slow down with highly complex tasks.",
      B4: "Manages high cognitive load effectively. Maintains performance under pressure.",
      B5: "Exceptional load handling. Performs well even with very complex, multi-step tasks.",
    },
    processing_speed: {
      B1: "Very fast processing. May sacrifice accuracy for speed.",
      B2: "Quick processing speed. Generally efficient in responses.",
      B3: "Moderate processing speed. Takes appropriate time for tasks.",
      B4: "Slower, more deliberate processing. Thorough but may need more time.",
      B5: "Very deliberate processing. Takes significant time but is very thorough.",
    },
    exploratory_nature: {
      B1: "Very focused and direct. Sticks to first instinct without exploring alternatives.",
      B2: "Mostly direct. Occasionally considers other options.",
      B3: "Moderate exploration. Considers some alternatives before deciding.",
      B4: "Actively exploratory. Examines multiple options and perspectives.",
      B5: "Highly exploratory. Extensively investigates all available options before deciding.",
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

export function computeCognitiveScores(payload: AssessmentPayload): AssessmentResponse {
  const { question1_conservation: q1, question2_classification: q2, question3_seriation: q3, question4_reversibility: q4, question5_hypothetical: q5 } = payload;

  const correctCount = [q1.correctness, q4.correctness, q5.correctness].filter(Boolean).length;
  const avgAC = (q1.ac + q4.ac + q5.ac) / 3;
  const confidenceRaw = (correctCount / 3) * 6 + invertBand(Math.round(avgAC)) * 2;

  const wmRaw = (invertBand(q3.s_band) + invertBand(q3.m_band) + invertBand(q3.tp_band)) / 3 * 5;

  const avgHover = (q1.h_band + q4.h_band + q5.h_band) / 3;
  const anxietyRaw = (avgHover + q2.idle_band) / 2 * 5;

  const corrScore = invertBand(q2.corr_band);
  const mScore = invertBand(q3.m_band);
  const precisionRaw = (correctCount / 3) * 4 + (corrScore + mScore) / 2 * 3;

  const ecRaw = (q2.corr_band + avgAC) / 2 * 5;

  const avgRT = (q1.rt_band + q4.rt_band + q5.rt_band) / 3;
  const impulsivityRaw = invertBand(Math.round(avgRT)) * 3 + avgAC * 2;

  const wmLoadRaw = (invertBand(q3.t_band) + invertBand(q2.t_band)) / 2 * 5;

  const processingRaw = invertBand(Math.round(avgRT)) * 5;

  const exploratoryRaw = (avgHover + avgAC) / 2 * 5;

  const confidence = rawToParameter(confidenceRaw, "confidence");
  const working_memory = rawToParameter(wmRaw, "working_memory");
  const anxiety = rawToParameter(anxietyRaw, "anxiety");
  const precision = rawToParameter(precisionRaw, "precision");
  const error_correction_ability = rawToParameter(ecRaw, "error_correction_ability");
  const impulsivity = rawToParameter(impulsivityRaw, "impulsivity");
  const working_memory_load_handling = rawToParameter(wmLoadRaw, "working_memory_load_handling");
  const processing_speed = rawToParameter(processingRaw, "processing_speed");
  const exploratory_nature = rawToParameter(exploratoryRaw, "exploratory_nature");

  const params = [confidence, working_memory, precision, error_correction_ability, working_memory_load_handling, processing_speed];
  const avgScore = params.reduce((sum, p) => sum + p.final_score, 0) / params.length;

  let summary: string;
  if (avgScore >= 70) {
    summary = "This learner demonstrates strong cognitive abilities across multiple dimensions. They show confident decision-making, effective working memory, and good precision. They would benefit from challenging material that pushes their capabilities further.";
  } else if (avgScore >= 50) {
    summary = "This learner shows developing cognitive skills with solid foundations. They have moderate confidence and working memory capacity. Structured learning with gradually increasing complexity would support their growth effectively.";
  } else {
    summary = "This learner is in the early stages of developing several cognitive skills. They would benefit from supportive, scaffolded instruction with plenty of encouragement. Breaking tasks into smaller steps and providing immediate feedback will help build confidence.";
  }

  return {
    confidence,
    working_memory,
    anxiety,
    precision,
    error_correction_ability,
    impulsivity,
    working_memory_load_handling,
    processing_speed,
    exploratory_nature,
    final_summary: summary,
  };
}
