import type { ComponentUsage } from "@/lib/mock";

export function ComponentAdoption({ data }: { data: ComponentUsage[] }) {
  return (
    <section className="dashboard-panel">
      <h2 className="dashboard-panel-title">Component adoption</h2>
      <p
        style={{
          fontSize: "var(--atom-font-size-sm)",
          color: "var(--atom-color-text-tertiary)",
          margin: "0 0 var(--atom-spacing-md)",
        }}
      >
        Share of projects using each component, this month.
      </p>
      <div className="dashboard-bars">
        {data.map((row) => (
          <div className="dashboard-bar-row" key={row.name}>
            <span className="dashboard-bar-name">{row.name}</span>
            <span className="dashboard-bar-track">
              <span
                className="dashboard-bar-fill"
                style={{ width: `${row.usage}%` }}
                aria-label={`${row.usage} percent`}
              />
            </span>
            <span className="dashboard-bar-value">{row.usage}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}
