/**
 * Official AtomizeUI lockup (icon + wordmark in one SVG).
 *
 * Two variants live in /public/ — one with a black wordmark for light
 * surfaces, one with white for dark. We render both and let CSS swap
 * them based on [data-theme] on <html>. This avoids any JS-driven src
 * swap, hydration mismatch, or theme-flash.
 *
 *   light surface →  atomizeui-light.svg  (icon verde + texto negro)
 *   dark surface  →  atomizeui-dark.svg   (icon verde + texto blanco)
 *
 * The SVG aspect ratio is 1363:255 (~5.34:1). Pass `height` to scale —
 * width is derived automatically.
 */
interface LogoProps {
  height?: number;
  className?: string;
}

const ASPECT = 1363 / 255;

export function Logo({ height = 28, className }: LogoProps) {
  const width = Math.round(height * ASPECT);

  return (
    <span
      className={"dashboard-logo" + (className ? ` ${className}` : "")}
      style={{ height, width }}
      aria-label="AtomizeUI"
    >
      <img
        src="/atomizeui-light.svg"
        alt=""
        width={width}
        height={height}
        className="dashboard-logo-light"
        draggable={false}
      />
      <img
        src="/atomizeui-dark.svg"
        alt=""
        width={width}
        height={height}
        className="dashboard-logo-dark"
        draggable={false}
      />
    </span>
  );
}
