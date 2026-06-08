"use client";

import { useState } from "react";
import { Drawer, Input } from "@atomizeui/core";
import { Sidebar } from "./Sidebar";
import { NavIcon } from "./NavIcon";
import { Logo } from "./Logo";

/**
 * Mobile-only navigation trigger.
 *
 * Renders a hamburger button (visible below the 720px breakpoint via CSS)
 * that opens a left Drawer containing:
 *   1. The search input — which lives in the header on desktop but moves
 *      here on mobile so the header stays compact and overflow-free.
 *   2. The same Sidebar used on desktop. Selecting any item closes the
 *      drawer automatically.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="dashboard-mobile-nav-toggle"
        aria-label="Open navigation"
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <NavIcon name="Menu" size={20} />
      </button>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        placement="left"
        width={288}
        closable={false}
        rootClassName="dashboard-mobile-nav-drawer"
        title={
          <span className="dashboard-mobile-nav-title">
            <Logo height={22} />
          </span>
        }
      >
        <div className="dashboard-mobile-nav-search">
          <Input
            placeholder="Search components, templates, docs…"
            prefix={<NavIcon name="Search" />}
            allowClear
            size="middle"
          />
        </div>

        <div className="dashboard-mobile-nav-body">
          <Sidebar onNavigate={() => setOpen(false)} />
        </div>
      </Drawer>
    </>
  );
}
