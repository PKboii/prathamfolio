import { useCallback, useEffect, useRef, useState } from "react";
import { CHAPTERS, EMAIL } from "../data/projects";
import type { Chapter } from "../data/projects";

interface Props {
  chapter: Chapter;
  soundOn: boolean;
  onToggleSound: () => void;
  onNav: (target: string) => void;
}

export default function Header({ chapter, soundOn, onToggleSound, onNav }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [open, setOpenState] = useState(false);
  const setOpen = useCallback((v: boolean) => {
    setOpenState(v);
    const el = menuRef.current;
    if (!el) return;
    el.style.pointerEvents = v ? "auto" : "none";
    el.style.opacity = v ? "1" : "0";
    el.style.transform = v ? "translateY(0)" : "translateY(-16px)";
    el.querySelectorAll<HTMLElement>("[data-item]").forEach((item, i) => {
      item.style.transitionDelay = v ? `${0.05 + i * 0.04}s` : "0s";
      item.style.opacity = v ? "1" : "0";
      item.style.transform = v ? "translateY(0)" : "translateY(14px)";
    });
  }, []);

  useEffect(() => setOpen(false), [chapter.id, setOpen]);

  const jump = (target: string) => {
    setOpen(false);
    onNav(target);
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference text-white">
        <div className="flex items-center justify-between px-5 md:px-8 py-5">
          <button
            onClick={() => jump("__top")}
            className="flex items-baseline gap-2"
            aria-label="Back to top"
            data-cursor
          >
            <span className="t-display text-lg tracking-wide">PRATHAM</span>
            <span className="t-mono text-[9px] opacity-70">PK·FILM</span>
          </button>

          <nav className="hidden md:flex items-center gap-7 t-mono text-[11px] tracking-[0.18em]">
            <button className="nav-link" onClick={() => jump("work")}>WORK</button>
            <button className="nav-link" onClick={() => jump("about")}>ABOUT</button>
            <button className="nav-link" onClick={() => jump("contact")}>CONTACT</button>
            <span className="opacity-30">/</span>
            <button
              className="nav-link flex items-center gap-2"
              onClick={onToggleSound}
              aria-label={soundOn ? "Mute ambience" : "Enable ambience"}
            >
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${soundOn ? "bg-current pulse-dot" : "border border-current opacity-60"}`} />
              SND {soundOn ? "ON" : "OFF"}
            </button>
          </nav>

          <button
            className="md:hidden t-mono text-[11px] tracking-[0.2em]"
            onClick={() => setOpen(!open)}
            aria-label="Open menu"
          >
            {open ? "CLOSE" : "MENU"}
          </button>
        </div>
      </header>

      {/* chapter menu */}
      <div
        ref={menuRef}
        className="fixed inset-0 z-[80] px-6 md:px-12 py-20 flex flex-col justify-between"
        style={{
          background: "color-mix(in srgb, var(--bg) 96%, black)",
          color: "var(--ink)",
          opacity: 0,
          pointerEvents: "none",
          transform: "translateY(-16px)",
          transition: "opacity 0.45s ease, transform 0.55s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div>
          <p className="t-mono text-[10px] opacity-50 mb-6">CHAPTERS — JUMP ANYWHERE</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-1">
            {CHAPTERS.map((c) => (
              <button
                key={c.id}
                data-item
                onClick={() => jump(c.id === "hero" ? "__top" : c.id === "work" ? "work" : c.id === "finale" ? "contact" : `ch-${c.id}`)}
                className="flex items-baseline gap-4 py-2.5 text-left border-b"
                style={{
                  borderColor: "var(--line)",
                  opacity: 0,
                  transform: "translateY(14px)",
                  transition: "opacity 0.4s ease, transform 0.5s cubic-bezier(0.16,1,0.3,1), color 0.3s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "")}
              >
                <span className="t-mono text-[10px] opacity-50">{c.num}</span>
                <span className="t-display text-2xl md:text-4xl">{c.name}</span>
                <span className="t-mono text-[9px] opacity-40 ml-auto hidden md:inline">{c.line}</span>
              </button>
            ))}
          </div>
        </div>
        <div data-item className="flex flex-wrap items-center gap-6 t-mono text-[10px] tracking-[0.15em]" style={{ opacity: 0, transition: "opacity 0.4s ease" }}>
          <a href={`mailto:${EMAIL}`} className="underline underline-offset-4">EMAIL — {EMAIL}</a>
          <span className="opacity-40">SOUND IS OPTIONAL · SCROLL IS THE CAMERA</span>
        </div>
      </div>
    </>
  );
}
