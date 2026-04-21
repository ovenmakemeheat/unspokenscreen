"use client";

import Link from "next/link";
import { MessageCircleHeart, BookOpen, TrendingUp } from "lucide-react";

const SOLUTIONS = [
  {
    icon: MessageCircleHeart,
    title: "สร้างพื้นที่สนทนาที่ไร้เงื่อนไข",
    subtitle: "Unconditional Dialogue",
    body: "เว็บไซต์นี้คือจุดเริ่มต้นให้ครอบครัวกล้าคุยกันโดยไม่มีเรื่อง \"เกรด\" หรือ \"ความสำเร็จ\" มาเป็นกำแพงกั้น",
    accent: "var(--us-blue)",
  },
  {
    icon: TrendingUp,
    title: "นิยามใหม่ของความมั่นคง",
    subtitle: "Redefining Security",
    body: "สายงานคอมพิวเตอร์มีเส้นทางที่หลากหลาย ความสุขในสิ่งที่ทำคือรากฐานของความมั่นคงในระยะยาวที่แท้จริง",
    accent: "var(--us-orange)",
  },
  {
    icon: BookOpen,
    title: "การล้มเหลวคือเรื่องปกติ",
    subtitle: "Normalizing Failure",
    body: "ส่งเสริมค่านิยมว่า \"การสะดุดหรือล้มเหลวเป็นเรื่องปกติ\" เพื่อลดแรงกดดันมหาศาลที่แบกไว้จากความคาดหวังของสังคม",
    accent: "var(--us-burg)",
  },
];

export function SolutionsSection() {
  return (
    <section
      id="solutions"
      style={{
        background: "var(--us-dark)",
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
            color: "rgba(249,244,235,0.35)",
            marginBottom: 12,
          }}
        >
          แนวทางการแก้ไขปัญหา
        </div>

        <h2
          style={{
            fontFamily: "var(--font-sarabun), sans-serif",
            fontSize: "clamp(24px, 3.5vw, 38px)",
            fontWeight: 700,
            color: "#f9f4eb",
            marginBottom: 48,
          }}
        >
          เราต้องการสะพาน
          <br />
          <span style={{ color: "var(--us-orange)" }}>ไม่ใช่กำแพง</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 24,
            marginBottom: 56,
          }}
        >
          {SOLUTIONS.map((s) => (
            <div
              key={s.title}
              style={{
                background: "rgba(249,244,235,0.04)",
                border: "1px solid rgba(249,244,235,0.08)",
                borderRadius: 12,
                padding: "28px 24px",
                borderTop: `3px solid ${s.accent}`,
              }}
            >
              <s.icon
                size={28}
                color={s.accent}
                strokeWidth={1.5}
                style={{ marginBottom: 16 }}
              />
              <div
                style={{
                  fontFamily: "var(--font-patrick-hand), cursive",
                  fontSize: 10,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  color: "rgba(249,244,235,0.35)",
                  marginBottom: 6,
                }}
              >
                {s.subtitle}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sarabun), sans-serif",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#f9f4eb",
                  marginBottom: 10,
                  lineHeight: 1.4,
                }}
              >
                {s.title}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-sarabun), sans-serif",
                  fontSize: 14,
                  color: "rgba(249,244,235,0.6)",
                  lineHeight: 1.75,
                }}
              >
                {s.body}
              </div>
            </div>
          ))}
        </div>

        {/* CTA block */}
        <div
          style={{
            background: "rgba(255,117,31,0.12)",
            border: "1px solid rgba(255,117,31,0.3)",
            borderRadius: 12,
            padding: "32px 36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 20,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-sarabun), sans-serif",
                fontSize: 18,
                fontWeight: 700,
                color: "#f9f4eb",
                marginBottom: 6,
              }}
            >
              พร้อมแล้วไหม?
            </div>
            <div
              style={{
                fontFamily: "var(--font-lora), Georgia, serif",
                fontStyle: "italic",
                fontSize: 14,
                color: "rgba(249,244,235,0.6)",
              }}
            >
              เริ่มต้นบทสนทนาที่ยังค้างอยู่ในใจ — ที่กำแพงนิรนาม
            </div>
          </div>
          <Link
            href="/wall"
            style={{
              background: "var(--us-orange)",
              color: "#fff",
              borderRadius: 24,
              padding: "12px 28px",
              fontFamily: "var(--font-sarabun), sans-serif",
              fontSize: 14,
              fontWeight: 700,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            ไปที่กำแพงนิรนาม →
          </Link>
        </div>
      </div>
    </section>
  );
}
