import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

const FRAME_COUNT = 180;
const ZOOM_FACTOR = 1.35;
const SCROLL_VH = 500;
const PARALLAX_MAX_PX = 28;

function frameUrl(index: number): string {
  const base = import.meta.env.BASE_URL;
  const n = String(index + 1).padStart(3, "0");
  return `${base}frames/ezgif-frame-${n}.jpg`;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function Scrollytell() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const scrollTickingRef = useRef(false);

  const [loadPercent, setLoadPercent] = useState(0);
  const [ready, setReady] = useState(false);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.floor(window.innerWidth);
    const h = Math.floor(window.innerHeight);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, []);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const images = imagesRef.current;
    if (!canvas) return;
    const img = images[index];
    if (!img?.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cw = window.innerWidth;
    const ch = window.innerHeight;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, cw, ch);

    const scale = Math.max(cw / iw, ch / ih) * ZOOM_FACTOR;
    const dw = iw * scale;
    const dh = ih * scale;
    const x = (cw - dw) / 2;
    const y = (ch - dh) / 2;

    ctx.drawImage(img, x, y, dw, dh);
  }, []);

  useEffect(() => {
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    let finished = 0;

    const bump = () => {
      finished += 1;
      const pct = Math.round((finished / FRAME_COUNT) * 100);
      setLoadPercent(pct);
      if (finished >= FRAME_COUNT) {
        setReady(true);
      }
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.onload = bump;
      img.onerror = bump;
      images[i] = img;
      img.src = frameUrl(i);
    }

    imagesRef.current = images;
  }, []);

  useEffect(() => {
    if (!ready) return;

    resizeCanvas();
    drawFrame(currentFrameRef.current);

    const onResize = () => {
      resizeCanvas();
      drawFrame(currentFrameRef.current);
    };

    const applyScrollFrame = () => {
      scrollTickingRef.current = false;
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const fraction = clamp(window.scrollY / maxScroll, 0, 1);
      const idx = Math.round(fraction * (FRAME_COUNT - 1));
      if (idx !== currentFrameRef.current) {
        currentFrameRef.current = idx;
        drawFrame(idx);
      }
    };

    const onScroll = () => {
      if (scrollTickingRef.current) return;
      scrollTickingRef.current = true;
      requestAnimationFrame(applyScrollFrame);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    applyScrollFrame();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [ready, resizeCanvas, drawFrame]);

  useEffect(() => {
    if (!ready || !parallaxRef.current) return;

    const el = parallaxRef.current;
    gsap.set(el, { x: 0, y: 0 });

    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      gsap.to(el, {
        x: -nx * PARALLAX_MAX_PX,
        y: -ny * PARALLAX_MAX_PX,
        duration: 0.65,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [ready]);

  const scrollToTop = () => {
    gsap.to(window, {
      duration: 1.1,
      scrollTo: { y: 0 },
      ease: "power2.inOut",
    });
  };

  return (
    <>
      <div
        className="relative w-full bg-black"
        style={{ height: `${SCROLL_VH}vh` }}
        aria-hidden
      />

      <div className="fixed inset-0 z-5 overflow-hidden bg-black pointer-events-none">
        <div
          ref={parallaxRef}
          className="absolute inset-0 flex items-center justify-center will-change-transform"
        >
          <div
            className="origin-center scale-105 w-screen h-screen max-w-none"
            style={{ width: "100vw", height: "100vh" }}
          >
            <canvas
              ref={canvasRef}
              className="block h-full w-full"
              aria-hidden
            />
          </div>
        </div>
      </div>

      {!ready && (
        <div
          className="fixed inset-0 z-60 flex flex-col items-center justify-center gap-6 bg-black text-foreground"
          role="status"
          aria-live="polite"
        >
          <p
            className="text-sm font-medium tracking-[0.2em] uppercase text-muted-foreground"
            style={{ fontFamily: "Inter, system-ui, sans-serif" }}
          >
            Loading sequence
          </p>
          <p
            className="text-5xl tabular-nums sm:text-6xl"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {loadPercent}%
          </p>
          <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-white/90 transition-[width] duration-150 ease-out"
              style={{ width: `${loadPercent}%` }}
            />
          </div>
        </div>
      )}

      {ready && (
        <button
          type="button"
          onClick={scrollToTop}
          className="liquid-glass pointer-events-auto fixed bottom-8 right-8 z-60 rounded-full px-6 py-3 text-sm text-foreground transition-transform hover:scale-[1.03] cursor-pointer"
          style={{ fontFamily: "Inter, system-ui, sans-serif" }}
        >
          Scroll to top
        </button>
      )}
    </>
  );
}
