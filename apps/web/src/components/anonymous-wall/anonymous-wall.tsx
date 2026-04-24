"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import {
  X,
  Check,
  Users,
  Send,
  Smile,
  Loader2,
  Keyboard,
  Pen,
  ZoomIn,
  ZoomOut,
  SlidersHorizontal,
} from "lucide-react";
import { FloatingNote, type NoteData } from "./floating-note";
import { ExpandedNote } from "./expanded-note";
import { AvatarFace, AvatarPicker } from "./avatar";
import { AVATAR_PRESETS, type AvatarPreset } from "./avatar-store";
import { DrawingModal } from "./drawing-modal";
import { toast } from "sonner";
import { env } from "@unspokenscreen/env/web";

const API = env.NEXT_PUBLIC_SERVER_URL;

const FILTERS = ["ทั้งหมด", "ครอบครัว", "ความเครียด", "ความฝัน", "ขอบคุณ"];
const TAGS = FILTERS.slice(1);

// Keywords that signal the message is family-related
const FAMILY_KEYWORDS = [
  // ── ความสัมพันธ์ในครอบครัว ──────────────────────────────────
  "ครอบครัว",
  "พ่อ",
  "แม่",
  "พ่อแม่",
  "พ่อเลี้ยง",
  "แม่เลี้ยง",
  "พ่อบุญธรรม",
  "แม่บุญธรรม",
  "พี่",
  "น้อง",
  "พี่ชาย",
  "พี่สาว",
  "น้องชาย",
  "น้องสาว",
  "พี่น้อง",
  "พี่สะใภ้",
  "น้องสะใภ้",
  "พี่เขย",
  "น้องเขย",
  "ลูก",
  "ลูกชาย",
  "ลูกสาว",
  "ลูกบุญธรรม",
  "สามี",
  "ภรรยา",
  "แฟน",
  "คู่ชีวิต",
  "คู่รัก",
  "ปู่",
  "ย่า",
  "ตา",
  "ยาย",
  "ทวด",
  "ลุง",
  "ป้า",
  "น้า",
  "อา",
  "หลาน",
  "หลานชาย",
  "หลานสาว",
  "เหลน",
  "ลูกพี่ลูกน้อง",
  "ญาติ",
  "ญาติพี่น้อง",
  "ญาติผู้ใหญ่",
  "ผู้ปกครอง",
  "ผู้เลี้ยงดู",

  // ── อารมณ์และความรู้สึกต่อกัน ───────────────────────────────
  "รัก",
  "รักมาก",
  "รักที่สุด",
  "รักนะ",
  "รักเขา",
  "รักเธอ",
  "คิดถึง",
  "คิดถึงมาก",
  "คิดถึงนะ",
  "ห่วง",
  "เป็นห่วง",
  "ห่วงใย",
  "เป็นห่วงมาก",
  "ขอบคุณ",
  "ขอบคุณมาก",
  "ขอบคุณนะ",
  "ขอบใจ",
  "ขอโทษ",
  "ขอโทษนะ",
  "ขอโทษด้วย",
  "โทษ",
  "ให้อภัย",
  "อภัย",
  "ให้อภัยกัน",
  "ภูมิใจ",
  "ภูมิใจใน",
  "ภูมิใจที่สุด",
  "เหงา",
  "คิดถึงบ้าน",
  "โหยหา",
  "อยากกลับบ้าน",
  "ทะเลาะ",
  "ทะเลาะกัน",
  "คืนดี",
  "คืนดีกัน",
  "อิจฉา",
  "น้อยใจ",
  "น้อยใจนะ",
  "น้อยใจมาก",
  "เสียใจ",
  "เสียใจมาก",
  "เสียใจด้วย",
  "ดีใจ",
  "ดีใจมาก",
  "ดีใจที่สุด",
  "หวัง",
  "หวังว่า",
  "ฝัน",
  "ฝันถึง",
  "เข้าใจ",
  "ไม่เข้าใจ",
  "เข้าใจกัน",
  "ผูกพัน",
  "ใกล้ชิด",
  "สนิท",
  "สนิทใจ",
  "ไว้ใจ",
  "ไว้วางใจ",
  "เชื่อใจ",
  "กังวล",
  "กังวลใจ",
  "วิตก",
  "อ้อนหา",
  "คิดฮอด", // อีสาน
  "ฮักแพง", // อีสาน: รักใคร่
  "อยากเห็น",
  "อยากเจอ",
  "อยากคุย",

  // ── การกระทำและการดูแล ──────────────────────────────────────
  "กอด",
  "อยากกอด",
  "โอบกอด",
  "ดูแล",
  "ดูแลกัน",
  "ดูแลตัวเอง",
  "ดูแลด้วย",
  "เลี้ยงดู",
  "เลี้ยง",
  "สั่งสอน",
  "สนับสนุน",
  "ให้กำลังใจ",
  "กำลังใจ",
  "ช่วย",
  "ช่วยเหลือ",
  "ช่วยกัน",
  "รับฟัง",
  "ฟัง",
  "พูดคุย",
  "คุยกัน",
  "เคียงข้าง",
  "อยู่เคียงข้าง",
  "อยู่ด้วยกัน",
  "นึกถึง",
  "ระลึก",
  "ระลึกถึง",
  "อวยพร",
  "พร",

  // ── บ้านและชีวิตร่วมกัน ─────────────────────────────────────
  "บ้าน",
  "บ้านเรา",
  "กลับบ้าน",
  "อยู่บ้าน",
  "ที่บ้าน",
  "อบอุ่น",
  "ความอบอุ่น",
  "ความทรงจำ",
  "ความทรงจำที่ดี",
  "ทรงจำ",
  "วันเกิด",
  "ปีใหม่",
  "สงกรานต์",
  "เทศกาล",
  "ทานข้าว",
  "กินข้าวด้วยกัน",
  "โต๊ะอาหาร",
  "ครอบครัวพร้อมหน้า",
  "พร้อมหน้า",
  "พร้อมกัน",
  "คนในบ้าน",
  "คนที่รัก",
  "คนสำคัญ",
  "คนข้างๆ",
  "ห่างกัน",
  "ห่างบ้าน",
  "อยู่ไกล",
  "คนละที่",

  // ── ความรู้สึกด้านลบที่เกี่ยวกับความสัมพันธ์ ────────────────
  "เครียด",
  "เครียดมาก",
  "เครียดใจ",
  "กดดัน",
  "ความกดดัน",
  "แรงกดดัน",
  "อึดอัด",
  "อึดอัดใจ",
  "เจ็บปวด",
  "เจ็บใจ",
  "ปวดใจ",
  "บาดเจ็บ",
  "หนักใจ",
  "ใจหนัก",
  "ท้อ",
  "ท้อแท้",
  "ท้อใจ",
  "หมดหวัง",
  "สิ้นหวัง",
  "ไม่มีความหวัง",
  "โกรธ",
  "โมโห",
  "ไม่พอใจ",
  "ขุ่นเคือง",
  "เบื่อ",
  "เบื่อหน่าย",
  "เหนื่อย",
  "เหนื่อยใจ",
  "หมดแรง",
  "ผิดหวัง",
  "ผิดหวังมาก",
  "คาดหวัง",
  "สับสน",
  "ไม่รู้จะทำยังไง",
  "หาทางออกไม่ได้",
  "เดียวดาย",
  "โดดเดี่ยว",
  "ไม่มีใคร",
  "กลัว",
  "กังวล",
  "หวาดกลัว",
  "ไม่กล้า",
  "แผล",
  "แผลใจ",
  "บาดแผล",
  "ทนไม่ได้",
  "ทน",
  "อดทน",
  "สู้ต่อ",
  "ซึมเศร้า",
  "เศร้า",
  "เศร้าใจ",
  "เสียน้ำตา",
  "ร้องไห้",
  "ทอดทิ้ง",
  "ถูกทอดทิ้ง",
  "ถูกทิ้ง",
  "ไม่ได้รับความรัก",
  "รู้สึกไม่มีคุณค่า",
  "ไม่มีคุณค่า",
  "พลาด",
  "ล้มเหลว",
  "ทำให้ผิดหวัง",
];

