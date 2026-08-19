import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Chapter, Project } from "../data/projects";
import { useIsMobile, useReducedMotion, useRevealObserver } from "../lib/hooks";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  chapter: Chapter;
  projects: Project[];
  onDetails: (p: Project) => void;
  onNav: (target: string) => void;
}

/**
 * How much of the section is spent arriving before the chapter title shows.
 * The dark→light corridor transitions need headroom so titles never appear
 * over the wrong world.
 */
const LEADS: Record<string, number> = {
  experimental: 0,
  digital: 0.22,
  brands: 0.18,
  architecture: 0.12,
  showroom: 0.08,
};

function hostOf(url: string) {
  return url.replace("https://", "").replace("/", "");
}

function PanelBody({ p, onDetails }: { p: Project; onDetails: (p: Project) => void }) {
  return (
    <>
      <div className="flex items-center gap-3 t-mono text-[10px] tracking-[0.2em]" style={{ color: "var(--muted)" }}>
        <span style={{ color: "var(--accent)" }}>P.{p.num}</span>
        <span className="px-2 py-0.5 border" style={{ borderColor: "var(--line)" }}>{p.category.toUpperCase()}</span>
      </div>
      <h3 className="t-display text-3xl md:text-[2.6rem] mt-4">{p.title}</h3>
      {p.jp && <p className="t-mono text-[11px] mt-1.5 opacity-60 tracking-[0.08em]">{p.jp}</p>}
      <p className="mt-4 text-[14px] leading-relaxed max-w-md" style={{ color: "color-mix(in srgb, var(--ink) 82%, transparent)" }}>
        {p.description}
      </p>
      <div className="mt-4 t-mono text-[9px] tracking-[0.16em] leading-relaxed" style={{ color: "var(--muted)" }}>
        <p>LIVE — {hostOf(p.url)}</p>
        <p className="mt-1">{p.tech.join(" · ").toUpperCase()}</p>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-5">
        <a href={p.url} target="_blank" rel="noopener noreferrer" className="btn-cta t-mono text-[11px] tracking-[0.18em] px-5 py-3 relative z-0">
          <span className="btn-fill" />
          ENTER EXPERIENCE
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M2 10L10 2M10 2H3.5M10 2v6.5" />
          </svg>
        </a>
        <button
          onClick={() => onDetails(p)}
          className="t-mono text-[11px] tracking-[0.18em] underline underline-offset-4 opacity-70 hover:opacity-100"
          style={{ textDecorationColor: "var(--accent)" }}
        >
          DETAILS
        </button>
      </div>
    </>
  );
}

function ShowroomPanel({ onNav }: { onNav: (t: string) => void }) {
  return (
    <>
      <div className="flex items-center gap-3 t-mono text-[10px] tracking-[0.2em]" style={{ color: "var(--muted)" }}>
        <span style={{ color: "var(--accent)" }}>SHOWROOM</span>
        <span className="px-2 py-0.5 border" style={{ borderColor: "var(--line)" }}>FUTURE-READY</span>
      </div>
      <h3 className="t-display text-3xl md:text-[2.6rem] mt-4">LOTS 01–04,<br />RESERVED.</h3>
      <p className="mt-4 text-[15px] leading-relaxed max-w-md" style={{ color: "color-mix(in srgb, var(--ink) 82%, transparent)" }}>
        A physical-feeling stage for products that don&rsquo;t exist yet — pedestals, glass and soft
        daylight, ready for ecommerce, product films and 3D commerce. When the next build ships, it
        stands here first.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-5">
        <button onClick={() => onNav("work")} className="btn-cta t-mono text-[11px] tracking-[0.18em] px-5 py-3 relative z-0">
          <span className="btn-fill" />
          SEE CURRENT WORK
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M2 6h8M10 6L6.5 2.5M10 6l-3.5 3.5" />
          </svg>
        </button>
        <span className="t-mono text-[10px] tracking-[0.16em] opacity-60">NO FAKE PRODUCTS — EVER</span>
      </div>
    </>
  );
}

