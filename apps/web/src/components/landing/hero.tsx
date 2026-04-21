"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const QUOTES = [
  "อยากให้แม่รู้ว่าฉันพยายามอยู่เสมอ",
  "เกรดไม่ใช่ทุกอย่าง แต่ฉันไม่รู้จะพูดยังไง",
  "ฉันแค่อยากให้พ่อถามว่า 'วันนี้เป็นยังไงบ้าง?'",
  "กลัวทำให้ครอบครัวผิดหวัง จนลืมดูแลตัวเอง",
];

export function Hero() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setQuoteIdx((i) => (i + 1) % QUOTES.length);
        setVisible(true);
      }, 400);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="hero"
      style={{
        minHeight: "100vh",
        background: "var(--us-dark)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Nav */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 40px",
          height: 60,
          background: "var(--us-blue)",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-sarabun), sans-serif",
            fontSize: 15,
            fontWeight: 700,
            color: "#f9f4eb",
            letterSpacing: 0.3,
          }}
        >
          Unspoken Screen
        </span>
        <div style={{ display: "flex", gap: 28 }}>
          {[
            ["ปัญหา", "#problem"],
            ["เสียงจากใจ", "#voices"],
            ["ข้อมูล", "#data"],
            ["กำแพงนิรนาม", "/wall"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              style={{
                fontFamily: "var(--font-sarabun), sans-serif",
                fontSize: 13,
                color: "rgba(249,244,235,0.8)",
                textDecoration: "none",
                transition: "color 0.15s",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Hero body */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px 40px 60px",
          maxWidth: 760,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-patrick-hand), cursive",
            fontSize: 11,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "var(--us-orange)",
            marginBottom: 16,
          }}
        >
          หน้าจอที่อยากให้ครอบครัวเห็น
        </div>

        <h1
          style={{
            fontSize: "clamp(40px, 7vw, 72px)",
            fontWeight: 700,
            color: "#f9f4eb",
            lineHeight: 1.12,
            marginBottom: 20,
            fontFamily: "var(--font-sarabun), sans-serif",
          }}
        >
          The<br />Unspoken<br />Screen
        </h1>

        {/* Rotating quote */}
        <div
          style={{
            fontFamily: "var(--font-lora), Georgia, serif",
            fontStyle: "italic",
            fontSize: "clamp(14px, 2vw, 17px)",
            color: "rgba(249,244,235,0.7)",
            lineHeight: 1.8,
            marginBottom: 36,
            minHeight: 52,
            borderLeft: "3px solid var(--us-burg)",
            paddingLeft: 18,
            transition: "opacity 0.4s",
            opacity: visible ? 1 : 0,
          }}
        >
          &ldquo;{QUOTES[quoteIdx]}&rdquo;
        </div>

        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <Link
            href="#problem"
            style={{
              background: "var(--us-orange)",
              color: "#fff",
              borderRadius: 28,
              padding: "13px 30px",
              fontFamily: "var(--font-sarabun), sans-serif",
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              transition: "background 0.2s",
            }}
          >
            สำรวจเว็บไซต์
          </Link>
          <Link
            href="/wall"
            style={{
              background: "transparent",
              color: "rgba(249,244,235,0.85)",
              border: "2px solid rgba(249,244,235,0.4)",
              borderRadius: 28,
              padding: "13px 26px",
              fontFamily: "var(--font-sarabun), sans-serif",
              fontSize: 15,
              textDecoration: "none",
              transition: "all 0.2s",
            }}
          >
            กำแพงนิรนาม →
          </Link>
        </div>
      </div>

      {/* Wave divider */}
      <svg
        viewBox="0 0 1440 60"
        style={{ display: "block", width: "100%", marginTop: "auto" }}
        preserveAspectRatio="none"
      >
        <path
          d="M0 60 Q360 0 720 30 Q1080 60 1440 10 L1440 60 Z"
          fill="var(--us-bg)"
        />
      </svg>

      {/* Scroll hint */}
      <div
        style={{
          position: "absolute",
          bottom: 72,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 4,
          opacity: 0.35,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-patrick-hand), cursive",
            fontSize: 10,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#f9f4eb",
          }}
        >
          scroll
        </span>
        <ChevronDown size={18} color="#f9f4eb" strokeWidth={1.5} />
      </div>
    </section>
  );
}
