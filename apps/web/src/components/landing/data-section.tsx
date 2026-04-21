"use client";

import { useEffect, useRef, useState } from "react";

// Bar chart data — stress causes from the survey
const STRESS_CAUSES = [
  { label: "ความคาดหวังของครอบครัว", pct: 80 },
  { label: "ความกดดันด้านผลการเรียน", pct: 74 },
  { label: "ความไม่แน่ใจในอนาคต", pct: 68 },
  { label: "ปัญหาการเงิน", pct: 51 },
  { label: "ความสัมพันธ์กับเพื่อน", pct: 38 },
];

// Pie/donut data — mental health breakdown
const MH_BREAKDOWN = [
  { label: "ปกติ", pct: 66, color: "var(--us-blue)" },
  { label: "เครียด/ซึมเศร้า", pct: 30, color: "var(--us-orange)" },
  { label: "วิกฤต", pct: 4, color: "var(--us-burg)" },
];

function AnimatedBar({ label, pct, delay }: { label: string; pct: number; delay: number }) {
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
              setWidth(ease * pct);
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
  }, [pct, delay]);

  return (
    <div ref={ref} style={{ marginBottom: 14 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sarabun), sans-serif",
            fontSize: 13,
            color: "var(--us-dark)",
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: "var(--font-sarabun), sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--us-orange)",
          }}
        >
          {Math.round(width)}%
        </span>
      </div>
      <div
        style={{
          height: 10,
          background: "rgba(47,89,122,0.12)",
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${width}%`,
            background: `linear-gradient(90deg, var(--us-blue), var(--us-orange))`,
            borderRadius: 5,
            transition: "width 0.05s linear",
          }}
        />
      </div>
    </div>
  );
}

function DonutChart() {
  const size = 180;
  const r = 70;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let cumulative = 0;
  const segments = MH_BREAKDOWN.map((d) => {
    const offset = circumference * (1 - cumulative / 100);
    const dasharray = `${(d.pct / 100) * circumference} ${circumference}`;
    cumulative += d.pct;
    return { ...d, offset, dasharray };
  });

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
      <svg width={size} height={size}>
        {segments.map((seg) => (
          <circle
            key={seg.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth={28}
            strokeDasharray={seg.dasharray}
            strokeDashoffset={seg.offset}
            style={{ transform: "rotate(-90deg)", transformOrigin: "center" }}
          />
        ))}
        {/* Center text */}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          fontFamily="var(--font-sarabun), sans-serif"
          fontSize={13}
          fill="var(--us-dark)"
          fontWeight={700}
        >
          นักศึกษา
        </text>
        <text
          x={cx}
          y={cy + 12}
          textAnchor="middle"
          fontFamily="var(--font-sarabun), sans-serif"
          fontSize={11}
          fill="var(--us-muted)"
        >
          15 มหาวิทยาลัย
        </text>
      </svg>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {MH_BREAKDOWN.map((d) => (
          <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: 3,
                background: d.color,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-sarabun), sans-serif",
                fontSize: 13,
                color: "var(--us-dark)",
              }}
            >
              {d.label}
            </span>
            <span
              style={{
                fontFamily: "var(--font-sarabun), sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: d.color,
              }}
            >
              {d.pct}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DataSection() {
  return (
    <section
      id="data"
      style={{
        background: "var(--us-surface)",
        padding: "80px 40px",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div
          style={{
            fontFamily: "var(--font-patrick-hand), cursive",
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "var(--us-muted)",
            marginBottom: 12,
          }}
        >
          ข้อมูลและหลักฐานเชิงประจักษ์
        </div>

        <h2
          style={{
            fontFamily: "var(--font-sarabun), sans-serif",
            fontSize: "clamp(24px, 3.5vw, 38px)",
            fontWeight: 700,
            color: "var(--us-dark)",
            marginBottom: 12,
          }}
        >
          ตัวเลขที่ซ่อนอยู่ใต้ผลการเรียน
        </h2>

        <p
          style={{
            fontFamily: "var(--font-lora), Georgia, serif",
            fontStyle: "italic",
            fontSize: 15,
            color: "var(--us-muted)",
            marginBottom: 52,
            maxWidth: 560,
            lineHeight: 1.7,
          }}
        >
          ลูกของคุณไม่ได้เหนื่อยอยู่คนเดียว — นี่คือปัญหาร่วมกันของทั้งรุ่น
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 40,
          }}
        >
          {/* Bar chart */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-sarabun), sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--us-blue)",
                marginBottom: 20,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              สาเหตุหลักของความเครียด
            </div>
            {STRESS_CAUSES.map((item, i) => (
              <AnimatedBar
                key={item.label}
                label={item.label}
                pct={item.pct}
                delay={i * 120}
              />
            ))}
          </div>

          {/* Donut */}
          <div>
            <div
              style={{
                fontFamily: "var(--font-sarabun), sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--us-blue)",
                marginBottom: 20,
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              สภาวะสุขภาพจิตนักศึกษา
            </div>
            <DonutChart />
            <p
              style={{
                fontFamily: "var(--font-sarabun), sans-serif",
                fontSize: 12,
                color: "var(--us-muted)",
                marginTop: 20,
                lineHeight: 1.6,
              }}
            >
              * ข้อมูลจากการสำรวจนักศึกษา 15 มหาวิทยาลัยทั่วประเทศไทย
              โดยส่วนนี้จะได้รับการอัปเดตด้วยข้อมูลจาก Google Form ของโปรเจกต์
            </p>
          </div>
        </div>

        {/* Placeholder for charts from Google Form */}
        <div
          style={{
            marginTop: 48,
            background: "rgba(47,89,122,0.06)",
            border: "2px dashed rgba(47,89,122,0.2)",
            borderRadius: 10,
            padding: "32px 24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-sarabun), sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "var(--us-blue)",
              marginBottom: 6,
            }}
          >
            พื้นที่สำหรับกราฟจาก Google Form
          </div>
          <div
            style={{
              fontFamily: "var(--font-sarabun), sans-serif",
              fontSize: 13,
              color: "var(--us-muted)",
            }}
          >
            Word cloud · Bar plot · Pie chart · และข้อมูลเชิงลึกอื่นๆ จากการเก็บข้อมูลจริง
          </div>
        </div>
      </div>
    </section>
  );
}
