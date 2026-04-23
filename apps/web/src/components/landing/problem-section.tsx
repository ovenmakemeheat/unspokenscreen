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
    <div ref={ref} className="bg-us-surface rounded-xl px-6 py-7 shadow-sm flex-1 min-w-40">
      <div className="text-[clamp(40px,6vw,58px)] font-bold text-us-orange leading-none">
        {count}{suffix}
      </div>
      <div className="text-[15px] font-semibold text-us-dark mt-2 leading-snug">
        {label}
      </div>
      {sub && (
        <div className="text-[12px] text-us-muted mt-1 leading-relaxed">{sub}</div>
      )}
    </div>
  );
}

export function ProblemSection() {
  return (
    <section id="problem" className="bg-us-bg py-20 px-10">
      <div className="max-w-240 mx-auto">
        <p className="text-[11px] tracking-[3px] uppercase text-us-muted mb-3 font-semibold">
          ที่มาและความสำคัญ
        </p>

        <h2 className="text-[clamp(26px,4vw,40px)] font-bold text-us-dark leading-snug mb-5 border-b-[3px] border-us-burg pb-4">
          ปัญหานี้ไม่ได้ไกลตัว
        </h2>

        <p className="text-[16px] text-us-text leading-[1.85] max-w-170 mb-14">
          ผลสำรวจจาก 15 มหาวิทยาลัยทั่วประเทศไทยเผยให้เห็นภาพที่น่ากังวล
          สาเหตุหลักของความเครียดสะสม คือ{" "}
          <strong className="text-us-burg">&ldquo;ความคาดหวังของครอบครัว&rdquo;</strong>{" "}
          ที่สร้างความขัดแย้งภายในระหว่างการทำตามใจตนเองและการทำให้คนที่รักพอใจ
        </p>

        {/* Stat cards */}
        <div className="flex gap-5 flex-wrap mb-14">
          <AnimatedStat value={30} label="มีอาการเครียดสะสมและซึมเศร้า" sub="จากนักศึกษาทั่วประเทศ" />
          <AnimatedStat value={80} label="มีความเครียดและวิตกกังวลสูง" sub="มีรากฐานจากความคาดหวังครอบครัว" />
          <AnimatedStat value={4} label="มีความคิดอยากทำร้ายตัวเองบ่อยครั้ง" sub="ตัวเลขที่ซ่อนอยู่ใต้ผลการเรียน" />
        </div>

        {/* Insight cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
          {[
            {
              title: "จากเรื่องส่วนตัว สู่โครงสร้างสังคม",
              body: "ความเครียดไม่ใช่ปัญหาของปัจเจก — มันฝังรากลึกในค่านิยมที่วัดคุณค่าความเป็นมนุษย์จากความมั่นคงทางอาชีพและเกรดเฉลี่ย",
              border: "border-l-us-blue",
            },
            {
              title: "ความกดดัน คือความกังวลที่แสดงออกมาผิดวิธี",
              body: "พ่อแม่ไม่ได้ต้องการควบคุม — พวกเขาแค่กลัวว่าลูกจะไม่มั่นคงในอนาคต เราต้องการสะพานเชื่อมความเข้าใจ ไม่ใช่กำแพงกั้น",
              border: "border-l-us-burg",
            },
          ].map((card) => (
            <div
              key={card.title}
              className={`bg-white rounded-xl px-6 py-6 border-l-4 ${card.border} shadow-sm`}
            >
              <div className="text-[15px] font-bold text-us-dark mb-2 leading-snug">
                {card.title}
              </div>
              <div className="text-[14px] text-us-muted leading-[1.75]">
                {card.body}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
