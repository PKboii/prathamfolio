import { CAPABILITIES, EMAIL, LEGACY_PORTFOLIO, STACKS } from "../data/projects";
import { useRevealObserver } from "../lib/hooks";

export default function Finale() {
  useRevealObserver();

  return (
    <>
      {/* ---------- 07 · the return — over the 3D portrait room ---------- */}
      <section data-chapter="finale" className="relative">
        <div className="max-w-[88rem] mx-auto px-5 md:px-10 pt-32 md:pt-44 pb-24">
          <p className="t-mono text-[11px] tracking-[0.26em] io-reveal" style={{ color: "var(--accent)" }}>
            07 — ME, AGAIN
          </p>
          <h2 className="t-display text-[clamp(2.9rem,8.5vw,8rem)] mt-6 max-w-5xl io-reveal">
            NOW YOU KNOW WHAT HE BUILDS.
          </h2>
          <p className="mt-8 max-w-xl text-[15px] leading-relaxed io-reveal" style={{ color: "var(--muted)" }}>
            The camera pulls back. The valley, the city, the counter, the courtyard and the showroom go
            quiet — seven worlds, one pair of hands. What opened with a person closes with one too.
          </p>
        </div>

        {/* ---------- about — forced to bone, like a printed insert ---------- */}
        <div
          id="about"
          className="relative"
          style={
            {
              background: "#F3EFE7",
              color: "#17150F",
              "--bg": "#F3EFE7",
              "--ink": "#17150F",
              "--muted": "#6E675A",
              "--accent": "#E4573D",
              "--line": "rgba(23,21,15,0.14)",
            } as React.CSSProperties
          }
        >
          <div className="max-w-[88rem] mx-auto px-5 md:px-10 py-20 md:py-28">
            <div className="max-w-3xl">
              <p className="t-mono text-[11px] tracking-[0.26em] io-reveal" style={{ color: "var(--accent)" }}>ABOUT</p>
              <h3 className="t-display text-[clamp(2.2rem,4.5vw,4rem)] mt-4 io-reveal">
                ENGINEER,<br />END TO END.
              </h3>
              <div className="mt-7 max-w-xl space-y-5 text-[15px] leading-relaxed io-reveal" style={{ color: "color-mix(in srgb, var(--ink) 84%, transparent)" }}>
                <p>
                  I am Pratham — an engineer who builds things that work beautifully. I work end-to-end:
                  from database schema to pixel-perfect UI. Every tool I pick is deliberate; every stack
                  decision is earned in production.
                </p>
                <p>
                  This page is one of those decisions. Not a grid of screenshots, but a place built the
                  same way the work is built — scroll is the camera, the projects are the sets, and the
                  links are the real doors.
                </p>
              </div>

              {/* real capability figures */}
              <div className="mt-10 max-w-xl">
                {CAPABILITIES.map((c) => (
                  <div key={c.label} className="py-3 border-b" style={{ borderColor: "var(--line)" }}>
                    <div className="flex justify-between t-mono text-[10px] tracking-[0.18em] mb-2">
                      <span>{c.label.toUpperCase()}</span>
                      <span style={{ color: "var(--accent)" }}>{c.value}%</span>
                    </div>
                    <div className="cap-bar io-reveal">
                      <i style={{ "--w": c.value / 100 } as React.CSSProperties} />
                    </div>
                  </div>
                ))}
              </div>

              {/* real stack */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
                {STACKS.map((s) => (
                  <div key={s.group}>
                    <p className="t-mono text-[9px] tracking-[0.24em] mb-3" style={{ color: "var(--muted)" }}>
                      {s.group.toUpperCase()}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {s.items.map((t) => (
                        <span key={t} className="t-mono text-[9px] tracking-[0.1em] px-2 py-1 border" style={{ borderColor: "var(--line)" }}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-x-10 gap-y-2 t-mono text-[10px] tracking-[0.2em]" style={{ color: "var(--muted)" }}>
                <span>STATUS — <span style={{ color: "var(--accent)" }}>AVAILABLE FOR WORK</span></span>
                <span>BASE — WHEREVER THE WORK IS</span>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- contact ---------- */}
        <div id="contact" className="max-w-[88rem] mx-auto px-5 md:px-10 pt-24 md:pt-36 pb-16">
          <p className="t-mono text-[11px] tracking-[0.26em] io-reveal" style={{ color: "var(--accent)" }}>
            GOT AN IDEA?
          </p>
          <h2 className="t-display text-[clamp(3rem,10vw,9.5rem)] mt-5 io-reveal">LET&rsquo;S BUILD IT.</h2>
          <a
            href={`mailto:${EMAIL}`}
            className="t-display inline-block mt-10 text-[clamp(1.15rem,3.6vw,3rem)] underline underline-offset-8 decoration-1 hover:decoration-[3px] transition-all io-reveal"
            style={{ textDecorationColor: "var(--accent)" }}
          >
            {EMAIL}
          </a>
          <div className="mt-14 flex flex-wrap items-center gap-x-10 gap-y-4 t-mono text-[10px] tracking-[0.2em] io-reveal" style={{ color: "var(--muted)" }}>
            <a href={LEGACY_PORTFOLIO} target="_blank" rel="noopener noreferrer" className="nav-link" style={{ color: "var(--ink)" }}>
              PREVIOUS PORTFOLIO ↗
            </a>
            <span>GITHUB · LINKEDIN · X — SHARED ON REQUEST</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: "var(--accent)" }} />
              REPLIES PERSONALLY
            </span>
          </div>
        </div>

        {/* ---------- credits ---------- */}
        <footer className="border-t" style={{ borderColor: "var(--line)" }}>
          <div className="max-w-[88rem] mx-auto px-5 md:px-10 py-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 t-mono text-[9px] tracking-[0.2em]" style={{ color: "var(--muted)" }}>
            <span>PRATHAM SANJAY KHINVSARA ©2025</span>
            <span className="opacity-80">PERSON → STORY → WORLDS → WORK → PERSON</span>
            <span className="opacity-60">THREE.JS · GSAP · LENIS — ONE CONTINUOUS SCENE</span>
          </div>
        </footer>
      </section>
    </>
  );
}
