"use client";

import { useState } from "react";
import { Switch } from "@atomizeui/core";

/**
 * Smallest possible client island: a Switch with internal state.
 * Stand-alone toggles (e.g. "Do not disturb", "Two-factor auth")
 * shouldn't drag the whole page into the client bundle.
 */
export function StandaloneSwitch({ defaultChecked = false }: { defaultChecked?: boolean }) {
  const [checked, setChecked] = useState(defaultChecked);
  return <Switch checked={checked} onChange={setChecked} />;
}
