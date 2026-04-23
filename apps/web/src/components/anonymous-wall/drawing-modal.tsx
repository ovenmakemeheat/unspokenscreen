"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { X, Trash2, Eraser, Upload, Send } from "lucide-react";

const COLORS = ["#1a1a1a", "#562634", "#2f597a", "#1e3a4f", "#ff751f", "#6b6055"];
const BRUSHES = [2, 4, 7, 12];

type Props = {
  onClose: () => void;
  onSubmit: (imageData: string) => void;
  displayName: string;
  onNameChange: (name: string) => void;
};

export function DrawingModal({ onClose, onSubmit, displayName, onNameChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#1a1a1a");
  const [brushSize, setBrushSize] = useState(4);
  const [erasing, setErasing] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);
  const drawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

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
    /* Backdrop */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-us-bg rounded-xl shadow-2xl flex flex-col overflow-hidden w-[min(520px,95vw)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-us-dark">
          <span className="text-[14px] font-bold text-us-cream">✍️ เขียนด้วยมือ</span>
          <button
            onClick={onClose}
            className="bg-transparent border-none cursor-pointer text-us-cream/50 flex p-1 hover:text-us-cream/80 transition-colors"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {/* Canvas area */}
        <div className="relative bg-[#e8e0cc] leading-none">
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
            className={`w-full h-auto block ${erasing ? "cursor-cell" : "cursor-crosshair"}`}
            style={{ touchAction: "none" }}
          />
          {!hasStrokes && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none font-[family-name:var(--font-lora)] italic text-[15px] text-us-muted/40">
              เขียนสิ่งที่อยากบอก...
            </div>
          )}
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 px-3.5 py-2.5 bg-us-surface border-t border-black/8 flex-wrap">
          {/* Color swatches */}
          <div className="flex gap-1.5 items-center">
            {COLORS.map((c) => (
              <button
                key={c}
                onClick={() => { setColor(c); setErasing(false); }}
                className="w-[18px] h-[18px] rounded-full cursor-pointer p-0 shrink-0 transition-[outline]"
                style={{
                  background: c,
                  border: color === c && !erasing ? "2px solid var(--us-orange)" : "2px solid transparent",
                  outline: color === c && !erasing ? "1px solid rgba(255,255,255,0.6)" : "none",
                }}
              />
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-black/12 shrink-0" />

          {/* Brush sizes */}
          <div className="flex gap-1.5 items-center">
            {BRUSHES.map((s) => (
              <button
                key={s}
                onClick={() => { setBrushSize(s); setErasing(false); }}
                className="w-6 h-6 rounded-full border-none cursor-pointer flex items-center justify-center p-0"
                style={{ background: brushSize === s && !erasing ? "var(--us-dark)" : "rgba(0,0,0,0.1)" }}
              >
                <div
                  className="rounded-full"
                  style={{
                    width: Math.min(s * 1.5, 14),
                    height: Math.min(s * 1.5, 14),
                    background: brushSize === s && !erasing ? "#f9f4eb" : "#1a1a1a",
                  }}
                />
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-black/12 shrink-0" />

          {/* Tool buttons */}
          <button
            onClick={() => setErasing((e) => !e)}
            title="ยางลบ"
            className={`border rounded-md px-2 py-1 cursor-pointer flex items-center gap-1 text-[11px] transition-colors ${
              erasing
                ? "bg-us-dark border-transparent text-us-cream"
                : "bg-transparent border-black/15 text-us-muted"
            }`}
          >
            <Eraser size={13} strokeWidth={2} />
          </button>

          <button
            onClick={clearCanvas}
            title="ล้าง"
            className="bg-transparent border border-black/15 rounded-md px-2 py-1 cursor-pointer flex items-center gap-1 text-us-muted text-[11px] hover:bg-black/5 transition-colors"
          >
            <Trash2 size={13} strokeWidth={2} />
          </button>

          <button
            onClick={() => fileRef.current?.click()}
            title="อัปโหลดรูป"
            className="bg-transparent border border-black/15 rounded-md px-2 py-1 cursor-pointer flex items-center gap-1 text-us-muted text-[11px] hover:bg-black/5 transition-colors"
          >
            <Upload size={13} strokeWidth={2} />
            <span>รูปภาพ</span>
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />

          <div className="flex-1" />

          {/* Name input */}
          <input
            type="text"
            value={displayName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="ชื่อ (ไม่บังคับ)"
            maxLength={30}
            className="bg-us-bg border border-black/15 rounded-md px-2 py-[5px] text-[11px] text-us-text outline-none w-[120px] focus:border-us-blue transition-colors"
          />

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!hasStrokes}
            className={`rounded-lg px-4 py-[7px] text-[13px] font-bold flex items-center gap-1.5 transition-colors ${
              hasStrokes
                ? "bg-us-orange text-white cursor-pointer hover:bg-orange-500"
                : "bg-black/10 text-black/30 cursor-default"
            }`}
          >
            ปล่อยโน้ต
            <Send size={13} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}
