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
              <div className="dashboard-activity-title">{item.title}</div>
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
