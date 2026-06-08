"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { sidebarNav } from "@/lib/navigation";
import { NavIcon } from "./NavIcon";
import { Logo } from "./Logo";

interface SidebarProps {
  /** Fired when an item is clicked. Useful for closing the mobile drawer
      after navigation. */
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps = {}) {
  const pathname = usePathname();

  // Only the **best** match is active. Two items can prefix-match the
  // same pathname (e.g. `/settings` is a real page AND a parent of
  // `/settings/notifications`); naive `startsWith` would light both.
  // Pick the longest matching href so the most specific item wins.
  const matchingHrefs = sidebarNav
    .flatMap((g) => g.items.map((i) => i.href))
    .filter((href) =>
      href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`),
    );
  const bestMatch = matchingHrefs.reduce(
    (best, href) => (href.length > best.length ? href : best),
    "",
  );

  return (
    <aside className="dashboard-sidebar" aria-label="Primary navigation">
      <div className="dashboard-sidebar-brand">
        <Logo height={26} />
      </div>

      <nav className="dashboard-sidebar-nav">
        {sidebarNav.map((group, gIdx) => (
          <div className="dashboard-sidebar-group" key={gIdx}>
            {group.title && <div className="dashboard-sidebar-group-title">{group.title}</div>}
            <ul className="dashboard-sidebar-items">
              {group.items.map((item) => {
                const active = item.href === bestMatch;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={
                        "dashboard-sidebar-item" + (active ? " dashboard-sidebar-item-active" : "")
                      }
                      aria-current={active ? "page" : undefined}
                      onClick={onNavigate}
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
