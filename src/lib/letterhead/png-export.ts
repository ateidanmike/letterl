import html2canvas from "html2canvas";

export async function exportPng(
  node: HTMLElement,
  filename: string,
  mime: "image/png" | "image/jpeg" = "image/png",
) {
  const { node: captureNode, cleanup } = await createCaptureNode(node);

  // See pdf-export.ts: borders keep their real colours; onclone handles oklch.
  const overrideStyle = document.createElement("style");
  overrideStyle.textContent = `#letterhead-page, #letterhead-page * {
    text-decoration-color: inherit !important;
    caret-color: auto !important;
  }`;
  document.head.appendChild(overrideStyle);

  try {
    const captureWidth = captureNode.scrollWidth || captureNode.offsetWidth;
    const captureHeight = captureNode.scrollHeight || captureNode.offsetHeight;
    const canvas = await html2canvas(captureNode, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: captureWidth,
      height: captureHeight,
      windowWidth: captureWidth,
      windowHeight: captureHeight,
      onclone: (doc) => {
        const props = [
          "color",
          "backgroundColor",
          "borderTopColor",
          "borderRightColor",
          "borderBottomColor",
          "borderLeftColor",
          "outlineColor",
          "fill",
          "stroke",
        ];
        doc.querySelectorAll<HTMLElement>("*").forEach((el) => {
          const cs = doc.defaultView?.getComputedStyle(el);
          if (!cs) return;
          props.forEach((p) => {
            const v = (cs as unknown as Record<string, string>)[p];
            if (v && v.includes("oklch")) {
              const fb =
                p === "color" ? "#0f172a" : p === "backgroundColor" ? "transparent" : "#e2e8f0";
              (el.style as unknown as Record<string, string>)[p] = fb;
            }
          });
        });
      },
    });
    const ext = mime === "image/jpeg" ? "jpg" : "png";
    const dataUrl = canvas.toDataURL(mime, 0.95);
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename.endsWith(`.${ext}`) ? filename : `${filename}.${ext}`;
    a.click();
  } finally {
    cleanup();
    overrideStyle.remove();
  }
}

async function createCaptureNode(node: HTMLElement) {
  const width = node.scrollWidth || node.offsetWidth || 794;
  const height = node.scrollHeight || node.offsetHeight || 1123;
  const clone = node.cloneNode(true) as HTMLElement;
  clone.style.transform = "none";
  clone.style.transformOrigin = "top left";
  clone.style.width = `${width}px`;
  clone.style.minHeight = `${height}px`;

  const wrapper = document.createElement("div");
  wrapper.style.position = "fixed";
  wrapper.style.left = "-10000px";
  wrapper.style.top = "0";
  wrapper.style.width = `${width}px`;
  wrapper.style.minHeight = `${height}px`;
  wrapper.style.background = "#ffffff";
  wrapper.style.transform = "none";
  wrapper.style.opacity = "1";
  wrapper.style.pointerEvents = "none";
  wrapper.appendChild(clone);
  document.body.appendChild(wrapper);

  await waitForImages(clone);

  return {
    node: clone,
    cleanup: () => wrapper.remove(),
  };
}

async function waitForImages(node: HTMLElement) {
  const images = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    images.map((img) => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    }),
  );
}
