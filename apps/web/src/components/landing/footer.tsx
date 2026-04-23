import Link from "next/link";

export function Footer() {
  return (
    <footer
      style={{
        background: "var(--us-dark)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "40px 40px 32px",
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-lora), Georgia, serif",
            fontStyle: "italic",
            fontSize: 16,
            color: "rgba(249,244,235,0.65)",
            lineHeight: 1.7,
          }}
        >
          &ldquo;เพราะหน้าจอนี้... คือพื้นที่ที่ความในใจได้ส่งถึงกัน&rdquo;
        </div>

        <div
          style={{
            fontFamily: "var(--font-sarabun), sans-serif",
            fontSize: 12,
            color: "rgba(249,244,235,0.25)",
          }}
        >
          The Unspoken Screen · หน้าจอที่อยากให้ครอบครัวได้ยิน
        </div>

        <div style={{ display: "flex", gap: 24 }}>
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
                fontSize: 12,
                color: "rgba(249,244,235,0.4)",
                textDecoration: "none",
              }}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
