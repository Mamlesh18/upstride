import { useEffect, useRef } from "react";

interface Star {
  x: number;      // 0..1 of width
  y: number;      // 0..1 of height
  z: number;      // depth 0.15..1 — drives size, brightness and parallax
  r: number;      // radius in px
  tw: number;     // twinkle phase
  hue: number;    // 0 = white, 1 = violet, 2 = cyan
}

const HUES = ["255, 255, 255", "167, 139, 250", "34, 211, 238"];

/**
 * The galaxy layer behind every MemDream page: a depth-sorted starfield that
 * drifts slowly, twinkles, and parallaxes a few pixels against the pointer.
 *
 * Deliberately cheap — a single 2D canvas, star count scaled to viewport area,
 * capped at ~45fps, paused when the tab is hidden, and skipped entirely under
 * `prefers-reduced-motion` (a static field is painted once instead).
 */
export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let raf = 0;
    let running = true;

    // Pointer parallax, eased toward the real pointer so it never snaps.
    const pointer = { x: 0, y: 0 };
    const eased = { x: 0, y: 0 };

    const seed = () => {
      const area = width * height;
      const count = Math.min(340, Math.max(90, Math.round(area / 7000)));
      stars = Array.from({ length: count }, () => {
        const z = 0.15 + Math.random() * 0.85;
        return {
          x: Math.random(),
          y: Math.random(),
          z,
          r: z * 1.25 + 0.25,
          tw: Math.random() * Math.PI * 2,
          // Mostly white; a minority tinted violet, a few cyan.
          hue: Math.random() < 0.72 ? 0 : Math.random() < 0.7 ? 1 : 2,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduced) draw(0);
    };

    function draw(t: number) {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      eased.x += (pointer.x - eased.x) * 0.045;
      eased.y += (pointer.y - eased.y) * 0.045;

      for (const s of stars) {
        // Slow upward drift, wrapping at the top.
        const drift = reduced ? 0 : ((t * 0.0000075 * s.z) % 1);
        let y = s.y - drift;
        if (y < 0) y += 1;

        const px = s.x * width + eased.x * s.z * 26;
        const py = y * height + eased.y * s.z * 26;

        const twinkle = reduced ? 0.7 : 0.55 + 0.45 * Math.sin(t * 0.0013 + s.tw);
        const alpha = (0.18 + s.z * 0.62) * twinkle;

        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${HUES[s.hue]}, ${alpha.toFixed(3)})`;
        ctx.fill();

        // The nearest stars get a soft bloom.
        if (s.z > 0.82) {
          ctx.beginPath();
          ctx.arc(px, py, s.r * 3.4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${HUES[s.hue]}, ${(alpha * 0.1).toFixed(3)})`;
          ctx.fill();
        }
      }
    }

    // ~45fps is plenty for a drifting field and leaves headroom for the page.
    const FRAME = 1000 / 45;
    let last = 0;
    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (!running || t - last < FRAME) return;
      last = t;
      draw(t);
    };

    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onVisibility = () => {
      running = document.visibilityState === "visible";
    };

    resize();
    window.addEventListener("resize", resize);
    if (!reduced) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div className="mdm-bg" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  );
}
