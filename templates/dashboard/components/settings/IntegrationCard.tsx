import type { Integration } from "@/lib/mock";
import { NavIcon } from "@/components/layout/NavIcon";
import { IntegrationToggle } from "@/components/settings/IntegrationToggle";

const ICON_FOR_CATEGORY = {
  Source: "Box",
  Deploy: "Box",
  Community: "MessageCircle",
  Analytics: "Box",
} as const;

/**
 * Server component. Renders the card chrome (mark, name, status,
 * description) at build time. Only the Connect/Disconnect button is a
 * client atom — `<IntegrationToggle />` owns its own state.
 */
export function IntegrationCard({ integration }: { integration: Integration }) {
  const iconName = ICON_FOR_CATEGORY[integration.category];
  return (
    <article className="integration-card">
      <div className="integration-card-head">
        <div className="integration-card-mark" aria-hidden="true">
          <NavIcon name={iconName} size={20} />
        </div>
        <div className="integration-card-name">{integration.name}</div>
        <span
          className={
            "integration-card-status" +
            (integration.connected ? " integration-card-status-connected" : "")
          }
        >
          <span className="integration-card-status-dot" aria-hidden="true" />
          {integration.connected ? "Connected" : "Not connected"}
        </span>
      </div>
      <p className="integration-card-description">{integration.description}</p>
      <div className="integration-card-footer">
        <IntegrationToggle name={integration.name} initiallyConnected={integration.connected} />
      </div>
    </article>
  );
}
