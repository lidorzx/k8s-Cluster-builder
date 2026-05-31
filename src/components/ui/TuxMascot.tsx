import { useEffect, useRef } from 'react';

interface TuxMascotProps {
  className?: string;
}

/**
 * "DevOps Tux" — a cool Linux penguin with shades + headphones whose glowing
 * eyes track the cursor and whose head leans toward it (parallax). Idle float.
 * Pure SVG, no assets. Place it anywhere; only it reacts to the mouse.
 */
export function TuxMascot({ className }: TuxMascotProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const leanRef = useRef<SVGGElement>(null);
  const leftEye = useRef<SVGGElement>(null);
  const rightEye = useRef<SVGGElement>(null);

  useEffect(() => {
    let raf = 0;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 3;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const tick = () => {
      const svg = svgRef.current;
      if (svg) {
        const r = svg.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height * 0.42; // around the face
        const dx = mx - cx;
        const dy = my - cy;
        const d = Math.hypot(dx, dy) || 1;

        // Whole-body lean toward the cursor (feet stay planted).
        const lean = Math.max(-10, Math.min(10, (dx / Math.max(r.width, 1)) * 18));
        const shiftY = Math.max(-5, Math.min(7, (dy / Math.max(r.height, 1)) * 10));
        if (leanRef.current) {
          leanRef.current.style.transform = `rotate(${lean}deg) translate(0px, ${shiftY}px)`;
        }

        // Glowing eyes look at the cursor (kept inside the lenses).
        const ex = (dx / d) * 3.2;
        const ey = (dy / d) * 2.6;
        if (leftEye.current) leftEye.current.style.transform = `translate(${ex}px, ${ey}px)`;
        if (rightEye.current) rightEye.current.style.transform = `translate(${ex}px, ${ey}px)`;
      }
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
    <svg ref={svgRef} viewBox="0 0 240 300" fill="none" className={className} aria-hidden="true">
      <defs>
        <radialGradient id="tuxBody" cx="42%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#34343f" />
          <stop offset="55%" stopColor="#17171e" />
          <stop offset="100%" stopColor="#0a0a0f" />
        </radialGradient>
        <linearGradient id="tuxBelly" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e6ebf4" />
        </linearGradient>
        <linearGradient id="tuxBeak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffc24d" />
          <stop offset="100%" stopColor="#e8860a" />
        </linearGradient>
        <linearGradient id="tuxFoot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffb52e" />
          <stop offset="100%" stopColor="#d9790a" />
        </linearGradient>
        <linearGradient id="tuxLens" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#101a2e" />
          <stop offset="100%" stopColor="#243a5e" />
        </linearGradient>
        <linearGradient id="tuxCup" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b3b48" />
          <stop offset="100%" stopColor="#16161d" />
        </linearGradient>
        <linearGradient id="tuxBand" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#38bdf8" />
        </linearGradient>
        <radialGradient id="tuxEye" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#bafff0" />
          <stop offset="45%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0ea5a3" />
        </radialGradient>
        <filter id="tuxEyeGlow" x="-120%" y="-120%" width="340%" height="340%">
          <feGaussianBlur stdDeviation="2.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* contact shadow (static) */}
      <ellipse cx="120" cy="288" rx="64" ry="10" fill="rgb(2 6 23 / 0.45)" />

      {/* everything that leans toward the cursor; feet stay planted */}
      <g ref={leanRef} style={{ transformBox: 'fill-box', transformOrigin: '50% 92%', transition: 'transform 120ms ease-out' }}>
        {/* feet */}
        <g fill="url(#tuxFoot)">
          <path d="M96 262c-16 2-31 16-25 25 5 8 33 6 41-1 5-5 3-26-16-24Z" />
          <path d="M144 262c16 2 31 16 25 25-5 8-33 6-41-1-5-5-3-26 16-24Z" />
        </g>

        {/* headphone band */}
        <path d="M50 120C50 48 190 48 190 120" stroke="#15151c" strokeWidth="16" strokeLinecap="round" />
        <path d="M50 120C50 54 190 54 190 120" stroke="url(#tuxBand)" strokeWidth="5" strokeLinecap="round" opacity="0.9" />

        {/* body */}
        <path
          d="M120 30C68 30 44 84 44 152c0 60 18 112 47 130 11 7 47 7 58 0 29-18 47-70 47-130C196 84 172 30 120 30Z"
          fill="url(#tuxBody)"
        />

        {/* belly */}
        <path
          d="M120 116c-29 0-45 30-45 78 0 38 16 74 45 78 29-4 45-40 45-78 0-48-16-78-45-78Z"
          fill="url(#tuxBelly)"
        />

        {/* flippers */}
        <path d="M48 150c-13 14-15 56-3 80 6-16 9-44 14-58Z" fill="#0d0d13" />
        <path d="M192 150c13 14 15 56 3 80-6-16-9-44-14-58Z" fill="#0d0d13" />

        {/* head sheen */}
        <ellipse cx="92" cy="78" rx="30" ry="20" fill="#ffffff" opacity="0.05" />

        {/* ear cups (headphones) */}
        <g>
          <ellipse cx="49" cy="124" rx="17" ry="23" fill="url(#tuxCup)" />
          <ellipse cx="49" cy="124" rx="11" ry="16" fill="none" stroke="url(#tuxBand)" strokeWidth="2" opacity="0.7" />
          <ellipse cx="49" cy="124" rx="7" ry="11" fill="#0a0a0f" />
          <ellipse cx="191" cy="124" rx="17" ry="23" fill="url(#tuxCup)" />
          <ellipse cx="191" cy="124" rx="11" ry="16" fill="none" stroke="url(#tuxBand)" strokeWidth="2" opacity="0.7" />
          <ellipse cx="191" cy="124" rx="7" ry="11" fill="#0a0a0f" />
        </g>

        {/* sunglasses */}
        <g>
          {/* temple arms */}
          <path d="M70 116 54 121M170 116 186 121" stroke="#0b0b10" strokeWidth="5" strokeLinecap="round" />
          {/* lenses */}
          <rect x="70" y="100" width="44" height="30" rx="9" fill="url(#tuxLens)" stroke="#05070d" strokeWidth="3" />
          <rect x="126" y="100" width="44" height="30" rx="9" fill="url(#tuxLens)" stroke="#05070d" strokeWidth="3" />
          {/* bridge */}
          <path d="M114 110h12" stroke="#0b0b10" strokeWidth="6" strokeLinecap="round" />

          {/* glowing eyes (track cursor) */}
          <g ref={leftEye} style={{ transition: 'transform 70ms linear' }}>
            <ellipse cx="92" cy="115" rx="5.4" ry="6.2" fill="url(#tuxEye)" filter="url(#tuxEyeGlow)" />
          </g>
          <g ref={rightEye} style={{ transition: 'transform 70ms linear' }}>
            <ellipse cx="148" cy="115" rx="5.4" ry="6.2" fill="url(#tuxEye)" filter="url(#tuxEyeGlow)" />
          </g>

          {/* glossy glints */}
          <path d="M76 105l10-2-12 9Z" fill="#ffffff" opacity="0.35" />
          <path d="M132 105l10-2-12 9Z" fill="#ffffff" opacity="0.35" />
        </g>

        {/* beak */}
        <path d="M120 132c-13 0-21 6-21 12s8 11 21 11 21-5 21-11-8-12-21-12Z" fill="url(#tuxBeak)" />
        <path d="M120 145c-9 0-15 1-19 3 4 5 11 7 19 7s15-2 19-7c-4-2-10-3-19-3Z" fill="#cf7a08" />
      </g>
    </svg>
  );
}
