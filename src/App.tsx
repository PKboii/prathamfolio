import { useCallback, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Experience from "./three/Experience";
import Cursor from "./components/Cursor";
import Header from "./components/Header";
import Hud from "./components/Hud";
import Hero from "./components/Hero";
import ChapterSection from "./components/Chapter";
import AllWork from "./components/AllWork";
import ProjectDetail from "./components/ProjectDetail";
import Finale from "./components/Finale";
import { CHAPTERS, IMG, PROJECTS } from "./data/projects";
import type { Project } from "./data/projects";
import { world } from "./lib/world";
import { ambience } from "./lib/audio";
import { useIsMobile, useReducedMotion } from "./lib/hooks";

gsap.registerPlugin(ScrollTrigger);

type SectionInfo = { id: string; top: number; bottom: number };

export default function App() {
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const [chapterId, setChapterId] = useState("hero");
  const [soundOn, setSoundOn] = useState(false);
  const [detail, setDetail] = useState<Project | null>(null);

  const sectionsRef = useRef<SectionInfo[]>([]);
  const cineEndRef = useRef(1);
  const currentChapter = useRef("hero");

  // keep render-loop flags in sync before the Canvas mounts
  world.reduced = reduced;
  world.lowPower = isMobile || (typeof navigator !== "undefined" && (navigator.hardwareConcurrency ?? 8) <= 4);

  const applyTheme = useCallback((id: string) => {
    const ch = CHAPTERS.find((c) => c.id === id) ?? CHAPTERS[0];
    const root = document.documentElement;
    root.style.setProperty("--bg", ch.theme.bg);
    root.style.setProperty("--ink", ch.theme.ink);
    root.style.setProperty("--muted", ch.theme.muted);
    root.style.setProperty("--accent", ch.theme.accent);
    root.style.setProperty("--line", ch.theme.ink + "24");
  }, []);

  /* ---------------- scroll system ---------------- */
  useEffect(() => {
    applyTheme("hero");

    // preload the whole image inventory so worlds never pop
    Object.values(IMG).forEach((src) => {
      const im = new Image();
      im.crossOrigin = "anonymous";
      im.src = src;
    });

    let lenis: Lenis | null = null;
    if (!reduced) {
      lenis = new Lenis({ duration: 1.2, smoothWheel: true });
      world.lenis = lenis;
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenis?.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    const measure = () => {
      const els = Array.from(document.querySelectorAll<HTMLElement>("[data-chapter]"));
      const sy = window.scrollY;
      sectionsRef.current = els.map((el) => ({
        id: el.dataset.chapter!,
        top: el.getBoundingClientRect().top + sy,
        bottom: el.getBoundingClientRect().bottom + sy,
      }));
      const showroom = sectionsRef.current.find((s) => s.id === "showroom");
      cineEndRef.current = Math.max(1, (showroom ? showroom.bottom : document.body.scrollHeight) - window.innerHeight);
      ScrollTrigger.refresh();
    };
    measure();
    const t = window.setTimeout(measure, 600); // after fonts/images settle

    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const sy = window.scrollY;
      const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      world.pGlobal = Math.min(1, Math.max(0, sy / total));
      world.pCine = Math.min(1, Math.max(0, sy / cineEndRef.current));

      const probe = sy + window.innerHeight * 0.55;
      let active = "hero";
      for (const s of sectionsRef.current) if (s.top <= probe) active = s.id;
      if (active !== currentChapter.current) {
        currentChapter.current = active;
        applyTheme(active);
        ambience.setChapter(active as never);
        setChapterId(active);
      }
    };
    raf = requestAnimationFrame(loop);

    const onMouse = (e: MouseEvent) => {
      world.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      world.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    let rT = 0;
    const onResize = () => {
      cancelAnimationFrame(rT);
      rT = requestAnimationFrame(measure);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(rT);
      window.clearTimeout(t);
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("resize", onResize);
      lenis?.destroy();
      world.lenis = null;
    };
  }, [reduced, applyTheme]);

  /* ---------------- navigation ---------------- */
  const nav = useCallback(
    (target: string) => {
      if (target === "__top") {
        if (world.lenis) world.lenis.scrollTo(0, { duration: 1.6 });
        else window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
        return;
      }
      const el = document.getElementById(target);
      if (!el) return;
      if (world.lenis) world.lenis.scrollTo(el, { offset: 0, duration: 1.6 });
      else el.scrollIntoView({ behavior: reduced ? "auto" : "smooth" });
    },
    [reduced]
  );

  const openDetail = useCallback((p: Project) => {
    setDetail(p);
    world.lenis?.stop();
    document.body.style.overflow = "hidden";
  }, []);

  const closeDetail = useCallback(() => {
    setDetail(null);
    world.lenis?.start();
    document.body.style.overflow = "";
  }, []);

  const toggleSound = useCallback(() => {
    setSoundOn((on) => {
      if (!on) {
        void ambience.start();
        ambience.setChapter(currentChapter.current as never);
      } else {
        ambience.stop();
      }
      return !on;
    });
  }, []);

  const chapter = CHAPTERS.find((c) => c.id === chapterId) ?? CHAPTERS[0];
  const cinematic = CHAPTERS.filter((c) => c.vh > 0 && c.id !== "hero");

  return (
    <div className="relative">
      {/* the world — fixed behind everything */}
      <Experience />
      <div className="vignette" />
      <div className="grain" />

      <Cursor />
      <Header chapter={chapter} soundOn={soundOn} onToggleSound={toggleSound} onNav={nav} />
      <Hud chapter={chapter} />

      <main className="relative z-10">
        <Hero />
        {cinematic.map((c) => (
          <ChapterSection
            key={c.id}
            chapter={c}
            projects={PROJECTS.filter((p) => p.chapter === c.id)}
            onDetails={openDetail}
            onNav={nav}
          />
        ))}
        <AllWork onDetails={openDetail} />
        <Finale />
      </main>

      <ProjectDetail project={detail} onClose={closeDetail} />
    </div>
  );
}
