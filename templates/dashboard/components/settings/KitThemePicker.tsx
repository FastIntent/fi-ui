"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "atomize-kit-theme";

/**
 * Cada theme vive en su propio archivo (app/themes/<id>.css) y se activa
 * con data-kit-theme en <html>. El swatch refleja la combinación:
 * aside / header / acento de UI.
 */
const KIT_THEMES = [
  { id: null, name: "Default", aside: "#ffffff", header: "#f8fafc", accent: "#25ac01" },
  { id: "midnight", name: "Midnight", aside: "#0f172a", header: "#f8fafc", accent: "#25ac01" },
  { id: "carbon", name: "Carbon", aside: "#111113", header: "#1b1b1f", accent: "#25ac01" },
  { id: "forest", name: "Forest", aside: "#0d2818", header: "#f0fdf4", accent: "#25ac01" },
  { id: "ocean", name: "Ocean", aside: "#111a36", header: "#eef2ff", accent: "#3b6ef5" },
  { id: "ember", name: "Ember", aside: "#1d1412", header: "#fff4ec", accent: "#ff6a00" },
  { id: "azure", name: "Azure", aside: "#f0f0f0", header: "#f0f0f0", accent: "#1677ff" },
] as const;

type KitThemeId = (typeof KIT_THEMES)[number]["id"];

export function KitThemePicker() {
  const [active, setActive] = useState<KitThemeId>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && KIT_THEMES.some((t) => t.id === stored)) {
      setActive(stored as KitThemeId);
    }
  }, []);

  const apply = (id: KitThemeId) => {
    setActive(id);
    if (id === null) {
      document.documentElement.removeAttribute("data-kit-theme");
      localStorage.removeItem(STORAGE_KEY);
    } else {
      document.documentElement.setAttribute("data-kit-theme", id);
      localStorage.setItem(STORAGE_KEY, id);
    }
  };

  return (
    <div className="kit-theme-picker" role="radiogroup" aria-label="Dashboard theme">
      {KIT_THEMES.map((t) => (
        <button
          key={t.name}
          type="button"
          role="radio"
          aria-checked={active === t.id}
          className={"kit-theme-swatch" + (active === t.id ? " kit-theme-swatch-active" : "")}
          onClick={() => apply(t.id)}
        >
          <span className="kit-theme-swatch-preview" aria-hidden="true">
            <span className="kit-theme-swatch-aside" style={{ background: t.aside }} />
            <span className="kit-theme-swatch-main">
              <span className="kit-theme-swatch-header" style={{ background: t.header }} />
              <span className="kit-theme-swatch-body">
                <span className="kit-theme-swatch-accent" style={{ background: t.accent }} />
              </span>
            </span>
          </span>
          <span className="kit-theme-swatch-name">{t.name}</span>
        </button>
      ))}
    </div>
  );
}
