"use client";

import { useState } from "react";
import type { NoteData } from "./floating-note";

type Props = {
  note: NoteData;
  onClose: () => void;
};

export function ExpandedNote({ note, onClose }: Props) {
  const [reply, setReply] = useState("");
  const [replies, setReplies] = useState(note.replies);
  const [hearts, setHearts] = useState(note.hearts);
  const [hearted, setHearted] = useState(false);

  const submit = () => {
    if (reply.trim()) {
      setReplies((r) => [...r, { from: "ครอบครัว", text: reply.trim() }]);
      setReply("");
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "absolute",
        inset: 0,
        background: "rgba(30,58,79,0.6)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(3px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 300,
          background: note.color,
          color: note.textColor ?? "#1a1a1a",
          borderRadius: 8,
          padding: "20px 18px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-patrick-hand), 'Patrick Hand', cursive",
            fontSize: 16,
            opacity: 0.4,
            color: "inherit",
          }}
        >
          ✕
        </button>

        {/* Tag */}
        <div
          style={{
            fontFamily: "var(--font-patrick-hand), 'Patrick Hand', cursive",
            fontSize: 9,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            opacity: 0.4,
            marginBottom: 8,
          }}
        >
          {note.tag}
        </div>

        {/* Full text */}
        <div
          style={{
            fontFamily: "var(--font-lora), 'Lora', Georgia, serif",
            fontStyle: "italic",
            fontSize: 15,
            lineHeight: 1.8,
            marginBottom: 12,
          }}
        >
          &ldquo;{note.text}&rdquo;
        </div>

        {/* Heart row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 16,
          }}
        >
          <button
            onClick={() => {
              if (!hearted) {
                setHearts((h) => h + 1);
                setHearted(true);
              }
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: 18,
            }}
          >
            {hearted ? "❤️" : "🤍"}
          </button>
          <span
            style={{
              fontFamily: "var(--font-sarabun), 'Sarabun', sans-serif",
              fontSize: 11,
              opacity: 0.5,
            }}
          >
            {hearts} คนส่งกำลังใจ
          </span>
        </div>

        {/* Family replies */}
        {replies.length > 0 && (
          <div
            style={{
              marginBottom: 12,
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            <div
              style={{
                fontFamily: "var(--font-patrick-hand), 'Patrick Hand', cursive",
                fontSize: 10,
                opacity: 0.4,
                letterSpacing: 1,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              ครอบครัวตอบกลับ
            </div>
            {replies.map((r, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.6)",
                  borderRadius: 6,
                  padding: "8px 10px",
                  borderLeft: "3px solid var(--us-blue)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-patrick-hand), 'Patrick Hand', cursive",
                    fontSize: 9,
                    color: "var(--us-blue)",
                    marginBottom: 3,
                  }}
                >
                  👨‍👩‍👧 {r.from}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-sarabun), 'Sarabun', sans-serif",
                    fontSize: 12,
                    color: "#1a1a1a",
                    lineHeight: 1.5,
                  }}
                >
                  {r.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reply input */}
        <div
          style={{
            background: "rgba(255,255,255,0.7)",
            borderRadius: 6,
            overflow: "hidden",
            border: "1.5px solid rgba(47,89,122,0.3)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-patrick-hand), 'Patrick Hand', cursive",
              fontSize: 10,
              color: "var(--us-blue)",
              padding: "6px 10px 2px",
              letterSpacing: 0.5,
            }}
          >
            ส่งกำลังใจในฐานะครอบครัว
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
            style={{
              width: "100%",
              border: "none",
              background: "transparent",
              padding: "4px 10px 8px",
              fontFamily: "var(--font-sarabun), 'Sarabun', sans-serif",
              fontSize: 12,
              resize: "none",
              outline: "none",
              minHeight: 56,
              color: "#1a1a1a",
            }}
          />
          <div style={{ padding: "4px 8px 8px", textAlign: "right" }}>
            <button
              onClick={submit}
              style={{
                background: "var(--us-blue)",
                color: "#fff",
                border: "none",
                borderRadius: 14,
                padding: "5px 14px",
                fontFamily: "var(--font-sarabun), 'Sarabun', sans-serif",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              ส่ง →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
