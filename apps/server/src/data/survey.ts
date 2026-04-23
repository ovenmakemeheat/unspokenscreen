import { loadResponses } from "./parse-csv.js";

const { rows } = loadResponses();

// ── Column index map ──────────────────────────────────────────
export const COL = {
  timestamp: 0,
  year: 1,
  department: 2,
  goal: 3,
  // Section A: Family understanding & pressure (cols 4–12, questions 1–9)
  a1_family_understanding: 4,
  a2_grade_expectation: 5,
  a3_fear_of_truth: 6,
  a4_future_planned: 7,
  a5_maintain_grades: 8,
  a6_career_preferred: 9, // open text
  a7_family_reaction: 10, // open text
  a8_uncomfortable_situation: 11, // open text
  a9_pressure_words: 12, // open text
  // Section B: Emotional impact (cols 13–22, questions 1–10)
  b1_self_worth: 13,
  b2_stress_impact: 14,
  b3_lost_identity: 15,
  b4_not_safe_space: 16,
  b5_failure_feeling: 17,
  b6_symptoms: 18, // open text
  b7_trigger: 19, // open text
  b8_coping: 20, // open text
  b9_conflict: 21, // open text
  b10_need_from_family: 22, // open text
  // Section C: Communication (cols 23–31, questions 1–9)
  c1_family_listens: 23,
  c2_family_response: 24, // open text
  c3_lie_about_grades: 25,
  c4_keep_stress_alone: 26,
  c5_loneliness: 27,
  c6_hard_to_talk: 28,
  c7_love_conditional: 29,
  c8_home_safe: 30,
  c9_dismissed: 31,
  // Final (cols 32–33)
  solution_suggestion: 32, // open text
  campaign_style: 33, // open text
} as const;

// ── Types ─────────────────────────────────────────────────────
export type QuestionMeta = {
  id: string;
  colIndex: number;
  questionTh: string;
  type: "scale" | "open" | "category";
  scaleMax?: number;
};

