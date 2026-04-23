"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { X, Trash2, Eraser, Pen, Upload, Send } from "lucide-react";

const COLORS = ["#1a1a1a", "#562634", "#2f597a", "#1e3a4f", "#ff751f", "#6b6055"];
const BRUSHES = [2, 4, 7, 12];

type Props = {
  onClose: () => void;
  onSubmit: (imageData: string) => void;
};

export function DrawingModal({ onClose, onSubmit }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#1a1a1a");
  const [brushSize, setBrushSize] = useState(4);
  const [erasing, setErasing] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Init canvas background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fef4c0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getPos = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawing.current = true;
    lastPos.current = getPos(e, canvas);
  }, []);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!drawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e, canvas);
    const from = lastPos.current ?? pos;

    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = erasing ? "#fef4c0" : color;
    ctx.lineWidth = erasing ? brushSize * 3 : brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();

    lastPos.current = pos;
    setHasStrokes(true);
  }, [color, brushSize, erasing]);

  const endDraw = useCallback(() => {
    drawing.current = false;
    lastPos.current = null;
  }, []);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#fef4c0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d")!;
        ctx.fillStyle = "#fef4c0";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Fit image into canvas maintaining aspect ratio
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h);
        setHasStrokes(true);
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasStrokes) return;
    onSubmit(canvas.toDataURL("image/png"));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--us-bg)",
          borderRadius: 12,
          boxShadow: "0 24px 64px rgba(0,0,0,0.4)",
          display: "flex",
          flexDirection: "column",
          gap: 0,
          width: "min(520px, 95vw)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            background: "var(--us-dark)",
          }}
        >
          <span style={{ fontFamily: "'Sarabun', sans-serif", fontSize: 14, fontWeight: 700, color: "#f9f4eb" }}>
            ✍️ เขียนด้วยมือ
          </span>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(249,244,235,0.5)", display: "flex", padding: 4 }}
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Canvas */}
        <div style={{ position: "relative", background: "#e8e0cc", lineHeight: 0 }}>
          <canvas
            ref={canvasRef}
            width={520}
            height={280}
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
            style={{
              width: "100%",
              height: "auto",
              display: "block",
              cursor: erasing ? "cell" : "crosshair",
              touchAction: "none",
            }}
          />
          {!hasStrokes && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                fontFamily: "'Lora', Georgia, serif",
                fontStyle: "italic",
                fontSize: 15,
                color: "rgba(107,96,85,0.4)",
              }}
            >
              เขียนสิ่งที่อยากบอก...
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 14px",
            background: "var(--us-surface)",
            borderTop: "1px solid rgba(0,0,0,0.08)",
            flexWrap: "wrap",
          }}
        >
          {/* Color swatches */}
          <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => { setColor(c); setErasing(false); }}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: c,
                  border: color === c && !erasing ? "2px solid var(--us-orange)" : "2px solid transparent",
                  outline: color === c && !erasing ? "1px solid rgba(255,255,255,0.6)" : "none",
                  cursor: "pointer",
                  padding: 0,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: "rgba(0,0,0,0.12)", flexShrink: 0 }} />

          {/* Brush sizes */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {BRUSHES.map((s) => (
              <button
                key={s}
                onClick={() => { setBrushSize(s); setErasing(false); }}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: brushSize === s && !erasing ? "var(--us-dark)" : "rgba(0,0,0,0.1)",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                <div style={{
                  width: Math.min(s * 1.5, 14),
                  height: Math.min(s * 1.5, 14),
                  borderRadius: "50%",
                  background: brushSize === s && !erasing ? "#f9f4eb" : "#1a1a1a",
                }} />
              </button>
            ))}
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 20, background: "rgba(0,0,0,0.12)", flexShrink: 0 }} />

          {/* Tools */}
          <button
            onClick={() => setErasing((e) => !e)}
            title="ยางลบ"
            style={{
              background: erasing ? "var(--us-dark)" : "none",
              border: erasing ? "none" : "1px solid rgba(0,0,0,0.15)",
              borderRadius: 6,
              padding: "4px 8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: erasing ? "#f9f4eb" : "var(--us-muted)",
              fontSize: 11,
              fontFamily: "'Sarabun', sans-serif",
            }}
          >
            <Eraser size={13} strokeWidth={2} />
          </button>

          <button
            onClick={clearCanvas}
            title="ล้าง"
            style={{
              background: "none",
              border: "1px solid rgba(0,0,0,0.15)",
              borderRadius: 6,
              padding: "4px 8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "var(--us-muted)",
              fontSize: 11,
              fontFamily: "'Sarabun', sans-serif",
            }}
          >
            <Trash2 size={13} strokeWidth={2} />
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            title="อัปโหลดรูป"
            style={{
              background: "none",
              border: "1px solid rgba(0,0,0,0.15)",
              borderRadius: 6,
              padding: "4px 8px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 4,
              color: "var(--us-muted)",
              fontSize: 11,
              fontFamily: "'Sarabun', sans-serif",
            }}
          >
            <Upload size={13} strokeWidth={2} />
            <span>รูปภาพ</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleImageUpload} />

          <div style={{ flex: 1 }} />

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!hasStrokes}
            style={{
              background: hasStrokes ? "var(--us-orange)" : "rgba(0,0,0,0.1)",
              color: hasStrokes ? "#fff" : "rgba(0,0,0,0.3)",
              border: "none",
              borderRadius: 8,
              padding: "7px 16px",
              fontFamily: "'Sarabun', sans-serif",
              fontSize: 13,
              fontWeight: 700,
              cursor: hasStrokes ? "pointer" : "default",
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "background 0.2s",
            }}
          >
            ปล่อยโน้ต
            <Send size={13} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
