import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";

const INK = "#011B43";

/**
 * A cartoon eye whose pupil springs toward the pointer. With no pointer around
 * (phones), it wanders on its own. Pass `closed` to squeeze it shut.
 */
export function GooglyEye({ size = 46, closed = false }: { size?: number; closed?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const x = useSpring(0, { stiffness: 320, damping: 9 });
  const y = useSpring(0, { stiffness: 320, damping: 9 });

  useEffect(() => {
    if (reduced) return;
    const reach = size * 0.2;
    let lastMove = 0;
    const onMove = (event: PointerEvent) => {
      const element = ref.current;
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const dx = event.clientX - (rect.left + rect.width / 2);
      const dy = event.clientY - (rect.top + rect.height / 2);
      const distance = Math.hypot(dx, dy) || 1;
      const scale = Math.min(reach, distance / 6) / distance;
      x.set(dx * scale);
      y.set(dy * scale);
      lastMove = Date.now();
    };
    const idle = window.setInterval(() => {
      if (Date.now() - lastMove < 2500) return;
      const angle = Math.random() * Math.PI * 2;
      x.set(Math.cos(angle) * reach);
      y.set(Math.sin(angle) * reach);
    }, 1700);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.clearInterval(idle);
    };
  }, [reduced, size, x, y]);

  return (
    <span
      ref={ref}
      style={{ width: size, height: size, borderColor: INK }}
      className="relative inline-flex items-center justify-center overflow-hidden rounded-full border-[3px] bg-white"
    >
      <motion.span
        style={{ x, y, width: size * 0.42, height: size * 0.42, backgroundColor: INK }}
        className="rounded-full"
      />
      {/* eyelid */}
      <motion.span
        aria-hidden
        initial={false}
        animate={{ y: closed ? "0%" : "-105%" }}
        transition={{ type: "spring", stiffness: 420, damping: 22 }}
        style={{ borderColor: INK }}
        className="absolute inset-0 border-b-[3px] bg-[#FFD43B]"
      />
    </span>
  );
}
