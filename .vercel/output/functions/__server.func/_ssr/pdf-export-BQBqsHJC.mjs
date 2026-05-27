import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { R as Root2, V as Value, T as Trigger, I as Icon, P as Portal, C as Content2, a as Viewport, b as Item, c as ItemIndicator, d as ItemText, S as ScrollUpButton, e as ScrollDownButton, L as Label, f as Separator } from "../_libs/radix-ui__react-select.mjs";
import { c as cn } from "./button-Cz8PAkJh.mjs";
import { j as jsPDF } from "../_libs/jspdf.mjs";
import { h as html2canvas } from "../_libs/html2canvas.mjs";
import { s as ChevronDown, C as Check, t as ChevronUp } from "../_libs/lucide-react.mjs";
const Select = Root2;
const SelectValue = Value;
const SelectTrigger = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Trigger,
  {
    ref,
    className: cn(
      "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className
    ),
    ...props,
    children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4 opacity-50" }) })
    ]
  }
));
SelectTrigger.displayName = Trigger.displayName;
const SelectScrollUpButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollUpButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronUp, { className: "h-4 w-4" })
  }
));
SelectScrollUpButton.displayName = ScrollUpButton.displayName;
const SelectScrollDownButton = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  ScrollDownButton,
  {
    ref,
    className: cn("flex cursor-default items-center justify-center py-1", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
  }
));
SelectScrollDownButton.displayName = ScrollDownButton.displayName;
const SelectContent = reactExports.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Content2,
  {
    ref,
    className: cn(
      "relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)",
      position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
      className
    ),
    position,
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollUpButton, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Viewport,
        {
          className: cn(
            "p-1",
            position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          ),
          children
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SelectScrollDownButton, {})
    ]
  }
) }));
SelectContent.displayName = Content2.displayName;
const SelectLabel = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Label,
  {
    ref,
    className: cn("px-2 py-1.5 text-sm font-semibold", className),
    ...props
  }
));
SelectLabel.displayName = Label.displayName;
const SelectItem = reactExports.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
  Item,
  {
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    ),
    ...props,
    children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4" }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(ItemText, { children })
    ]
  }
));
SelectItem.displayName = Item.displayName;
const SelectSeparator = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Separator,
  {
    ref,
    className: cn("-mx-1 my-1 h-px bg-muted", className),
    ...props
  }
));
SelectSeparator.displayName = Separator.displayName;
const PAGE_MM = {
  a4: [210, 297],
  letter: [216, 279],
  legal: [216, 356]
};
function getPageMm(format = "a4", orientation = "portrait") {
  const [w, h] = PAGE_MM[format] ?? PAGE_MM.a4;
  return orientation === "landscape" ? [h, w] : [w, h];
}
async function exportPdf(node, filename, letter) {
  const blob = await exportPdfBlob(node, letter);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".pdf") ? filename : `${filename}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}
async function exportPdfBlob(node, letter) {
  const prevTransform = node.style.transform;
  const prevOrigin = node.style.transformOrigin;
  node.style.transform = "none";
  node.style.transformOrigin = "top left";
  const overrideStyle = document.createElement("style");
  overrideStyle.setAttribute("data-pdf-export-override", "true");
  overrideStyle.textContent = `
    #letterhead-page, #letterhead-page * {
      border-color: #e2e8f0 !important;
      outline-color: #e2e8f0 !important;
      text-decoration-color: inherit !important;
      caret-color: auto !important;
    }
  `;
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
      windowWidth: node.offsetWidth,
      windowHeight: node.offsetHeight,
      onclone: (clonedDoc) => {
        const COLOR_PROPS = [
          "color",
          "backgroundColor",
          "borderTopColor",
          "borderRightColor",
          "borderBottomColor",
          "borderLeftColor",
          "outlineColor",
          "fill",
          "stroke"
        ];
        const all = clonedDoc.querySelectorAll("*");
        all.forEach((el) => {
          const cs = clonedDoc.defaultView?.getComputedStyle(el);
          if (!cs) return;
          COLOR_PROPS.forEach((prop) => {
            const value = cs[prop];
            if (value && value.includes("oklch")) {
              const fallback = prop === "color" ? "#0f172a" : prop === "backgroundColor" ? "transparent" : "#e2e8f0";
              el.style[prop] = fallback;
            }
          });
        });
      }
    });
    const imgData = canvas.toDataURL("image/png");
    const fmt = letter?.page_format ?? "a4";
    const orient = letter?.page_orientation ?? "portrait";
    const margin = letter?.margin_mm ?? 0;
    const [pageWmm, pageHmm] = getPageMm(fmt, orient);
    const pdf = new jsPDF({ unit: "mm", format: [pageWmm, pageHmm], orientation: orient });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const contentW = pageW - margin * 2;
    const contentH = pageH - margin * 2;
    const imgHeight = canvas.height * contentW / canvas.width;
    if (imgHeight <= contentH + 0.5) {
      pdf.addImage(imgData, "PNG", margin, margin, contentW, imgHeight, void 0, "FAST");
      drawPageNumber(pdf, 1, 1, pageW, pageH);
    } else {
      const pxPerMm = canvas.width / contentW;
      const sliceHeightPx = Math.floor(contentH * pxPerMm);
      let renderedPx = 0;
      const sliceCanvas = document.createElement("canvas");
      sliceCanvas.width = canvas.width;
      const ctx = sliceCanvas.getContext("2d");
      let first = true;
      const totalPages = Math.ceil(canvas.height / sliceHeightPx);
      let pageIndex = 0;
      while (renderedPx < canvas.height) {
        const remaining = canvas.height - renderedPx;
        const currentSlicePx = Math.min(sliceHeightPx, remaining);
        sliceCanvas.height = currentSlicePx;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
        ctx.drawImage(
          canvas,
          0,
          renderedPx,
          canvas.width,
          currentSlicePx,
          0,
          0,
          canvas.width,
          currentSlicePx
        );
        const sliceData = sliceCanvas.toDataURL("image/png");
        const sliceHeightMm = currentSlicePx / pxPerMm;
        if (!first) pdf.addPage();
        pdf.addImage(sliceData, "PNG", margin, margin, contentW, sliceHeightMm, void 0, "FAST");
        pageIndex += 1;
        drawPageNumber(pdf, pageIndex, totalPages, pageW, pageH);
        first = false;
        renderedPx += currentSlicePx;
      }
    }
    return pdf.output("blob");
  } finally {
    node.style.transform = prevTransform;
    node.style.transformOrigin = prevOrigin;
    overrideStyle.remove();
  }
}
function drawPageNumber(pdf, current, total, pageW, pageH) {
  const label = `Page ${current} of ${total}`;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(110, 110, 110);
  pdf.text(label, pageW - 8, pageH - 4, { align: "right" });
}
export {
  Select as S,
  SelectTrigger as a,
  SelectValue as b,
  SelectContent as c,
  SelectItem as d,
  exportPdf as e
};