// ── Numeric scale questions (1–5) ────────────────────────────
export const SCALE_QUESTIONS: QuestionMeta[] = [
  {
    id: "a1",
    colIndex: COL.a1_family_understanding,
    questionTh:
      "ครอบครัวมีความเข้าใจในสิ่งที่คุณเรียน (วิศวกรรมศาสตร์) มากน้อยเพียงใด",
    type: "scale",
    scaleMax: 5,
  },
  {
    id: "a2",
    colIndex: COL.a2_grade_expectation,
    questionTh:
      "คุณรู้สึกว่าครอบครัวคาดหวังให้คุณต้องเรียนจบด้วยเกรดเฉลี่ยที่สูง (เกียรตินิยม)",
    type: "scale",
    scaleMax: 5,
  },
  {
    id: "a3",
    colIndex: COL.a3_fear_of_truth,
    questionTh:
      "คุณรู้สึกกลัวที่จะบอกความจริงกับที่บ้านเพราะกังวลว่าจะทำให้เขาผิดหวัง",
    type: "scale",
    scaleMax: 5,
  },
  {
    id: "a4",
    colIndex: COL.a4_future_planned,
    questionTh:
      "ที่บ้านมักจะวางแผนอนาคตไว้ให้คุณล่วงหน้าโดยยังไม่ได้ถามความสมัครใจ",
    type: "scale",
    scaleMax: 5,
  },
  {
    id: "a5",
    colIndex: COL.a5_maintain_grades,
    questionTh:
      "คุณถูกคาดหวังให้รักษามาตรฐานผลการเรียนให้คงที่หรือดีขึ้นในทุกภาคการศึกษา",
    type: "scale",
    scaleMax: 5,
  },
  {
    id: "b1",
    colIndex: COL.b1_self_worth,
    questionTh:
      "คุณค่าในตัวเอง (Self-worth) ลดลงอย่างมาก เมื่อผลการเรียนไม่เป็นไปตามที่ครอบครัวคาดหวัง",
    type: "scale",
    scaleMax: 5,
  },
  {
    id: "b2",
    colIndex: COL.b2_stress_impact,
    questionTh:
      "ความกลัวที่จะทำให้ครอบครัวผิดหวัง ทำให้คุณมีภาวะความเครียดสะสมจนส่งผลกระทบต่อชีวิต",
    type: "scale",
    scaleMax: 5,
  },
  {
    id: "b3",
    colIndex: COL.b3_lost_identity,
    questionTh:
      "คุณรู้สึกสูญเสียความเป็นตัวเองเพราะต้องพยายามเดินตามเส้นทางที่ครอบครัวมองว่าดีที่สุด",
    type: "scale",
    scaleMax: 5,
  },
  {
    id: "b4",
    colIndex: COL.b4_not_safe_space,
    questionTh:
      "ในวันที่แบกรับความกดดันไม่ไหว คุณรู้สึกว่าครอบครัวไม่ใช่พื้นที่ปลอดภัย",
    type: "scale",
    scaleMax: 5,
  },
  {
    id: "b5",
    colIndex: COL.b5_failure_feeling,
    questionTh:
      "เพียงแค่คิดจะเปลี่ยนสายงาน คุณก็ถูกทำให้รู้สึกว่าตัวเองกลายเป็นคนล้มเหลว",
    type: "scale",
    scaleMax: 5,
  },
  {
    id: "c1",
    colIndex: COL.c1_family_listens,
    questionTh:
      "ครอบครัวรับฟังคุณอย่างตั้งใจมากน้อยเพียงใด เมื่อคุณรู้สึกเครียดหรือล้มเหลว",
    type: "scale",
    scaleMax: 5,
  },
  {
    id: "c3",
    colIndex: COL.c3_lie_about_grades,
    questionTh:
      "คุณมักจะเลือกโกหกเรื่องเกรดเพื่อหลีกเลี่ยงการปะทะหรือความผิดหวังของพ่อแม่",
    type: "scale",
    scaleMax: 5,
  },
  {
    id: "c4",
    colIndex: COL.c4_keep_stress_alone,
    questionTh:
      "คุณเคยรู้สึกว่าต้องเก็บความเครียดไว้กับตัวเองเพราะคิดว่าครอบครัวจะไม่เข้าใจ",
    type: "scale",
    scaleMax: 5,
  },
  {
    id: "c5",
    colIndex: COL.c5_loneliness,
    questionTh:
      "คุณรู้สึกโดดเดี่ยวในการรับมือกับความคาดหวังของครอบครัวมากน้อยเพียงใด",
    type: "scale",
    scaleMax: 5,
  },
  {
    id: "c6",
    colIndex: COL.c6_hard_to_talk,
    questionTh:
      "ความคาดหวังของครอบครัวเคยทำให้คุณรู้สึกว่าการพูดคุยกับครอบครัวเป็นเรื่องยากขึ้น",
    type: "scale",
    scaleMax: 5,
  },
  {
    id: "c7",
    colIndex: COL.c7_love_conditional,
    questionTh:
      "ครอบครัวรักและภูมิใจในตัวคุณ เมื่อคุณทำสำเร็จ มากกว่า เมื่อคุณเป็นตัวเอง",
    type: "scale",
    scaleMax: 5,
  },
  {
    id: "c8",
    colIndex: COL.c8_home_safe,
    questionTh:
      "บ้านเป็นพื้นที่ที่คุณสามารถพูดคุยเรื่องความล้มเหลวได้โดยไม่ถูกตำหนิ",
    type: "scale",
    scaleMax: 5,
  },
  {
    id: "c9",
    colIndex: COL.c9_dismissed,
    questionTh:
      "ครอบครัวมักจะตัดบทหรือมองว่าเป็นเรื่องไร้สาระ เมื่อคุณพยายามอธิบายความต้องการที่แท้จริง",
    type: "scale",
    scaleMax: 5,
  },
];

