import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Project } from "../data/projects";
import { CHAPTERS } from "../data/projects";

interface Props {
  project: Project | null;
  onClose: () => void;
}

function hostOf(url: string) {
  return url.replace("https://", "").replace("/", "");
}

export default function ProjectDetail({ project, onClose }: Props) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!project) return;
    const el = root.current;
    if (el) {
      gsap.fromTo(el, { yPercent: 4, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.55, ease: "power3.out" });
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [project, onClose]);

  if (!project) return null;
  const chapter = CHAPTERS.find((c) => c.id === project.chapter);

  return (
    <div
      ref={root}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — project file`}
      className="fixed inset-0 z-[75] overflow-y-auto"
      style={
        {
          background: "color-mix(in srgb, var(--bg) 97%, black)",
          color: "var(--ink)",
          "--accent": project.accent,
        } as React.CSSProperties
      }
    >
      <div className="max-w-[80rem] mx-auto px-5 md:px-10 py-8 md:py-12">
        {/* file header */}
        <div className="flex items-center justify-between t-mono text-[10px] tracking-[0.22em]" style={{ color: "var(--muted)" }}>
          <p>
            FILE — P.{project.num} / {chapter?.name ?? ""}
          </p>
          <button
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 border hover:opacity-70 transition-opacity"
            style={{ borderColor: "var(--line)", color: "var(--ink)" }}
            autoFocus
          >
            CLOSE
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M2 2l8 8M10 2l-8 8" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mt-10">
          {/* visual */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden border" style={{ borderColor: "var(--line)" }}>
              <img src={project.image} alt={`${project.title} — key visual`} className="w-full aspect-[16/10] object-cover" />
            </div>
            <p className="t-mono text-[9px] tracking-[0.2em] mt-3" style={{ color: "var(--muted)" }}>
              STILL — {project.title}
            </p>
          </div>

          {/* dossier */}
          <div className="lg:col-span-5">
            <p className="t-mono text-[10px] tracking-[0.24em]" style={{ color: "var(--accent)" }}>
              {project.category.toUpperCase()}
            </p>
            <h2 className="t-display text-[clamp(2.4rem,4.5vw,4rem)] mt-4 leading-[0.95]">{project.title}</h2>
            {project.jp && <p className="t-mono text-[11px] mt-3 opacity-60">{project.jp}</p>}

            <p className="mt-7 text-[15px] leading-relaxed" style={{ color: "color-mix(in srgb, var(--ink) 85%, transparent)" }}>
              {project.story}
            </p>

            <dl className="mt-9 border-t" style={{ borderColor: "var(--line)" }}>
              {[
                ["WORLD", chapter ? `${chapter.num} — ${chapter.name}` : "—"],
                ["FORMAT", project.format],
                ["STACK", project.tech.join(" · ")],
                ["LIVE AT", hostOf(project.url)],
                ["ROLE", "DESIGN & BUILD — PRATHAM"],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-6 py-3 border-b" style={{ borderColor: "var(--line)" }}>
                  <dt className="t-mono text-[9px] tracking-[0.24em]" style={{ color: "var(--muted)" }}>{k}</dt>
                  <dd className="t-mono text-[11px] text-right truncate max-w-[60%]">{v}</dd>
                </div>
              ))}
            </dl>

            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-cta t-mono text-[12px] tracking-[0.2em] px-7 py-4 mt-9 relative z-0 inline-flex"
            >
              <span className="btn-fill" />
              ENTER LIVE EXPERIENCE
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4">
                <path d="M2 10L10 2M10 2H3.5M10 2v6.5" />
              </svg>
            </a>
            <p className="t-mono text-[9px] tracking-[0.18em] mt-4 opacity-50">
              OPENS {project.url.toUpperCase()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
