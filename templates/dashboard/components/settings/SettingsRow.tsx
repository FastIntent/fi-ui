import type { ReactNode } from "react";

interface Props {
  label: string;
  description?: string;
  /** The control (Switch, Input, Select, Button…) on the right. */
  control: ReactNode;
}

/**
 * One row inside a SettingsSection: label + optional description on the
 * left, control on the right. Inspired by the Linear / Vercel settings
 * layout — flexbox so the control stays anchored to the right and the
 * label can wrap on narrow viewports.
 */
export function SettingsRow({ label, description, control }: Props) {
  return (
    <div className="settings-row">
      <div className="settings-row-text">
        <div className="settings-row-label">{label}</div>
        {description && <div className="settings-row-description">{description}</div>}
      </div>
      <div className="settings-row-control">{control}</div>
    </div>
  );
}
