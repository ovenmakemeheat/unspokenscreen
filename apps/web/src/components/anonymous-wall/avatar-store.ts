export type AvatarPreset = {
  id: string;
  label: string;
  bg: string;
  fg: string;
};

export const AVATAR_PRESETS: AvatarPreset[] = [
  { id: "a1", label: "น้องฟ้า",     bg: "#bde3f5", fg: "#2f597a" },
  { id: "a2", label: "น้องแดง",     bg: "#f5bdbd", fg: "#562634" },
  { id: "a3", label: "น้องเหลือง",  bg: "#fef4c0", fg: "#c07c00" },
  { id: "a4", label: "น้องเขียว",   bg: "#d4edda", fg: "#2d6a4f" },
  { id: "a5", label: "น้องม่วง",    bg: "#e6d5f5", fg: "#6a3d9a" },
  { id: "a6", label: "น้องส้ม",     bg: "#ffe5cc", fg: "#ff751f" },
  { id: "a7", label: "น้องกรม",     bg: "#c8d8e8", fg: "#1e3a4f" },
  { id: "a8", label: "น้องครีม",    bg: "#f0e9d8", fg: "#6b6055" },
];
