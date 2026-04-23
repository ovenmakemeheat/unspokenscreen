"use client";

import { useCountUp } from "./shared";

type StatProps = { value: number; suffix?: string; label: string; sub?: string };

function AnimatedStat({ value, suffix = "%", label, sub }: StatProps) {
  const [ref, count] = useCountUp(value, { duration: 1600, threshold: 0.4 });

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
    <section id="problem" className="bg-us-bg py-14 sm:py-20 px-5 sm:px-10">
      <div className="max-w-240 mx-auto">
        <p className="text-[11px] tracking-[3px] uppercase text-us-muted mb-3 font-semibold">
          ที่มาและความสำคัญ
        </p>

        <h2 className="text-[clamp(24px,4vw,40px)] font-bold text-us-dark leading-snug mb-5 border-b-[3px] border-us-burg pb-4">
          ปัญหานี้ไม่ได้ไกลตัว
        </h2>

        <p className="text-[15px] sm:text-[16px] text-us-text leading-[1.85] max-w-170 mb-10 sm:mb-14">
          ผลสำรวจจาก 15 มหาวิทยาลัยทั่วประเทศไทยเผยให้เห็นภาพที่น่ากังวล
          สาเหตุหลักของความเครียดสะสม คือ{" "}
          <strong className="text-us-burg">&ldquo;ความคาดหวังของครอบครัว&rdquo;</strong>{" "}
          ที่สร้างความขัดแย้งภายในระหว่างการทำตามใจตนเองและการทำให้คนที่รักพอใจ
        </p>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-10 sm:mb-14">
          <AnimatedStat value={30} label="มีอาการเครียดสะสมและซึมเศร้า" sub="จากนักศึกษาทั่วประเทศ" />
          <AnimatedStat value={80} label="มีความเครียดและวิตกกังวลสูง" sub="มีรากฐานจากความคาดหวังครอบครัว" />
          <AnimatedStat value={4} label="มีความคิดอยากทำร้ายตัวเองบ่อยครั้ง" sub="ตัวเลขที่ซ่อนอยู่ใต้ผลการเรียน" />
        </div>

        {/* Insight cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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
