"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { sidebarNav } from "@/lib/navigation";
import { NavIcon } from "./NavIcon";
import { Logo } from "./Logo";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="dashboard-sidebar" aria-label="Primary navigation">
      <div className="dashboard-sidebar-brand">
        <Logo />
        <span className="dashboard-sidebar-brand-name">atomizeui/core</span>
      </div>

      <nav className="dashboard-sidebar-nav">
        {sidebarNav.map((group, gIdx) => (
          <div className="dashboard-sidebar-group" key={gIdx}>
            {group.title && <div className="dashboard-sidebar-group-title">{group.title}</div>}
            <ul className="dashboard-sidebar-items">
              {group.items.map((item) => {
                const active =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={
                        "dashboard-sidebar-item" + (active ? " dashboard-sidebar-item-active" : "")
                      }
                      aria-current={active ? "page" : undefined}
                    >
                      <span className="dashboard-sidebar-item-icon" aria-hidden="true">
                        <NavIcon name={item.iconName} />
                      </span>
                      <span className="dashboard-sidebar-item-label">{item.label}</span>
                      {item.badge && (
                        <span className="dashboard-sidebar-item-badge">{item.badge}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="dashboard-sidebar-footer">
        <Link
          href="https://github.com/atomizeui/atomize-ui"
          className="dashboard-sidebar-footer-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          <NavIcon name="Github" />
          <span>GitHub</span>
        </Link>
      </div>
    </aside>
  );
}
