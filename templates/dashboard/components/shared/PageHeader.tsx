import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: Props) {
  return (
    <header className="dashboard-page-header">
      <div>
        <h1 className="dashboard-page-header-title">{title}</h1>
        {subtitle && <p className="dashboard-page-header-subtitle">{subtitle}</p>}
      </div>
      {actions && <div className="dashboard-page-header-actions">{actions}</div>}
    </header>
  );
}
