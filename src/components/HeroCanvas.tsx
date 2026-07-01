"use client";

import { useEffect, useRef } from "react";

// ── Tuning ──────────────────────────────────────────────────────────────────
const SPRING_K = 0.05;
const DAMPING = 0.82;
const COLOR_LERP = 0.04;
const PHASE_HOLD_MS = 4000;   // how long each shape holds before scattering
const SCATTER_MS = 3500;      // how long particles float freely between phases
const SCATTER_DAMPING = 0.994; // near 1 = particles coast a long time
const DRIFT_SPRING = 0.0003;  // tiny pull toward canvas center during drift
const SAMPLE_RES = 100;       // offscreen canvas width for photo/motif sampling
const SAMPLE_RES_TEXT = 200;  // text uses a wider canvas for cleaner letterforms
const PARTICLE_SIZE = 2;
const GREEN = { r: 57, g: 255, b: 136 } as const;

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  tx: number; ty: number;
  r: number; g: number; b: number;
  tr: number; tg: number; tb: number;
}

interface Sample {
  x: number; y: number;
  r: number; g: number; b: number;
}

// ── Pixel sampling ───────────────────────────────────────────────────────────

function sampleOffscreen(
  src: HTMLCanvasElement,
  count: number,
  outW: number,
  outH: number,
  alphaThreshold = 100,
): Sample[] {
  const ctx = src.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  const { data } = ctx.getImageData(0, 0, src.width, src.height);
  const pool: Sample[] = [];

  for (let row = 0; row < src.height; row++) {
    for (let col = 0; col < src.width; col++) {
      const i = (row * src.width + col) * 4;
      if (data[i + 3] > alphaThreshold) {
        pool.push({
          x: (col / src.width) * outW,
          y: (row / src.height) * outH,
          r: data[i],
          g: data[i + 1],
          b: data[i + 2],
        });
      }
    }
  }

  if (!pool.length) return [];
  return Array.from({ length: count }, () => pool[Math.floor(Math.random() * pool.length)]);
}

// ── Phase canvas builders ────────────────────────────────────────────────────

function makePhotoCanvas(img: HTMLImageElement, sW: number, sH: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = sW;
  c.height = sH;
  const ctx = c.getContext("2d")!;

  // Center-cover crop
  const imgAspect = img.naturalWidth / img.naturalHeight;
  const frameAspect = sW / sH;
  let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
  if (imgAspect > frameAspect) {
    sw = img.naturalHeight * frameAspect;
    sx = (img.naturalWidth - sw) / 2;
  } else {
    sh = img.naturalWidth / frameAspect;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sW, sH);
  return c;
}

function makeTextCanvas(name: string, tag: string, sW: number, sH: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = sW;
  c.height = sH;
  const ctx = c.getContext("2d")!;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';
  const MONO = '"Courier New", Courier, monospace';
  const MAX_W = sW * 0.88;

  // Name — scale down until it fits
  let nameSz = sH * 0.32;
  ctx.font = `700 ${Math.round(nameSz)}px ${FONT}`;
  const nameW = ctx.measureText(name).width;
  if (nameW > MAX_W) nameSz *= MAX_W / nameW;
  ctx.font = `700 ${Math.round(nameSz)}px ${FONT}`;
  ctx.fillStyle = "#fff";
  ctx.fillText(name, sW / 2, sH * 0.38);

  // Tag — monospace, about 42% of name size, also guaranteed to fit
  let tagSz = nameSz * 0.42;
  ctx.font = `400 ${Math.round(tagSz)}px ${MONO}`;
  const tagW = ctx.measureText(tag).width;
  if (tagW > MAX_W) tagSz *= MAX_W / tagW;
  ctx.font = `400 ${Math.round(tagSz)}px ${MONO}`;
  ctx.fillStyle = "rgba(255,255,255,0.55)";
  ctx.fillText(tag, sW / 2, sH * 0.63);

  return c;
}

function makeMotifCanvas(sW: number, sH: number): HTMLCanvasElement {
  // Placeholder motif: concentric rings — TODO: replace per DESIGN.md open decision
  const c = document.createElement("canvas");
  c.width = sW;
  c.height = sH;
  const ctx = c.getContext("2d")!;
  const cx = sW / 2;
  const cy = sH / 2;
  const maxR = Math.min(sW, sH) * 0.42;

  for (let ring = 1; ring <= 5; ring++) {
    const r = maxR * (ring / 5);
    const dotsOnRing = Math.round(ring * 9 + 3);
    for (let d = 0; d < dotsOnRing; d++) {
      const angle = (d / dotsOnRing) * Math.PI * 2 + ring * 0.45;
      const px = Math.round(cx + Math.cos(angle) * r);
      const py = Math.round(cy + Math.sin(angle) * r);
      ctx.fillStyle = "#fff";
      ctx.fillRect(px, py, 2, 2);
    }
  }
  return c;
}

// ── Component ────────────────────────────────────────────────────────────────

