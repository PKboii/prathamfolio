import { useEffect, useRef } from "react";
import { useFinePointer, useReducedMotion } from "../lib/hooks";

export default function Cursor() {
  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!fine || reduced) return;
    let x = -100, y = -100, rx = -100, ry = -100;
    let raf = 0;
    let visible = false;

    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      if (!visible) {
        visible = true;
        if (dot.current) dot.current.style.opacity = "1";
        if (ring.current) ring.current.style.opacity = "1";
      }
      const t = e.target as HTMLElement;
      const hot = !!t.closest?.("a, button, [data-cursor]");
      ring.current?.classList.toggle("hot", hot);
    };
    const down = () => dot.current && (dot.current.style.transform = `translate(${x - 3}px, ${y - 3}px) scale(2.2)`);
    const up = () => dot.current && (dot.current.style.transform = `translate(${x - 3}px, ${y - 3}px) scale(1)`);

    const loop = () => {
      rx += (x - rx) * 0.16;
      ry += (y - ry) * 0.16;
      if (ring.current) {
        const w = ring.current.offsetWidth / 2;
        ring.current.style.transform = `translate(${rx - w}px, ${ry - w}px)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      cancelAnimationFrame(raf);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;
  return (
    <>
      <div ref={dot} className="cursor-dot" style={{ opacity: 0 }} />
      <div ref={ring} className="cursor-ring" style={{ opacity: 0 }} />
    </>
  );
}
