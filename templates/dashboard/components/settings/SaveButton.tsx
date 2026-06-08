"use client";

import { useState } from "react";
import { Button, message } from "@atomizeui/core";

interface Props {
  label: string;
  successMessage: string;
  /** Simulated round-trip delay in ms. Replace with real mutation. */
  delay?: number;
}

export function SaveButton({ label, successMessage, delay = 600 }: Props) {
  const [saving, setSaving] = useState(false);
  const onClick = () => {
    setSaving(true);
    window.setTimeout(() => {
      setSaving(false);
      message.success(successMessage);
    }, delay);
  };
  return (
    <Button type="primary" loading={saving} onClick={onClick}>
      {label}
    </Button>
  );
}
