import type React from 'react';

export interface ServerImage {
  /** Filename, e.g. "hero.png". */
  name: string;
  /** Public URL the browser can render directly. */
  url: string;
  /** Path relative to rootDir, e.g. "2026/01/hero.png". */
  path: string;
  /** File size in bytes. */
  size: number;
  /** Modification time (ms epoch). */
  mtime: number;
  /** Optional pre-generated thumbnail URL. */
  thumbnailUrl?: string;
  /** Optional pixel dimensions. */
  width?: number;
  height?: number;
}

export interface ServerFolder {
  /** Folder name (last segment). */
  name: string;
  /** Path relative to rootDir, e.g. "2026/01". */
  path: string;
  /** Folder mtime (ms epoch). Optional. */
  mtime?: number;
  /** Number of items inside (optional, for display). */
  itemCount?: number;
}

export interface ListResult {
  folders: ServerFolder[];
  images: ServerImage[];
}

export interface ImageManagerActions {
  /** Required. List entries under a path (relative to rootDir). */
  list: (path: string) => Promise<ListResult>;
  /** Required in mode="edit". Upload files into a path. */
  upload?: (path: string, files: File[]) => Promise<void>;
  /** Required in mode="edit". Create a new folder under path. */
  createFolder?: (path: string, name: string) => Promise<void>;
  /** Required in mode="edit". Rename a file or folder. */
  rename?: (path: string, newName: string) => Promise<void>;
  /** Required in mode="edit". Delete files or folders by path. */
  remove?: (paths: string[]) => Promise<void>;
  /** Required in mode="edit" for drag&drop. Move items to a destination folder. */
  move?: (sources: string[], destination: string) => Promise<void>;
}

export type ImageManagerMode = 'view' | 'edit';
export type ImageManagerView = 'grid' | 'list';
export type ImageManagerSize = 'sm' | 'md' | 'lg';

export interface ImageManagerProps {
  /** Sandbox root. Users cannot navigate above this path. Default: "". */
  rootDir?: string;
  /** Initial subpath inside rootDir, e.g. "2026/01". Default: "". */
  initialPath?: string;
  /** "view" disables write operations; "edit" enables them. Default: "view". */
  mode?: ImageManagerMode;
  /** Allow selecting multiple images. Default: false. */
  multiple?: boolean;
  /** Server adapter — list/upload/createFolder/rename/remove/move. */
  actions: ImageManagerActions;
  /** Initial selected image paths (relative to rootDir). */
  defaultSelected?: string[];
  /** Controlled selection. */
  selected?: string[];
  /** Fires when the selection changes. */
  onSelectionChange?: (paths: string[], images: ServerImage[]) => void;
  /** Fires when the user double-clicks/Enter on an image (quick pick). */
  onImageOpen?: (image: ServerImage) => void;
  /** Accepted MIME types for upload (passed to <Upload>). */
  accept?: string;
  /** Max single-file size for upload, in bytes. */
  maxFileSize?: number;
  /** Default view mode. Default: "grid". */
  defaultView?: ImageManagerView;
  /** Item card size preset. Default: "md". */
  itemSize?: ImageManagerSize;
  /** Override the card min-width in pixels (advanced; ignores itemSize). */
  itemMinWidth?: number;
  /** Render a custom empty state. */
  emptyState?: React.ReactNode;
  /** className for the root container. */
  className?: string;
  /** style for the root container. */
  style?: React.CSSProperties;
}

export interface ImageManagerModalProps extends Omit<
  ImageManagerProps,
  'defaultSelected' | 'onSelectionChange'
> {
  open: boolean;
  onCancel: () => void;
  /** Fires when the user clicks Apply with the current selection. */
  onApply: (paths: string[], images: ServerImage[]) => void;
  title?: React.ReactNode;
  width?: number | string;
  okText?: string;
  cancelText?: string;
  defaultSelected?: string[];
}
