"use client";

import { useState } from "react";
import { Option, Select } from "@atomizeui/core";

interface Props {
  options: { value: string; label: string }[];
  defaultValue: string;
  width?: number;
}

/**
 * Tiny client island around Select. Required because Select expects
 * <Option> React elements as children, but server components serialize
 * those elements through the RSC payload — the Select then receives
 * plain objects instead of recognised React types and crashes.
 *
 * Owning the Options here keeps Select's children inside the client
 * boundary while the parent page stays fully server-rendered.
 */
export function SimpleSelect({ options, defaultValue, width }: Props) {
  const [value, setValue] = useState(defaultValue);
  return (
    <Select
      value={value}
      onChange={(v) => setValue(v as string)}
      style={width ? { width } : undefined}
    >
      {options.map((o) => (
        <Option key={o.value} value={o.value}>
          {o.label}
        </Option>
      ))}
    </Select>
  );
}
