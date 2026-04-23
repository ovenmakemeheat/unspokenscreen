import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-us-dark border-t border-white/[0.06] py-10 px-10">
      <div className="max-w-[960px] mx-auto flex flex-col items-center gap-4 text-center">
        <p className="italic text-[16px] text-us-cream/65 leading-[1.7]">
          &ldquo;เพราะหน้าจอนี้... คือพื้นที่ที่ความในใจได้ส่งถึงกัน&rdquo;
        </p>

        <p className="text-[12px] text-us-cream/25">
          The Unspoken Screen · หน้าจอที่อยากให้ครอบครัวเห็น
        </p>

        <div className="flex gap-6">
          {[
            ["ปัญหา", "#problem"],
            ["เสียงจากใจ", "#voices"],
            ["ข้อมูล", "#data"],
            ["กำแพงนิรนาม", "/wall"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="text-[12px] text-us-cream/40 no-underline hover:text-us-cream/70 transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
