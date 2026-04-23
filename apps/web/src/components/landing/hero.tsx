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
    <section id="hero" className="min-h-screen bg-us-dark flex flex-col relative overflow-hidden">
      {/* Nav */}
      <nav className="flex items-center justify-between px-10 h-15 bg-us-blue shrink-0">
        <span className="text-us-cream text-[15px] font-bold tracking-[0.3px]">
          Unspoken Screen
        </span>
        <div className="flex gap-7">
          {[
            ["ปัญหา", "#problem"],
            ["เสียงจากใจ", "#voices"],
            ["ข้อมูล", "#data"],
            ["กำแพงนิรนาม", "/wall"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href as string}
              className="text-us-cream/80 text-[13px] no-underline hover:text-us-cream transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Hero body */}
      <div className="flex-1 flex flex-col items-start justify-center px-10 pt-20 pb-16 max-w-190 mx-auto w-full">
        {/* Eyebrow */}
        <p className="text-us-orange text-[11px] tracking-[4px] uppercase mb-4 font-semibold">
          หน้าจอที่อยากให้ครอบครัวเห็น
        </p>

        <h1 className="text-[clamp(40px,7vw,72px)] font-bold text-us-cream leading-[1.12] mb-5">
          The
          <br />
          Unspoken
          <br />
          Screen
        </h1>

        {/* Rotating quote */}
        <div
          className="text-us-cream/70 text-[clamp(14px,2vw,17px)] leading-[1.8] mb-9 min-h-13 italic border-l-2 border-us-orange/50 pl-4 transition-opacity duration-300"
          style={{ opacity: visible ? 1 : 0 }}
        >
          &ldquo;{QUOTES[quoteIdx]}&rdquo;
        </div>

        <div className="flex gap-3 flex-wrap">
          <Link
            href="#problem"
            className="bg-us-orange text-white rounded-full px-8 py-3 text-[15px] font-bold no-underline hover:bg-orange-500 transition-colors duration-200"
          >
            สำรวจเว็บไซต์
          </Link>
          <Link
            href={"/wall" as string}
            className="bg-transparent text-us-cream/85 border-2 border-us-cream/40 rounded-full px-7 py-3 text-[15px] no-underline hover:border-us-cream/70 hover:text-us-cream transition-all duration-200"
          >
            กำแพงนิรนาม →
          </Link>
        </div>
      </div>

      {/* Wave divider */}
      <svg viewBox="0 0 1440 60" className="block w-full mt-auto" preserveAspectRatio="none">
        <path d="M0 60 Q360 0 720 30 Q1080 60 1440 10 L1440 60 Z" fill="var(--us-bg)" />
      </svg>

      {/* Scroll hint */}
      <div className="absolute bottom-18 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-35">
        <span className="text-us-cream text-[10px] tracking-[3px] uppercase">scroll</span>
        <ChevronDown size={18} color="var(--us-cream, #f9f4eb)" strokeWidth={1.5} />
      </div>
    </section>
  );
}