// ── Open-text questions ───────────────────────────────────────
export const OPEN_QUESTIONS: QuestionMeta[] = [
  {
    id: "a6",
    colIndex: COL.a6_career_preferred,
    questionTh:
      "อาชีพรูปแบบใดที่ครอบครัวต้องการให้คุณทำมากที่สุดหลังจากเรียนจบ",
    type: "open",
  },
  {
    id: "a7",
    colIndex: COL.a7_family_reaction,
    questionTh:
      "ปฏิกิริยาของครอบครัวที่คุณกังวลมากที่สุด หากคุณทำไม่ได้ตามเป้าหมาย",
    type: "open",
  },
  {
    id: "a8",
    colIndex: COL.a8_uncomfortable_situation,
    questionTh: "สถานการณ์ใดในครอบครัวที่ทำให้คุณรู้สึกอึดอัดมากที่สุด",
    type: "open",
  },
  {
    id: "a9",
    colIndex: COL.a9_pressure_words,
    questionTh:
      "คำพูดหรือการกระทำใดจากครอบครัวที่ทำให้คุณรู้สึกกดดันเรื่องอนาคตมากที่สุด",
    type: "open",
  },
  {
    id: "b6",
    colIndex: COL.b6_symptoms,
    questionTh:
      "อาการหรือพฤติกรรมใดที่คุณมักเผชิญบ่อยที่สุด เมื่อรู้สึกกดดันจากความคาดหวังของครอบครัว",
    type: "open",
  },
  {
    id: "b7",
    colIndex: COL.b7_trigger,
    questionTh:
      "เหตุการณ์หรือคำพูดรูปแบบใดจากครอบครัว ที่มักเป็นตัวกระตุ้น (Trigger) ให้เกิดความรู้สึกล้มเหลว",
    type: "open",
  },
  {
    id: "b8",
    colIndex: COL.b8_coping,
    questionTh:
      "คุณมีกลไกการรับมือ (Coping Mechanism) กับความรู้สึกล้มเหลวอย่างไร",
    type: "open",
  },
  {
    id: "b9",
    colIndex: COL.b9_conflict,
    questionTh:
      "เรื่องใดที่ความต้องการของตัวเองขัดแย้งกับความคาดหวังของครอบครัวมากที่สุด",
    type: "open",
  },
  {
    id: "b10",
    colIndex: COL.b10_need_from_family,
    questionTh: "สิ่งใดที่คุณโหยหาและต้องการมากที่สุดจากครอบครัว",
    type: "open",
  },
  {
    id: "c2",
    colIndex: COL.c2_family_response,
    questionTh:
      "ครอบครัวของคุณมักตอบสนองในลักษณะใดมากที่สุด เมื่อคุณพูดถึงความกดดัน",
    type: "open",
  },
  {
    id: "sol",
    colIndex: COL.solution_suggestion,
    questionTh:
      "วิธีใดสามารถช่วยลดความเครียดของนักศึกษาที่เกิดจากความคาดหวังของครอบครัวได้มากที่สุด",
    type: "open",
  },
];

// ── Helpers ───────────────────────────────────────────────────
function numericValues(colIndex: number): number[] {
  return rows
    .map((r) => parseFloat(r[colIndex] ?? ""))
    .filter((n) => !isNaN(n));
}

function avg(nums: number[]): number {
  if (!nums.length) return 0;
  return (
    Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100
  );
}

function distribution(colIndex: number, max = 5): Record<string, number> {
  const dist: Record<string, number> = {};
  for (let i = 1; i <= max; i++) dist[String(i)] = 0;
  rows.forEach((r) => {
    const v = r[colIndex]?.trim();
    if (v && dist[v] !== undefined) dist[v]++;
  });
  return dist;
}

function categoryCount(colIndex: number): Record<string, number> {
  const count: Record<string, number> = {};
  rows.forEach((r) => {
    const v = (r[colIndex] ?? "").trim();
    if (v) count[v] = (count[v] ?? 0) + 1;
  });
  return Object.fromEntries(
    Object.entries(count).sort(([, a], [, b]) => b - a),
  );
}

// ── Choice questions (multi-select, plottable) ────────────────
export const CHOICE_QUESTIONS: QuestionMeta[] = [
  {
    id: "c2",
    colIndex: COL.c2_family_response,
    questionTh:
      "ครอบครัวของคุณมักตอบสนองในลักษณะใดมากที่สุด เมื่อคุณพูดถึงความกดดัน",
    type: "category",
  },
  {
    id: "a7",
    colIndex: COL.a7_family_reaction,
    questionTh:
      "ปฏิกิริยาของครอบครัวที่คุณกังวลมากที่สุด หากคุณทำไม่ได้ตามเป้าหมาย",
    type: "category",
  },
  {
    id: "b6",
    colIndex: COL.b6_symptoms,
    questionTh:
      "อาการหรือพฤติกรรมที่คุณมักเผชิญบ่อยที่สุด เมื่อรู้สึกกดดันจากครอบครัว",
    type: "category",
  },
  {
    id: "b8",
    colIndex: COL.b8_coping,
    questionTh: "กลไกการรับมือ (Coping Mechanism) กับความรู้สึกล้มเหลว",
    type: "category",
  },
];