export default function ChapterSection({ chapter, projects, onDetails, onNav }: Props) {
  const section = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const introRef = useRef<HTMLDivElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);

  useRevealObserver([isMobile]);

  /* ---------- desktop scrub choreography ---------- */
  useEffect(() => {
    if (isMobile || reduced || !section.current) return;
    const lead = LEADS[chapter.id] ?? 0;
    const N = Math.max(1, projects.length);
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.7,
      },
    });

    const bars = barsRef.current?.querySelectorAll(".lb-bar");
    if (bars && bars.length) {
      tl.fromTo(bars, { scaleY: 0 }, { scaleY: 1, ease: "none", duration: 0.05 }, lead + 0.01)
        .to(bars, { scaleY: 0, ease: "none", duration: 0.05 }, lead + 0.17);
    }
    if (introRef.current) {
      tl.fromTo(introRef.current, { autoAlpha: 0, y: 46 }, { autoAlpha: 1, y: 0, ease: "none", duration: 0.09 }, lead + 0.03)
        .to(introRef.current, { autoAlpha: 0, y: -34, ease: "none", duration: 0.07 }, lead + 0.16);
    }
    const start0 = lead + 0.24;
    const span = (1 - start0 - 0.03) / N;
    const inDur = Math.min(0.085, span * 0.45);
    const outDur = Math.min(0.075, span * 0.4);
    for (let i = 0; i < N; i++) {
      const el = panelRefs.current[i];
      const img = imgRefs.current[i];
      const s = start0 + i * span;
      if (el) {
        tl.fromTo(el, { autoAlpha: 0, y: 64 }, { autoAlpha: 1, y: 0, ease: "none", duration: inDur }, s)
          .to(el, { autoAlpha: 0, y: -48, ease: "none", duration: outDur }, s + span - outDur);
      }
      if (img) {
        tl.fromTo(img, { autoAlpha: 0, y: 40, scale: 0.965 }, { autoAlpha: 1, y: 0, scale: 1, ease: "none", duration: inDur }, s)
          .to(img, { autoAlpha: 0, y: -36, ease: "none", duration: outDur }, s + span - outDur);
      }
    }

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, [isMobile, reduced, projects, chapter.id]);

  /* ---------- mobile: cinematic editorial flow ---------- */
  if (isMobile) {
    return (
      <section ref={section} id={`ch-${chapter.id}`} data-chapter={chapter.id} className="relative px-6 pt-24 pb-16">
        <p className="t-mono text-[10px] tracking-[0.24em] io-reveal" style={{ color: "var(--accent)" }}>
          CHAPTER {chapter.num}
        </p>
        <h2 className="t-display text-[clamp(2.4rem,10.5vw,5rem)] leading-none mt-3 io-reveal">{chapter.name}</h2>
        <p className="t-mono text-[10px] tracking-[0.18em] mt-3 opacity-60 io-reveal">{chapter.line}</p>

        <div className="mt-12 space-y-16">
          {projects.length === 0 ? (
            <div className="io-reveal">
              <ShowroomPanel onNav={onNav} />
            </div>
          ) : (
            projects.map((p, i) => (
              <article key={p.id} className="io-reveal" style={{ transitionDelay: `${(i % 2) * 0.08}s` }}>
                <div className="overflow-hidden border" style={{ borderColor: "var(--line)" }}>
                  <img src={p.image} alt={`${p.title} — project still`} loading="lazy" className="w-full aspect-[16/10] object-cover" />
                </div>
                <div className="mt-5">
                  <PanelBody p={p} onDetails={onDetails} />
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    );
  }

  /* ---------- desktop: pinned world with scrubbed panels ---------- */
  const panelCount = Math.max(1, projects.length);
  return (
    <section ref={section} id={`ch-${chapter.id}`} data-chapter={chapter.id} style={{ height: `${chapter.vh}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* letterbox chapter bars */}
        <div ref={barsRef} className="absolute inset-0 z-20 pointer-events-none">
          <div className="lb-bar top-0 origin-top" style={{ transform: "scaleY(0)" }} />
          <div className="lb-bar bottom-0 origin-bottom" style={{ transform: "scaleY(0)" }} />
        </div>

        {/* chapter intro — appears, holds, dissolves */}
        <div ref={introRef} className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none" style={{ opacity: 0, visibility: "hidden" }}>
          <p className="t-mono text-[11px] tracking-[0.34em]" style={{ color: "var(--accent)" }}>
            CHAPTER {chapter.num}
          </p>
          <h2 className="t-display text-[clamp(2.4rem,6.5vw,5.6rem)] mt-4 text-center px-6 leading-[0.95]">{chapter.name}</h2>
          <p className="t-mono text-[10px] tracking-[0.24em] mt-4 opacity-60">{chapter.line}</p>
        </div>

        {/* project panels + companion stills ride the camera */}
        {Array.from({ length: panelCount }).map((_, i) => {
          const p = projects[i];
          const panelSide = i % 2 === 0 ? "left" : "right";
          const imgSide = i % 2 === 0 ? "right" : "left";
          return (
            <Fragment key={p ? p.id : "showroom"}>
              <div
                className="absolute top-1/2 -translate-y-1/2 z-10 w-[min(30rem,42vw)]"
                style={{ [panelSide]: "6vw" } as React.CSSProperties}
              >
                <div ref={(el) => { panelRefs.current[i] = el; }} style={{ opacity: 0, visibility: "hidden" }}>
                  {p ? <PanelBody p={p} onDetails={onDetails} /> : <ShowroomPanel onNav={onNav} />}
                </div>
              </div>
              {p && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 z-[9] hidden lg:block w-[min(33rem,40vw)]"
                  style={{ [imgSide]: "6vw" } as React.CSSProperties}
                >
                  <div ref={(el) => { imgRefs.current[i] = el; }} style={{ opacity: 0, visibility: "hidden" }}>
                    <div className="overflow-hidden border" style={{ borderColor: "var(--line)" }}>
                      <img
                        src={p.image}
                        alt={`${p.title} — still frame`}
                        loading="lazy"
                        className="w-full aspect-[16/10] object-cover"
                      />
                    </div>
                    <div className="flex justify-between mt-2 t-mono text-[9px] tracking-[0.22em]" style={{ color: "var(--muted)" }}>
                      <span>STILL — P.{p.num}</span>
                      <span style={{ color: "var(--accent)" }}>{hostOf(p.url)}</span>
                    </div>
                  </div>
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </section>
  );
}
