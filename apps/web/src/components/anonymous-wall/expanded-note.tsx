"use client";

import { useState } from "react";
import { Heart, Send, X, Users } from "lucide-react";
import type { NoteData } from "./floating-note";
import type { AvatarPreset } from "./avatar-store";
import { AVATAR_PRESETS } from "./avatar-store";
import { AvatarFace } from "./avatar";

type Reply = NoteData["replies"][number];

type Props = {
  note: NoteData;
  resolvedAvatar: AvatarPreset | undefined;
  replyAvatar?: AvatarPreset | null;
  replyDisplayName?: string | null;
  onClose: () => void;
  onHeart: () => void;
  onReply: (text: string, from: string, avatarId: string | null) => Promise<Reply>;
};

const ANON_LABEL = "ไม่ระบุตัวตน";

export function ExpandedNote({ note, resolvedAvatar, replyAvatar, replyDisplayName, onClose, onHeart, onReply }: Props) {
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState(note.replies);
  const [hearts, setHearts] = useState(note.hearts);
  const [hearted, setHearted] = useState(false);
  const [sending, setSending] = useState(false);

  const submit = async () => {
    if (!reply.trim() || sending) return;
    setSending(true);
    try {
      const newReply = await onReply(reply.trim(), replyDisplayName ?? "ครอบครัว", replyAvatar?.id ?? null);
      setReplies((r) => [...r, newReply]);
      setReply("");
    } finally {
      setSending(false);
    }
  };

  const isLight = (note.textColor ?? "#1a1a1a") === "#1a1a1a";
  const heartColor = hearted ? "#e53e3e" : isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.5)";

  return (
    /* Backdrop */
    <div
      onClick={onClose}
      className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm"
      style={{ background: "rgba(30,58,79,0.6)" }}
    >
      {/* Card */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-[min(310px,92vw)] rounded-lg px-[18px] py-5 shadow-2xl max-h-[80vh] overflow-y-auto"
        style={{ background: note.color, color: note.textColor ?? "#1a1a1a" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-2.5 right-2.5 bg-transparent border-none cursor-pointer p-1 flex opacity-40 hover:opacity-70 transition-opacity"
        >
          <X size={16} strokeWidth={2} />
        </button>

        {/* Tag + author avatar */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col gap-[2px]">
            <div className="font-[family-name:var(--font-patrick-hand)] text-[9px] tracking-[1.5px] uppercase opacity-40">
              {note.tag}
            </div>
            <div className="font-[family-name:var(--font-patrick-hand)] text-[9px] opacity-35">
              {note.displayName ?? ANON_LABEL}
            </div>
          </div>
          {resolvedAvatar && <AvatarFace preset={resolvedAvatar} size={28} />}
        </div>

        {/* Full text */}
        <div className="font-[family-name:var(--font-lora)] italic text-[15px] leading-[1.8] mb-3">
          &ldquo;{note.text}&rdquo;
        </div>

        {/* Heart row */}
        <div className="flex items-center gap-1.5 mb-4">
          <button
            onClick={() => {
              if (!hearted) {
                setHearts((h) => h + 1);
                setHearted(true);
                onHeart();
              }
            }}
            className="bg-transparent border-none cursor-pointer flex items-center p-0"
          >
            <Heart
              size={18}
              fill={hearted ? heartColor : "none"}
              color={heartColor}
              strokeWidth={2}
              style={{ transition: "all 0.2s" }}
            />
          </button>
          <span className="text-[11px] opacity-50">
            {hearts} คนส่งกำลังใจ
          </span>
        </div>

        {/* Family replies */}
        {replies.length > 0 && (
          <div className="mb-3 flex flex-col gap-1.5">
            <div className="font-[family-name:var(--font-patrick-hand)] text-[10px] opacity-40 tracking-[1px] uppercase mb-1 flex items-center gap-1.5">
              <Users size={10} strokeWidth={2} />
              ครอบครัวตอบกลับ
            </div>
            {replies.map((r) => {
              const rAvatar = r.avatarId
                ? AVATAR_PRESETS.find((p) => p.id === r.avatarId)
                : undefined;
              return (
                <div
                  key={r.id}
                  className="bg-white/60 rounded-md px-2.5 py-2 border-l-[3px] border-us-blue"
                >
                  <div className="flex items-center gap-1.5 mb-[3px]">
                    {rAvatar ? (
                      <AvatarFace preset={rAvatar} size={16} />
                    ) : (
                      <Users size={11} color="var(--us-blue)" strokeWidth={2} />
                    )}
                    <span className="font-[family-name:var(--font-patrick-hand)] text-[9px] text-us-blue">
                      {r.from}
                    </span>
                  </div>
                  <div className="text-[12px] text-[#1a1a1a] leading-snug">
                    {r.text}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Reply input */}
        <div className="bg-white/70 rounded-md overflow-hidden border-[1.5px] border-us-blue/30">
          <div className="font-[family-name:var(--font-patrick-hand)] text-[10px] text-us-blue px-2.5 pt-1.5 pb-0.5 tracking-[0.5px]">
            {replyDisplayName ? `ส่งกำลังใจในฐานะ ${replyDisplayName}` : "ส่งกำลังใจในฐานะครอบครัว"}
          </div>
          <textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            placeholder="พิมพ์ข้อความถึงลูก..."
            className="w-full border-none bg-transparent px-2.5 pb-2 text-[12px] resize-none outline-none min-h-[52px] text-[#1a1a1a]"
          />
          <div className="px-2 pb-2 flex justify-end items-center gap-1.5">
            {replyAvatar && <AvatarFace preset={replyAvatar} size={20} />}
            <button
              onClick={submit}
              disabled={sending}
              className={`bg-us-blue text-white border-none rounded-full px-3 py-[5px] text-[11px] flex items-center gap-1.5 transition-opacity ${sending ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
            >
              ส่ง
              <Send size={11} strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
