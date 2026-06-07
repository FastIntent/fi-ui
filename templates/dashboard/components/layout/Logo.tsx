/**
 * Atomize UI mark — atom orbital around the "a" nucleus.
 */
export function Logo({ size = 24 }: { size?: number }) {
  return (
    <span className="dashboard-logo" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 32 32" width={size} height={size} fill="none">
        <rect width="32" height="32" rx="8" fill="var(--atom-primary-color)" />
        <circle cx="16" cy="16" r="3.5" fill="#fff" />
        <ellipse cx="16" cy="16" rx="10" ry="4" stroke="#fff" strokeWidth="1.5" opacity="0.65" />
        <ellipse
          cx="16"
          cy="16"
          rx="10"
          ry="4"
          stroke="#fff"
          strokeWidth="1.5"
          opacity="0.45"
          transform="rotate(60 16 16)"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="10"
          ry="4"
          stroke="#fff"
          strokeWidth="1.5"
          opacity="0.3"
          transform="rotate(120 16 16)"
        />
      </svg>
    </span>
  );
}
