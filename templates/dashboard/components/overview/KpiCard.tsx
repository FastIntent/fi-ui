import { NavIcon } from "@/components/layout/NavIcon";
import type { Kpi } from "@/lib/mock";

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const max = Math.max(...kpi.sparkline);

  return (
    <div className="dashboard-kpi-card">
      <div className="dashboard-kpi-label">{kpi.label}</div>
      <div className="dashboard-kpi-value-row">
        <div className="dashboard-kpi-value">{kpi.value}</div>
        <div
          className={
            "dashboard-kpi-delta " +
            (kpi.trend === "down" ? "dashboard-kpi-delta-down" : "dashboard-kpi-delta-up")
          }
        >
          <NavIcon name={kpi.trend === "down" ? "ArrowDown" : "ArrowUp"} size={12} />
          {kpi.delta}
        </div>
      </div>
      <div className="dashboard-kpi-sparkline" aria-hidden="true">
        {kpi.sparkline.map((v, i) => (
          <span
            key={i}
            className="dashboard-kpi-sparkline-bar"
            style={{
              height: `${(v / max) * 100}%`,
              opacity: 0.4 + (i / kpi.sparkline.length) * 0.6,
            }}
          />
        ))}
      </div>
    </div>
  );
}
