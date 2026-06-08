import { Tooltip } from "@atomizeui/core";
import { NavIcon } from "@/components/layout/NavIcon";
import type { Kpi } from "@/lib/mock";

type SparkVariant = "bars" | "stepped" | "dots" | "line";

const variantById: Record<string, SparkVariant> = {
  downloads: "stepped",
  projects: "line",
  stars: "bars",
  contributors: "dots",
};

function Sparkline({ data, variant }: { data: number[]; variant: SparkVariant }) {
  const max = Math.max(...data, 1);

  if (variant === "line") {
    const W = 100;
    const H = 40;
    const stepX = W / (data.length - 1);
    const points = data.map((v, i) => [i * stepX, H - (v / max) * (H - 4) - 2] as const);
    const path = points
      .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(2)} ${y.toFixed(2)}`)
      .join(" ");
    const area =
      `M ${points[0][0]} ${H} ` +
      points.map(([x, y]) => `L ${x.toFixed(2)} ${y.toFixed(2)}`).join(" ") +
      ` L ${W} ${H} Z`;
    return (
      <span className="dashboard-kpi-spark dashboard-kpi-spark-line" aria-hidden="true">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
          <path className="kpi-area" d={area} />
          <path d={path} />
        </svg>
      </span>
    );
  }

  return (
    <span className={`dashboard-kpi-spark dashboard-kpi-spark-${variant}`} aria-hidden="true">
      {data.map((v, i) => (
        <span
          key={i}
          style={
            variant === "dots"
              ? { opacity: 0.35 + (v / max) * 0.65 }
              : { height: `${(v / max) * 100}%` }
          }
        />
      ))}
    </span>
  );
}

export function KpiCard({ kpi }: { kpi: Kpi }) {
  const variant = variantById[kpi.id] ?? "bars";

  return (
    <div className="dashboard-kpi-card">
      <div className="dashboard-kpi-label">{kpi.label}</div>
      <div className="dashboard-kpi-value-row">
        <div className="dashboard-kpi-value">{kpi.value}</div>
        <Tooltip title={`${kpi.delta} vs previous period`} placement="top">
          <span
            className={
              "dashboard-kpi-delta " +
              (kpi.trend === "down" ? "dashboard-kpi-delta-down" : "dashboard-kpi-delta-up")
            }
            tabIndex={0}
          >
            <NavIcon name={kpi.trend === "down" ? "ArrowDown" : "ArrowUp"} size={12} />
            {kpi.delta}
          </span>
        </Tooltip>
      </div>
      <Sparkline data={kpi.sparkline} variant={variant} />
    </div>
  );
}
