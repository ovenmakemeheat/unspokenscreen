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
    <section id="voices" className="bg-us-burg py-14 sm:py-20 px-5 sm:px-10 relative overflow-hidden">
      {/* Decorative large quote mark */}
      <div className="absolute -top-5 left-8 text-[220px] text-white/4 leading-none select-none pointer-events-none font-serif">
        &ldquo;
      </div>

      <div className="max-w-190 mx-auto relative">
        <p className="text-[11px] tracking-[3px] uppercase text-us-cream/45 mb-3 font-semibold">
          เสียงสะท้อนจากพื้นที่จริง
        </p>

        <h2 className="text-[clamp(22px,3.5vw,34px)] font-bold text-us-cream mb-11">
          สิ่งที่นักศึกษาอยากบอก
          <br />
          <span className="text-us-orange">แต่ยังพูดไม่ออก</span>
        </h2>

        {/* Quote card */}
        <div className="bg-white/7 rounded-xl px-5 sm:px-10 py-6 sm:py-9 border-l-4 border-us-orange min-h-35">
          <p className="italic text-[clamp(16px,2.5vw,21px)] text-us-cream leading-[1.85] mb-5">
            &ldquo;{QUOTES[idx].text}&rdquo;
          </p>
          <p className="text-[12px] text-us-cream/45 tracking-[0.5px]">
            — {QUOTES[idx].label}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mt-6">
          {/* Dots */}
          <div className="flex gap-2">
            {QUOTES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className="h-2 rounded-full border-none cursor-pointer p-0 transition-all duration-200"
                style={{
                  width: i === idx ? 24 : 8,
                  background: i === idx ? "var(--us-orange)" : "rgba(249,244,235,0.25)",
                }}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex gap-2">
            {[
              { fn: prev, Icon: ChevronLeft },
              { fn: next, Icon: ChevronRight },
            ].map(({ fn, Icon }, i) => (
              <button
                key={i}
                onClick={fn}
                className="bg-white/10 border border-white/20 rounded-full w-9 h-9 flex items-center justify-center cursor-pointer text-us-cream hover:bg-white/20 transition-colors duration-150"
              >
                <Icon size={16} strokeWidth={2} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
