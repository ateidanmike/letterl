import html2canvas from "html2canvas";

export async function exportPng(node: HTMLElement, filename: string, mime: "image/png" | "image/jpeg" = "image/png") {
  const prevTransform = node.style.transform;
  const prevOrigin = node.style.transformOrigin;
  node.style.transform = "none";
  node.style.transformOrigin = "top left";

  const overrideStyle = document.createElement("style");
  overrideStyle.textContent = `#letterhead-page, #letterhead-page * {
    border-color: #e2e8f0 !important;
    outline-color: #e2e8f0 !important;
  }`;
  document.head.appendChild(overrideStyle);

  try {
    const canvas = await html2canvas(node, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: node.offsetWidth,
      height: node.offsetHeight,
      onclone: (doc) => {
        const props = ["color", "backgroundColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "outlineColor", "fill", "stroke"];
        doc.querySelectorAll<HTMLElement>("*").forEach((el) => {
          const cs = doc.defaultView?.getComputedStyle(el);
          if (!cs) return;
          props.forEach((p) => {
            const v = (cs as unknown as Record<string, string>)[p];
            if (v && v.includes("oklch")) {
              const fb = p === "color" ? "#0f172a" : p === "backgroundColor" ? "transparent" : "#e2e8f0";
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
    node.style.transform = prevTransform;
    node.style.transformOrigin = prevOrigin;
    overrideStyle.remove();
  }
}