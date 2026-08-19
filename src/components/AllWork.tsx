import type { Project } from "../data/projects";
import { PROJECTS } from "../data/projects";
import { useRevealObserver } from "../lib/hooks";

interface Props {
  onDetails: (p: Project) => void;
}

const MARQUEE =
  "PRATHAM KHINVSARA ✦ ENGINEER ✦ FULL STACK ✦ PROBLEM SOLVER ✦ SYSTEMS BUILDER ✦ REACT ✦ THREE.JS ✦ NODE.JS ✦ PYTHON ✦ GSAP ✦";

function hostOf(url: string) {
  return url.replace("https://", "").replace("/", "");
}

export default function AllWork({ onDetails }: Props) {
  useRevealObserver();

  return (
    <section
      id="work"
      data-chapter="work"
      className="relative"
      style={
        {
          background: "var(--bg)",
          "--bg": "#F3EFE7",
          "--ink": "#17150F",
          "--muted": "#6E675A",
          "--accent": "#E4573D",
          "--line": "rgba(23,21,15,0.14)",
        } as React.CSSProperties
      }
    >
      {/* marquee — his actual words */}
      <div className="marquee border-y t-mono text-[11px] tracking-[0.22em] py-3.5 select-none" style={{ borderColor: "var(--line)", color: "var(--ink)" }}>
        <div className="marquee-track">{MARQUEE}</div>
        <div className="marquee-track" aria-hidden>{MARQUEE}</div>
      </div>

      <div className="max-w-[88rem] mx-auto px-5 md:px-10 pt-20 md:pt-28 pb-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p className="t-mono text-[11px] tracking-[0.26em] io-reveal" style={{ color: "var(--accent)" }}>
              06 — THE INDEX
            </p>
            <h2 className="t-display text-[clamp(3.4rem,9vw,8.5rem)] mt-4 io-reveal">ALL WORK</h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed io-reveal" style={{ color: "var(--muted)" }}>
            Seven live worlds, indexed for people in a hurry. Every row is real, deployed, and one click
            away — the cinematic route above is optional, the work is not.
          </p>
        </div>

        <div className="mt-14 md:mt-20">
          {PROJECTS.map((p, i) => (
            <article
              key={p.id}
              className="work-row group grid grid-cols-12 items-center gap-x-4 gap-y-5 py-7 md:py-9 border-t cursor-pointer io-reveal"
              style={{ borderColor: "var(--line)", transitionDelay: `${(i % 3) * 0.07}s` }}
              onClick={() => onDetails(p)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onDetails(p);
                }
              }}
              data-cursor
            >
              <div className="col-span-2 md:col-span-1 t-mono text-[11px] tracking-[0.2em]" style={{ color: "var(--muted)" }}>
                {p.num}
              </div>
              <div className="col-span-10 md:col-span-5 overflow-hidden border" style={{ borderColor: "var(--line)" }}>
                <img
                  src={p.image}
                  alt={`${p.title} — project still`}
                  loading="lazy"
                  className="row-img w-full aspect-[16/9] object-cover"
                />
              </div>
              <div className="col-span-10 md:col-span-4 md:pl-2">
                <p className="t-mono text-[9px] tracking-[0.22em]" style={{ color: "var(--accent)" }}>
                  {p.category.toUpperCase()}
                </p>
                <h3 className="row-title t-display text-2xl md:text-[2rem] mt-2 inline-block">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed line-clamp-2" style={{ color: "var(--muted)" }}>
                  {p.description}
                </p>
              </div>
              <div className="col-span-2 md:col-span-2 flex md:justify-end items-center gap-5">
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="t-mono text-[10px] tracking-[0.18em] flex items-center gap-2 hover:opacity-70"
                  aria-label={`Open ${p.title} live`}
                >
                  LIVE
                  <svg className="row-arrow" width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
                    <path d="M2 10L10 2M10 2H3.5M10 2v6.5" />
                  </svg>
                </a>
                <span className="hidden md:block t-mono text-[10px] opacity-35 truncate max-w-[8rem]">{hostOf(p.url)}</span>
              </div>
            </article>
          ))}
          <div className="border-t pt-6 mt-2 flex flex-wrap gap-x-10 gap-y-2 t-mono text-[9px] tracking-[0.2em]" style={{ borderColor: "var(--line)", color: "var(--muted)" }}>
            <span>ALL LINKS OPEN THE LIVE DEPLOYMENT</span>
            <span>NO EMBEDS · NO MOCKS</span>
            <span className="opacity-60">SHOWROOM LOTS 01–04 RESERVED FOR WHAT COMES NEXT</span>
          </div>
        </div>
      </div>
    </section>
  );
}
