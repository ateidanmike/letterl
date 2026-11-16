import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { signatureFromFile, loadImage, toastError } = vi.hoisted(() => ({
  signatureFromFile: vi.fn(),
  loadImage: vi.fn(),
  toastError: vi.fn(),
}));
vi.mock("sonner", () => ({ toast: { error: toastError } }));
vi.mock("@/lib/signature", async (original) => ({
  ...(await original<typeof import("@/lib/signature")>()),
  signatureFromFile,
  loadImage,
}));

import { SignaturePad } from "./SignaturePad";

let ctx: Record<string, ReturnType<typeof vi.fn>>;
let exported: number;

beforeEach(() => {
  exported = 0;
  ctx = Object.fromEntries(
    ["clearRect", "beginPath", "arc", "fill", "moveTo", "lineTo", "stroke", "drawImage"].map(
      (name) => [name, vi.fn()],
    ),
  );
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    ctx as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockImplementation(
    () => `data:image/png;base64,STROKE${++exported}`,
  );
  HTMLCanvasElement.prototype.setPointerCapture = vi.fn();
  signatureFromFile.mockReset();
  loadImage.mockReset().mockResolvedValue({ naturalWidth: 500, naturalHeight: 100 });
  toastError.mockReset();
});
afterEach(cleanup);

const pad = () => screen.getByLabelText("Signature pad");

describe("SignaturePad", () => {
  it("saves the drawing when a stroke ends", () => {
    const onChange = vi.fn();
    render(<SignaturePad value={null} onChange={onChange} />);

    fireEvent.pointerDown(pad(), { clientX: 10, clientY: 10 });
    fireEvent.pointerMove(pad(), { clientX: 40, clientY: 30 });
    expect(onChange).not.toHaveBeenCalled();
    fireEvent.pointerUp(pad());

    expect(ctx.lineTo).toHaveBeenCalledTimes(1);
    expect(ctx.stroke).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("data:image/png;base64,STROKE1");
  });

  it("leaves a mark for a single tap", () => {
    const onChange = vi.fn();
    render(<SignaturePad value={null} onChange={onChange} />);

    fireEvent.pointerDown(pad(), { clientX: 10, clientY: 10 });
    fireEvent.pointerUp(pad());

    expect(ctx.arc).toHaveBeenCalledTimes(1);
    expect(ctx.fill).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("ignores pointer movement when not drawing", () => {
    const onChange = vi.fn();
    render(<SignaturePad value={null} onChange={onChange} />);

    fireEvent.pointerMove(pad(), { clientX: 40, clientY: 30 });
    fireEvent.pointerUp(pad());

    expect(ctx.lineTo).not.toHaveBeenCalled();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("keeps earlier strokes on the pad when its own drawing comes back as the value", async () => {
    const onChange = vi.fn();
    const { rerender } = render(<SignaturePad value={null} onChange={onChange} />);
    fireEvent.pointerDown(pad(), { clientX: 10, clientY: 10 });
    fireEvent.pointerUp(pad());
    ctx.clearRect.mockClear();

    rerender(<SignaturePad value={onChange.mock.calls[0][0]} onChange={onChange} />);
    await Promise.resolve();

    expect(ctx.clearRect).not.toHaveBeenCalled();
    expect(loadImage).not.toHaveBeenCalled();
  });

  it("shows a saved signature without stretching it", async () => {
    render(<SignaturePad value="data:image/png;base64,SAVED" onChange={vi.fn()} />);

    await waitFor(() => expect(ctx.drawImage).toHaveBeenCalledTimes(1));
    expect(loadImage).toHaveBeenCalledWith("data:image/png;base64,SAVED");
    // A 500x100 image in the 1000x280 pad: full width, centred vertically.
    expect(ctx.drawImage.mock.calls[0].slice(1)).toEqual([0, 40, 1000, 200]);
  });

  it("clears the signature", () => {
    const onChange = vi.fn();
    render(<SignaturePad value="data:image/png;base64,SAVED" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: /clear/i }));

    expect(onChange).toHaveBeenCalledWith(null);
    expect(ctx.clearRect).toHaveBeenCalled();
  });

  it("has nothing to clear on an empty pad", () => {
    render(<SignaturePad value={null} onChange={vi.fn()} />);
    expect((screen.getByRole("button", { name: /clear/i }) as HTMLButtonElement).disabled).toBe(
      true,
    );
    expect(screen.getByText(/sign here/i)).toBeTruthy();
  });

  it("uses an uploaded image and lets the same file be chosen again", async () => {
    signatureFromFile.mockResolvedValue("data:image/png;base64,UPLOAD");
    const onChange = vi.fn();
    const { container } = render(<SignaturePad value={null} onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    const file = new File(["x"], "sig.png", { type: "image/png" });

    fireEvent.change(input, { target: { files: [file] } });

    await waitFor(() => expect(onChange).toHaveBeenCalledWith("data:image/png;base64,UPLOAD"));
    expect(signatureFromFile).toHaveBeenCalledWith(file);
    expect(input.value).toBe("");
  });

  it("explains an upload that cannot be used and keeps the current signature", async () => {
    signatureFromFile.mockRejectedValue(new Error("Choose an image file (PNG or JPG)."));
    const onChange = vi.fn();
    const { container } = render(<SignaturePad value={null} onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    fireEvent.change(input, { target: { files: [new File(["x"], "a.pdf")] } });

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith("Choose an image file (PNG or JPG)."),
    );
    expect(onChange).not.toHaveBeenCalled();
  });
});
