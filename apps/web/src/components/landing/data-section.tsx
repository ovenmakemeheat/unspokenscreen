"use client";

import { useEffect, useRef, useState } from "react";
import { ImageIcon } from "lucide-react";

// ── Types mirroring the API ───────────────────────────────────
type SummaryData = {
  totalResponses: number;
  yearBreakdown: Record<string, number>;
  keyStats: {
    avgFamilyUnderstanding: number;
    avgGradeExpectation: number;
    avgFearOfTruth: number;
    avgSelfWorthImpact: number;
    avgStressImpact: number;
    avgLostIdentity: number;
    avgNotSafeSpace: number;
    avgFamilyListens: number;
    avgLoneliness: number;
    avgConditionalLove: number;
  };
};

type ScaleQuestion = {
  id: string;
  questionTh: string;
  average: number;
  count: number;
  distribution: Record<string, number>;
};

type ChoiceQuestion = {
  id: string;
  questionTh: string;
  type: "category";
  total: number;
  choices: { label: string; count: number }[];
};

type WordCloudQuestion = {
  id: string;
  questionTh: string;
  wordcloudImageUrl: string | null;
  count: number;
};

const API = process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:3000";

// ── Animated pressure bar ─────────────────────────────────────
function AnimatedBar({
  label,
  value,
  max,
  colorClass,
  delay,
  suffix = "",
}: {
  label: string;
  value: number;
  max: number;
  colorClass: string;
  delay: number;
  suffix?: string;
}) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          setTimeout(() => {
            const start = performance.now();
            const animate = (now: number) => {
              const p = Math.min((now - start) / 900, 1);
              const ease = 1 - Math.pow(1 - p, 3);
              setWidth(ease * (value / max) * 100);
              if (p < 1) requestAnimationFrame(animate);
            };
            requestAnimationFrame(animate);
          }, delay);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, max, delay]);

  return (
    <div ref={ref} className="mb-3.5">
      <div className="flex justify-between mb-1.5 gap-2">
        <span className="text-[13px] text-us-dark leading-snug flex-1">{label}</span>
        <span className={`text-[13px] font-bold shrink-0 ${colorClass}`}>
          {value.toFixed(1)}{suffix}
        </span>
      </div>
      <div className="h-2 bg-us-blue/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-[width] duration-[50ms] ${colorClass.replace("text-", "bg-")}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

// ── Distribution bar chart (1–5 scale) ───────────────────────
function DistributionChart({ dist, avg }: { dist: Record<string, number>; avg: number }) {
  const total = Object.values(dist).reduce((a, b) => a + b, 0) || 1;
  const max = Math.max(...Object.values(dist), 1);
  return (
    <div className="flex flex-col gap-1">
      <div className="flex gap-1 items-end h-12">
        {[1, 2, 3, 4, 5].map((v) => {
          const count = dist[String(v)] ?? 0;
          const h = (count / max) * 44;
          return (
            <div key={v} className="flex-1 flex flex-col items-center gap-0.5">
              <div
                className={`w-full rounded-t-sm ${v >= 4 ? "bg-us-orange" : "bg-us-blue"}`}
                style={{
                  height: h,
                  opacity: 0.75 + (v / 5) * 0.25,
                  minHeight: count > 0 ? 2 : 0,
                }}
              />
              <span className="text-[10px] text-us-muted">{v}</span>
            </div>
          );
        })}
      </div>
      <p className="text-[11px] text-us-muted text-right">
        เฉลี่ย {avg.toFixed(2)} / 5 · {total} คน
      </p>
    </div>
  );
}

// ── Choice bar chart ──────────────────────────────────────────
const CHOICE_COLORS = [
  "bg-us-blue text-us-blue",
  "bg-us-burg text-us-burg",
  "bg-us-orange text-us-orange",
  "bg-us-blue text-us-blue",
  "bg-us-burg text-us-burg",
  "bg-us-orange text-us-orange",
];

function ChoiceChart({ question }: { question: ChoiceQuestion }) {
  const max = Math.max(...question.choices.map((c) => c.count), 1);
  const shown = question.choices.slice(0, 6);

  return (
    <div className="bg-white rounded-xl px-4 py-[18px] shadow-sm">
      <p className="text-[12px] font-semibold text-us-dark mb-3.5 leading-snug">
        {question.questionTh}
      </p>
      <div className="flex flex-col gap-2">
        {shown.map((c, i) => {
          const pct = Math.round((c.count / question.total) * 100);
          const barW = (c.count / max) * 100;
          const [bgClass, textClass] = CHOICE_COLORS[i % CHOICE_COLORS.length].split(" ");
          return (
            <div key={c.label}>
              <div className="flex justify-between mb-0.5 gap-2">
                <span className="text-[11px] text-us-dark leading-snug flex-1">
                  {c.label.length > 55 ? c.label.slice(0, 52) + "…" : c.label}
                </span>
                <span className={`text-[11px] font-bold shrink-0 ${textClass}`}>{pct}%</span>
              </div>
              <div className="h-1.5 bg-us-blue/[0.08] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${bgClass}`} style={{ width: `${barW}%` }} />
              </div>
            </div>
          );
        })}
        <p className="text-[10px] text-us-muted text-right mt-0.5">{question.total} คำตอบ</p>
      </div>
    </div>
  );
}

// ── Word cloud card ───────────────────────────────────────────
function WordCloudCard({ question }: { question: WordCloudQuestion }) {
  return (
    <div className="bg-white rounded-xl px-4 py-[18px] shadow-sm">
      <p className="text-[12px] font-semibold text-us-dark mb-3.5 leading-snug">
        {question.questionTh}
      </p>
      {question.wordcloudImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={question.wordcloudImageUrl}
          alt={`Word cloud: ${question.questionTh}`}
          className="w-full rounded-md object-contain"
        />
      ) : (
        <div className="h-[130px] flex flex-col items-center justify-center gap-2 bg-us-blue/[0.04] rounded-md border-2 border-dashed border-us-blue/[0.15]">
          <ImageIcon size={24} color="rgba(47,89,122,0.3)" strokeWidth={1.5} />
          <span className="text-[11px] text-us-muted text-center">
            Word Cloud<br />
            <span className="opacity-60">{question.count} คำตอบ</span>
          </span>
        </div>
      )}
    </div>
  );
}

