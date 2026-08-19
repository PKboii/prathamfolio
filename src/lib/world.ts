/**
 * Shared mutable scroll/camera state.
 * Written by the App scroll loop (main thread), read every frame by the
 * three.js rig — avoids React re-renders in the render loop.
 */
export const world = {
  /** normalized camera progress through the cinematic part (0..1) */
  pCine: 0,
  /** normalized progress through the whole page (0..1) — for the timecode HUD */
  pGlobal: 0,
  /** damped values used by the render loop */
  dCine: 0,
  mouseX: 0,
  mouseY: 0,
  reduced: false,
  lowPower: false,
  /** live camera z, written back by the rig for the HUD readout */
  camZ: 0,
  /** lenis instance, if smooth scrolling is active */
  lenis: null as null | {
    stop: () => void;
    start: () => void;
    scrollTo: (target: string | number | HTMLElement, opts?: Record<string, unknown>) => void;
    destroy: () => void;
  },
};

export type ChapterId =
  | "hero"
  | "experimental"
  | "digital"
  | "brands"
  | "architecture"
  | "showroom"
  | "work"
  | "finale";
