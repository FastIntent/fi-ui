import { Button } from "@atomizeui/core";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/overview/KpiCard";
import { ComponentAdoption } from "@/components/overview/ComponentAdoption";
import { ActivityFeed } from "@/components/overview/ActivityFeed";
import { ThemeUsage } from "@/components/overview/ThemeUsage";
import { NavIcon } from "@/components/layout/NavIcon";
import { componentAdoption, kpis, recentActivity, themeUsage } from "@/lib/mock";

export default function OverviewPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Overview"
        subtitle="What's happening across the Atomize UI ecosystem today."
        actions={
          <>
            <Button>Export</Button>
            <Button type="primary" icon={<NavIcon name="Plus" />}>
              New release
            </Button>
          </>
        }
      />

      <div className="dashboard-kpi-grid">
        {kpis.map((k) => (
          <KpiCard kpi={k} key={k.id} />
        ))}
      </div>

      <div className="dashboard-two-col">
        <ComponentAdoption data={componentAdoption} />
        <ActivityFeed items={recentActivity} />
      </div>

      <div className="dashboard-two-col">
        <ThemeUsage data={themeUsage} />
        <section className="dashboard-panel">
          <h2 className="dashboard-panel-title">Plan health</h2>
          <p
            style={{
              fontSize: "var(--atom-font-size-sm)",
              color: "var(--atom-color-text-tertiary)",
              margin: "0 0 var(--atom-spacing-md)",
            }}
          >
            Seats and usage on the Team plan.
          </p>
          <div className="dashboard-bars">
            <div className="dashboard-bar-row">
              <span className="dashboard-bar-name">Seats</span>
              <span className="dashboard-bar-track">
                <span className="dashboard-bar-fill" style={{ width: "100%" }} />
              </span>
              <span className="dashboard-bar-value">5/5</span>
            </div>
            <div className="dashboard-bar-row">
              <span className="dashboard-bar-name">Projects</span>
              <span className="dashboard-bar-track">
                <span className="dashboard-bar-fill" style={{ width: "74%" }} />
              </span>
              <span className="dashboard-bar-value">37/50</span>
            </div>
            <div className="dashboard-bar-row">
              <span className="dashboard-bar-name">Storage</span>
              <span className="dashboard-bar-track">
                <span className="dashboard-bar-fill" style={{ width: "42%" }} />
              </span>
              <span className="dashboard-bar-value">4.2 GB</span>
            </div>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
