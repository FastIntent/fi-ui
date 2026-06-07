import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MessageConfig, MessageItem, MessageType } from './Message';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';

// ─── Internal state ───────────────────────────────────────────────────────────

const messagePrefixCls = getDefaultPrefixCls('message');

interface InternalItem extends MessageConfig {
  messageKey: string;
}

let items: InternalItem[] = [];
let container: HTMLElement | null = null;
let root: Root | null = null;
let keyCounter = 0;

// ─── DOM management ───────────────────────────────────────────────────────────

function getOrCreateRoot(): Root {
  if (root) return root;

  container = document.createElement('div');
  container.className = messagePrefixCls;
  document.body.appendChild(container);
  root = createRoot(container);

  return root;
}

function render(): void {
  const r = getOrCreateRoot();
  r.render(
    <>
      {items.map(({ key: _userKey, ...item }) => (
        <MessageItem
          key={item.messageKey}
          {...item}
          prefixCls={messagePrefixCls}
          onRemove={remove}
        />
      ))}
    </>
  );
}

// ─── Core open / remove ───────────────────────────────────────────────────────

function remove(key: string): void {
  items = items.filter((i) => i.messageKey !== key);
  render();
}

function open(config: MessageConfig): () => void {
  // SSR guard
  if (typeof document === 'undefined') return () => {};

  const messageKey = config.key ?? `${messagePrefixCls}-${++keyCounter}`;
  const item: InternalItem = { ...config, messageKey };

  const idx = items.findIndex((i) => i.messageKey === messageKey);
  if (idx >= 0) {
    items[idx] = item;
  } else {
    items.push(item);
  }

  render();

  // Returns a cancel fn so callers can do: const hide = message.loading('...'); hide();
  return () => remove(messageKey);
}

function destroyAll(): void {
  items = [];
  render();
}

// ─── Shorthand helpers ────────────────────────────────────────────────────────

type ContentArg = React.ReactNode;
type DurationArg = number | null;

/**
 * Acepta:
 * - `message.success('texto')`
 * - `message.success('texto', 2)`
 * - `message.success('texto', 2, onClose)`
 * - `message.success({ content: 'texto', duration: 2 })`
 */
function makeShorthand(type: MessageType) {
  return (
    contentOrConfig: ContentArg | MessageConfig,
    duration?: DurationArg,
    onClose?: () => void
  ): (() => void) => {
    if (
      contentOrConfig !== null &&
      typeof contentOrConfig === 'object' &&
      !React.isValidElement(contentOrConfig) &&
      'content' in contentOrConfig
    ) {
      return open({ type, ...(contentOrConfig as MessageConfig) });
    }

    const cfg: MessageConfig = { type, content: contentOrConfig as ContentArg };
    if (duration !== undefined) cfg.duration = duration;
    if (onClose !== undefined) cfg.onClose = onClose;

    return open(cfg);
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const message = {
  /** Abre un mensaje con configuración completa. */
  open,
  /** Mensaje de éxito. */
  success: makeShorthand('success'),
  /** Mensaje de error. */
  error: makeShorthand('error'),
  /** Mensaje de advertencia. */
  warning: makeShorthand('warning'),
  /** Mensaje informativo. */
  info: makeShorthand('info'),
  /** Mensaje con spinner de carga. Retorna una función para cerrarlo. */
  loading: makeShorthand('loading'),
  /**
   * Cierra un mensaje específico por key, o todos si no se pasa key.
   */
  destroy: (key?: string) => (key ? remove(key) : destroyAll()),
};
