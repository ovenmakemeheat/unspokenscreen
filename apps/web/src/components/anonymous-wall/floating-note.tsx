"use client";

import { useState } from "react";

export type NoteData = {
  id: number;
  text: string;
  tag: string;
  hearts: number;
  replies: { from: string; text: string }[];
  x: number;
  y: number;
  rotation: number;
  color: string;
  textColor?: string;
  floatClass: "us-float-a" | "us-float-b" | "us-float-c";
  width: number;
  delay: string;
};

type Props = NoteData & {
  onExpand: () => void;
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
  onExpand,
}: Props) {
  const [hearts, setHearts] = useState(initHearts);
  const [hearted, setHearted] = useState(false);
  const [heartAnim, setHeartAnim] = useState(false);

  const doHeart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hearted) {
      setHearts((h) => h + 1);
      setHearted(true);
      setHeartAnim(true);
      setTimeout(() => setHeartAnim(false), 400);
    }
  };

  const borderColor =
    textColor === "#f9f4eb"
      ? "rgba(255,255,255,0.12)"
      : "rgba(0,0,0,0.08)";

  return (
    <div
      className={floatClass}
      onClick={onExpand}
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
        boxShadow:
          "0 4px 14px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)",
        cursor: "pointer",
        animationDelay: delay,
        zIndex: 2,
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
          background: "var(--us-orange)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        }}
      />

      {/* Tag */}
      <div
        style={{
          fontFamily: "var(--font-patrick-hand), 'Patrick Hand', cursive",
          fontSize: 8,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          opacity: 0.55,
          marginBottom: 5,
        }}
      >
        {tag}
      </div>

      {/* Text */}
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

      {/* Interaction row */}
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
            style={{
              fontSize: 14,
              display: "inline-block",
              filter: hearted ? "none" : "grayscale(1)",
              transition: "filter 0.2s",
            }}
          >
            {hearted ? "❤️" : "🤍"}
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
            padding: "1px 7px",
            fontFamily: "var(--font-patrick-hand), 'Patrick Hand', cursive",
            fontSize: 9,
            opacity: 0.5,
            cursor: "pointer",
            color: "inherit",
          }}
        >
          {replies.length > 0 ? `💬 ${replies.length}` : "ตอบกลับ"}
        </button>
      </div>
    </div>
  );
}
