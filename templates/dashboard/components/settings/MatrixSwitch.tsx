"use client";

import { useState } from "react";
import { Switch } from "@atomizeui/core";

interface Props {
  defaultChecked: boolean;
  ariaLabel: string;
}

/**
 * Atomic client island. Owns its own toggle state so the surrounding
 * matrix can stay fully server-rendered. The parent doesn't need to
 * lift state; each cell handles its own `useState`.
 *
 * Trade-off: no central "save preferences" closure here. If you need
 * that, swap this for a controlled Switch inside a higher-up client
 * island, or post-on-change to your backend per toggle. For the
 * template the per-cell store mirrors how Linear/Notion render their
 * settings pages.
 */
export function MatrixSwitch({ defaultChecked, ariaLabel }: Props) {
  const [checked, setChecked] = useState(defaultChecked);
  return <Switch checked={checked} onChange={setChecked} aria-label={ariaLabel} />;
}
