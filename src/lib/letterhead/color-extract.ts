// Extract a small palette from an image URL using a downscaled canvas.
export async function extractPalette(url: string): Promise<{ primary: string; accent: string } | null> {
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    const W = 60;
    const ratio = img.height / img.width;
    canvas.width = W;
    canvas.height = Math.max(1, Math.round(W * ratio));
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const buckets = new Map<string, { count: number; r: number; g: number; b: number }>();
    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 200) continue;
      const r = data[i], g = data[i + 1], b = data[i + 2];
      // skip near-white and near-black
      const max = Math.max(r, g, b), min = Math.min(r, g, b);
      if (max > 240 && min > 240) continue;
      if (max < 25) continue;
      const key = `${r >> 4},${g >> 4},${b >> 4}`;
      const e = buckets.get(key);
      if (e) { e.count++; e.r += r; e.g += g; e.b += b; }
      else buckets.set(key, { count: 1, r, g, b });
    }
    const sorted = [...buckets.values()].sort((a, b) => b.count - a.count);
    if (!sorted.length) return null;
    const top = (i: number) => {
      const e = sorted[Math.min(i, sorted.length - 1)];
      return rgbToHex(Math.round(e.r / e.count), Math.round(e.g / e.count), Math.round(e.b / e.count));
    };
    return { primary: top(0), accent: top(Math.min(2, sorted.length - 1)) };
  } catch {
    return null;
  }
}

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = url;
  });
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
}