"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { FloatingNote, type NoteData } from "./floating-note";
import { ExpandedNote } from "./expanded-note";

const FILTERS = ["ทั้งหมด", "ครอบครัว", "ความเครียด", "ความฝัน", "ขอบคุณ"];
const TAGS = ["ครอบครัว", "ความเครียด", "ความฝัน", "อื่นๆ"];

const INITIAL_NOTES: NoteData[] = [
  {
    id: 1,
    text: "อยากให้แม่รู้ว่าฉันพยายามอยู่เสมอ",
    tag: "ครอบครัว",
    hearts: 41,
    replies: [{ from: "คุณแม่", text: "แม่รู้และภูมิใจในตัวลูกมาก" }],
    x: 120, y: 160, rotation: -2,
    color: "#1e3a4f", textColor: "#f9f4eb",
    floatClass: "us-float-b", width: 170, delay: "0s",
  },
  {
    id: 2,
    text: "เครียดมากกับ thesis แต่ไม่อยากให้ใครเป็นห่วง",
    tag: "ความเครียด",
    hearts: 28,
    replies: [],
    x: 420, y: 90, rotation: 1.5,
    color: "#562634", textColor: "#f9f4eb",
    floatClass: "us-float-a", width: 160, delay: "1s",
  },
  {
    id: 3,
    text: "มีความฝันที่ยังไม่กล้าบอกใคร",
    tag: "ความฝัน",
    hearts: 19,
    replies: [],
    x: 740, y: 140, rotation: -1,
    color: "#fef4c0", textColor: "#1a1a1a",
    floatClass: "us-float-c", width: 148, delay: "0.5s",
  },
  {
    id: 4,
    text: "อยากให้พ่อรู้ว่าฉันคิดถึงเขามากแค่ไหน",
    tag: "ครอบครัว",
    hearts: 55,
    replies: [{ from: "คุณพ่อ", text: "พ่อก็คิดถึงลูกเช่นกัน" }],
    x: 200, y: 380, rotation: 2,
    color: "#2f597a", textColor: "#f9f4eb",
    floatClass: "us-float-a", width: 165, delay: "1.2s",
  },
  {
    id: 5,
    text: "ขอบคุณที่มีพื้นที่ให้ได้พูด",
    tag: "ขอบคุณ",
    hearts: 33,
    replies: [],
    x: 560, y: 340, rotation: -1.5,
    color: "#f0e9d8", textColor: "#1a1a1a",
    floatClass: "us-float-b", width: 148, delay: "0.3s",
  },
  {
    id: 6,
    text: "กลัวล้มเหลว กลัวทำให้ผิดหวัง",
    tag: "ความกังวล",
    hearts: 47,
    replies: [],
    x: 860, y: 300, rotation: 2.5,
    color: "#562634", textColor: "#f9f4eb",
    floatClass: "us-float-c", width: 145, delay: "0.9s",
  },
  {
    id: 7,
    text: "บางครั้งฉันเครียดมากแต่ไม่รู้จะบอกใคร",
    tag: "ความเครียด",
    hearts: 12,
    replies: [{ from: "คุณแม่", text: "แม่อยู่ตรงนี้เสมอนะ ไม่ต้องกลัว" }],
    x: 1060, y: 120, rotation: -3,
    color: "#fef4c0", textColor: "#1a1a1a",
    floatClass: "us-float-a", width: 162, delay: "0.7s",
  },
  {
    id: 8,
    text: "อยากให้พ่อแม่รู้ว่าเกรดไม่ใช่ทุกอย่าง",
    tag: "ครอบครัว",
    hearts: 34,
    replies: [],
    x: 1300, y: 200, rotation: 1,
    color: "#fde8d8", textColor: "#1a1a1a",
    floatClass: "us-float-b", width: 155, delay: "0.2s",
  },
  {
    id: 9,
    text: "นอนไม่หลับมาสามคืนแล้ว ไม่รู้จะทำยังไง",
    tag: "ความเครียด",
    hearts: 21,
    replies: [],
    x: 980, y: 400, rotation: -2,
    color: "#e8f4e8", textColor: "#1a1a1a",
    floatClass: "us-float-c", width: 158, delay: "1.4s",
  },
  {
    id: 10,
    text: "อยากคุยกับแม่มากกว่านี้แต่ไม่รู้จะเริ่มยังไง",
    tag: "ครอบครัว",
    hearts: 16,
    replies: [{ from: "คุณแม่", text: "โทรหาแม่ได้เลยนะลูก" }],
    x: 1500, y: 350, rotation: 1.5,
    color: "#1e3a4f", textColor: "#f9f4eb",
    floatClass: "us-float-a", width: 170, delay: "0.6s",
  },
];

