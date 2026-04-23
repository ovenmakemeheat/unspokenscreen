"use client";

import type { AvatarPreset } from "./avatar-store";

type AvatarFaceProps = {
  preset: AvatarPreset;
  size?: number;
};

export function AvatarFace({ preset, size = 36 }: AvatarFaceProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 rounded-full block"
    >
      <circle cx="18" cy="18" r="18" fill={preset.bg} />
      <ellipse cx="18" cy="8" rx="9" ry="6" fill={preset.fg} opacity="0.85" />
      <rect x="9" y="8" width="18" height="5" fill={preset.bg} />
      <circle cx="13.5" cy="17" r="1.8" fill={preset.fg} />
      <circle cx="22.5" cy="17" r="1.8" fill={preset.fg} />
      <path
        d="M13 22 Q18 26.5 23 22"
        stroke={preset.fg}
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />
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

export function AvatarPicker({ presets, selected, onSelect, onClose }: AvatarPickerProps) {
  return (
    /* Backdrop */
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm"
      style={{ background: "rgba(30,58,79,0.55)" }}
    >
      {/* Panel */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-us-bg rounded-xl px-6 pt-6 pb-5 w-[min(340px,92vw)] shadow-2xl"
      >
        <p className="text-[15px] font-bold text-us-dark mb-1">เลือกอวตารของคุณ</p>
        <p className="text-[12px] text-us-muted mb-[18px]">
          อวตารจะแสดงบนโน้ตที่คุณส่ง (ยังไม่ระบุตัวตน)
        </p>

        <div className="grid grid-cols-4 gap-3">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p)}
              className="bg-transparent rounded-[10px] p-1.5 cursor-pointer flex flex-col items-center gap-1.5 outline-none transition-[border-color] duration-150"
              style={{
                border: `2.5px solid ${selected?.id === p.id ? "var(--us-orange)" : "transparent"}`,
              }}
            >
              <AvatarFace preset={p} size={48} />
              <span className="text-[10px] text-us-muted whitespace-nowrap">{p.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-[18px] flex justify-end gap-2">
          <button
            onClick={onClose}
            className="bg-transparent border border-us-muted rounded-lg px-4 py-[7px] text-[12px] text-us-muted cursor-pointer hover:bg-black/5 transition-colors"
          >
            ยกเลิก
          </button>
          <button
            onClick={onClose}
            disabled={!selected}
            className={`border-none rounded-lg px-[18px] py-[7px] text-[12px] font-bold text-white transition-colors ${
              selected ? "bg-us-orange cursor-pointer hover:bg-orange-500" : "bg-[#ccc] cursor-not-allowed"
            }`}
          >
            เลือก
          </button>
        </div>
      </div>
    </div>
  );
}
