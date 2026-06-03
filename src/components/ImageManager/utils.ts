/**
 * Sandbox-safe path helpers. All "path" values here are relative to the
 * consumer's rootDir; the rootDir itself is opaque to fi-ui (the server
 * adapter is responsible for resolving it against the real filesystem).
 */

const SEP = '/';

export function normalizePath(input: string): string {
  if (!input) return '';
  const cleaned = input.replace(/\\/g, SEP).replace(/\/+/g, SEP);
  const segments: string[] = [];
  for (const seg of cleaned.split(SEP)) {
    if (!seg || seg === '.') continue;
    if (seg === '..') {
      // Sandbox jail: never escape root.
      if (segments.length > 0) segments.pop();
      continue;
    }
    segments.push(seg);
  }
  return segments.join(SEP);
}

export function joinPath(parent: string, child: string): string {
  const p = normalizePath(parent);
  const c = normalizePath(child);
  if (!p) return c;
  if (!c) return p;
  return `${p}${SEP}${c}`;
}

export function parentOf(path: string): string {
  const p = normalizePath(path);
  if (!p) return '';
  const idx = p.lastIndexOf(SEP);
  return idx === -1 ? '' : p.slice(0, idx);
}

/** Split path into ordered segments for breadcrumbs. */
export function segments(path: string): string[] {
  const p = normalizePath(path);
  return p ? p.split(SEP) : [];
}

/** Reject names with separators, dotfiles, or reserved chars. */
const INVALID_NAME = /[\\/:*?"<>|]/;
export function isValidName(name: string): boolean {
  if (!name) return false;
  const trimmed = name.trim();
  if (!trimmed || trimmed === '.' || trimmed === '..') return false;
  if (INVALID_NAME.test(trimmed)) return false;
  if (trimmed.length > 255) return false;
  return true;
}

const KB = 1024;
const MB = KB * 1024;
const GB = MB * 1024;

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  if (bytes < KB) return `${bytes} B`;
  if (bytes < MB) return `${(bytes / KB).toFixed(1)} KB`;
  if (bytes < GB) return `${(bytes / MB).toFixed(1)} MB`;
  return `${(bytes / GB).toFixed(1)} GB`;
}

const IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg|avif|bmp|ico)$/i;
export function isImageName(name: string): boolean {
  return IMAGE_EXT.test(name);
}

/**
 * Filter items by a case-insensitive name query.
 */
export function filterByQuery<T extends { name: string }>(items: T[], query: string): T[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter((it) => it.name.toLowerCase().includes(q));
}
