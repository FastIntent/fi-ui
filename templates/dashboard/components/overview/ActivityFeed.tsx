import { Tag } from "@atomizeui/core";
import { NavIcon } from "@/components/layout/NavIcon";
import type { ActivityItem } from "@/lib/mock";

const iconFor = (type: ActivityItem["type"]) => {
  switch (type) {
    case "release":
      return "Box";
    case "pr":
      return "GitPullRequest";
    case "issue":
      return "AlertCircle";
    case "discussion":
      return "MessageCircle";
  }
};

const TAG_COLOR: Record<ActivityItem["type"], "success" | "processing" | "warning" | "default"> = {
  release: "success",
  pr: "processing",
  issue: "warning",
  discussion: "default",
};

const TAG_LABEL: Record<ActivityItem["type"], string> = {
  release: "Release",
  pr: "PR",
  issue: "Issue",
  discussion: "Discussion",
};

export function ActivityFeed({ items }: { items: ActivityItem[] }) {
  return (
    <section className="dashboard-panel">
      <h2 className="dashboard-panel-title">Recent activity</h2>
      <div className="dashboard-activity">
        {items.map((item) => (
          <article className="dashboard-activity-item" key={item.id}>
            <span
              className={
                "dashboard-activity-icon " +
                (item.type === "release" ? "dashboard-activity-icon-release" : "")
              }
            >
              <NavIcon name={iconFor(item.type)!} size={14} />
            </span>
            <div className="dashboard-activity-body">
              <div className="dashboard-activity-title">
                <Tag color={TAG_COLOR[item.type]}>{TAG_LABEL[item.type]}</Tag>
                <span>{item.title}</span>
              </div>
              <div className="dashboard-activity-meta">
                {item.actor} · {item.timeAgo}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