const FLOAT_CLASSES: NoteData["floatClass"][] = [
  "us-float-a",
  "us-float-b",
  "us-float-c",
];
const NOTE_COLORS = [
  { color: "#fef4c0", textColor: "#1a1a1a" },
  { color: "#fde8d8", textColor: "#1a1a1a" },
  { color: "#1e3a4f", textColor: "#f9f4eb" },
  { color: "#f0e9d8", textColor: "#1a1a1a" },
  { color: "#562634", textColor: "#f9f4eb" },
  { color: "#2f597a", textColor: "#f9f4eb" },
];

export function AnonymousWall() {
  const [notes, setNotes] = useState<NoteData[]>(INITIAL_NOTES);
  const [expanded, setExpanded] = useState<NoteData | null>(null);
  const [activeFilter, setActiveFilter] = useState("ทั้งหมด");
  const [inputText, setInputText] = useState("");
  const [selectedTag, setSelectedTag] = useState("ครอบครัว");
  const [submitted, setSubmitted] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);

  // Canvas pan state
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const didMove = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastOffset = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  const visible =
    activeFilter === "ทั้งหมด"
      ? notes
      : notes.filter((n) => n.tag === activeFilter);

  // ── Pan handlers ──────────────────────────────────────────
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("button, textarea, input")) return;
      isDragging.current = true;
      didMove.current = false;
      dragStart.current = { x: e.clientX, y: e.clientY };
      lastOffset.current = offset;
    },
    [offset]
  );

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) didMove.current = true;
    setOffset({ x: lastOffset.current.x + dx, y: lastOffset.current.y + dy });
  }, []);

  const onPointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if ((e.target as HTMLElement).closest("button, textarea, input")) return;
      isDragging.current = true;
      didMove.current = false;
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastOffset.current = offset;
    },
    [offset]
  );

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - dragStart.current.x;
    const dy = e.touches[0].clientY - dragStart.current.y;
    didMove.current = true;
    setOffset({ x: lastOffset.current.x + dx, y: lastOffset.current.y + dy });
  }, []);

  const handleNoteExpand = useCallback(
    (note: NoteData) => {
      if (didMove.current) return;
      setExpanded(note);
    },
    []
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSubmit = () => {
    if (!inputText.trim()) return;
    const colorPick = NOTE_COLORS[notes.length % NOTE_COLORS.length];
    const cw = canvasRef.current?.clientWidth ?? 800;
    const ch = canvasRef.current?.clientHeight ?? 500;
    const vx = -offset.x + cw / 2 - 80 + (Math.random() - 0.5) * 200;
    const vy = -offset.y + ch / 2 - 60 + (Math.random() - 0.5) * 120;
    const newNote: NoteData = {
      id: Date.now(),
      text: inputText.trim(),
      tag: selectedTag,
      hearts: 0,
      replies: [],
      x: vx,
      y: vy,
      rotation: (Math.random() - 0.5) * 5,
      color: colorPick.color,
      textColor: colorPick.textColor,
      floatClass: FLOAT_CLASSES[notes.length % 3],
      width: 145 + Math.floor(Math.random() * 25),
      delay: `${(notes.length % 4) * 0.4}s`,
    };
    setNotes((prev) => [...prev, newNote]);
    setInputText("");
    setSubmitted(true);
    setShowSubmit(false);
    setTimeout(() => setSubmitted(false), 2000);
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        background: "var(--us-dark)",
        fontFamily: "'Sarabun', sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ── Top bar ─────────────────────────────────────────── */}
      <div
        style={{
          flexShrink: 0,
          background: "var(--us-dark)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          gap: 14,
          height: 52,
          zIndex: 30,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span
            style={{ fontSize: 16, fontWeight: 700, color: "#f9f4eb" }}
          >
            โน้ตจากใจ
          </span>
          <span
            style={{
              fontFamily: "'Patrick Hand', cursive",
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "rgba(249,244,235,0.3)",
            }}
          >
            Anonymous Wall
          </span>
        </div>

        <div
          style={{
            width: 3,
            height: 18,
            background: "var(--us-orange)",
            borderRadius: 2,
            flexShrink: 0,
          }}
        />

        {/* Filter chips */}
        <div
          style={{
            display: "flex",
            gap: 6,
            overflowX: "auto",
            flexShrink: 1,
          }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                background:
                  activeFilter === f
                    ? "var(--us-orange)"
                    : "rgba(255,255,255,0.08)",
                color:
                  activeFilter === f ? "#fff" : "rgba(249,244,235,0.6)",
                border:
                  activeFilter === f
                    ? "none"
                    : "1px solid rgba(255,255,255,0.12)",
                borderRadius: 14,
                padding: "4px 12px",
                fontSize: 12,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.15s",
                fontFamily: "'Sarabun', sans-serif",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {/* Note count */}
        <div
          style={{
            color: "var(--us-orange)",
            display: "flex",
            alignItems: "baseline",
            gap: 3,
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 20, fontWeight: 700 }}>{notes.length}</span>
          <span style={{ fontSize: 10, opacity: 0.65 }}>ข้อความ</span>
        </div>

        {/* Write button */}
        <button
          onClick={() => setShowSubmit((s) => !s)}
          style={{
            background: submitted
              ? "#6b6055"
              : showSubmit
              ? "rgba(255,255,255,0.12)"
              : "var(--us-orange)",
            color: "#fff",
            border: "none",
            borderRadius: 20,
            padding: "7px 16px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            transition: "background 0.2s",
            fontFamily: "'Sarabun', sans-serif",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {submitted ? "ส่งแล้ว ✓" : showSubmit ? "ปิด ✕" : "✏️ เขียนโน้ต"}
        </button>
      </div>

      {/* ── Submit panel ──────────────────────────────────── */}
      {showSubmit && (
        <div
          style={{
            flexShrink: 0,
            background: "var(--us-bg)",
            borderBottom: "2px solid rgba(30,58,79,0.6)",
            padding: "12px 20px",
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            zIndex: 29,
          }}
        >
          <div style={{ flex: 1 }}>
            <textarea
              autoFocus
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              placeholder="เขียนสิ่งที่อยากให้ครอบครัวรู้..."
              rows={2}
              style={{
                width: "100%",
                background: "#fff",
                border: "2px solid var(--us-dark)",
                borderRadius: 4,
                padding: "9px 13px",
                fontFamily: "'Sarabun', sans-serif",
                fontSize: 14,
                resize: "none",
                outline: "none",
                color: "var(--us-text)",
              }}
            />
            <div
              style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}
            >
              {TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTag(t)}
                  style={{
                    background:
                      selectedTag === t ? "var(--us-blue)" : "var(--us-surface)",
                    color: selectedTag === t ? "#fff" : "var(--us-muted)",
                    border:
                      selectedTag === t
                        ? "none"
                        : "1px solid var(--us-muted)",
                    borderRadius: 12,
                    padding: "3px 10px",
                    fontFamily: "'Sarabun', sans-serif",
                    fontSize: 11,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={handleSubmit}
            style={{
              background: "var(--us-orange)",
              color: "#fff",
              border: "none",
              borderRadius: 4,
              padding: "10px 20px",
              fontFamily: "'Sarabun', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              marginTop: 2,
            }}
          >
            ปล่อยโน้ต ↑
          </button>
        </div>
      )}

      {/* ── Infinite canvas ───────────────────────────────── */}
      <div
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onPointerUp}
        style={{
          flex: 1,
          position: "relative",
          overflow: "hidden",
          cursor: "grab",
          background: "var(--us-surface)",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {/* Dot grid — pattern offset tracks pan */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: 0.18,
            pointerEvents: "none",
          }}
        >
          <defs>
            <pattern
              id="us-dots"
              x={offset.x % 28}
              y={offset.y % 28}
              width="28"
              height="28"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.2" fill="#6b6055" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#us-dots)" />
        </svg>

        {/* Panned layer */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            transform: `translate(${offset.x}px, ${offset.y}px)`,
            willChange: "transform",
          }}
        >
          {/* Dashed string threads */}
          <svg
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              overflow: "visible",
              opacity: 0.2,
              pointerEvents: "none",
            }}
          >
            {visible.map((n) => (
              <line
                key={n.id}
                x1={n.x + (n.width ?? 150) / 2}
                y1={-offset.y - 40}
                x2={n.x + (n.width ?? 150) / 2}
                y2={n.y}
                stroke="#1a1a1a"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
            ))}
          </svg>

          {/* Notes */}
          {visible.map((n) => (
            <FloatingNote
              key={n.id}
              {...n}
              onExpand={() => handleNoteExpand(n)}
            />
          ))}
        </div>

        {/* Expanded modal — lives in canvas viewport space */}
        {expanded && (
          <ExpandedNote note={expanded} onClose={() => setExpanded(null)} />
        )}

        {/* Bottom-center hint */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "'Patrick Hand', cursive",
            fontSize: 11,
            color: "rgba(107,96,85,0.5)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            letterSpacing: 1,
          }}
        >
          ลากเพื่อสำรวจ · กดโน้ตเพื่ออ่านและตอบกลับ
        </div>

        {/* Bottom-right family CTA */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            right: 20,
            fontFamily: "'Sarabun', sans-serif",
            fontSize: 12,
            color: "rgba(47,89,122,0.65)",
            pointerEvents: "none",
          }}
        >
          👨‍👩‍👧 กดที่โน้ตเพื่อส่งกำลังใจ
        </div>
      </div>
    </div>
  );
}
