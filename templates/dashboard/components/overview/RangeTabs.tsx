"use client";

import { useState } from "react";
import { Tabs } from "@atomizeui/core";

const RANGE_TABS = [
  { key: "all", label: "All time" },
  { key: "30d", label: "Last 30 days" },
  { key: "7d", label: "Last 7 days" },
];

/**
 * Decorative date-range filter. The values are mock — the KPIs do not
 * actually re-fetch — so the island stays tiny: just Tabs + a single
 * useState. Hook into your data layer where `setRange` lands when you
 * fork the template.
 */
export function RangeTabs() {
  const [range, setRange] = useState("all");
  return (
    <Tabs
      items={RANGE_TABS.map((t) => ({ key: t.key, label: t.label }))}
      activeKey={range}
      onChange={setRange}
      className="dashboard-range-tabs"
    />
  );
}
