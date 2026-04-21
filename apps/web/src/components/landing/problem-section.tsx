"use client";

import { useEffect, useRef, useState } from "react";

type StatProps = { value: number; suffix?: string; label: string; sub?: string };

function AnimatedStat({ value, suffix = "%", label, sub }: StatProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1600;
          const start = performance.now();
          const animate = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setCount(Math.round(ease * value));
            if (p < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div
      ref={ref}
      style={{
        background: "var(--us-surface)",
        borderRadius: 12,
        padding: "28px 24px",
        boxShadow: "0 2px 12px rgba(47,89,122,0.08)",
        flex: "1 1 180px",
        minWidth: 160,
      }}
    >
      <div
        style={{
          fontSize: "clamp(40px, 6vw, 58px)",
          fontWeight: 700,
          color: "var(--us-orange)",
          lineHeight: 1,
          fontFamily: "var(--font-sarabun), sans-serif",
        }}
      >
        {count}
        {suffix}
      </div>
      <div
        style={{
          fontFamily: "var(--font-sarabun), sans-serif",
          fontSize: 15,
          fontWeight: 600,
          color: "var(--us-dark)",
          marginTop: 8,
          lineHeight: 1.4,
        }}
      >
        {label}
      </div>
      {sub && (
        <div
          style={{
            fontFamily: "var(--font-sarabun), sans-serif",
            fontSize: 12,
            color: "var(--us-muted)",
            marginTop: 4,
            lineHeight: 1.5,
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}

export function ProblemSection() {
  return (
    <section
      id="problem"
      style={{
        background: "var(--us-bg)",
        padding: "80px 40px",
      }}
    >
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Label */}
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
          ที่มาและความสำคัญ
        </div>

        <h2
          style={{
            fontFamily: "var(--font-sarabun), sans-serif",
            fontSize: "clamp(26px, 4vw, 40px)",
            fontWeight: 700,
            color: "var(--us-dark)",
            lineHeight: 1.25,
            marginBottom: 20,
            borderBottom: "3px solid var(--us-burg)",
            paddingBottom: 16,
          }}
        >
          ปัญหานี้ไม่ได้ไกลตัว
        </h2>

        <p
          style={{
            fontFamily: "var(--font-sarabun), sans-serif",
            fontSize: 16,
            color: "#1a1a1a",
            lineHeight: 1.85,
            maxWidth: 680,
            marginBottom: 52,
          }}
        >
          ผลสำรวจจาก 15 มหาวิทยาลัยทั่วประเทศไทยเผยให้เห็นภาพที่น่ากังวล
          สาเหตุหลักของความเครียดสะสม คือ{" "}
          <strong style={{ color: "var(--us-burg)" }}>
            &ldquo;ความคาดหวังของครอบครัว&rdquo;
          </strong>{" "}
          ที่สร้างความขัดแย้งภายในระหว่างการทำตามใจตนเองและการทำให้คนที่รักพอใจ
        </p>

        {/* Stat cards */}
        <div
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            marginBottom: 56,
          }}
        >
          <AnimatedStat
            value={30}
            label="มีอาการเครียดสะสมและซึมเศร้า"
            sub="จากนักศึกษาทั่วประเทศ"
          />
          <AnimatedStat
            value={80}
            label="มีความเครียดและวิตกกังวลสูง"
            sub="มีรากฐานจากความคาดหวังครอบครัว"
          />
          <AnimatedStat
            value={4}
            label="มีความคิดอยากทำร้ายตัวเองบ่อยครั้ง"
            sub="ตัวเลขที่ซ่อนอยู่ใต้ผลการเรียน"
          />
        </div>

        {/* Insight cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {[
            {
              title: "จากเรื่องส่วนตัว สู่โครงสร้างสังคม",
              body: "ความเครียดไม่ใช่ปัญหาของปัจเจก — มันฝังรากลึกในค่านิยมที่วัดคุณค่าความเป็นมนุษย์จากความมั่นคงทางอาชีพและเกรดเฉลี่ย",
              accent: "var(--us-blue)",
            },
            {
              title: "ความกดดัน คือความกังวลที่แสดงออกมาผิดวิธี",
              body: "พ่อแม่ไม่ได้ต้องการควบคุม — พวกเขาแค่กลัวว่าลูกจะไม่มั่นคงในอนาคต เราต้องการสะพานเชื่อมความเข้าใจ ไม่ใช่กำแพงกั้น",
              accent: "var(--us-burg)",
            },
          ].map((card) => (
            <div
              key={card.title}
              style={{
                background: "#fff",
                borderRadius: 10,
                padding: "24px 22px",
                borderLeft: `4px solid ${card.accent}`,
                boxShadow: "0 2px 12px rgba(47,89,122,0.07)",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-sarabun), sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  color: "var(--us-dark)",
                  marginBottom: 10,
                  lineHeight: 1.4,
                }}
              >
                {card.title}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sarabun), sans-serif",
                  fontSize: 14,
                  color: "var(--us-muted)",
                  lineHeight: 1.75,
                }}
              >
                {card.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
