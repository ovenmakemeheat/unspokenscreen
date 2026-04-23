"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  PencilLine,
  X,
  Check,
  Users,
  Send,
  Smile,
  Loader2,
} from "lucide-react";
import { FloatingNote, type NoteData } from "./floating-note";
import { ExpandedNote } from "./expanded-note";
import { AvatarFace, AvatarPicker } from "./avatar";
import { AVATAR_PRESETS, type AvatarPreset } from "./avatar-store";
import { env } from "@unspokenscreen/env/web";

const API = env.NEXT_PUBLIC_SERVER_URL;

const FILTERS = ["ทั้งหมด", "ครอบครัว", "ความเครียด", "ความฝัน", "ขอบคุณ"];
const TAGS = FILTERS.slice(1);

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

function resolveAvatar(avatarId: string | null): AvatarPreset | undefined {
  if (!avatarId) return undefined;
  return AVATAR_PRESETS.find((p) => p.id === avatarId);
}

export function AnonymousWall() {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<NoteData | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState("ทั้งหมด");
  const [inputText, setInputText] = useState("");
  const [selectedTag, setSelectedTag] = useState(TAGS[0]);
  const [submitted, setSubmitted] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [newNoteId, setNewNoteId] = useState<number | null>(null);

  // Avatar state
  const [avatar, setAvatar] = useState<AvatarPreset | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Canvas pan state
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const offsetRef = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const didMove = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastOffset = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const panRafRef = useRef<number | null>(null);

  // Keep offsetRef in sync so panTo can read current value
  useEffect(() => { offsetRef.current = offset; }, [offset]);

  const panTo = useCallback((targetX: number, targetY: number) => {
    if (panRafRef.current !== null) cancelAnimationFrame(panRafRef.current);
    const DURATION = 900;
    const start = performance.now();
    const fromX = offsetRef.current.x;
    const fromY = offsetRef.current.y;

    const ease = (t: number) => 1 - Math.pow(1 - t, 3); // ease-out cubic

    const step = (now: number) => {
      const t = Math.min((now - start) / DURATION, 1);
      const e = ease(t);
      const x = fromX + (targetX - fromX) * e;
      const y = fromY + (targetY - fromY) * e;
      offsetRef.current = { x, y };
      setOffset({ x, y });
      if (t < 1) panRafRef.current = requestAnimationFrame(step);
      else panRafRef.current = null;
    };
    panRafRef.current = requestAnimationFrame(step);
  }, []);

  // ── Session init ───────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("us_wall_token");
    const storedId = localStorage.getItem("us_wall_user_id");
    if (stored && storedId) {
      setUserToken(stored);
      setUserId(Number(storedId));
      return;
    }
    fetch(`${API}/api/wall/session`, { method: "POST" })
      .then((r) => r.json())
      .then((data: { token: string; userId: number }) => {
        localStorage.setItem("us_wall_token", data.token);
        localStorage.setItem("us_wall_user_id", String(data.userId));
        setUserToken(data.token);
        setUserId(data.userId);
      })
      .catch(console.error);
  }, []);

  // ── Fetch notes from API ───────────────────────────────────
  useEffect(() => {
    fetch(`${API}/api/wall/notes`)
      .then((r) => r.json())
      .then((data: NoteData[]) => setNotes(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

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

  const handleNoteExpand = useCallback((note: NoteData) => {
    if (didMove.current) return;
    setExpanded(note);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setExpanded(null);
        setShowAvatarPicker(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // ── Find a placement in an empty area ─────────────────────
  const findPosition = useCallback(
    (noteWidth: number, noteHeight: number): { x: number; y: number } => {
      const cw = canvasRef.current?.clientWidth ?? 800;
      const ch = canvasRef.current?.clientHeight ?? 500;
      const cx = -offset.x + cw / 2;
      const cy = -offset.y + ch / 2;

      const NOTE_H = 120;
      const JITTER = 18; // small random nudge so grid rows don't look mechanical
      const CELL_W = noteWidth + 20;
      const CELL_H = NOTE_H + 20;

      // Grid radiates outward in rings so closer cells are checked first
      const RINGS = 6;
      const candidates: { x: number; y: number; dist: number }[] = [];
      for (let ring = 0; ring <= RINGS; ring++) {
        for (let col = -ring; col <= ring; col++) {
          for (let row = -ring; row <= ring; row++) {
            if (Math.abs(col) !== ring && Math.abs(row) !== ring) continue; // only perimeter of ring
            const bx = cx + col * CELL_W - noteWidth / 2;
            const by = cy + row * CELL_H - NOTE_H / 2;
            const dist = Math.hypot(col, row);
            candidates.push({ x: bx, y: by, dist });
          }
        }
      }

      const isClear = (x: number, y: number) => {
        for (const n of notes) {
          const nw = n.width ?? 150;
          const ox = Math.max(0, Math.min(x + noteWidth, n.x + nw) - Math.max(x, n.x));
          const oy = Math.max(0, Math.min(y + noteHeight, n.y + NOTE_H) - Math.max(y, n.y));
          if (ox * oy > 0) return false; // any overlap = not clear
        }
        return true;
      };

      // Sort by distance from viewport center, try each cell
      candidates.sort((a, b) => a.dist - b.dist);
      for (const { x, y } of candidates) {
        if (isClear(x, y)) {
          return {
            x: x + (Math.random() - 0.5) * JITTER,
            y: y + (Math.random() - 0.5) * JITTER,
          };
        }
      }

      // All grid cells occupied — place in the closest cell with the least overlap
      let best = candidates[0]!;
      let bestOverlap = Infinity;
      for (const c of candidates) {
        let totalOverlap = 0;
        for (const n of notes) {
          const nw = n.width ?? 150;
          const ox = Math.max(0, Math.min(c.x + noteWidth, n.x + nw) - Math.max(c.x, n.x));
          const oy = Math.max(0, Math.min(c.y + noteHeight, n.y + NOTE_H) - Math.max(c.y, n.y));
          totalOverlap += ox * oy;
        }
        if (totalOverlap < bestOverlap) { bestOverlap = totalOverlap; best = c; }
      }
      return {
        x: best.x + (Math.random() - 0.5) * JITTER,
        y: best.y + (Math.random() - 0.5) * JITTER,
      };
    },
    [notes, offset]
  );

  // ── Submit new note ────────────────────────────────────────
  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    const colorPick = NOTE_COLORS[notes.length % NOTE_COLORS.length];
    const noteWidth = 145 + Math.floor(Math.random() * 25);
    const noteHeight = 120;
    const { x: vx, y: vy } = findPosition(noteWidth, noteHeight);

    const payload = {
      text: inputText.trim(),
      tag: selectedTag,
      color: colorPick.color,
      textColor: colorPick.textColor,
      floatClass: FLOAT_CLASSES[notes.length % 3],
      width: noteWidth,
      x: vx,
      y: vy,
      rotation: (Math.random() - 0.5) * 5,
      delay: `${(notes.length % 4) * 0.4}s`,
      avatarId: avatar?.id ?? null,
    };

    try {
      const res = await fetch(`${API}/api/wall/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(userToken ? { "x-user-token": userToken } : {}),
        },
        body: JSON.stringify(payload),
      });
      const created: NoteData = await res.json();
      setNotes((prev) => [...prev, created]);
      setNewNoteId(created.id);
      setTimeout(() => setNewNoteId(null), 600);
      setInputText("");
      setSubmitted(true);
      setShowSubmit(false);
      setTimeout(() => setSubmitted(false), 2000);

      // Pan canvas so the new note is centered in the viewport
      const cw = canvasRef.current?.clientWidth ?? 800;
      const ch = canvasRef.current?.clientHeight ?? 500;
      panTo(-(created.x + (created.width ?? 150) / 2) + cw / 2, -(created.y + 60) + ch / 2);
    } catch (err) {
      console.error("Failed to create note:", err);
    }
  };

  // ── Delete a note ──────────────────────────────────────────
  const handleDelete = useCallback(async (noteId: number) => {
    if (!userToken) return;
    try {
      await fetch(`${API}/api/wall/notes/${noteId}`, {
        method: "DELETE",
        headers: { "x-user-token": userToken },
      });
      setNotes((prev) => prev.filter((n) => n.id !== noteId));
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  }, [userToken]);

  // ── Edit a note ────────────────────────────────────────────
  const handleEdit = useCallback(async (noteId: number, text: string, tag: string) => {
    if (!userToken) return;
    try {
      const res = await fetch(`${API}/api/wall/notes/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-token": userToken,
        },
        body: JSON.stringify({ text, tag }),
      });
      const updated = await res.json();
      setNotes((prev) =>
        prev.map((n) => (n.id === noteId ? { ...n, text: updated.text, tag: updated.tag } : n))
      );
    } catch (err) {
      console.error("Failed to edit note:", err);
    }
  }, [userToken]);

  // ── Heart a note ───────────────────────────────────────────
  const handleHeart = useCallback(async (noteId: number) => {
    try {
      await fetch(`${API}/api/wall/notes/${noteId}/heart`, { method: "POST" });
    } catch (err) {
      console.error("Failed to heart note:", err);
    }
  }, []);

  // ── Reply to a note ────────────────────────────────────────
  const handleReply = useCallback(
    async (noteId: number, text: string, from: string, avatarId: string | null) => {
      const res = await fetch(`${API}/api/wall/notes/${noteId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, from, avatarId }),
      });
      const created = await res.json();
      // Update note in list too
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, replies: [...n.replies, created] } : n
        )
      );
      return created;
    },
    []
  );

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
          <span style={{ fontSize: 16, fontWeight: 700, color: "#f9f4eb" }}>
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
        <div style={{ display: "flex", gap: 6, overflowX: "auto", flexShrink: 1 }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              style={{
                background:
                  activeFilter === f ? "var(--us-orange)" : "rgba(255,255,255,0.08)",
                color: activeFilter === f ? "#fff" : "rgba(249,244,235,0.6)",
                border:
                  activeFilter === f ? "none" : "1px solid rgba(255,255,255,0.12)",
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

        {/* Avatar button */}
        <button
          onClick={() => setShowAvatarPicker(true)}
          title="เลือกอวตาร"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: avatar
              ? "2px solid var(--us-orange)"
              : "1px solid rgba(255,255,255,0.15)",
            borderRadius: "50%",
            width: 36,
            height: 36,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            padding: 0,
            overflow: "hidden",
          }}
        >
          {avatar ? (
            <AvatarFace preset={avatar} size={36} />
          ) : (
            <Smile size={16} color="rgba(249,244,235,0.5)" strokeWidth={1.5} />
          )}
        </button>

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
            padding: "7px 14px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            transition: "background 0.2s",
            fontFamily: "'Sarabun', sans-serif",
            whiteSpace: "nowrap",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {submitted ? (
            <><Check size={14} strokeWidth={2.5} /> ส่งแล้ว</>
          ) : showSubmit ? (
            <><X size={14} strokeWidth={2.5} /> ปิด</>
          ) : (
            <><PencilLine size={14} strokeWidth={2} /> เขียนโน้ต</>
          )}
        </button>
      </div>

      {/* ── Submit panel ──────────────────────────────────────── */}
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
          {/* Avatar preview in submit panel */}
          <button
            onClick={() => setShowAvatarPicker(true)}
            title="เลือกอวตาร"
            style={{
              background: "var(--us-surface)",
              border: avatar
                ? "2px solid var(--us-orange)"
                : "2px dashed var(--us-muted)",
              borderRadius: "50%",
              width: 44,
              height: 44,
              flexShrink: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0,
              overflow: "hidden",
              marginTop: 2,
            }}
          >
            {avatar ? (
              <AvatarFace preset={avatar} size={44} />
            ) : (
              <Smile size={18} color="var(--us-muted)" strokeWidth={1.5} />
            )}
          </button>

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
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              {TAGS.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedTag(t)}
                  style={{
                    background:
                      selectedTag === t ? "var(--us-blue)" : "var(--us-surface)",
                    color: selectedTag === t ? "#fff" : "var(--us-muted)",
                    border:
                      selectedTag === t ? "none" : "1px solid var(--us-muted)",
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
              padding: "10px 18px",
              fontFamily: "'Sarabun', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              marginTop: 2,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ปล่อยโน้ต
            <Send size={13} strokeWidth={2} />
          </button>
        </div>
      )}

      {/* ── Infinite canvas ───────────────────────────────────── */}
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
        {/* Loading state */}
        {loading && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              color: "rgba(249,244,235,0.4)",
              fontFamily: "'Sarabun', sans-serif",
              fontSize: 13,
            }}
          >
            <Loader2
              size={16}
              strokeWidth={2}
              style={{ animation: "spin 1s linear infinite" }}
            />
            กำลังโหลด...
          </div>
        )}

        {/* Dot grid */}
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

          {visible.map((n, i) => (
            <FloatingNote
              key={n.id}
              {...n}
              zIndex={visible.length - i}
              resolvedAvatar={resolveAvatar(n.avatarId)}
              isOwner={userId !== null && n.userId === userId}
              isNew={n.id === newNoteId}
              onExpand={() => handleNoteExpand(n)}
              onHeart={() => handleHeart(n.id)}
              onDelete={() => handleDelete(n.id)}
              onEdit={(text, tag) => handleEdit(n.id, text, tag)}
            />
          ))}
        </div>

        {expanded && (
          <ExpandedNote
            note={expanded}
            resolvedAvatar={resolveAvatar(expanded.avatarId)}
            replyAvatar={avatar}
            onClose={() => setExpanded(null)}
            onHeart={() => handleHeart(expanded.id)}
            onReply={(text, from, avatarId) =>
              handleReply(expanded.id, text, from, avatarId)
            }
          />
        )}

        {/* Hint */}
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

        {/* Family CTA */}
        <div
          style={{
            position: "absolute",
            bottom: 16,
            right: 20,
            fontFamily: "'Sarabun', sans-serif",
            fontSize: 12,
            color: "rgba(47,89,122,0.65)",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Users size={13} strokeWidth={1.5} color="rgba(47,89,122,0.65)" />
          กดที่โน้ตเพื่อส่งกำลังใจ
        </div>
      </div>

      {/* ── Avatar picker modal ───────────────────────────────── */}
      {showAvatarPicker && (
        <AvatarPicker
          presets={AVATAR_PRESETS}
          selected={avatar}
          onSelect={(p) => setAvatar(p)}
          onClose={() => setShowAvatarPicker(false)}
        />
      )}
    </div>
  );
}
