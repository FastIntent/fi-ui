import type { ReactNode } from "react";
import { Text, Title } from "@atomizeui/core";

interface Props {
  title: string;
  description?: string;
  /** Right-aligned slot in the section header (e.g. a save button). */
  action?: ReactNode;
  children: ReactNode;
  /** Style the section as a destructive zone (red border on hover, etc). */
  danger?: boolean;
}

/**
 * Card-shaped container for a group of related settings. Keeps the same
 * radius / border / hover treatment as the rest of the kit (Team table,
 * Media manager) so the Settings pages don't feel like a different app.
 */
export function SettingsSection({ title, description, action, children, danger }: Props) {
  return (
    <section
      className={`settings-section${danger ? " settings-section-danger" : ""}`}
      aria-label={title}
    >
      <header className="settings-section-header">
        <div>
          <Title level={2} className="settings-section-title">
            {title}
          </Title>
          {description && (
            <Text color="secondary" className="settings-section-description">
              {description}
            </Text>
          )}
        </div>
        {action && <div className="settings-section-action">{action}</div>}
      </header>
      <div className="settings-section-body">{children}</div>
    </section>
  );
}
