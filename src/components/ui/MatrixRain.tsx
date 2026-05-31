import { useEffect, useRef } from 'react';

interface MatrixRainProps {
  className?: string;
}

/**
 * cmatrix-style falling code rain on a 2D canvas. Cheap (throttled ~18fps),
 * self-contained, and sized to its container. Meant to sit behind the hero.
 */
export function MatrixRain({ className }: MatrixRainProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const glyphs =
      'アカサタナハマヤラワ0123456789{}[]<>/=;:$#&kubectlapplyyamlclusterX'.split('');
    const fontSize = 16;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let cols = 0;
    let drops: number[] = [];

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / fontSize);
      drops = new Array(cols).fill(0).map(() => Math.floor(Math.random() * (h / fontSize)));
    };

    let raf = 0;
    let last = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < 55) return; // ~18fps — a chill rain, easy on the CPU
      last = t;

      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      // translucent wash leaves fading trails behind each head glyph
      ctx.fillStyle = 'rgba(6, 9, 18, 0.1)';
      ctx.fillRect(0, 0, w, h);
      ctx.font = `${fontSize}px "JetBrains Mono Variable", monospace`;

      for (let i = 0; i < cols; i++) {
        const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        // occasional bright "head" glyph, otherwise the teal trail
        ctx.fillStyle = Math.random() > 0.9 ? '#e3fff5' : 'rgba(52, 224, 200, 0.95)';
        ctx.fillText(ch, x, y);
        if (y > h && Math.random() > 0.975) drops[i] = 0;
        else drops[i]++;
      }
    };

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <canvas ref={ref} className={className} />;
}
