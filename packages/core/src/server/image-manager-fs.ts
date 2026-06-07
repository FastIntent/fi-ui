/**
 * Ready-to-use server actions for <ImageManager> backed by the local filesystem.
 *
 * Usage (Next.js App Router):
 *
 *   // app/actions/images.ts
 *   'use server';
 *   import { createFsImageManagerActions } from '@atomizeui/core/server';
 *
 *   export const imageActions = createFsImageManagerActions({
 *     rootDir: 'public/uploads',
 *     publicPrefix: '/uploads',
 *   });
 *
 *   // app/media/page.tsx
 *   'use client';
 *   import { ImageManager } from '@atomizeui/core';
 *   import { imageActions } from '../actions/images';
 *   export default function Page() {
 *     return <ImageManager mode="edit" multiple actions={imageActions} />;
 *   }
 *
 * The factory enforces:
 *   - Sandbox jail: every resolved path must stay inside `rootDir`.
 *   - Name validation: rejects separators, traversal, reserved chars.
 *   - MIME allowlist for upload (default: common web image types).
 *   - Per-file size limit (default 10 MB).
 *
 * Bring your own auth / rate-limiting layer on top.
 */

import { readdir, stat, mkdir, rename as fsRename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';

export interface ServerImage {
  name: string;
  url: string;
  path: string;
  size: number;
  mtime: number;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
}

export interface ServerFolder {
  name: string;
  path: string;
  mtime?: number;
  itemCount?: number;
}

export interface ListResult {
  folders: ServerFolder[];
  images: ServerImage[];
}

export interface FsImageManagerConfig {
  /** Absolute or cwd-relative path to the sandbox root. */
  rootDir: string;
  /** URL prefix that maps to rootDir (e.g. "/uploads" for Next public dir). */
  publicPrefix: string;
  /** Max file size in bytes for uploads. Default 10 MB. */
  maxFileSize?: number;
  /** Allowed MIME types for upload. Default: common web image types. */
  acceptedMimes?: Iterable<string>;
  /** Extension allowlist for listing (regex). Default: png/jpeg/webp/gif/svg/avif. */
  imageExtensions?: RegExp;
  /** Optional hook called after every mutation (upload/rename/move/remove/createFolder). */
  onMutation?: (op: MutationOp) => void | Promise<void>;
}

export type MutationOp =
  | { kind: 'upload'; path: string; files: string[] }
  | { kind: 'createFolder'; path: string; name: string }
  | { kind: 'rename'; from: string; to: string }
  | { kind: 'remove'; paths: string[] }
  | { kind: 'move'; sources: string[]; destination: string };

export interface FsImageManagerActions {
  list: (relPath: string) => Promise<ListResult>;
  upload: (relPath: string, files: File[]) => Promise<void>;
  createFolder: (relPath: string, name: string) => Promise<void>;
  rename: (relPath: string, newName: string) => Promise<void>;
  remove: (relPaths: string[]) => Promise<void>;
  move: (sources: string[], destination: string) => Promise<void>;
}

// ── Defaults ──────────────────────────────────────────────────────────────

const DEFAULT_MAX_FILE_SIZE = 10 * 1024 * 1024;
const DEFAULT_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'image/avif',
]);
const DEFAULT_IMAGE_EXT = /\.(png|jpe?g|webp|gif|svg|avif)$/i;
const INVALID_NAME = /[\\/:*?"<>|]/;

// ── Sandbox primitives (also exported for advanced usage) ─────────────────

export class SandboxError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SandboxError';
  }
}

export function assertValidName(name: string): void {
  const t = (name ?? '').trim();
  if (!t || t === '.' || t === '..') throw new SandboxError('Invalid name');
  if (INVALID_NAME.test(t)) throw new SandboxError('Invalid name');
  if (t.length > 255) throw new SandboxError('Name too long');
}

export interface SandboxResolver {
  /** Resolves a sandbox-relative path to an absolute one, asserting jail. */
  resolve: (relPath: string) => string;
  /** Converts a sandbox-relative path to a public URL. */
  toUrl: (relPath: string) => string;
  /** Absolute path of the root. */
  readonly rootAbs: string;
}

export function createSandbox(rootDir: string, publicPrefix: string): SandboxResolver {
  const rootAbs = path.resolve(rootDir);

  const resolve = (relPath: string): string => {
    const cleaned = (relPath ?? '').replace(/\\/g, '/');
    const abs = path.resolve(rootAbs, cleaned);
    const rel = path.relative(rootAbs, abs);
    if (rel.startsWith('..') || path.isAbsolute(rel)) {
      throw new SandboxError('Path escapes sandbox');
    }
    return abs;
  };

  const toUrl = (relPath: string): string => {
    const clean = relPath.replace(/\\/g, '/').replace(/^\/+/, '');
    return clean ? `${publicPrefix.replace(/\/+$/, '')}/${clean}` : publicPrefix;
  };

  return { resolve, toUrl, rootAbs };
}