export function HeroCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const wrapEl = wrap;
    const canvasEl = canvas;
    const ctxEl = ctx;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let destroyed = false;
    let rafId = 0;
    let phaseTimer: ReturnType<typeof setTimeout> | null = null;
    let scattering = false;

    let W = 0, H = 0, N = 0;
    let particles: Particle[] = [];
    let phases: Sample[][] = [[], [], []];
    let photoImg: HTMLImageElement | undefined;

    // ── Canvas sizing ──────────────────────────────────────────────────────
    function resize() {
      W = wrapEl.clientWidth;
      H = wrapEl.clientHeight;
      if (!W || !H) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvasEl.width = W * dpr;
      canvasEl.height = H * dpr;
      ctxEl.setTransform(dpr, 0, 0, dpr, 0, 0);
      N = W < 640 ? 500 : 2200;
    }

    // ── Particle init ──────────────────────────────────────────────────────
    function initParticles() {
      particles = Array.from({ length: N }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: 0, vy: 0,
        tx: Math.random() * W,
        ty: Math.random() * H,
        r: GREEN.r, g: GREEN.g, b: GREEN.b,
        tr: GREEN.r, tg: GREEN.g, tb: GREEN.b,
      }));
    }

    // ── Phase sampling ─────────────────────────────────────────────────────
    function buildPhases(img?: HTMLImageElement) {
      if (!W || !H) return;
      const sH = Math.round(SAMPLE_RES * (H / W));
      const textSH = Math.round(SAMPLE_RES_TEXT * (H / W));

      const photoCanvas = img
        ? makePhotoCanvas(img, SAMPLE_RES, sH)
        : makeMotifCanvas(SAMPLE_RES, sH);

      phases = [
        sampleOffscreen(photoCanvas, N, W, H),
        // Higher threshold (90) = only solid pixel centers, no antialiased fuzz → sharper letters
        sampleOffscreen(makeTextCanvas("Connor Gorman", "AI Engineer", SAMPLE_RES_TEXT, textSH), N, W, H, 90),
        sampleOffscreen(makeMotifCanvas(SAMPLE_RES, sH), N, W, H),
      ];
    }

    // ── Scatter between phases ─────────────────────────────────────────────
    // Releases particles to drift freely — no sharp targets, just float.
    function scatter() {
      scattering = true;
      for (const p of particles) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.8 + Math.random() * 2.2;
        p.vx += Math.cos(angle) * speed;
        p.vy += Math.sin(angle) * speed;
        p.tr = GREEN.r; p.tg = GREEN.g; p.tb = GREEN.b;
      }
    }

    // ── Phase switching ────────────────────────────────────────────────────
    function setPhase(phase: number, usePhotoColors: boolean) {
      if (destroyed) return;
      const targets = phases[phase];
      if (!targets?.length) return;

      scattering = false;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const s = targets[i % targets.length];
        p.tx = s.x;
        p.ty = s.y;
        if (phase === 0 && usePhotoColors) {
          p.tr = s.r; p.tg = s.g; p.tb = s.b;
        } else {
          p.tr = GREEN.r; p.tg = GREEN.g; p.tb = GREEN.b;
        }
      }

      if (prefersReduced) return;

      if (phaseTimer) clearTimeout(phaseTimer);
      phaseTimer = setTimeout(() => {
        if (destroyed) return;
        scatter();
        phaseTimer = setTimeout(() => {
          if (!destroyed) setPhase((phase + 1) % 3, usePhotoColors);
        }, SCATTER_MS);
      }, PHASE_HOLD_MS);
    }

    // ── Animation loop ─────────────────────────────────────────────────────
    function tick() {
      if (!W || !H) { rafId = requestAnimationFrame(tick); return; }
      ctxEl.clearRect(0, 0, W, H);

      const allGreen = scattering || particles.every(
        p => p.tr === GREEN.r && p.tg === GREEN.g && p.tb === GREEN.b
      );
      if (allGreen) ctxEl.fillStyle = `rgb(${GREEN.r},${GREEN.g},${GREEN.b})`;

      for (const p of particles) {
        if (prefersReduced) {
          p.x = p.tx; p.y = p.ty;
          p.r = p.tr; p.g = p.tg; p.b = p.tb;
        } else if (scattering) {
          // Free drift: very low damping so particles coast, tiny pull toward center
          p.vx += (W / 2 - p.x) * DRIFT_SPRING;
          p.vy += (H / 2 - p.y) * DRIFT_SPRING;
          p.vx *= SCATTER_DAMPING;
          p.vy *= SCATTER_DAMPING;
          p.x += p.vx;
          p.y += p.vy;
          p.r += (p.tr - p.r) * COLOR_LERP;
          p.g += (p.tg - p.g) * COLOR_LERP;
          p.b += (p.tb - p.b) * COLOR_LERP;
        } else {
          // Spring toward target
          p.vx += (p.tx - p.x) * SPRING_K;
          p.vy += (p.ty - p.y) * SPRING_K;
          p.vx *= DAMPING;
          p.vy *= DAMPING;
          p.x += p.vx;
          p.y += p.vy;
          p.r += (p.tr - p.r) * COLOR_LERP;
          p.g += (p.tg - p.g) * COLOR_LERP;
          p.b += (p.tb - p.b) * COLOR_LERP;
        }

        if (!allGreen) ctxEl.fillStyle = `rgb(${p.r | 0},${p.g | 0},${p.b | 0})`;
        ctxEl.fillRect(p.x | 0, p.y | 0, PARTICLE_SIZE, PARTICLE_SIZE);
      }

      rafId = requestAnimationFrame(tick);
    }

    // ── Bootstrap ──────────────────────────────────────────────────────────
    resize();
    initParticles();
    tick();

    const img = new Image();
    img.onload = () => {
      if (destroyed) return;
      photoImg = img;
      buildPhases(img);
      setPhase(prefersReduced ? 2 : 0, true);
    };
    img.onerror = () => {
      if (destroyed) return;
      buildPhases();
      setPhase(prefersReduced ? 2 : 1, false);
    };
    img.src = "/hero-photo.jpg";

    const ro = new ResizeObserver(() => {
      if (destroyed) return;
      if (phaseTimer) clearTimeout(phaseTimer);
      resize();
      initParticles();
      buildPhases(photoImg);
      if (phases[0].length) setPhase(0, !!photoImg);
    });
    ro.observe(wrapEl);

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafId);
      if (phaseTimer) clearTimeout(phaseTimer);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={wrapRef} className="h-full w-full">
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        aria-label="Hero animation — Connor Gorman"
      />
    </div>
  );
}
