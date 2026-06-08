"use client";

import { useEffect, useState } from "react";
import { Radio, RadioGroup } from "@atomizeui/core";

type Theme = "light" | "dark" | "system";

/**
 * Theme picker. Mirrors the choice on <html data-theme>. "system" clears
 * the attribute so the OS preference (and the kit's @media rules) take
 * over. Pure UI atom — no global store, no context.
 */
export function ThemeRadio() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    if (typeof document === "undefined") return;
    if (theme === "system") document.documentElement.removeAttribute("data-theme");
    else document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <RadioGroup value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
      <Radio value="light">Light</Radio>
      <Radio value="dark">Dark</Radio>
      <Radio value="system">System</Radio>
    </RadioGroup>
  );
}
