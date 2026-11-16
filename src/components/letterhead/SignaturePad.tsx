import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Eraser, Upload } from "lucide-react";
import { containRect, loadImage, signatureFromFile } from "@/lib/signature";

type Props = {
  value: string | null | undefined;
  onChange: (dataUrl: string | null) => void;
};

// Drawn at twice the displayed size so the signature stays sharp in exports.
const WIDTH = 1000;
const HEIGHT = 280;
const INK = "#0f172a";

export function SignaturePad({ value, onChange }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const drawingRef = useRef(false);
  /** The value this pad last produced itself; the canvas already shows it. */
  const emittedRef = useRef<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Show a signature that came from outside (a saved one, or an upload).
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const current = value ?? null;
    if (current === emittedRef.current) return;
    emittedRef.current = current;
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    if (!current) return;
    let cancelled = false;
    loadImage(current)
      .then((img) => {
        if (cancelled || drawingRef.current) return;
        const box = containRect(
          img.naturalWidth || img.width,
          img.naturalHeight || img.height,
          WIDTH,
          HEIGHT,
        );
        ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.drawImage(img, box.x, box.y, box.width, box.height);
      })
      .catch(() => {
        // A broken saved image just leaves the pad empty.
      });
    return () => {
      cancelled = true;
    };
  }, [value]);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) * WIDTH) / (rect.width || WIDTH),
      y: ((e.clientY - rect.top) * HEIGHT) / (rect.height || HEIGHT),
    };
  };

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (e.button !== undefined && e.button > 0) return;
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    e.preventDefault();
    // Keep receiving the stroke even if the pointer slips outside the pad.
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Not supported for this pointer; drawing still works inside the pad.
    }
    drawingRef.current = true;
    const { x, y } = point(e);
    ctx.lineWidth = 5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = INK;
    ctx.fillStyle = INK;
    // A dot, so a tap or the dot of an "i" leaves a mark.
    ctx.beginPath();
    ctx.arc(x, y, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    const { x, y } = point(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const end = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    const dataUrl = e.currentTarget.toDataURL("image/png");
    emittedRef.current = dataUrl;
    onChange(dataUrl);
  };

  const clear = () => {
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, WIDTH, HEIGHT);
    emittedRef.current = null;
    onChange(null);
  };

  const upload = async (file: File) => {
    setBusy(true);
    try {
      onChange(await signatureFromFile(file));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not use that image.");
    } finally {
      setBusy(false);
      // Let the same file be chosen again after a clear.
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          aria-label="Signature pad"
          className="block w-full cursor-crosshair touch-none rounded border bg-white"
          style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
        />
        {!value && (
          <p className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs text-slate-400">
            Sign here with your mouse or finger
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button type="button" size="sm" variant="ghost" onClick={clear} disabled={!value}>
          <Eraser className="mr-1 h-3 w-3" /> Clear
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
        />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="mr-1 h-3 w-3" /> {busy ? "Uploading…" : "Upload image"}
        </Button>
      </div>
    </div>
  );
}
