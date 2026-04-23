"use client";

import { useState, useEffect } from "react";
import { Heart, MessageCircle, Trash2, Pencil, X, Check } from "lucide-react";
import type { AvatarPreset } from "./avatar-store";
import { AvatarFace } from "./avatar";

export type NoteData = {
  id: number;
  text: string;
  tag: string;
  hearts: number;
  replies: { id: number; from: string; text: string; avatarId: string | null }[];
  x: number;
  y: number;
  rotation: number;
  color: string;
  textColor?: string;
  floatClass: string;
  width: number;
  delay: string;
  avatarId: string | null;
  imageData: string | null;
  userId: number | null;
  displayName: string | null;
};

type Props = NoteData & {
  resolvedAvatar: AvatarPreset | undefined;
  zIndex?: number;
  isOwner?: boolean;
  isNew?: boolean;
  fetchIndex?: number; // position in initial load batch → stagger delay
  onExpand: () => void;
  onHeart: () => void;
  onDelete?: () => void;
  onEdit?: (text: string, tag: string) => void;
};

const ANON_LABEL = "ไม่ระบุตัวตน";

export function FloatingNote({
  text,
  tag,
  hearts: initHearts,
  replies,
  x,
  y,
  rotation,
  color,
  textColor = "#1a1a1a",
  floatClass,
  width,
  delay,
  imageData,
  displayName,
  resolvedAvatar,
  zIndex = 2,
  isOwner = false,
  isNew = false,
  fetchIndex,
  onExpand,
  onHeart,
  onDelete,
  onEdit,
}: Props) {
  const [hearts, setHearts] = useState(initHearts);
  const [hearted, setHearted] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [appeared, setAppeared] = useState(!isNew);

  useEffect(() => {
    if (!isNew) return;
    const t = setTimeout(() => setAppeared(true), 520);
    return () => clearTimeout(t);
  }, [isNew]);

  const doHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hearted) {
      setHearts((h) => h + 1);
      setHearted(true);
      setHeartAnim(true);
      onHeart();
      setTimeout(() => setHeartAnim(false), 400);
    }
  };

  const isLight = textColor === "#1a1a1a";
  const borderColor = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)";
  const heartColor = hearted
    ? "#e53e3e"
    : isLight
    ? "rgba(0,0,0,0.35)"
    : "rgba(255,255,255,0.45)";

  const submitEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editText.trim() && onEdit) {
      onEdit(editText.trim(), tag);
    }
    setEditing(false);
  };

  const isFetchEntry = fetchIndex !== undefined;
  const fetchDelay = isFetchEntry ? `${Math.min(fetchIndex * 55, 900)}ms` : "0ms";
  const animClass = editing
    ? ""
    : isFetchEntry
    ? `us-note-fetch ${floatClass}`
    : !appeared
    ? "us-note-appear"
    : floatClass;

  return (
    <div
      className={`${animClass} rounded-sm px-3 pt-3.5 pb-2.5 select-none ${editing ? "cursor-default" : "cursor-pointer"}`}
      onClick={editing ? undefined : onExpand}
      style={{
        position: "absolute",
        left: x,
        top: y,
        ["--note-r" as string]: `${rotation}deg`,
        width,
        background: color,
        color: textColor,
        animationDelay: isFetchEntry ? fetchDelay : delay,
        zIndex,
        boxShadow: isOwner
          ? "0 0 0 2px var(--us-orange), 0 4px 14px rgba(0,0,0,0.2)"
          : "0 4px 14px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)",
      }}
    >
      {/* Pin */}
      <div
        className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full"
        style={{
          background: isOwner ? "var(--us-orange)" : "rgba(107,96,85,0.55)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      />

      {/* Owner controls */}
      {isOwner && !editing && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-1 right-1 flex gap-0.5"
        >
          <button
            onClick={(e) => { e.stopPropagation(); setEditing(true); }}
            className="bg-transparent border-none cursor-pointer p-0.5 flex opacity-35 hover:opacity-70 transition-opacity"
            title="แก้ไข"
          >
            <Pencil size={10} strokeWidth={2} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
            className="bg-transparent border-none cursor-pointer p-0.5 flex text-red-500"
            title="ลบ"
          >
            <Trash2 size={10} strokeWidth={2} />
          </button>
        </div>
      )}

      {/* Delete confirm popover */}
      {confirmDelete && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute top-5 right-1 bg-[#1e1e1e] border border-white/12 rounded-lg px-2.5 py-2 z-10 flex flex-col gap-2 shadow-lg min-w-[110px]"
        >
          <span className="text-[10px] text-us-cream whitespace-nowrap">
            ลบโน้ตนี้?
          </span>
          <div className="flex gap-1.5 justify-end">
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
              className="bg-white/10 border-none rounded w-6 h-6 cursor-pointer flex items-center justify-center text-us-cream"
              title="ยกเลิก"
            >
              <X size={12} strokeWidth={2.5} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); onDelete?.(); }}
              className="bg-red-500 border-none rounded w-6 h-6 cursor-pointer flex items-center justify-center text-white"
              title="ยืนยันลบ"
            >
              <Check size={12} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* Tag + avatar row */}
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex flex-col gap-[1px]">
          <div className="font-[family-name:var(--font-patrick-hand)] text-[8px] tracking-[1.5px] uppercase opacity-55">
            {tag}
          </div>
          <div className="font-[family-name:var(--font-patrick-hand)] text-[8px] opacity-40">
            {displayName ?? ANON_LABEL}
          </div>
        </div>
        {resolvedAvatar && <AvatarFace preset={resolvedAvatar} size={20} />}
      </div>

      {/* Text / Image / Edit area */}
      {editing ? (
        <div onClick={(e) => e.stopPropagation()}>
          <textarea
            autoFocus
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submitEdit(e as unknown as React.MouseEvent); }
              if (e.key === "Escape") { setEditing(false); setEditText(text); }
            }}
            rows={3}
            className="w-full rounded-sm px-1.5 py-1 font-[family-name:var(--font-lora)] italic text-[12px] leading-relaxed resize-none outline-none"
            style={{
              background: "rgba(255,255,255,0.15)",
              border: `1px solid ${borderColor}`,
              color: textColor,
            }}
          />
          <div className="flex gap-1 mt-1 justify-end">
            <button
              onClick={(e) => { e.stopPropagation(); setEditing(false); setEditText(text); }}
              className="bg-transparent rounded-sm px-1.5 py-0.5 text-[9px] cursor-pointer"
              style={{ border: `1px solid ${borderColor}`, color: textColor }}
            >
              ยกเลิก
            </button>
            <button
              onClick={submitEdit}
              className="bg-us-orange border-none rounded-sm px-1.5 py-0.5 text-[9px] cursor-pointer text-white"
            >
              บันทึก
            </button>
          </div>
        </div>
      ) : imageData ? (
        <img
          src={imageData}
          alt="handwritten note"
          draggable={false}
          className="w-full rounded-sm block pointer-events-none"
        />
      ) : (
        <div className="font-[family-name:var(--font-lora)] italic text-[12px] leading-relaxed">
          &ldquo;{text}&rdquo;
        </div>
      )}

      {/* Interaction row */}
      {!editing && (
        <div
          className="flex items-center justify-between mt-2.5 pt-[7px]"
          style={{ borderTop: `1px solid ${borderColor}` }}
        >
          <button
            onClick={doHeart}
            className="bg-transparent border-none cursor-pointer flex items-center gap-[3px] px-1 py-0.5 rounded"
          >
            <span className={heartAnim ? "us-heart-pop" : ""} style={{ display: "inline-flex" }}>
              <Heart
                size={13}
                fill={hearted ? heartColor : "none"}
                color={heartColor}
                strokeWidth={2}
                style={{ transition: "all 0.2s" }}
              />
            </span>
            <span className="font-[family-name:var(--font-patrick-hand)] text-[10px] opacity-60">
              {hearts}
            </span>
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onExpand(); }}
            className="bg-transparent border border-current rounded-[10px] px-[7px] py-0.5 font-[family-name:var(--font-patrick-hand)] text-[9px] opacity-50 cursor-pointer flex items-center gap-[3px]"
          >
            <MessageCircle size={9} strokeWidth={2} />
            {replies.length > 0 ? replies.length : "ตอบกลับ"}
          </button>
        </div>
      )}
    </div>
  );
}
