"use client";

import Link from "next/link";
import { MessageCircleHeart, BookOpen, TrendingUp } from "lucide-react";

const SOLUTIONS = [
  {
    icon: MessageCircleHeart,
    title: "สร้างพื้นที่สนทนาที่ไร้เงื่อนไข",
    subtitle: "Unconditional Dialogue",
    body: "เว็บไซต์นี้คือจุดเริ่มต้นให้ครอบครัวกล้าคุยกันโดยไม่มีเรื่อง \"เกรด\" หรือ \"ความสำเร็จ\" มาเป็นกำแพงกั้น",
    accentClass: "border-t-us-blue",
    iconColor: "var(--us-blue)",
  },
  {
    icon: TrendingUp,
    title: "นิยามใหม่ของความมั่นคง",
    subtitle: "Redefining Security",
    body: "สายงานคอมพิวเตอร์มีเส้นทางที่หลากหลาย ความสุขในสิ่งที่ทำคือรากฐานของความมั่นคงในระยะยาวที่แท้จริง",
    accentClass: "border-t-us-orange",
    iconColor: "var(--us-orange)",
  },
  {
    icon: BookOpen,
    title: "การล้มเหลวคือเรื่องปกติ",
    subtitle: "Normalizing Failure",
    body: "ส่งเสริมค่านิยมว่า \"การสะดุดหรือล้มเหลวเป็นเรื่องปกติ\" เพื่อลดแรงกดดันมหาศาลที่แบกไว้จากความคาดหวังของสังคม",
    accentClass: "border-t-us-burg",
    iconColor: "var(--us-burg)",
  },
];

export function SolutionsSection() {
  return (
    <section id="solutions" className="bg-us-dark py-20 px-10">
      <div className="max-w-[960px] mx-auto">
        <p className="text-[11px] tracking-[3px] uppercase text-us-cream/35 mb-3 font-semibold">
          แนวทางการแก้ไขปัญหา
        </p>

        <h2 className="text-[clamp(24px,3.5vw,38px)] font-bold text-us-cream mb-12">
          เราต้องการสะพาน
          <br />
          <span className="text-us-orange">ไม่ใช่กำแพง</span>
        </h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-6 mb-14">
          {SOLUTIONS.map((s) => (
            <div
              key={s.title}
              className={`bg-white/[0.04] border border-white/[0.08] rounded-xl px-6 py-7 border-t-[3px] ${s.accentClass}`}
            >
              <s.icon size={28} color={s.iconColor} strokeWidth={1.5} className="mb-4" />
              <p className="text-[10px] tracking-[2px] uppercase text-us-cream/35 mb-1.5 font-semibold">
                {s.subtitle}
              </p>
              <p className="text-[16px] font-bold text-us-cream mb-2.5 leading-snug">
                {s.title}
              </p>
              <p className="text-[14px] text-us-cream/60 leading-[1.75]">
                {s.body}
              </p>
            </div>
          ))}
        </div>

        {/* CTA block */}
        <div className="bg-us-orange/[0.12] border border-us-orange/30 rounded-xl px-9 py-8 flex items-center justify-between flex-wrap gap-5">
          <div>
            <p className="text-[18px] font-bold text-us-cream mb-1.5">พร้อมแล้วไหม?</p>
            <p className="text-[14px] text-us-cream/60 italic">
              เริ่มต้นบทสนทนาที่ยังค้างอยู่ในใจ — ที่กำแพงนิรนาม
            </p>
          </div>
          <Link
            href="/wall"
            className="bg-us-orange text-white rounded-full px-7 py-3 text-[14px] font-bold no-underline whitespace-nowrap hover:bg-orange-500 transition-colors duration-200"
          >
            ไปที่กำแพงนิรนาม →
          </Link>
        </div>
      </div>
    </section>
  );
}
