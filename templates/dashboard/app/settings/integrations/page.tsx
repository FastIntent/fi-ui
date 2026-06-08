import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { IntegrationCard } from "@/components/settings/IntegrationCard";
import { integrations } from "@/lib/mock";

/**
 * Server component. Renders the full grid of integration cards at build
 * time. Each card delegates only the connect/disconnect button to a
 * client atom; the markup (mark, name, status, description) ships as
 * static HTML.
 */
export default function IntegrationsSettingsPage() {
  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <DashboardLayout>
      <PageHeader
        title="Integrations"
        subtitle={`Connect the rest of your stack. ${connectedCount} of ${integrations.length} services connected.`}
      />

      <div className="integrations-grid">
        {integrations.map((i) => (
          <IntegrationCard key={i.id} integration={i} />
        ))}
      </div>
    </DashboardLayout>
  );
}