// ── Factory ───────────────────────────────────────────────────────────────

export function createFsImageManagerActions(config: FsImageManagerConfig): FsImageManagerActions {
  const {
    rootDir,
    publicPrefix,
    maxFileSize = DEFAULT_MAX_FILE_SIZE,
    acceptedMimes,
    imageExtensions = DEFAULT_IMAGE_EXT,
    onMutation,
  } = config;

  const sandbox = createSandbox(rootDir, publicPrefix);
  const mimes = acceptedMimes ? new Set(acceptedMimes) : DEFAULT_MIMES;

  const list = async (relPath: string): Promise<ListResult> => {
    const abs = sandbox.resolve(relPath);
    await mkdir(abs, { recursive: true });

    const entries = await readdir(abs, { withFileTypes: true });
    const folders: ServerFolder[] = [];
    const images: ServerImage[] = [];

    for (const e of entries) {
      const childRel = relPath ? `${relPath}/${e.name}` : e.name;
      const childAbs = path.join(abs, e.name);
      const s = await stat(childAbs);

      if (e.isDirectory()) {
        const children = await readdir(childAbs).catch(() => [] as string[]);
        folders.push({
          name: e.name,
          path: childRel,
          mtime: s.mtimeMs,
          itemCount: children.length,
        });
      } else if (e.isFile() && imageExtensions.test(e.name)) {
        images.push({
          name: e.name,
          path: childRel,
          url: sandbox.toUrl(childRel),
          size: s.size,
          mtime: s.mtimeMs,
        });
      }
    }

    folders.sort((a, b) => a.name.localeCompare(b.name));
    images.sort((a, b) => a.name.localeCompare(b.name));
    return { folders, images };
  };

  const upload = async (relPath: string, files: File[]): Promise<void> => {
    const abs = sandbox.resolve(relPath);
    await mkdir(abs, { recursive: true });
    const written: string[] = [];

    for (const file of files) {
      if (file.type && !mimes.has(file.type)) {
        throw new SandboxError(`Unsupported MIME type: ${file.type}`);
      }
      if (file.size > maxFileSize) {
        throw new SandboxError(`File "${file.name}" exceeds max size (${maxFileSize} bytes)`);
      }
      assertValidName(file.name);

      // Re-validate the resolved destination after joining the filename.
      const childRel = relPath ? `${relPath}/${file.name}` : file.name;
      const dest = sandbox.resolve(childRel);

      const buffer = Buffer.from(await file.arrayBuffer());
      await writeFile(dest, buffer);
      written.push(childRel);
    }

    await onMutation?.({ kind: 'upload', path: relPath, files: written });
  };

  const createFolder = async (relPath: string, name: string): Promise<void> => {
    assertValidName(name);
    const childRel = relPath ? `${relPath}/${name}` : name;
    const childAbs = sandbox.resolve(childRel);
    await mkdir(childAbs, { recursive: false });
    await onMutation?.({ kind: 'createFolder', path: relPath, name });
  };

  const rename = async (relPath: string, newName: string): Promise<void> => {
    assertValidName(newName);
    const abs = sandbox.resolve(relPath);
    const parentRel = path.posix.dirname(relPath.replace(/\\/g, '/'));
    const destRel = parentRel === '.' || parentRel === '' ? newName : `${parentRel}/${newName}`;
    const destAbs = sandbox.resolve(destRel);
    await fsRename(abs, destAbs);
    await onMutation?.({ kind: 'rename', from: relPath, to: destRel });
  };

  const remove = async (relPaths: string[]): Promise<void> => {
    for (const p of relPaths) {
      const abs = sandbox.resolve(p);
      // Defensive: never let the sandbox root itself be deleted.
      if (abs === sandbox.rootAbs) throw new SandboxError('Refusing to delete sandbox root');
      await rm(abs, { recursive: true, force: true });
    }
    await onMutation?.({ kind: 'remove', paths: relPaths });
  };

  const move = async (sources: string[], destination: string): Promise<void> => {
    const destAbs = sandbox.resolve(destination);
    await mkdir(destAbs, { recursive: true });

    for (const src of sources) {
      const srcAbs = sandbox.resolve(src);
      const name = path.basename(srcAbs);
      const destRel = destination ? `${destination}/${name}` : name;
      const destFinal = sandbox.resolve(destRel);
      if (srcAbs === destFinal) continue;
      // Prevent moving a folder into itself or a descendant.
      const relCheck = path.relative(srcAbs, destFinal);
      if (!relCheck.startsWith('..') && relCheck !== '') {
        throw new SandboxError('Cannot move a folder into itself or a descendant');
      }
      await fsRename(srcAbs, destFinal);
    }
    await onMutation?.({ kind: 'move', sources, destination });
  };

  return { list, upload, createFolder, rename, remove, move };
}
