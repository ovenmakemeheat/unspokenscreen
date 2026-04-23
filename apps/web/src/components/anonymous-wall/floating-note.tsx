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
};

type Props = NoteData & {
  resolvedAvatar: AvatarPreset | undefined;
  zIndex?: number;
  isOwner?: boolean;
  isNew?: boolean;
  onExpand: () => void;
  onHeart: () => void;
  onDelete?: () => void;
  onEdit?: (text: string, tag: string) => void;
};

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
  resolvedAvatar,
  zIndex = 2,
  isOwner = false,
  isNew = false,
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

  return (
    <div
      className={editing ? "" : !appeared ? "us-note-appear" : floatClass}
      onClick={editing ? undefined : onExpand}
      style={{
        position: "absolute",
        left: x,
        top: y,
        ["--note-r" as string]: `${rotation}deg`,
        width,
        background: color,
        color: textColor,
        borderRadius: 4,
        padding: "14px 12px 10px",
        boxShadow: isOwner
          ? "0 0 0 2px var(--us-orange), 0 4px 14px rgba(0,0,0,0.2)"
          : "0 4px 14px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)",
        cursor: editing ? "default" : "pointer",
        animationDelay: delay,
        zIndex,
        userSelect: "none",
      }}
    >
      {/* Pin */}
      <div
        style={{
          position: "absolute",
          top: -8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: isOwner ? "var(--us-orange)" : "rgba(107,96,85,0.55)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      />

      {/* Owner controls */}
      {isOwner && !editing && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            display: "flex",
            gap: 2,
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setEditing(true); }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 2,
              color: isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.4)",
              display: "flex",
            }}
            title="แก้ไข"
          >
            <Pencil size={10} strokeWidth={2} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setConfirmDelete(true); }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 2,
              color: "#e53e3e",
              display: "flex",
            }}
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
          style={{
            position: "absolute",
            top: 20,
            right: 4,
            background: "#1e1e1e",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 8,
            padding: "8px 10px",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            gap: 8,
            boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
            minWidth: 110,
          }}
        >
          <span style={{ fontSize: 10, color: "#f9f4eb", whiteSpace: "nowrap", fontFamily: "'Sarabun', sans-serif" }}>
            ลบโน้ตนี้?
          </span>
          <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); }}
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "none",
                borderRadius: 4,
                width: 24,
                height: 24,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#f9f4eb",
              }}
              title="ยกเลิก"
            >
              <X size={12} strokeWidth={2.5} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); setConfirmDelete(false); onDelete?.(); }}
              style={{
                background: "#e53e3e",
                border: "none",
                borderRadius: 4,
                width: 24,
                height: 24,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
              }}
              title="ยืนยันลบ"
            >
              <Check size={12} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      )}

      {/* Tag + avatar row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 5,
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-patrick-hand), 'Patrick Hand', cursive",
            fontSize: 8,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            opacity: 0.55,
          }}
        >
          {tag}
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
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.15)",
              border: `1px solid ${borderColor}`,
              borderRadius: 3,
              padding: "4px 6px",
              fontFamily: "var(--font-lora), 'Lora', Georgia, serif",
              fontStyle: "italic",
              fontSize: 12,
              lineHeight: 1.6,
              color: textColor,
              resize: "none",
              outline: "none",
            }}
          />
          <div style={{ display: "flex", gap: 4, marginTop: 4, justifyContent: "flex-end" }}>
            <button
              onClick={(e) => { e.stopPropagation(); setEditing(false); setEditText(text); }}
              style={{ background: "none", border: `1px solid ${borderColor}`, borderRadius: 3, padding: "2px 6px", fontSize: 9, cursor: "pointer", color: textColor }}
            >
              ยกเลิก
            </button>
            <button
              onClick={submitEdit}
              style={{ background: "var(--us-orange)", border: "none", borderRadius: 3, padding: "2px 6px", fontSize: 9, cursor: "pointer", color: "#fff" }}
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
          style={{
            width: "100%",
            borderRadius: 3,
            display: "block",
            pointerEvents: "none",
          }}
        />
      ) : (
        <div
          style={{
            fontFamily: "var(--font-lora), 'Lora', Georgia, serif",
            fontStyle: "italic",
            fontSize: 12,
            lineHeight: 1.6,
          }}
        >
          &ldquo;{text}&rdquo;
        </div>
      )}

      {/* Interaction row */}
      {!editing && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 10,
            paddingTop: 7,
            borderTop: `1px solid ${borderColor}`,
          }}
        >
          <button
            onClick={doHeart}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 3,
              padding: "2px 4px",
              borderRadius: 4,
              color: "inherit",
            }}
          >
            <span
              className={heartAnim ? "us-heart-pop" : ""}
              style={{ display: "inline-flex" }}
            >
              <Heart
                size={13}
                fill={hearted ? heartColor : "none"}
                color={heartColor}
                strokeWidth={2}
                style={{ transition: "all 0.2s" }}
              />
            </span>
            <span
              style={{
                fontFamily: "var(--font-patrick-hand), 'Patrick Hand', cursive",
                fontSize: 10,
                opacity: 0.6,
              }}
            >
              {hearts}
            </span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
            style={{
              background: "none",
              border: "1px solid currentColor",
              borderRadius: 10,
              padding: "2px 7px",
              fontFamily: "var(--font-patrick-hand), 'Patrick Hand', cursive",
              fontSize: 9,
              opacity: 0.5,
              cursor: "pointer",
              color: "inherit",
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <MessageCircle size={9} strokeWidth={2} />
            {replies.length > 0 ? replies.length : "ตอบกลับ"}
          </button>
        </div>
      )}
    </div>
  );
}
