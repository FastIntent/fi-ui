import type { ComponentUsage } from "@/lib/mock";

export function ComponentAdoption({ data }: { data: ComponentUsage[] }) {
  return (
    <section className="dashboard-panel">
      <h2 className="dashboard-panel-title">Component adoption</h2>
      <p className="dashboard-panel-subtitle">
        Share of projects using each component, this month.
      </p>
      <div className="dashboard-adoption">
        {data.map((row, idx) => (
          <div className="dashboard-adoption-row" key={row.name}>
            <span className="dashboard-adoption-name">{row.name}</span>
            <span className="dashboard-adoption-track">
              <span
                className="dashboard-adoption-fill"
                style={{
                  width: `${row.usage}%`,
                  animationDelay: `${idx * 60}ms`,
                }}
                aria-label={`${row.usage} percent`}
              />
            </span>
            <span className="dashboard-adoption-value">{row.usage}%</span>
          </div>
        ))}
      </div>
    </section>
  );
}
