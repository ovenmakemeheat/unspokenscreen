"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const QUOTES = [
  {
    text: "บางวันฉันแค่อยากได้ยินว่า 'ไม่เป็นไร ลูก ยังมีพ่อแม่อยู่นะ' แค่นั้นเอง",
    label: "นักศึกษาชั้นปีที่ 3 · ไม่ระบุตัวตน",
  },
  {
    text: "เกรดตกไม่ได้ทำให้ฉันเจ็บปวด แต่การที่บ้านไม่ถามว่าฉันเป็นยังไงบ้าง มันเจ็บกว่ามาก",
    label: "นักศึกษาวิศวกรรมคอมพิวเตอร์ · ไม่ระบุตัวตน",
  },
  {
    text: "ทุกครั้งที่โทรหาบ้าน คำถามแรกคือ 'เทอมนี้ได้เกรดเท่าไหร่' ไม่เคยเป็น 'หนูสบายดีไหม'",
    label: "นักศึกษาชั้นปีที่ 2 · ไม่ระบุตัวตน",
  },
  {
    text: "ฉันพยายามทุกวัน แต่ไม่มีวันที่รู้สึกว่าพยายามพอ เพราะมาตรวัดของครอบครัวมันไม่มีเพดาน",
    label: "นักศึกษาชั้นปีที่ 4 · ไม่ระบุตัวตน",
  },
  {
    text: "อยากบอกพ่อว่าฉันมีความฝันที่ต่างออกไป แต่กลัวว่าเขาจะผิดหวัง เลยเก็บไว้คนเดียวมาสองปีแล้ว",
    label: "นักศึกษาชั้นปีที่ 3 · ไม่ระบุตัวตน",
  },
];

export function VoicesSection() {
  const [idx, setIdx] = useState(0);

  const prev = () => setIdx((i) => (i - 1 + QUOTES.length) % QUOTES.length);
  const next = () => setIdx((i) => (i + 1) % QUOTES.length);

  return (
    <section
      id="voices"
      style={{
        background: "var(--us-burg)",
        padding: "80px 40px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative large quote mark */}
      <div
        style={{
          position: "absolute",
          top: -20,
          left: 32,
          fontFamily: "var(--font-lora), Georgia, serif",
          fontSize: 220,
          color: "rgba(255,255,255,0.04)",
          lineHeight: 1,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        &ldquo;
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", position: "relative" }}>
        <div
          style={{
            fontFamily: "var(--font-patrick-hand), cursive",
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "rgba(249,244,235,0.45)",
            marginBottom: 12,
          }}
        >
          เสียงสะท้อนจากพื้นที่จริง
        </div>

        <h2
          style={{
            fontFamily: "var(--font-sarabun), sans-serif",
            fontSize: "clamp(22px, 3.5vw, 34px)",
            fontWeight: 700,
            color: "#f9f4eb",
            marginBottom: 44,
          }}
        >
          สิ่งที่นักศึกษาอยากบอก
          <br />
          <span style={{ color: "var(--us-orange)" }}>แต่ยังพูดไม่ออก</span>
        </h2>

        {/* Quote card */}
        <div
          style={{
            background: "rgba(249,244,235,0.07)",
            borderRadius: 12,
            padding: "36px 40px",
            borderLeft: "4px solid var(--us-orange)",
            minHeight: 140,
            transition: "opacity 0.3s",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-lora), Georgia, serif",
              fontStyle: "italic",
              fontSize: "clamp(16px, 2.5vw, 21px)",
              color: "#f9f4eb",
              lineHeight: 1.85,
              marginBottom: 20,
            }}
          >
            &ldquo;{QUOTES[idx].text}&rdquo;
          </div>
          <div
            style={{
              fontFamily: "var(--font-patrick-hand), cursive",
              fontSize: 12,
              color: "rgba(249,244,235,0.45)",
              letterSpacing: 0.5,
            }}
          >
            — {QUOTES[idx].label}
          </div>
        </div>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 24,
          }}
        >
          {/* Dots */}
          <div style={{ display: "flex", gap: 8 }}>
            {QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                style={{
                  width: i === idx ? 24 : 8,
                  height: 8,
                  borderRadius: 4,
                  background: i === idx ? "var(--us-orange)" : "rgba(249,244,235,0.25)",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  transition: "all 0.2s",
                }}
              />
            ))}
          </div>

          {/* Arrows */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={prev}
              style={{
                background: "rgba(249,244,235,0.1)",
                border: "1px solid rgba(249,244,235,0.2)",
                borderRadius: "50%",
                width: 36,
                height: 36,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f9f4eb",
              }}
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>
            <button
              onClick={next}
              style={{
                background: "rgba(249,244,235,0.1)",
                border: "1px solid rgba(249,244,235,0.2)",
                borderRadius: "50%",
                width: 36,
                height: 36,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f9f4eb",
              }}
            >
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
