import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile, useReducedMotion } from "../lib/hooks";

gsap.registerPlugin(ScrollTrigger);

/**
 * Frame 00 — a dark stage. The person is announced by the header mark;
 * the scene itself stays quiet: film strip info top-left, one instruction
 * bottom-left. Scrolling drives the camera forward through the stage.
 */
export default function Hero() {
  const section = useRef<HTMLElement>(null);
  const leave = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!section.current || !leave.current || reduced) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
      },
    });
    tl.to(leave.current, { opacity: 0, yPercent: -26, ease: "none", duration: 0.5 }, 0);
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [reduced]);

  return (
    <section
      ref={section}
      id="hero"
      data-chapter="hero"
      style={{ height: (isMobile ? 170 : 180) + "vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div ref={leave} className="absolute inset-0 z-10 pointer-events-none">
          {/* film-strip slate */}
          <div className="absolute top-20 md:top-24 left-5 md:left-8 t-mono text-[10px] md:text-[11px] tracking-[0.2em]">
            <p className="opacity-70 rise" style={{ animationDelay: "0.6s" }}>
              PORTFOLIO FILM — VOL.01
            </p>
            <p className="mt-2.5 flex items-center gap-2 rise" style={{ animationDelay: "0.8s" }}>
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "var(--accent)" }} />
              AVAILABLE FOR WORK
            </p>
          </div>

          {/* single instruction */}
          <div
            className="absolute bottom-7 md:bottom-9 left-5 md:left-8 flex items-center gap-3 t-mono text-[10px] tracking-[0.18em] opacity-75 rise"
            style={{ animationDelay: "1.15s" }}
          >
            <svg width="11" height="14" viewBox="0 0 12 14" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M6 1v10m0 0L2.5 7.5M6 11l3.5-3.5" />
            </svg>
            SCROLL — THE CAMERA DOLLIES FORWARD
          </div>

          <div
            className="absolute bottom-7 md:bottom-9 right-6 md:right-10 hidden md:block t-mono text-[10px] tracking-[0.22em] opacity-45 rise"
            style={{ animationDelay: "1.3s" }}
          >
            07 WORLDS · ONE CAMERA
          </div>
        </div>
      </div>
    </section>
  );
}
