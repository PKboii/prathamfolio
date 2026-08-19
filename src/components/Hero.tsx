import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile, useReducedMotion } from "../lib/hooks";

gsap.registerPlugin(ScrollTrigger);

const NAME = "PRATHAM";

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
      style={{ height: isMobile ? "170vh" : "200vh" }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        <div ref={leave} className="absolute inset-0 z-10 pointer-events-none">
          {/* top strip */}
          <div className="absolute top-20 md:top-24 left-5 md:left-8 t-mono text-[10px] md:text-[11px] tracking-[0.2em]">
            <p className="opacity-70 rise" style={{ animationDelay: "1.5s" }}>PORTFOLIO FILM — VOL.01</p>
            <p className="mt-2 flex items-center gap-2 rise" style={{ animationDelay: "1.7s" }}>
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "var(--accent)" }} />
              AVAILABLE FOR WORK
            </p>
          </div>

          {/* ghost chapter number */}
          <div className="absolute top-16 right-6 md:right-10 t-display stroke-text text-[26vw] md:text-[13vw] leading-none opacity-40 select-none rise" style={{ animationDelay: "0.9s" }}>
            00
          </div>

          {/* the name */}
          <div className="absolute left-5 md:left-8 top-1/2 -translate-y-[54%] mix-blend-difference text-white">
            <h1 className="t-display text-[clamp(4.2rem,16.5vw,15rem)] overflow-hidden" aria-label="Pratham">
              {NAME.split("").map((ch, i) => (
                <span key={i} className="letter" style={{ animationDelay: `${0.25 + i * 0.055}s` }}>
                  {ch}
                </span>
              ))}
            </h1>
            <p className="t-display stroke-text -mt-[0.6em] md:-mt-[0.75em] text-[clamp(1.5rem,5vw,4.4rem)] tracking-wide overflow-hidden">
              <span className="letter" style={{ animationDelay: "0.85s", display: "inline-block" }}>KHINVSARA</span>
            </p>
            <p className="t-mono text-[9px] md:text-[11px] tracking-[0.22em] mt-5 opacity-80 rise" style={{ animationDelay: "1.35s" }}>
              ENGINEER — FULL STACK · PROBLEM SOLVER · SYSTEMS BUILDER
            </p>
          </div>

          {/* bottom strip */}
          <div className="absolute bottom-6 md:bottom-8 left-5 md:left-8 t-mono text-[10px] tracking-[0.18em] opacity-70 rise" style={{ animationDelay: "1.9s" }}>
            <p>SCROLL — THE CAMERA DOLLIES FORWARD</p>
            <p className="mt-1.5 opacity-70">07 CHAPTERS · 07 LIVE WORLDS AHEAD</p>
          </div>

          {/* rotating scroll badge */}
          {!isMobile && (
            <div className="absolute bottom-8 right-10 w-32 h-32 rise" style={{ animationDelay: "2.05s" }}>
              <svg viewBox="0 0 120 120" className="w-full h-full spin-slow t-mono" style={{ letterSpacing: "2.5px" }}>
                <defs>
                  <path id="heroCircle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" fill="none" />
                </defs>
                <text fontSize="8.2" fill="currentColor" opacity="0.75">
                  <textPath href="#heroCircle">WALK THROUGH SEVEN WORLDS · SCROLL ·&#160;</textPath>
                </text>
              </svg>
              <svg viewBox="0 0 24 24" className="absolute inset-0 m-auto w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M12 4v14m0 0l-5-5m5 5l5-5" />
              </svg>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
