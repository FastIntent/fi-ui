import { Button } from "@atomizeui/core";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PageHeader } from "@/components/shared/PageHeader";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { SettingsRow } from "@/components/settings/SettingsRow";
import { MatrixSwitch } from "@/components/settings/MatrixSwitch";
import { DigestPicker } from "@/components/settings/DigestPicker";
import { StandaloneSwitch } from "@/components/settings/StandaloneSwitch";

type Channel = "email" | "inApp" | "slack";
type Category = "releases" | "mentions" | "activity" | "marketing";

const CATEGORIES: { id: Category; label: string; description: string }[] = [
  {
    id: "releases",
    label: "Releases",
    description: "New @atomizeui/core versions, breaking changes and changelog highlights.",
  },
  {
    id: "mentions",
    label: "Mentions",
    description: "Someone tagged you in a comment, PR or design review.",
  },
  {
    id: "activity",
    label: "Workspace activity",
    description: "Members joining, projects created, integrations connected.",
  },
  {
    id: "marketing",
    label: "Product news",
    description: "Roadmap updates, customer stories, occasional announcements.",
  },
];

type Matrix = Record<Category, Record<Channel, boolean>>;

const DEFAULT_MATRIX: Matrix = {
  releases: { email: true, inApp: true, slack: true },
  mentions: { email: true, inApp: true, slack: false },
  activity: { email: false, inApp: true, slack: false },
  marketing: { email: false, inApp: false, slack: false },
};

const CHANNELS: Channel[] = ["email", "inApp", "slack"];

/**
 * Server component. Renders the entire markup (matrix layout, labels,
 * descriptions, section chrome) at build time. Only the actual toggles
 * are client atoms — each <MatrixSwitch /> ships its own tiny `useState`.
 * The page chunk stays close to zero bytes of page-specific JS.
 */
export default function NotificationsSettingsPage() {
  return (
    <DashboardLayout>
      <PageHeader
        title="Notifications"
        subtitle="Choose what reaches you and how. These preferences apply to your account only."
      />

      <div className="settings-stack">
        <SettingsSection
          title="By category"
          description="Per-category control across every channel. Toggle individual cells to fine-tune."
        >
          <div className="notif-matrix" role="table" aria-label="Notification matrix">
            <div className="notif-matrix-head" role="row">
              <span className="notif-matrix-th notif-matrix-th-label">Category</span>
              <span className="notif-matrix-th" role="columnheader">
                Email
              </span>
              <span className="notif-matrix-th" role="columnheader">
                In-app
              </span>
              <span className="notif-matrix-th" role="columnheader">
                Slack
              </span>
            </div>
            {CATEGORIES.map((cat) => (
              <div className="notif-matrix-row" role="row" key={cat.id}>
                <div className="notif-matrix-cell-label" role="rowheader">
                  <div className="notif-matrix-label">{cat.label}</div>
                  <div className="notif-matrix-description">{cat.description}</div>
                </div>
                {CHANNELS.map((channel) => (
                  <div className="notif-matrix-cell" role="cell" key={channel}>
                    <MatrixSwitch
                      defaultChecked={DEFAULT_MATRIX[cat.id][channel]}
                      ariaLabel={`${cat.label} via ${channel}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </SettingsSection>

        <SettingsSection
          title="Schedule"
          description="Batch routine updates into a daily summary, or mute everything for a window."
        >
          <DigestPicker />
          <SettingsRow
            label="Do not disturb"
            description="Pause every channel between 22:00 and 07:00 (your local time)."
            control={<StandaloneSwitch />}
          />
        </SettingsSection>

        <SettingsSection
          title="Slack integration"
          description="Connection used to deliver Slack notifications. Manage in the Integrations tab."
          action={<Button>Open integration</Button>}
        >
          <SettingsRow
            label="Workspace"
            description="atomize-team.slack.com"
            control={<span className="settings-meta">Connected as @atomize-bot</span>}
          />
        </SettingsSection>
      </div>
    </DashboardLayout>
  );
}
