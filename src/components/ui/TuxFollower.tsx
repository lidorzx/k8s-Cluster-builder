import { useEffect, useRef } from 'react';

interface TuxFollowerProps {
  enabled: boolean;
}

/**
 * A friendly Linux Tux that trails the mouse with eased "spring" motion,
 * leans into its movement like a waddle, and whose eyes track the cursor.
 * Rendered fixed + pointer-events-none so it never blocks the UI.
 */
export function TuxFollower({ enabled }: TuxFollowerProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const leftPupilRef = useRef<SVGGElement>(null);
  const rightPupilRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (!enabled) return;

    // Skip on devices without a fine pointer (touch) — nothing to follow.
    if (window.matchMedia && !window.matchMedia('(pointer: fine)').matches) return;

    const SIZE = 66;
    // Current rendered position (top-left of the Tux box) and the mouse target.
    let curX = window.innerWidth / 2;
    let curY = window.innerHeight / 2;
    let mouseX = curX;
    let mouseY = curY;
    let prevX = curX;
    let visible = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      // Trail slightly down-right of the cursor so Tux doesn't sit on top of it.
      mouseX = e.clientX + 22;
      mouseY = e.clientY + 26;
      if (!visible && wrapRef.current) {
        wrapRef.current.style.opacity = '1';
        visible = true;
      }
    };

    const tick = () => {
      // Ease toward the target — the lag is what makes it feel like it follows.
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;

      const vx = curX - prevX;
      prevX = curX;

      if (wrapRef.current) {
        wrapRef.current.style.transform = `translate3d(${curX - SIZE / 2}px, ${curY - SIZE / 2}px, 0)`;
      }
      // Lean into horizontal movement (clamped waddle).
      const tilt = Math.max(-14, Math.min(14, vx * 1.4));
      if (tiltRef.current) {
        tiltRef.current.style.transform = `rotate(${tilt}deg)`;
      }

      // Eyes look toward the cursor.
      const dx = mouseX - curX;
      const dy = mouseY - curY;
      const dist = Math.hypot(dx, dy) || 1;
      const px = (dx / dist) * 2.4;
      const py = (dy / dist) * 2.0;
      if (leftPupilRef.current) leftPupilRef.current.style.transform = `translate(${px}px, ${py}px)`;
      if (rightPupilRef.current) rightPupilRef.current.style.transform = `translate(${px}px, ${py}px)`;

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none fixed left-0 top-0 z-[60] opacity-0 transition-opacity duration-500 will-change-transform"
      aria-hidden="true"
    >
      <div ref={tiltRef} className="animate-float" style={{ transformOrigin: '50% 80%' }}>
        <svg width="66" height="74" viewBox="0 0 120 134" fill="none">
          {/* soft contact shadow */}
          <ellipse cx="60" cy="127" rx="34" ry="6" fill="rgb(15 23 42 / 0.18)" />

          {/* feet */}
          <g fill="#f7a30b">
            <path d="M40 108c-9 1-18 9-15 14 2 4 22 3 27-1 3-3 1-13-12-13Z" />
            <path d="M80 108c9 1 18 9 15 14-2 4-22 3-27-1-3-3-1-13 12-13Z" />
          </g>

          {/* body (black) */}
          <path
            d="M60 8c-22 0-37 17-37 47 0 16 4 34 11 49 4 9 13 14 26 14s22-5 26-14c7-15 11-33 11-49C97 25 82 8 60 8Z"
            fill="#15151c"
          />
          {/* head sheen */}
          <path d="M60 9c-15 0-27 9-33 25 7-9 19-15 33-15s26 6 33 15C87 18 75 9 60 9Z" fill="#2a2a36" />

          {/* white belly */}
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
          <g ref={leftPupilRef} style={{ transition: 'transform 60ms linear' }}>
            <circle cx="49" cy="45" r="3.6" fill="#15151c" />
            <circle cx="50.2" cy="43.6" r="1.1" fill="#ffffff" />
          </g>
          <g ref={rightPupilRef} style={{ transition: 'transform 60ms linear' }}>
            <circle cx="71" cy="45" r="3.6" fill="#15151c" />
            <circle cx="72.2" cy="43.6" r="1.1" fill="#ffffff" />
          </g>

          {/* beak */}
          <path d="M60 49c-7 0-12 4-12 8 0 3 5 6 12 6s12-3 12-6c0-4-5-8-12-8Z" fill="#f7a30b" />
          <path d="M60 58c-6 0-10 1-12 2 2 3 6 5 12 5s10-2 12-5c-2-1-6-2-12-2Z" fill="#d8870a" />
        </svg>
      </div>
    </div>
  );
}
