/** Largest size an uploaded signature is stored at; keeps saved documents small. */
export const SIGNATURE_MAX = { width: 600, height: 240 };

/** Scale a width and height to fit inside a box, keeping the proportions. Never enlarges. */
export function fitWithin(width: number, height: number, maxWidth: number, maxHeight: number) {
  if (width <= 0 || height <= 0) return { width: 0, height: 0 };
  const scale = Math.min(1, maxWidth / width, maxHeight / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

/** Where to draw an image so it sits centred inside a box, keeping the proportions. */
export function containRect(width: number, height: number, boxWidth: number, boxHeight: number) {
  if (width <= 0 || height <= 0) return { x: 0, y: 0, width: 0, height: 0 };
  const scale = Math.min(boxWidth / width, boxHeight / height);
  const w = width * scale;
  const h = height * scale;
  return { x: (boxWidth - w) / 2, y: (boxHeight - h) / 2, width: w, height: h };
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("That image could not be read."));
    img.src = src;
  });
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("That file could not be read."));
    reader.readAsDataURL(file);
  });
}

/** Read an uploaded signature image and shrink it to a storable PNG data URL. */
export async function signatureFromFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Choose an image file (PNG or JPG).");
  const original = await readAsDataUrl(file);
  const img = await loadImage(original);
  const size = fitWithin(
    img.naturalWidth || img.width,
    img.naturalHeight || img.height,
    SIGNATURE_MAX.width,
    SIGNATURE_MAX.height,
  );
  if (!size.width || !size.height) throw new Error("That image could not be read.");
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return original;
  ctx.drawImage(img, 0, 0, size.width, size.height);
  return canvas.toDataURL("image/png");
}
