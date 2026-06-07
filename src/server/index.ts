/**
 * Server-only entry point for @atomizeui/core.
 *
 * Import as: `@atomizeui/core/server`.
 *
 * Contains Node.js-only adapters and helpers (filesystem-backed
 * ImageManager actions, sandbox utilities). Importing this from a client
 * bundle will fail because it depends on `node:fs` and `node:path`.
 */

export {
  createFsImageManagerActions,
  createSandbox,
  assertValidName,
  SandboxError,
} from './image-manager-fs';

export type {
  FsImageManagerConfig,
  FsImageManagerActions,
  SandboxResolver,
  MutationOp,
  ServerImage,
  ServerFolder,
  ListResult,
} from './image-manager-fs';
