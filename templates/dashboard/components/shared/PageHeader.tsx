import type { ReactNode } from "react";
import { Space, Title, Text } from "@atomizeui/core";

interface Props {
  title: string;
  subtitle?: string;
  /** Optional badge/tag rendered inline next to the title. */
  meta?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, meta, actions }: Props) {
  return (
    <header className="dashboard-page-header">
      <div>
        <Space size={10} align="center">
          <Title level={1} className="dashboard-page-header-title">
            {title}
          </Title>
          {meta}
        </Space>
        {subtitle && (
          <Text color="secondary" className="dashboard-page-header-subtitle">
            {subtitle}
          </Text>
        )}
      </div>
      {actions && <div className="dashboard-page-header-actions">{actions}</div>}
    </header>
  );
}
