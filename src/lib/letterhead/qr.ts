import QRCode from "qrcode";

export async function makeQrDataUrl(text: string, size = 96): Promise<string> {
  return QRCode.toDataURL(text, {
    width: size,
    margin: 0,
    color: { dark: "#0f172a", light: "#ffffff" },
  });
}