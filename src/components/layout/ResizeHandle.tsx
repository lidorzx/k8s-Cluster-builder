import { useCallback } from 'react';

interface ResizeHandleProps {
  /** Called during drag with the desired panel width (px) = distance from the right edge. */
  onResize: (width: number) => void;
}

/**
 * Vertical drag handle that sits between the workspace and the YAML panel.
 * The panel is flush to the right edge, so its width = innerWidth - cursorX.
 */
export function ResizeHandle({ onResize }: ResizeHandleProps) {
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      const move = (ev: MouseEvent) => onResize(window.innerWidth - ev.clientX);
      const up = () => {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', up);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      document.addEventListener('mousemove', move);
      document.addEventListener('mouseup', up);
    },
    [onResize]
  );

  return (
    <div
      onMouseDown={onMouseDown}
      role="separator"
      aria-orientation="vertical"
      title="Drag to resize the YAML panel"
      className="group relative w-1.5 flex-shrink-0 cursor-col-resize bg-ink-200 transition-colors hover:bg-brand-400 active:bg-brand-500"
    >
      {/* grabber dots */}
      <div className="pointer-events-none absolute inset-y-0 left-1/2 flex -translate-x-1/2 items-center">
        <div className="h-9 w-1 rounded-full bg-ink-300 transition-colors group-hover:bg-white" />
      </div>
    </div>
  );
}
