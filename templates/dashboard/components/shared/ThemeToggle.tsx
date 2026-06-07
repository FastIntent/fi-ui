"use client";

import { useEffect, useState } from "react";
import { applyTheme, getInitialTheme, persistTheme, type Theme } from "@/lib/theme";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  if (!theme) {
    // Avoid hydration mismatch — render an inert placeholder of the same size
    return <button type="button" className="dashboard-theme-toggle" aria-hidden="true" />;
  }

  const next: Theme = theme === "dark" ? "light" : "dark";
  const onToggle = () => {
    applyTheme(next);
    persistTheme(next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      className="dashboard-theme-toggle"
      onClick={onToggle}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      <span className="dashboard-theme-toggle-icon" aria-hidden="true">
        {theme === "dark" ? (
          // sun
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        ) : (
          // moon
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </span>
    </button>
  );
}
