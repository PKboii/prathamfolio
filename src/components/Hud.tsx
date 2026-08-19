import { useEffect, useRef } from "react";
import { world } from "../lib/world";
import type { Chapter } from "../data/projects";

/** Film timecode + camera readout — the portfolio behaves like a screening. */
export default function Hud({ chapter }: { chapter: Chapter }) {
  const tc = useRef<HTMLSpanElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const p = world.pGlobal;
      const secs = p * 180; // the "film" runs three minutes
      const mm = String(Math.floor(secs / 60)).padStart(2, "0");
      const ss = String(Math.floor(secs % 60)).padStart(2, "0");
      const ff = String(Math.floor((secs * 24) % 24)).padStart(2, "0");
      if (tc.current) tc.current.textContent = `TC 00:${mm}:${ss}:${ff}`;
      if (fill.current) fill.current.style.transform = `scaleX(${p})`;
      if (top.current) top.current.style.transform = `scaleX(${p})`;
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      {/* progress hairline — all sizes */}
      <div className="fixed top-0 left-0 w-full h-[2px] z-[55] pointer-events-none" style={{ background: "color-mix(in srgb, var(--ink) 10%, transparent)" }}>
        <div ref={top} className="h-full w-full origin-left" style={{ background: "var(--accent)", transform: "scaleX(0)" }} />
      </div>

      <div className="fixed bottom-5 left-6 z-40 hidden md:block pointer-events-none t-mono text-[10px] tracking-[0.14em]" style={{ color: "var(--ink)" }}>
        <div className="flex items-center gap-3 opacity-80">
          <span className="blink" style={{ color: "#E4573D" }}>●</span>
          <span>REC</span>
          <span ref={tc}>TC 00:00:00:00</span>
        </div>
        <div className="mt-1.5 opacity-90">
          CH.{chapter.num} — {chapter.name}
        </div>
        <div className="mt-2 w-40 h-px overflow-hidden" style={{ background: "color-mix(in srgb, var(--ink) 18%, transparent)" }}>
          <div ref={fill} className="h-full w-full origin-left" style={{ background: "var(--accent)", transform: "scaleX(0)" }} />
        </div>
      </div>
    </>
  );
}
