import { useEffect, useRef } from 'react';

interface TuxMascotProps {
  className?: string;
}

/**
 * A stationary Linux Tux whose eyes follow the mouse cursor (xeyes-style).
 * Sits wherever it's placed; only the pupils move. Gentle idle float.
 */
export function TuxMascot({ className }: TuxMascotProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const leftPupil = useRef<SVGGElement>(null);
  const rightPupil = useRef<SVGGElement>(null);

  useEffect(() => {
    let raf = 0;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    // Convert an eye's viewBox coords to screen space, then point the pupil at
    // the cursor (offset kept small so it stays inside the eye white).
    const pupilOffset = (eyeVbX: number, eyeVbY: number) => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const r = svg.getBoundingClientRect();
      const sx = r.left + (eyeVbX / 120) * r.width;
      const sy = r.top + (eyeVbY / 134) * r.height;
      const dx = mx - sx;
      const dy = my - sy;
      const d = Math.hypot(dx, dy) || 1;
      return { x: (dx / d) * 2.8, y: (dy / d) * 2.3 };
    };

    const tick = () => {
      const l = pupilOffset(49, 45);
      if (leftPupil.current) leftPupil.current.style.transform = `translate(${l.x}px, ${l.y}px)`;
      const r = pupilOffset(71, 45);
      if (rightPupil.current) rightPupil.current.style.transform = `translate(${r.x}px, ${r.y}px)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <svg ref={svgRef} viewBox="0 0 120 134" fill="none" className={className} aria-hidden="true">
      {/* soft contact shadow */}
      <ellipse cx="60" cy="127" rx="34" ry="6" fill="rgb(15 23 42 / 0.18)" />

      {/* feet */}
      <g fill="#f7a30b">
        <path d="M40 108c-9 1-18 9-15 14 2 4 22 3 27-1 3-3 1-13-12-13Z" />
        <path d="M80 108c9 1 18 9 15 14-2 4-22 3-27-1-3-3-1-13 12-13Z" />
      </g>

      {/* body */}
      <path
        d="M60 8c-22 0-37 17-37 47 0 16 4 34 11 49 4 9 13 14 26 14s22-5 26-14c7-15 11-33 11-49C97 25 82 8 60 8Z"
        fill="#15151c"
      />
      <path d="M60 9c-15 0-27 9-33 25 7-9 19-15 33-15s26 6 33 15C87 18 75 9 60 9Z" fill="#2a2a36" />

      {/* belly */}
      <path
        d="M60 36c-16 0-26 14-26 39 0 14 3 28 8 38 4 7 10 10 18 10s14-3 18-10c5-10 8-24 8-38 0-25-10-39-26-39Z"
        fill="#fdfdfa"
      />

      {/* flippers */}
      <path d="M27 58c-6 6-7 22-3 33 3-9 5-22 8-30Z" fill="#101019" />
      <path d="M93 58c6 6 7 22 3 33-3-9-5-22-8-30Z" fill="#101019" />

      {/* eyes (whites) */}
      <ellipse cx="49" cy="44" rx="9" ry="11" fill="#ffffff" />
      <ellipse cx="71" cy="44" rx="9" ry="11" fill="#ffffff" />

      {/* pupils (follow cursor) */}
      <g ref={leftPupil} style={{ transition: 'transform 70ms linear' }}>
        <circle cx="49" cy="45" r="3.6" fill="#15151c" />
        <circle cx="50.2" cy="43.6" r="1.1" fill="#ffffff" />
      </g>
      <g ref={rightPupil} style={{ transition: 'transform 70ms linear' }}>
        <circle cx="71" cy="45" r="3.6" fill="#15151c" />
        <circle cx="72.2" cy="43.6" r="1.1" fill="#ffffff" />
      </g>

      {/* beak */}
      <path d="M60 49c-7 0-12 4-12 8 0 3 5 6 12 6s12-3 12-6c0-4-5-8-12-8Z" fill="#f7a30b" />
      <path d="M60 58c-6 0-10 1-12 2 2 3 6 5 12 5s10-2 12-5c-2-1-6-2-12-2Z" fill="#d8870a" />
    </svg>
  );
}