// Word cloud questions (free text, visualised as image)
export const WORDCLOUD_QUESTION_IDS = ["a9"];

// ── Exported data builders ────────────────────────────────────
export function getSummary() {
  return {
    totalResponses: rows.length,
    yearBreakdown: categoryCount(COL.year),
    departmentBreakdown: categoryCount(COL.department),
    goalBreakdown: categoryCount(COL.goal),
    keyStats: {
      avgFamilyUnderstanding: avg(numericValues(COL.a1_family_understanding)),
      avgGradeExpectation: avg(numericValues(COL.a2_grade_expectation)),
      avgFearOfTruth: avg(numericValues(COL.a3_fear_of_truth)),
      avgSelfWorthImpact: avg(numericValues(COL.b1_self_worth)),
      avgStressImpact: avg(numericValues(COL.b2_stress_impact)),
      avgLostIdentity: avg(numericValues(COL.b3_lost_identity)),
      avgNotSafeSpace: avg(numericValues(COL.b4_not_safe_space)),
      avgFamilyListens: avg(numericValues(COL.c1_family_listens)),
      avgLoneliness: avg(numericValues(COL.c5_loneliness)),
      avgConditionalLove: avg(numericValues(COL.c7_love_conditional)),
    },
  };
}

export function getScaleQuestion(id: string) {
  const q = SCALE_QUESTIONS.find((q) => q.id === id);
  if (!q) return null;
  const nums = numericValues(q.colIndex);
  return {
    id: q.id,
    questionTh: q.questionTh,
    type: "scale" as const,
    average: avg(nums),
    count: nums.length,
    distribution: distribution(q.colIndex, q.scaleMax ?? 5),
  };
}

export function getAllScaleQuestions() {
  return SCALE_QUESTIONS.map((q) => {
    const nums = numericValues(q.colIndex);
    return {
      id: q.id,
      questionTh: q.questionTh,
      type: "scale" as const,
      average: avg(nums),
      count: nums.length,
      distribution: distribution(q.colIndex, q.scaleMax ?? 5),
    };
  });
}

export function getOpenQuestion(id: string) {
  const q = OPEN_QUESTIONS.find((q) => q.id === id);
  if (!q) return null;
  const answers = rows.map((r) => (r[q.colIndex] ?? "").trim()).filter(Boolean);
  return {
    id: q.id,
    questionTh: q.questionTh,
    type: "open" as const,
    count: answers.length,
    answers,
    wordcloudImageUrl: null as string | null,
  };
}

export function getAllOpenQuestions() {
  return OPEN_QUESTIONS.map((q) => {
    const answers = rows
      .map((r) => (r[q.colIndex] ?? "").trim())
      .filter(Boolean);
    const wordcloudImageUrl: string | null =
      q.id === "a9" ? "/wordcloud-a9.png" : null;
    return {
      id: q.id,
      questionTh: q.questionTh,
      type: "open" as const,
      count: answers.length,
      answers,
      wordcloudImageUrl,
    };
  });
}

// ── Choice/category questions ─────────────────────────────────
function categoryCountMulti(colIndex: number): Record<string, number> {
  const count: Record<string, number> = {};
  rows.forEach((r) => {
    const cell = (r[colIndex] ?? "").trim();
    if (!cell) return;
    // Split on comma followed by Thai/space patterns
    cell.split(",").forEach((part) => {
      const v = part.trim();
      if (v) count[v] = (count[v] ?? 0) + 1;
    });
  });
  return Object.fromEntries(
    Object.entries(count).sort(([, a], [, b]) => b - a),
  );
}

export function getAllChoiceQuestions() {
  return CHOICE_QUESTIONS.map((q) => {
    const counts = categoryCountMulti(q.colIndex);
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return {
      id: q.id,
      questionTh: q.questionTh,
      type: "category" as const,
      total,
      choices: Object.entries(counts).map(([label, count]) => ({
        label,
        count,
      })),
    };
  });
}
