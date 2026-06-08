"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@atomizeui/core";
import { KpiCard } from "./KpiCard";
import type { Kpi } from "@/lib/mock";

interface Props {
  kpis: Kpi[];
}

/**
 * Brief loading state for the KPI strip. The data ships pre-rendered
 * inside this island via props (no extra fetch); the skeleton frames
 * exist to demo the component and document the loading pattern.
 */
export function KpiSkeletonStrip({ kpis }: Props) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {loading
        ? kpis.map((k) => (
            <div className="dashboard-kpi-card" key={k.id}>
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" height={32} />
              <Skeleton variant="rounded" width="100%" height={40} />
            </div>
          ))
        : kpis.map((k) => <KpiCard kpi={k} key={k.id} />)}
    </>
  );
}
