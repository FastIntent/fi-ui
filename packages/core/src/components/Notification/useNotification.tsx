import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import {
  NotificationItem,
  NotificationNode,
  NotificationPlacement,
  NotificationNodeProps,
} from './NotificationNode';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';

const notificationPrefixCls = getDefaultPrefixCls('notification');

// ─── Internal types ───────────────────────────────────────────────────────────

interface InternalItem extends NotificationItem {
  notificationKey: string;
}

interface PlacementState {
  items: InternalItem[];
  root: Root;
  container: HTMLElement;
}

// ─── State ────────────────────────────────────────────────────────────────────

const placements = new Map<NotificationPlacement, PlacementState>();
let keyCounter = 0;

// ─── Render helper ────────────────────────────────────────────────────────────

function renderPlacement(state: PlacementState) {
  state.root.render(
    <>
      {state.items.map((item) => (
        <NotificationNode key={item.notificationKey} {...item} onRemove={remove} />
      ))}
    </>
  );
}

function getOrCreatePlacement(placement: NotificationPlacement): PlacementState {
  const existing = placements.get(placement);
  if (existing) return existing;

  const container = document.createElement('div');
  container.className = `${notificationPrefixCls} ${notificationPrefixCls}-${placement}`;
  document.body.appendChild(container);

  const root = createRoot(container);
  const state: PlacementState = { items: [], root, container };
  placements.set(placement, state);
  return state;
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface OpenConfig extends NotificationItem {
  key?: string;
}

function open(config: OpenConfig): void {
  // SSR guard — notification requires a real DOM (createRoot + body.appendChild)
  if (typeof document === 'undefined') return;

  const placement: NotificationPlacement = config.placement ?? 'topRight';
  const notificationKey = config.key ?? `${notificationPrefixCls}-${++keyCounter}`;

  const state = getOrCreatePlacement(placement);

  const item: InternalItem = { ...config, notificationKey };
  const idx = state.items.findIndex((i) => i.notificationKey === notificationKey);

  if (idx >= 0) {
    state.items[idx] = item;
  } else {
    state.items.push(item);
  }

  renderPlacement(state);
}

function remove(notificationKey: string): void {
  placements.forEach((state, placement) => {
    const idx = state.items.findIndex((i) => i.notificationKey === notificationKey);
    if (idx < 0) return;

    // Animate out via class, then remove
    const el = state.container.querySelector(`[data-notification-key="${notificationKey}"]`);
    if (el) {
      el.classList.add(`${notificationPrefixCls}-notice-leaving`);
      setTimeout(() => finishRemove(notificationKey, placement), 220);
    } else {
      finishRemove(notificationKey, placement);
    }
  });
}

function finishRemove(notificationKey: string, placement: NotificationPlacement): void {
  const state = placements.get(placement);
  if (!state) return;
  state.items = state.items.filter((i) => i.notificationKey !== notificationKey);
  renderPlacement(state);
}

function destroyAll(): void {
  placements.forEach((state) => {
    state.items = [];
    renderPlacement(state);
  });
}

// ─── Exported object ──────────────────────────────────────────────────────────

export const notification = {
  open,
  success: (config: OpenConfig) => open({ ...config, type: 'success' }),
  error: (config: OpenConfig) => open({ ...config, type: 'error' }),
  warning: (config: OpenConfig) => open({ ...config, type: 'warning' }),
  info: (config: OpenConfig) => open({ ...config, type: 'info' }),
  destroy: (key?: string) => (key ? remove(key) : destroyAll()),
};
