"use client";

import { Avatar, Badge, Dropdown, Input, Menu, MenuItem } from "@atomizeui/core";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { MobileNav } from "./MobileNav";
import { NavIcon } from "./NavIcon";

const userMenu = (
  <Menu>
    <MenuItem key="profile">Profile</MenuItem>
    <MenuItem key="prefs">Preferences</MenuItem>
    <MenuItem key="docs">Documentation</MenuItem>
    <MenuItem key="signout">Sign out</MenuItem>
  </Menu>
);

const notificationsMenu = (
  <Menu style={{ minWidth: 320 }}>
    <MenuItem key="r1">
      <strong>New release</strong>
      <div style={{ fontSize: 12, color: "var(--atom-color-text-tertiary)" }}>
        @atomizeui/core v2.0.0 is published — 2h ago
      </div>
    </MenuItem>
    <MenuItem key="r2">
      <strong>Pull request opened</strong>
      <div style={{ fontSize: 12, color: "var(--atom-color-text-tertiary)" }}>
        fix(image-manager): scrollbar-gutter — 5h ago
      </div>
    </MenuItem>
    <MenuItem key="r3">
      <strong>New discussion</strong>
      <div style={{ fontSize: 12, color: "var(--atom-color-text-tertiary)" }}>
        How do you compose blocks with theming? — 6h ago
      </div>
    </MenuItem>
  </Menu>
);

export function Header() {
  return (
    <header className="dashboard-header" role="banner">
      <MobileNav />

      <div className="dashboard-header-search">
        <Input
          placeholder="Search components, templates, docs…"
          prefix={<NavIcon name="Search" />}
          allowClear
          size="middle"
        />
      </div>

      <div className="dashboard-header-actions">
        <ThemeToggle />

        <Dropdown overlay={notificationsMenu} trigger={["click"]} placement="bottomRight">
          <button type="button" className="dashboard-header-icon-btn" aria-label="Notifications">
            <NavIcon name="Bell" />
            <Badge dot status="processing" />
          </button>
        </Dropdown>

        <Dropdown overlay={userMenu} trigger={["click"]} placement="bottomRight">
          <button type="button" className="dashboard-header-user" aria-label="User menu">
            <Avatar size="small">AK</Avatar>
            <span className="dashboard-header-user-name">Ari Kim</span>
            <NavIcon name="ChevronDown" size={14} />
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
