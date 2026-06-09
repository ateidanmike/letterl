// Extract dominant brand colors from a logo URL using a downscaled canvas.
export async function extractPalette(url: string): Promise<{ primary: string; accent: string } | null> {
  try {
    const img = await loadImage(url);
    const canvas = document.createElement("canvas");
    const maxSize = 180;
    const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
    canvas.width = Math.max(1, Math.round(img.width * scale));
    canvas.height = Math.max(1, Math.round(img.height * scale));
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    const buckets = new Map<string, { count: number; r: number; g: number; b: number; saturation: number }>();

    for (let i = 0; i < data.length; i += 4) {
      const a = data[i + 3];
      if (a < 160) continue;

      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      const lightness = (max + min) / 510;
      const saturation = max === min ? 0 : (max - min) / (255 * (1 - Math.abs(2 * lightness - 1)));

      if (lightness > 0.94 || lightness < 0.04 || saturation < 0.12) continue;

      // 8-level buckets preserve the visual logo color better than broad 16-level averaging.
      const key = `${r >> 3},${g >> 3},${b >> 3}`;
      const entry = buckets.get(key);
      if (entry) {
        entry.count++;
        entry.r += r;
        entry.g += g;
        entry.b += b;
        entry.saturation += saturation;
      } else {
        buckets.set(key, { count: 1, r, g, b, saturation });
      }
    }

    const colors = [...buckets.values()]
      .map((entry) => {
        const r = Math.round(entry.r / entry.count);
        const g = Math.round(entry.g / entry.count);
        const b = Math.round(entry.b / entry.count);
        const saturation = entry.saturation / entry.count;
        return {
          r,
          g,
          b,
          count: entry.count,
          saturation,
          score: entry.count * (1 + saturation),
          hex: rgbToHex(r, g, b),
        };
      })
      .sort((a, b) => b.score - a.score);

    if (!colors.length) return null;

    const primary = colors[0];
    const accent = colors.find((color) => colorDistance(color, primary) > 48) ?? colors[1] ?? primary;
    return { primary: primary.hex, accent: accent.hex };
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

function colorDistance(a: { r: number; g: number; b: number }, b: { r: number; g: number; b: number }) {
  return Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
}