// ── Main section ──────────────────────────────────────────────
export function DataSection() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [scaleQuestions, setScaleQuestions] = useState<ScaleQuestion[]>([]);
  const [choiceQuestions, setChoiceQuestions] = useState<ChoiceQuestion[]>([]);
  const [wordcloudQuestions, setWordcloudQuestions] = useState<WordCloudQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch(`${API}/api/survey/summary`).then((r) => r.json()),
      fetch(`${API}/api/survey/scale`).then((r) => r.json()),
      fetch(`${API}/api/survey/choices`).then((r) => r.json()),
      fetch(`${API}/api/survey/open`).then((r) => r.json()),
    ])
      .then(([s, sc, ch, op]) => {
        setSummary(s);
        setScaleQuestions(sc);
        setChoiceQuestions(ch);
        setWordcloudQuestions(
          (op as Array<{ id: string; questionTh: string; wordcloudImageUrl: string | null; count: number }>)
            .filter((q) => q.id === "a9" || q.id === "camp")
        );
        setLoading(false);
      })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  const pressureStats = summary
    ? [
        { label: "ครอบครัวคาดหวังเกรดสูง", value: summary.keyStats.avgGradeExpectation, colorClass: "text-us-orange" },
        { label: "กลัวบอกความจริงกับที่บ้าน", value: summary.keyStats.avgFearOfTruth, colorClass: "text-us-burg" },
        { label: "Self-worth ลดเมื่อผลเรียนแย่", value: summary.keyStats.avgSelfWorthImpact, colorClass: "text-us-burg" },
        { label: "ความเครียดส่งผลต่อชีวิต", value: summary.keyStats.avgStressImpact, colorClass: "text-us-orange" },
        { label: "รู้สึกสูญเสียความเป็นตัวเอง", value: summary.keyStats.avgLostIdentity, colorClass: "text-us-blue" },
        { label: "ครอบครัวไม่ใช่พื้นที่ปลอดภัย", value: summary.keyStats.avgNotSafeSpace, colorClass: "text-us-blue" },
        { label: "รู้สึกโดดเดี่ยว", value: summary.keyStats.avgLoneliness, colorClass: "text-us-burg" },
        { label: "รักมีเงื่อนไข (เมื่อสำเร็จ)", value: summary.keyStats.avgConditionalLove, colorClass: "text-us-orange" },
      ]
    : [];

  const detailScaleIds = ["a3", "b1", "b2", "c5", "c7"];
  const detailScales = scaleQuestions.filter((q) => detailScaleIds.includes(q.id));

  return (
    <section id="data" className="bg-us-surface py-20 px-10">
      <div className="max-w-[960px] mx-auto">

        {/* Header */}
        <p className="text-[11px] tracking-[3px] uppercase text-us-muted mb-3 font-semibold">
          ข้อมูลและหลักฐานเชิงประจักษ์
        </p>
        <h2 className="text-[clamp(24px,3.5vw,38px)] font-bold text-us-dark mb-3">
          ตัวเลขที่ซ่อนอยู่ใต้ผลการเรียน
        </h2>
        <p className="italic text-[15px] text-us-muted mb-14 max-w-[560px] leading-[1.7]">
          ลูกของคุณไม่ได้เหนื่อยอยู่คนเดียว — นี่คือปัญหาร่วมกันของทั้งรุ่น
        </p>

        {loading && (
          <p className="text-[14px] text-us-muted mb-10">กำลังโหลดข้อมูล...</p>
        )}

        {error && (
          <div className="bg-us-burg/[0.06] border border-us-burg/20 rounded-lg px-[18px] py-3.5 text-[13px] text-us-burg mb-10">
            ไม่สามารถโหลดข้อมูลจาก API ได้ — ตรวจสอบว่า server กำลังรันอยู่ที่ {API}
          </div>
        )}

        {/* ── Summary total ── */}
        {summary && (
          <div className="bg-us-dark rounded-xl px-7 py-6 mb-10 flex items-center gap-6 flex-wrap">
            <div>
              <div className="text-[clamp(36px,5vw,52px)] font-bold text-us-orange leading-none">
                {summary.totalResponses}
              </div>
              <p className="text-[13px] text-us-cream/60 mt-1">ผู้ตอบแบบสอบถาม</p>
            </div>
            <div className="w-px h-12 bg-white/10 shrink-0" />
            <div className="flex gap-4 flex-wrap">
              {Object.entries(summary.yearBreakdown).map(([year, count]) => (
                <div key={year} className="text-center">
                  <div className="text-[20px] font-bold text-us-cream">{count}</div>
                  <div className="text-[11px] text-us-cream/45">{year}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Pressure score bars ── */}
        {summary && (
          <div className="mb-14">
            <p className="text-[14px] font-bold text-us-blue uppercase tracking-[0.5px] mb-5">
              คะแนนเฉลี่ย (สเกล 1–5) จากผู้ตอบ {summary.totalResponses} คน
            </p>
            {pressureStats.map((s, i) => (
              <AnimatedBar
                key={s.label}
                label={s.label}
                value={s.value}
                max={5}
                colorClass={s.colorClass}
                delay={i * 80}
                suffix=" / 5"
              />
            ))}
          </div>
        )}

        {/* ── Detailed distribution charts (scale 1–5) ── */}
        {detailScales.length > 0 && (
          <div className="mb-14">
            <p className="text-[14px] font-bold text-us-blue uppercase tracking-[0.5px] mb-5">
              การกระจายคำตอบ (1 = น้อยมาก · 5 = มากที่สุด)
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-5">
              {detailScales.map((q) => (
                <div key={q.id} className="bg-white rounded-xl px-4 py-[18px] shadow-sm">
                  <p className="text-[12px] font-semibold text-us-dark mb-3.5 leading-snug">
                    {q.questionTh}
                  </p>
                  <DistributionChart dist={q.distribution} avg={q.average} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Choice bar charts ── */}
        {choiceQuestions.length > 0 && (
          <div className="mb-14">
            <p className="text-[14px] font-bold text-us-blue uppercase tracking-[0.5px] mb-5">
              คำตอบแบบเลือก — ความถี่ที่พบมากที่สุด
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
              {choiceQuestions.map((q) => (
                <ChoiceChart key={q.id} question={q} />
              ))}
            </div>
          </div>
        )}

        {/* ── Word clouds ── */}
        {wordcloudQuestions.length > 0 && (
          <div>
            <p className="text-[14px] font-bold text-us-blue uppercase tracking-[0.5px] mb-5">
              เสียงจากผู้ตอบ — Word Cloud
            </p>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-5">
              {wordcloudQuestions.map((q) => (
                <WordCloudCard key={q.id} question={q} />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
