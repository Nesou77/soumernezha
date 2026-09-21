import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Draw the monogram strokes with a CSS animation (used by the loader). */
  animate?: boolean;
}

/** Geometric NS monogram inside a hexagonal "cube" outline. */
export function Logo({ className, animate = false }: LogoProps) {
  const stroke = animate ? { strokeDasharray: 1, strokeDashoffset: 1 } : undefined;
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label="NS monogram"
      className={cn("text-accent", className)}
    >
      <path
        d="M24 3.5 42 14v20L24 44.5 6 34V14L24 3.5Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        pathLength={1}
        style={stroke}
        className={animate ? "logo-draw" : undefined}
      />
      <path
        d="M15 32V16l9 16V16"
        stroke="#F5F7FA"
        strokeWidth="2.2"
        strokeLinecap="square"
        strokeLinejoin="miter"
        pathLength={1}
        style={stroke}
        className={animate ? "logo-draw logo-draw-2" : undefined}
      />
      <path
        d="M39 18.5c-1.5-2-4-3-6.5-3-3.2 0-5.5 1.6-5.5 4 0 2.6 2.4 3.4 5.5 4.2 3.2.8 5.5 1.6 5.5 4.2 0 2.4-2.3 4-5.5 4-2.7 0-5.2-1-6.7-3"
        stroke="#F5F7FA"
        strokeWidth="2.2"
        strokeLinecap="square"
        pathLength={1}
        style={stroke}
        className={animate ? "logo-draw logo-draw-3" : undefined}
      />
    </svg>
  );
}