function looksLikeFamily(text: string): boolean {
  const lower = text.toLowerCase();
  return FAMILY_KEYWORDS.some((kw) => lower.includes(kw));
}

// Rotating family-themed writing prompts shown in the submit panel
const FAMILY_PROMPTS = [
  "มีอะไรอยากบอกพ่อหรือแม่ แต่พูดออกมาไม่ได้?",
  "มีช่วงเวลาไหนที่ครอบครัวทำให้คุณรู้สึกอบอุ่น?",
  "มีคำขอบคุณที่ยังไม่เคยบอกใครในบ้านไหม?",
  "สิ่งที่คุณห่วงใยคนในครอบครัวมากที่สุดคืออะไร?",
  "มีความทรงจำกับครอบครัวที่อยากเก็บไว้ตลอดไปไหม?",
  "อยากให้ครอบครัวรู้ว่าคุณรู้สึกอย่างไรในตอนนี้?",
  "มีเรื่องที่อยากขอโทษหรืออยากให้อภัยกันไหม?",
  "สิ่งที่ทำให้คุณภูมิใจในครอบครัวคืออะไร?",
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

function resolveAvatar(avatarId: string | null): AvatarPreset | undefined {
  if (!avatarId) return undefined;
  return AVATAR_PRESETS.find((p) => p.id === avatarId);
}

export function AnonymousWall() {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchedIds, setFetchedIds] = useState<Set<number>>(new Set());
  const [expanded, setExpanded] = useState<NoteData | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState("ทั้งหมด");
  const [inputText, setInputText] = useState("");
  const [selectedTag, setSelectedTag] = useState(TAGS[0]);
  const [submitted, setSubmitted] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const [showDrawing, setShowDrawing] = useState(false);
  const [newNoteId, setNewNoteId] = useState<number | null>(null);

  const [avatar, setAvatar] = useState<AvatarPreset | null>(null);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [showMobileSubmit, setShowMobileSubmit] = useState(false);
  const [promptIndex, setPromptIndex] = useState(0);
  const [showOffTopicConfirm, setShowOffTopicConfirm] = useState(false);

  const MIN_SCALE = 0.3;
  const MAX_SCALE = 2.5;

  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const offsetRef = useRef({ x: 0, y: 0 });
  const scaleRef = useRef(1);
  const isDragging = useRef(false);
  const didMove = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const lastOffset = useRef({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const panRafRef = useRef<number | null>(null);
  // touch pinch
  const pinchStartDist = useRef<number | null>(null);
  const pinchStartScale = useRef(1);
  const pinchStartOffset = useRef({ x: 0, y: 0 });
  const pinchMidpoint = useRef({ x: 0, y: 0 });

  useEffect(() => {
    offsetRef.current = offset;
  }, [offset]);
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  const applyZoom = useCallback(
    (newScale: number, originX: number, originY: number) => {
      const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));
      const prev = scaleRef.current;
      const ox = offsetRef.current.x;
      const oy = offsetRef.current.y;
      // keep the canvas point under (originX, originY) fixed
      const nx = originX - (originX - ox) * (clamped / prev);
      const ny = originY - (originY - oy) * (clamped / prev);
      scaleRef.current = clamped;
      offsetRef.current = { x: nx, y: ny };
      setScale(clamped);
      setOffset({ x: nx, y: ny });
    },
    [],
  );

  // Wheel zoom — attached via addEventListener so we can pass passive:false
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const originX = e.clientX - rect.left;
      const originY = e.clientY - rect.top;
      // ctrlKey means pinch-to-zoom gesture on trackpad
      const delta = e.ctrlKey ? e.deltaY * 0.01 : e.deltaY * 0.001;
      applyZoom(scaleRef.current * (1 - delta), originX, originY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [applyZoom]);

  const panTo = useCallback((targetX: number, targetY: number) => {
    if (panRafRef.current !== null) cancelAnimationFrame(panRafRef.current);
    const DURATION = 900;
    const start = performance.now();
    const fromX = offsetRef.current.x;
    const fromY = offsetRef.current.y;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
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

  useEffect(() => {
    const stored = localStorage.getItem("us_wall_token");
    const storedId = localStorage.getItem("us_wall_user_id");
    const storedName = localStorage.getItem("us_wall_display_name") ?? "";
    if (stored && storedId) {
      setUserToken(stored);
      setUserId(Number(storedId));
      setDisplayName(storedName);
      return;
    }
    fetch(`${API}/api/wall/session`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((r) => r.json())
      .then(
        (data: {
          token: string;
          userId: number;
          displayName: string | null;
        }) => {
          localStorage.setItem("us_wall_token", data.token);
          localStorage.setItem("us_wall_user_id", String(data.userId));
          setUserToken(data.token);
          setUserId(data.userId);
        },
      )
      .catch(console.error);
  }, []);

  const saveName = useCallback(
    async (name: string) => {
      const trimmed = name.trim();
      localStorage.setItem("us_wall_display_name", trimmed);
      setDisplayName(trimmed);
      if (!userToken) return;
      try {
        await fetch(`${API}/api/wall/session`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-user-token": userToken,
          },
          body: JSON.stringify({ name: trimmed }),
        });
      } catch (err) {
        console.error("Failed to update display name:", err);
      }
    },
    [userToken],
  );

  useEffect(() => {
    fetch(`${API}/api/wall/notes`)
      .then((r) => r.json())
      .then((data: NoteData[]) => {
        setNotes(data);
        const ids = new Set(data.map((n) => n.id));
        setFetchedIds(ids);
        // clear after all stagger animations finish so filter changes don't re-trigger
        setTimeout(() => setFetchedIds(new Set()), data.length * 55 + 800);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const visible =
    activeFilter === "ทั้งหมด"
      ? notes
      : notes.filter((n) => n.tag === activeFilter);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("button, textarea, input")) return;
      isDragging.current = true;
      didMove.current = false;
      dragStart.current = { x: e.clientX, y: e.clientY };
      lastOffset.current = offset;
    },
    [offset],
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
      if (e.touches.length === 2) {
        // pinch start
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const dist = Math.hypot(
          t1.clientX - t0.clientX,
          t1.clientY - t0.clientY,
        );
        pinchStartDist.current = dist;
        pinchStartScale.current = scaleRef.current;
        pinchStartOffset.current = { ...offsetRef.current };
        const rect = canvasRef.current?.getBoundingClientRect();
        pinchMidpoint.current = {
          x: (t0.clientX + t1.clientX) / 2 - (rect?.left ?? 0),
          y: (t0.clientY + t1.clientY) / 2 - (rect?.top ?? 0),
        };
        isDragging.current = false;
        return;
      }
      pinchStartDist.current = null;
      isDragging.current = true;
      didMove.current = false;
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastOffset.current = offset;
    },
    [offset],
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2 && pinchStartDist.current !== null) {
        e.preventDefault();
        const t0 = e.touches[0];
        const t1 = e.touches[1];
        const dist = Math.hypot(
          t1.clientX - t0.clientX,
          t1.clientY - t0.clientY,
        );
        const newScale =
          pinchStartScale.current * (dist / pinchStartDist.current);
        applyZoom(newScale, pinchMidpoint.current.x, pinchMidpoint.current.y);
        didMove.current = true;
        return;
      }
      if (!isDragging.current) return;
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      didMove.current = true;
      setOffset({ x: lastOffset.current.x + dx, y: lastOffset.current.y + dy });
    },
    [applyZoom],
  );

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

  const findPosition = useCallback(
    (noteWidth: number, noteHeight: number): { x: number; y: number } => {
      const cw = canvasRef.current?.clientWidth ?? 800;
      const ch = canvasRef.current?.clientHeight ?? 500;
      const cx = -offset.x + cw / 2;
      const cy = -offset.y + ch / 2;
      const NOTE_H = 120;
      const JITTER = 18;
      const CELL_W = noteWidth + 20;
      const CELL_H = NOTE_H + 20;
      const RINGS = 6;
      const candidates: { x: number; y: number; dist: number }[] = [];
      for (let ring = 0; ring <= RINGS; ring++) {
        for (let col = -ring; col <= ring; col++) {
          for (let row = -ring; row <= ring; row++) {
            if (Math.abs(col) !== ring && Math.abs(row) !== ring) continue;
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
          const ox = Math.max(
            0,
            Math.min(x + noteWidth, n.x + nw) - Math.max(x, n.x),
          );
          const oy = Math.max(
            0,
            Math.min(y + noteHeight, n.y + NOTE_H) - Math.max(y, n.y),
          );
          if (ox * oy > 0) return false;
        }
        return true;
      };
      candidates.sort((a, b) => a.dist - b.dist);
      for (const { x, y } of candidates) {
        if (isClear(x, y)) {
          return {
            x: x + (Math.random() - 0.5) * JITTER,
            y: y + (Math.random() - 0.5) * JITTER,
          };
        }
      }
      let best = candidates[0]!;
      let bestOverlap = Infinity;
      for (const c of candidates) {
        let totalOverlap = 0;
        for (const n of notes) {
          const nw = n.width ?? 150;
          const ox = Math.max(
            0,
            Math.min(c.x + noteWidth, n.x + nw) - Math.max(c.x, n.x),
          );
          const oy = Math.max(
            0,
            Math.min(c.y + noteHeight, n.y + NOTE_H) - Math.max(c.y, n.y),
          );
          totalOverlap += ox * oy;
        }
        if (totalOverlap < bestOverlap) {
          bestOverlap = totalOverlap;
          best = c;
        }
      }
      return {
        x: best.x + (Math.random() - 0.5) * JITTER,
        y: best.y + (Math.random() - 0.5) * JITTER,
      };
    },
    [notes, offset],
  );

  const postNote = async (text: string, imageData?: string) => {
    const colorPick = NOTE_COLORS[notes.length % NOTE_COLORS.length];
    const noteWidth = imageData ? 180 : 145 + Math.floor(Math.random() * 25);
    const noteHeight = imageData ? 160 : 120;
    const { x: vx, y: vy } = findPosition(noteWidth, noteHeight);
    const payload = {
      text,
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
      imageData: imageData ?? null,
    };
    const res = await fetch(`${API}/api/wall/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(userToken ? { "x-user-token": userToken } : {}),
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const msg =
        (err as { error?: string }).error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่";
      toast.error(msg);
      throw new Error(msg);
    }
    const created: NoteData = await res.json();
    setNotes((prev) => [...prev, created]);
    setNewNoteId(created.id);
    setTimeout(() => setNewNoteId(null), 600);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2000);
    const cw = canvasRef.current?.clientWidth ?? 800;
    const ch = canvasRef.current?.clientHeight ?? 500;
    const s = scaleRef.current;
    panTo(
      -(created.x + (created.width ?? 150) / 2) * s + cw / 2,
      -(created.y + 60) * s + ch / 2,
    );
    return created;
  };

  const doSubmit = async () => {
    try {
      await postNote(inputText.trim());
      setInputText("");
      setShowSubmit(false);
      setShowMobileSubmit(false);
    } catch {
      // error already shown via toast — keep input so user can edit
    }
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) return;
    // Skip check when tag already declares family intent
    if (selectedTag === "ครอบครัว" || looksLikeFamily(inputText)) {
      await doSubmit();
      return;
    }
    // Text looks off-topic — ask for confirmation
    setShowOffTopicConfirm(true);
  };

  const handleDrawingSubmit = async (imageData: string) => {
    setShowDrawing(false);
    try {
      await postNote("", imageData);
    } catch (err) {
      console.error("Failed to create drawing note:", err);
    }
  };

  const handleDelete = useCallback(
    async (noteId: number) => {
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
    },
    [userToken],
  );

  const handleEdit = useCallback(
    async (noteId: number, text: string, tag: string) => {
      if (!userToken) return;
      const res = await fetch(`${API}/api/wall/notes/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-user-token": userToken,
        },
        body: JSON.stringify({ text, tag }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg =
          (err as { error?: string }).error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่";
        toast.error(msg);
        throw new Error(msg);
      }
      const updated = await res.json();
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, text: updated.text, tag: updated.tag } : n,
        ),
      );
    },
    [userToken],
  );

  const handleHeart = useCallback(async (noteId: number) => {
    try {
      await fetch(`${API}/api/wall/notes/${noteId}/heart`, { method: "POST" });
    } catch (err) {
      console.error("Failed to heart note:", err);
    }
  }, []);

  const handleReply = useCallback(
    async (
      noteId: number,
      text: string,
      from: string,
      avatarId: string | null,
    ) => {
      const res = await fetch(`${API}/api/wall/notes/${noteId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, from, avatarId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        const msg =
          (err as { error?: string }).error ?? "เกิดข้อผิดพลาด กรุณาลองใหม่";
        toast.error(msg);
        throw new Error(msg);
      }
      const created = await res.json();
      setNotes((prev) =>
        prev.map((n) =>
          n.id === noteId ? { ...n, replies: [...n.replies, created] } : n,
        ),
      );
      return created;
    },
    [],
  );

  // Shared submit panel content (used both desktop inline and mobile sheet)
  const submitPanel = (
    <div className="flex items-start gap-3">
      {/* Avatar preview */}
      <button
        onClick={() => setShowAvatarPicker(true)}
        title="เลือกอวตาร"
        className={`rounded-full w-11 h-11 shrink-0 cursor-pointer flex items-center justify-center overflow-hidden mt-0.5 ${
          avatar
            ? "border-2 border-us-orange bg-us-surface"
            : "border-2 border-dashed border-us-muted bg-us-surface"
        }`}
      >
        {avatar ? (
          <AvatarFace preset={avatar} size={44} />
        ) : (
          <Smile size={18} className="text-us-muted" strokeWidth={1.5} />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          onBlur={(e) => saveName(e.target.value)}
          placeholder="ชื่อ (ไม่บังคับ)"
          maxLength={30}
          className="w-full bg-us-surface border border-us-muted rounded px-3 py-1.5 text-[12px] outline-none text-us-text font-sans mb-2 focus:border-us-blue transition-colors"
        />
        {/* Rotating family prompt */}
        <p className="text-[11px] text-us-orange/80 mb-1.5 leading-snug italic">
          ✨ {FAMILY_PROMPTS[promptIndex]}
        </p>
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
          className="w-full bg-white border-2 border-us-dark rounded px-3 py-2 text-[14px] resize-none outline-none text-us-text font-sans"
        />
        <p className="text-[11px] text-us-muted/60 mt-1 leading-snug">
          พื้นที่นี้สำหรับข้อความถึงครอบครัว — ความรัก ความห่วงใย
          หรือสิ่งที่พูดออกมาไม่ได้
        </p>
        <div className="flex gap-1.5 mt-2 flex-wrap">
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTag(t)}
              className={`rounded-full px-2.5 py-[3px] text-[11px] cursor-pointer transition-all duration-150 ${
                selectedTag === t
                  ? "bg-us-blue text-white border-none"
                  : "bg-us-surface text-us-muted border border-us-muted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="bg-us-orange text-white border-none rounded px-4 py-[10px] text-[13px] font-bold cursor-pointer flex items-center gap-1.5 mt-0.5 whitespace-nowrap hover:bg-orange-500 transition-colors"
      >
        ปล่อยโน้ต
        <Send size={13} strokeWidth={2} />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 flex flex-col bg-us-dark overflow-hidden font-sans">
      {/* ── Desktop top bar (hidden on mobile) ───────────────── */}
      <div className="hidden sm:flex shrink-0 items-center gap-2 px-5 h-[52px] bg-us-dark border-b border-white/8 z-30 overflow-x-auto">
        {/* Title */}
        <div className="flex items-baseline gap-1.5 shrink-0">
          <span className="text-[15px] font-bold text-us-cream">โน้ตจากใจ</span>
          <span className="font-[family-name:var(--font-patrick-hand)] text-[9px] tracking-[2px] uppercase text-us-cream/30">
            Anonymous Wall
          </span>
        </div>

        <div className="w-[3px] h-[18px] bg-us-orange rounded-sm shrink-0" />

        {/* Filter chips */}
        <div
          className="flex gap-1.5 overflow-x-auto shrink-1"
          style={{ scrollbarWidth: "none" }}
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`rounded-full px-3 py-1 text-[11px] whitespace-nowrap shrink-0 cursor-pointer transition-all duration-150 ${
                activeFilter === f
                  ? "bg-us-orange text-white border-none"
                  : "bg-white/8 text-us-cream/60 border border-white/12"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <div className="flex items-baseline gap-[3px] shrink-0 text-us-orange">
          <span className="text-[18px] font-bold">{notes.length}</span>
          <span className="text-[9px] opacity-65">ข้อความ</span>
        </div>

        <button
          onClick={() => setShowAvatarPicker(true)}
          title="เลือกอวตาร"
          className={`rounded-full w-[34px] h-[34px] flex items-center justify-center shrink-0 overflow-hidden cursor-pointer transition-colors ${
            avatar
              ? "border-2 border-us-orange bg-white/8"
              : "border border-white/15 bg-white/8"
          }`}
        >
          {avatar ? (
            <AvatarFace preset={avatar} size={34} />
          ) : (
            <Smile size={15} className="text-us-cream/50" strokeWidth={1.5} />
          )}
        </button>

        {submitted ? (
          <div className="bg-us-muted text-white rounded-full px-3 py-[6px] text-[12px] font-bold flex items-center gap-1.5 shrink-0">
            <Check size={13} strokeWidth={2.5} /> ส่งแล้ว
          </div>
        ) : (
          <div className="flex gap-1.5 shrink-0">
            <button
              onClick={() => {
                setShowSubmit((s) => {
                  if (!s)
                    setPromptIndex((i) => (i + 1) % FAMILY_PROMPTS.length);
                  return !s;
                });
                setShowDrawing(false);
              }}
              className={`rounded-full px-[10px] py-[6px] text-[12px] font-bold cursor-pointer transition-colors whitespace-nowrap flex items-center gap-1 ${
                showSubmit
                  ? "bg-white/12 text-white"
                  : "bg-us-orange text-white hover:bg-orange-500"
              }`}
            >
              {showSubmit ? (
                <>
                  <X size={12} strokeWidth={2.5} /> ปิด
                </>
              ) : (
                <>
                  <Keyboard size={12} strokeWidth={2} /> พิมพ์
                </>
              )}
            </button>
            <button
              onClick={() => {
                setShowDrawing(true);
                setShowSubmit(false);
              }}
              className="bg-white/10 text-us-cream border border-white/20 rounded-full px-[10px] py-[6px] text-[12px] font-bold cursor-pointer whitespace-nowrap flex items-center gap-1 hover:bg-white/20 transition-colors"
            >
              <Pen size={12} strokeWidth={2} /> เขียน
            </button>
          </div>
        )}
      </div>

      {/* ── Desktop submit panel ──────────────────────────────── */}
      {showSubmit && (
        <div className="hidden sm:block shrink-0 px-5 py-3 bg-us-bg border-b-2 border-us-dark/60 z-[29]">
          {submitPanel}
        </div>
      )}

      {/* ── Infinite canvas ──────────────────────────────────── */}
      <div
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onPointerUp}
        onMouseLeave={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onPointerUp}
        className="flex-1 relative overflow-hidden cursor-grab bg-us-surface select-none"
        style={{ WebkitUserSelect: "none" }}
      >
        {/* Skeleton notes while loading */}
        {loading && (
          <div className="absolute inset-0 pointer-events-none">
            {[
              { x: "12%", y: "18%", w: 148, h: 130, r: -2.5 },
              { x: "32%", y: "10%", w: 160, h: 115, r: 1.8 },
              { x: "55%", y: "22%", w: 140, h: 140, r: -1.2 },
              { x: "72%", y: "12%", w: 155, h: 120, r: 2.2 },
              { x: "20%", y: "52%", w: 145, h: 125, r: 1.0 },
              { x: "44%", y: "58%", w: 158, h: 118, r: -2.0 },
              { x: "66%", y: "50%", w: 142, h: 132, r: 1.5 },
            ].map((s, i) => (
              <div
                key={i}
                className="absolute rounded-sm overflow-hidden"
                style={{
                  left: s.x,
                  top: s.y,
                  width: s.w,
                  height: s.h,
                  transform: `rotate(${s.r}deg)`,
                  animationDelay: `${i * 0.08}s`,
                  background: i % 2 === 0 ? "#1e3a4f" : "#f0e9d8",
                  opacity: 0.55,
                }}
              >
                <div className="us-skeleton absolute inset-0" />
                {/* pin */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white/20" />
                {/* lines */}
                <div className="px-3 pt-5 flex flex-col gap-2">
                  <div
                    className="us-skeleton h-2 w-12 rounded"
                    style={{ animationDelay: `${i * 0.1 + 0.1}s` }}
                  />
                  <div
                    className="us-skeleton h-2.5 w-full rounded"
                    style={{ animationDelay: `${i * 0.1 + 0.2}s` }}
                  />
                  <div
                    className="us-skeleton h-2.5 w-4/5 rounded"
                    style={{ animationDelay: `${i * 0.1 + 0.3}s` }}
                  />
                  <div
                    className="us-skeleton h-2.5 w-3/5 rounded"
                    style={{ animationDelay: `${i * 0.1 + 0.4}s` }}
                  />
                </div>
              </div>
            ))}
            {/* Loading label */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 text-us-muted/60 text-[12px] font-[family-name:var(--font-patrick-hand)] tracking-[1px]">
              <Loader2 size={13} strokeWidth={2} className="animate-spin" />
              กำลังโหลดโน้ต...
            </div>
          </div>
        )}

        {/* Dot grid — scales with zoom */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.18] pointer-events-none">
          <defs>
            <pattern
              id="us-dots"
              x={offset.x % (28 * scale)}
              y={offset.y % (28 * scale)}
              width={28 * scale}
              height={28 * scale}
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx={2 * scale}
                cy={2 * scale}
                r={1.2 * scale}
                fill="#6b6055"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#us-dots)" />
        </svg>

        {/* Panned + scaled layer — transform is dynamic JS so inline style is required */}
        <div
          className="absolute top-0 left-0 will-change-transform origin-top-left"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          }}
        >
          {/* Dashed string threads */}
          <svg className="absolute top-0 left-0 w-full h-full overflow-visible opacity-20 pointer-events-none">
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
              fetchIndex={fetchedIds.has(n.id) ? i : undefined}
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
            replyDisplayName={displayName.trim() || null}
            onClose={() => setExpanded(null)}
            onHeart={() => handleHeart(expanded.id)}
            onReply={(text, from, avatarId) =>
              handleReply(expanded.id, text, from, avatarId)
            }
          />
        )}

        {/* ── Mobile floating right pill ── */}
        <div className="sm:hidden absolute right-3 top-4 z-20 flex flex-col gap-2">
          {/* Note count badge */}
          <div className="flex flex-col items-center bg-us-dark/85 border border-white/10 rounded-2xl px-2 py-2.5 gap-[2px] backdrop-blur-sm">
            <span className="text-[15px] font-bold text-us-orange leading-none">
              {notes.length}
            </span>
            <span className="text-[8px] text-us-cream/40">โน้ต</span>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-white/8" />

          {/* Filter */}
          <button
            onClick={() => {
              setShowMobileFilter((s) => !s);
              setShowMobileSubmit(false);
            }}
            title="กรอง"
            className={`w-10 h-10 rounded-2xl flex flex-col items-center justify-center gap-[3px] cursor-pointer transition-colors border ${
              showMobileFilter || activeFilter !== "ทั้งหมด"
                ? "bg-us-orange border-us-orange text-white"
                : "bg-us-dark/85 border-white/10 text-us-cream/60 backdrop-blur-sm"
            }`}
          >
            <SlidersHorizontal size={15} strokeWidth={2} />
            {activeFilter !== "ทั้งหมด" && (
              <span className="text-[7px] font-bold leading-none truncate max-w-[32px] text-center">
                {activeFilter}
              </span>
            )}
          </button>

          {/* Type note */}
          <button
            onClick={() => {
              setShowMobileSubmit((s) => {
                if (!s) setPromptIndex((i) => (i + 1) % FAMILY_PROMPTS.length);
                return !s;
              });
              setShowMobileFilter(false);
              setShowDrawing(false);
            }}
            title="พิมพ์โน้ต"
            className={`w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer transition-colors border ${
              showMobileSubmit
                ? "bg-us-orange border-us-orange text-white"
                : "bg-us-dark/85 border-white/10 text-us-cream/60 backdrop-blur-sm"
            }`}
          >
            <Keyboard size={15} strokeWidth={2} />
          </button>

          {/* Draw note */}
          <button
            onClick={() => {
              setShowDrawing(true);
              setShowMobileSubmit(false);
              setShowMobileFilter(false);
            }}
            title="เขียนด้วยมือ"
            className="w-10 h-10 rounded-2xl bg-us-dark/85 border border-white/10 text-us-cream/60 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors backdrop-blur-sm"
          >
            <Pen size={15} strokeWidth={2} />
          </button>

          {/* Avatar */}
          <button
            onClick={() => setShowAvatarPicker(true)}
            title="เลือกอวตาร"
            className={`w-10 h-10 rounded-2xl flex items-center justify-center cursor-pointer transition-colors border overflow-hidden ${
              avatar
                ? "border-us-orange bg-us-dark/85"
                : "border-white/10 bg-us-dark/85 backdrop-blur-sm"
            }`}
          >
            {avatar ? (
              <AvatarFace preset={avatar} size={40} />
            ) : (
              <Smile size={15} className="text-us-cream/60" strokeWidth={1.5} />
            )}
          </button>

          {/* Zoom in */}
          <div className="w-full h-px bg-white/8" />
          <button
            onClick={() =>
              applyZoom(
                scale * 1.3,
                (canvasRef.current?.clientWidth ?? 400) / 2,
                (canvasRef.current?.clientHeight ?? 600) / 2,
              )
            }
            className="w-10 h-10 rounded-2xl bg-us-dark/85 border border-white/10 text-us-cream/60 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors backdrop-blur-sm"
            title="ซูมเข้า"
          >
            <ZoomIn size={15} strokeWidth={2} />
          </button>
          {/* Zoom out */}
          <button
            onClick={() =>
              applyZoom(
                scale * 0.75,
                (canvasRef.current?.clientWidth ?? 400) / 2,
                (canvasRef.current?.clientHeight ?? 600) / 2,
              )
            }
            className="w-10 h-10 rounded-2xl bg-us-dark/85 border border-white/10 text-us-cream/60 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors backdrop-blur-sm"
            title="ซูมออก"
          >
            <ZoomOut size={15} strokeWidth={2} />
          </button>
          {/* Zoom reset */}
          <button
            onClick={() =>
              applyZoom(
                1,
                (canvasRef.current?.clientWidth ?? 400) / 2,
                (canvasRef.current?.clientHeight ?? 600) / 2,
              )
            }
            className="w-10 h-10 rounded-2xl bg-us-dark/85 border border-white/10 text-us-cream/50 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors backdrop-blur-sm text-[9px] font-bold"
            title="รีเซ็ต"
          >
            {Math.round(scale * 100)}%
          </button>
        </div>

        {/* ── Mobile filter bottom sheet ── */}
        {showMobileFilter && (
          <div className="sm:hidden absolute bottom-0 left-0 right-0 z-30 bg-us-dark/95 border-t border-white/10 px-4 py-4 backdrop-blur-md">
            <div className="font-[family-name:var(--font-patrick-hand)] text-[10px] text-us-cream/40 uppercase tracking-[1.5px] mb-3">
              กรองตามหมวด
            </div>
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => {
                    setActiveFilter(f);
                    setShowMobileFilter(false);
                  }}
                  className={`rounded-full px-4 py-1.5 text-[12px] cursor-pointer transition-all ${
                    activeFilter === f
                      ? "bg-us-orange text-white"
                      : "bg-white/8 text-us-cream/60 border border-white/12"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Mobile submit bottom sheet ── */}
        {showMobileSubmit && (
          <div className="sm:hidden absolute bottom-0 left-0 right-0 z-30 bg-us-bg border-t-2 border-us-dark/60 px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-[family-name:var(--font-patrick-hand)] text-[10px] text-us-muted uppercase tracking-[1.5px]">
                ส่งโน้ต
              </span>
              <button
                onClick={() => setShowMobileSubmit(false)}
                className="text-us-muted bg-transparent border-none cursor-pointer p-1"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>
            {submitted ? (
              <div className="flex items-center justify-center gap-2 py-4 text-us-muted text-[14px] font-bold">
                <Check size={16} strokeWidth={2.5} /> ส่งโน้ตแล้ว!
              </div>
            ) : (
              submitPanel
            )}
          </div>
        )}

        {/* ── Desktop zoom controls ── */}
        <div className="hidden sm:flex absolute bottom-4 right-4 flex-col gap-1 z-20">
          <button
            onClick={() =>
              applyZoom(
                scale * 1.25,
                (canvasRef.current?.clientWidth ?? 800) / 2,
                (canvasRef.current?.clientHeight ?? 500) / 2,
              )
            }
            className="w-8 h-8 bg-us-dark/80 hover:bg-us-dark text-us-cream/70 hover:text-us-cream rounded-md flex items-center justify-center cursor-pointer transition-colors border border-white/10"
            title="ซูมเข้า"
          >
            <ZoomIn size={14} strokeWidth={2} />
          </button>
          <button
            onClick={() =>
              applyZoom(
                scale * 0.8,
                (canvasRef.current?.clientWidth ?? 800) / 2,
                (canvasRef.current?.clientHeight ?? 500) / 2,
              )
            }
            className="w-8 h-8 bg-us-dark/80 hover:bg-us-dark text-us-cream/70 hover:text-us-cream rounded-md flex items-center justify-center cursor-pointer transition-colors border border-white/10"
            title="ซูมออก"
          >
            <ZoomOut size={14} strokeWidth={2} />
          </button>
          <button
            onClick={() =>
              applyZoom(
                1,
                (canvasRef.current?.clientWidth ?? 800) / 2,
                (canvasRef.current?.clientHeight ?? 500) / 2,
              )
            }
            className="w-8 h-8 bg-us-dark/80 hover:bg-us-dark text-us-cream/60 hover:text-us-cream rounded-md flex items-center justify-center cursor-pointer transition-colors border border-white/10 font-bold text-[10px]"
            title="รีเซ็ตซูม"
          >
            {Math.round(scale * 100)}%
          </button>
        </div>

        {/* Canvas hint */}
        <div className="hidden sm:block absolute bottom-4 left-1/2 -translate-x-1/2 font-[family-name:var(--font-patrick-hand)] text-[11px] text-us-muted/50 pointer-events-none whitespace-nowrap tracking-[1px]">
          ลากเพื่อสำรวจ · scroll เพื่อซูม · กดโน้ตเพื่ออ่าน
        </div>
      </div>

      {/* ── Modals ───────────────────────────────────────────── */}
      {showDrawing && (
        <DrawingModal
          onClose={() => setShowDrawing(false)}
          onSubmit={handleDrawingSubmit}
          displayName={displayName}
          onNameChange={saveName}
        />
      )}

      {/* ── Off-topic confirmation modal ──────────────────────── */}
      {showOffTopicConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 px-5">
          <div className="bg-us-bg rounded-xl shadow-2xl max-w-sm w-full p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <p className="text-[15px] font-bold text-us-text leading-snug">
                ข้อความนี้ดูไม่เกี่ยวกับครอบครัว
              </p>
              <p className="text-[13px] text-us-muted leading-relaxed">
                พื้นที่นี้ตั้งใจให้เป็นที่แชร์ความรู้สึกต่อครอบครัว
                ลองเขียนใหม่ดูไหม?
              </p>
            </div>
            {/* Preview the current text */}
            <p className="text-[12px] text-us-muted/70 bg-us-surface rounded px-3 py-2 italic line-clamp-3">
              "{inputText}"
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowOffTopicConfirm(false)}
                className="px-4 py-2 rounded text-[13px] font-bold bg-us-orange text-white cursor-pointer hover:bg-orange-500 transition-colors"
              >
                แก้ไขข้อความ
              </button>
              <button
                onClick={() => {
                  setShowOffTopicConfirm(false);
                  doSubmit();
                }}
                className="px-4 py-2 rounded text-[13px] text-us-muted bg-us-surface cursor-pointer hover:bg-white/10 transition-colors"
              >
                ส่งต่อไป
              </button>
            </div>
          </div>
        </div>
      )}

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
