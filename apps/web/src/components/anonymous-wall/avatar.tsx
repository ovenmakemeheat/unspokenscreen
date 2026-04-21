"use client";

import type { AvatarPreset } from "./avatar-store";

type AvatarFaceProps = {
  preset: AvatarPreset;
  size?: number;
};

// Simple SVG face — consistent style across all presets, differentiated by color
export function AvatarFace({ preset, size = 36 }: AvatarFaceProps) {
  const r = size / 2;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, borderRadius: "50%", display: "block" }}
    >
      {/* Face circle */}
      <circle cx="18" cy="18" r="18" fill={preset.bg} />

      {/* Hair band / top shape */}
      <ellipse cx="18" cy="8" rx="9" ry="6" fill={preset.fg} opacity="0.85" />
      <rect x="9" y="8" width="18" height="5" fill={preset.bg} />

      {/* Eyes */}
      <circle cx="13.5" cy="17" r="1.8" fill={preset.fg} />
      <circle cx="22.5" cy="17" r="1.8" fill={preset.fg} />

      {/* Smile */}
      <path
        d="M13 22 Q18 26.5 23 22"
        stroke={preset.fg}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />

      {/* Cheeks */}
      <circle cx="11" cy="21" r="2.5" fill={preset.fg} opacity="0.18" />
      <circle cx="25" cy="21" r="2.5" fill={preset.fg} opacity="0.18" />
    </svg>
  );
}

type AvatarPickerProps = {
  presets: AvatarPreset[];
  selected: AvatarPreset | null;
  onSelect: (p: AvatarPreset) => void;
  onClose: () => void;
};

export function AvatarPicker({
  presets,
  selected,
  onSelect,
  onClose,
}: AvatarPickerProps) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(30,58,79,0.55)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--us-bg)",
          borderRadius: 12,
          padding: "24px 24px 20px",
          width: 340,
          boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
        }}
      >
        <div
          style={{
            fontFamily: "'Sarabun', sans-serif",
            fontSize: 15,
            fontWeight: 700,
            color: "var(--us-dark)",
            marginBottom: 4,
          }}
        >
          เลือกอวตารของคุณ
        </div>
        <div
          style={{
            fontFamily: "'Sarabun', sans-serif",
            fontSize: 12,
            color: "var(--us-muted)",
            marginBottom: 18,
          }}
        >
          อวตารจะแสดงบนโน้ตที่คุณส่ง (ยังไม่ระบุตัวตน)
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 12,
          }}
        >
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              style={{
                background: "none",
                border: `2.5px solid ${selected?.id === p.id ? "var(--us-orange)" : "transparent"}`,
                borderRadius: 10,
                padding: 6,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 5,
                transition: "border-color 0.15s",
                outline: "none",
              }}
            >
              <AvatarFace preset={p} size={48} />
              <span
                style={{
                  fontFamily: "'Sarabun', sans-serif",
                  fontSize: 10,
                  color: "var(--us-muted)",
                  whiteSpace: "nowrap",
                }}
              >
                {p.label}
              </span>
            </button>
          ))}
        </div>

        <div
          style={{
            marginTop: 18,
            display: "flex",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "1px solid var(--us-muted)",
              borderRadius: 8,
              padding: "7px 16px",
              fontFamily: "'Sarabun', sans-serif",
              fontSize: 12,
              color: "var(--us-muted)",
              cursor: "pointer",
            }}
          >
            ยกเลิก
          </button>
          <button
            onClick={onClose}
            disabled={!selected}
            style={{
              background: selected ? "var(--us-orange)" : "#ccc",
              border: "none",
              borderRadius: 8,
              padding: "7px 18px",
              fontFamily: "'Sarabun', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              cursor: selected ? "pointer" : "not-allowed",
            }}
          >
            เลือก
          </button>
        </div>
      </div>
    </div>
  );
}
