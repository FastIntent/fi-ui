import type { ThemeUsage as ThemeUsageItem } from "@/lib/mock";

export function ThemeUsage({ data }: { data: ThemeUsageItem[] }) {
  return (
    <section className="dashboard-panel">
      <h2 className="dashboard-panel-title">Theme usage</h2>
      <p
        style={{
          fontSize: "var(--atom-font-size-sm)",
          color: "var(--atom-color-text-tertiary)",
          margin: "0 0 var(--atom-spacing-md)",
        }}
      >
        Distribution across active projects.
      </p>
      <div className="dashboard-theme-usage">
        {data.map((t) => (
          <div className="dashboard-theme-row" key={t.name}>
            <span className="dashboard-theme-swatch">
              <span className="dashboard-theme-swatch-dot" style={{ background: t.color }} />
              {t.name}
            </span>
            <span className="dashboard-bar-track">
              <span
                className="dashboard-bar-fill"
                style={{ width: `${t.share}%`, background: t.color }}
                aria-label={`${t.share} percent`}
              />
            </span>
            <span className="dashboard-bar-value">{t.share}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}
