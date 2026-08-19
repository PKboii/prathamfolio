import type { ChapterId } from "./world";

/**
 * Tiny generative ambience engine — no audio assets, everything synthesized.
 * A brown-noise bed through a slow-breathing lowpass + a soft sub drone.
 * Each chapter nudges the filter/drone so the room tone shifts with the worlds.
 */
type Profile = { lp: number; drone: number; gain: number; air: number };

const PROFILES: Record<string, Profile> = {
  hero:         { lp: 420,  drone: 55,  gain: 0.5,  air: 0.25 },
  experimental: { lp: 900,  drone: 65,  gain: 0.42, air: 0.55 },
  digital:      { lp: 1400, drone: 49,  gain: 0.55, air: 0.35 },
  brands:       { lp: 620,  drone: 58,  gain: 0.45, air: 0.4 },
  architecture: { lp: 340,  drone: 52,  gain: 0.4,  air: 0.6 },
  showroom:     { lp: 500,  drone: 60,  gain: 0.38, air: 0.45 },
  work:         { lp: 520,  drone: 56,  gain: 0.4,  air: 0.4 },
  finale:       { lp: 460,  drone: 55,  gain: 0.45, air: 0.3 },
};

class Ambience {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private lp: BiquadFilterNode | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private noiseGain: GainNode | null = null;
  private lfo: OscillatorNode | null = null;
  running = false;

  private build() {
    const ctx = new AudioContext();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);

    // brown noise bed
    const len = ctx.sampleRate * 3;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const w = Math.random() * 2 - 1;
      last = (last + 0.02 * w) / 1.02;
      data[i] = last * 3.2;
    }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.loop = true;
    this.lp = ctx.createBiquadFilter();
    this.lp.type = "lowpass";
    this.lp.frequency.value = 420;
    this.lp.Q.value = 0.6;
    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.value = 0.16;
    src.connect(this.lp).connect(this.noiseGain).connect(this.master);
    src.start();

    // breathing LFO on the filter
    this.lfo = ctx.createOscillator();
    this.lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 120;
    this.lfo.connect(lfoGain).connect(this.lp.frequency);
    this.lfo.start();

    // sub drone
    this.droneOsc = ctx.createOscillator();
    this.droneOsc.type = "sine";
    this.droneOsc.frequency.value = 55;
    this.droneGain = ctx.createGain();
    this.droneGain.gain.value = 0.05;
    this.droneOsc.connect(this.droneGain).connect(this.master);
    this.droneOsc.start();
  }

  async start() {
    if (!this.ctx) this.build();
    const ctx = this.ctx!;
    if (ctx.state === "suspended") await ctx.resume();
    this.master!.gain.cancelScheduledValues(ctx.currentTime);
    this.master!.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 1.6);
    this.running = true;
  }

  stop() {
    if (!this.ctx || !this.master) return;
    const ctx = this.ctx;
    this.master.gain.cancelScheduledValues(ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.7);
    this.running = false;
  }

  setChapter(id: ChapterId) {
    if (!this.ctx || !this.running) return;
    const p = PROFILES[id] ?? PROFILES.hero;
    const t = this.ctx.currentTime;
    this.lp!.frequency.cancelScheduledValues(t);
    this.lp!.frequency.linearRampToValueAtTime(p.lp, t + 2.4);
    this.droneOsc!.frequency.linearRampToValueAtTime(p.drone, t + 2.4);
    this.noiseGain!.gain.linearRampToValueAtTime(0.1 * p.gain + 0.06 * p.air, t + 2.4);
    this.droneGain!.gain.linearRampToValueAtTime(0.045 * p.gain, t + 2.4);
  }
}

export const ambience = new Ambience();
