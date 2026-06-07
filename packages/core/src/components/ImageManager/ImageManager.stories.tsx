import type { Meta, StoryObj } from '@storybook/react';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { ImageManager } from './index';
import { Button } from '../Button';
import type {
  ImageManagerActions,
  ImageManagerSize,
  ListResult,
  ServerFolder,
  ServerImage,
} from './types';
import { joinPath, parentOf } from './utils';

const meta: Meta<typeof ImageManager> = {
  title: 'Data Display/ImageManager',
  component: ImageManager,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};
export default meta;
type Story = StoryObj<typeof ImageManager>;

// ── In-memory mock filesystem ────────────────────────────────────────────────

interface MockNode {
  folders: ServerFolder[];
  images: ServerImage[];
}

const seed = (): Record<string, MockNode> => ({
  '': {
    folders: [
      { name: 'banners', path: 'banners', itemCount: 4 },
      { name: 'avatars', path: 'avatars', itemCount: 2 },
      { name: '2026', path: '2026', itemCount: 3 },
    ],
    images: [
      makeImg('logo.png', '', 'https://picsum.photos/seed/logo/240/180'),
      makeImg('hero.jpg', '', 'https://picsum.photos/seed/hero/240/180'),
      makeImg('cover.webp', '', 'https://picsum.photos/seed/cover/240/180'),
    ],
  },
  banners: {
    folders: [],
    images: [
      makeImg('summer.jpg', 'banners', 'https://picsum.photos/seed/banner-summer/240/180'),
      makeImg('winter.jpg', 'banners', 'https://picsum.photos/seed/banner-winter/240/180'),
      makeImg('spring.jpg', 'banners', 'https://picsum.photos/seed/banner-spring/240/180'),
      makeImg('autumn.jpg', 'banners', 'https://picsum.photos/seed/banner-autumn/240/180'),
    ],
  },
  avatars: {
    folders: [],
    images: [
      makeImg('avatar-1.png', 'avatars', 'https://picsum.photos/seed/a1/240/240'),
      makeImg('avatar-2.png', 'avatars', 'https://picsum.photos/seed/a2/240/240'),
    ],
  },
  '2026': {
    folders: [{ name: 'campaigns', path: '2026/campaigns', itemCount: 0 }],
    images: [
      makeImg('q1-report.png', '2026', 'https://picsum.photos/seed/q1/240/180'),
      makeImg('q2-report.png', '2026', 'https://picsum.photos/seed/q2/240/180'),
    ],
  },
  '2026/campaigns': { folders: [], images: [] },
});

function makeImg(name: string, parent: string, url: string): ServerImage {
  const path = parent ? `${parent}/${name}` : name;
  return {
    name,
    path,
    url,
    thumbnailUrl: url,
    size: 100_000 + Math.floor(Math.random() * 900_000),
    mtime: Date.now(),
  };
}

function useMockActions(): ImageManagerActions {
  const ref = useRef<Record<string, MockNode>>(seed());

  const list = useCallback(async (path: string): Promise<ListResult> => {
    await new Promise((r) => setTimeout(r, 120));
    const node = ref.current[path] ?? { folders: [], images: [] };
    // Recompute itemCount from the actual children so it stays in sync
    // after upload / move / createFolder / remove.
    const folders = node.folders.map((f) => {
      const child = ref.current[f.path];
      const count = child ? child.folders.length + child.images.length : 0;
      return { ...f, itemCount: count };
    });
    return { folders, images: [...node.images] };
  }, []);

  const upload = useCallback(async (path: string, files: File[]) => {
    await new Promise((r) => setTimeout(r, 200));
    const node = ref.current[path] ?? { folders: [], images: [] };
    for (const file of files) {
      const url = URL.createObjectURL(file);
      node.images.push({
        name: file.name,
        path: joinPath(path, file.name),
        url,
        thumbnailUrl: url,
        size: file.size,
        mtime: Date.now(),
      });
    }
    ref.current[path] = node;
  }, []);

  const createFolder = useCallback(async (path: string, name: string) => {
    await new Promise((r) => setTimeout(r, 150));
    const node = ref.current[path] ?? { folders: [], images: [] };
    const newPath = joinPath(path, name);
    node.folders.push({ name, path: newPath, itemCount: 0 });
    ref.current[path] = node;
    ref.current[newPath] = { folders: [], images: [] };
  }, []);

  const rename = useCallback(async (path: string, newName: string) => {
    await new Promise((r) => setTimeout(r, 150));
    const parent = parentOf(path);
    const node = ref.current[parent] ?? { folders: [], images: [] };
    const newPath = joinPath(parent, newName);
    const img = node.images.find((i) => i.path === path);
    if (img) {
      img.name = newName;
      img.path = newPath;
      return;
    }
    const folder = node.folders.find((f) => f.path === path);
    if (folder) {
      folder.name = newName;
      folder.path = newPath;
      // Move children index
      ref.current[newPath] = ref.current[path];
      delete ref.current[path];
    }
  }, []);

  const remove = useCallback(async (paths: string[]) => {
    await new Promise((r) => setTimeout(r, 150));
    for (const p of paths) {
      const parent = parentOf(p);
      const node = ref.current[parent];
      if (!node) continue;
      node.images = node.images.filter((i) => i.path !== p);
      node.folders = node.folders.filter((f) => f.path !== p);
      delete ref.current[p];
    }
  }, []);

  const move = useCallback(async (sources: string[], destination: string) => {
    await new Promise((r) => setTimeout(r, 150));
    const dest = ref.current[destination] ?? { folders: [], images: [] };
    for (const src of sources) {
      const parent = parentOf(src);
      const node = ref.current[parent];
      if (!node) continue;
      const img = node.images.find((i) => i.path === src);
      if (img) {
        node.images = node.images.filter((i) => i.path !== src);
        const newPath = joinPath(destination, img.name);
        img.path = newPath;
        dest.images.push(img);
        continue;
      }
      const folder = node.folders.find((f) => f.path === src);
      if (folder) {
        node.folders = node.folders.filter((f) => f.path !== src);
        const newPath = joinPath(destination, folder.name);
        folder.path = newPath;
        dest.folders.push(folder);
      }
    }
    ref.current[destination] = dest;
  }, []);

  // Memoize the actions object so its identity is stable across renders;
  // otherwise a new object each render would retrigger any consumer effects.
  return useMemo(
    () => ({ list, upload, createFolder, rename, remove, move }),
    [list, upload, createFolder, rename, remove, move]
  );
}

export const ViewMode: Story = {
  render: () => {
    const actions = useMockActions();
    const [picked, setPicked] = useState<string[]>([]);
    return (
      <div style={{ height: 600 }}>
        <p style={{ marginBottom: 12 }}>
          Selected: <code>{picked.join(', ') || '—'}</code>
        </p>
        <ImageManager
          rootDir="/uploads"
          mode="view"
          actions={actions}
          onSelectionChange={(paths) => setPicked(paths)}
        />
      </div>
    );
  },
};

export const EditMode: Story = {
  render: () => {
    const actions = useMockActions();
    return (
      <div style={{ height: 600 }}>
        <ImageManager rootDir="/uploads" mode="edit" multiple actions={actions} />
      </div>
    );
  },
};

export const Sizes: Story = {
  render: () => {
    const actions = useMockActions();
    const [size, setSize] = useState<ImageManagerSize>('md');
    return (
      <div style={{ height: 640 }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {(['sm', 'md', 'lg'] as ImageManagerSize[]).map((s) => (
            <Button key={s} type={size === s ? 'primary' : 'default'} onClick={() => setSize(s)}>
              {s.toUpperCase()}
            </Button>
          ))}
        </div>
        <ImageManager rootDir="/uploads" mode="view" actions={actions} itemSize={size} />
      </div>
    );
  },
};

export const ModalUsage: Story = {
  render: () => {
    const actions = useMockActions();
    const [open, setOpen] = useState(false);
    const [picked, setPicked] = useState<string[]>([]);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Pick image</Button>
        <p style={{ marginTop: 12 }}>
          Selected: <code>{picked.join(', ') || '—'}</code>
        </p>
        <ImageManager.Modal
          open={open}
          onCancel={() => setOpen(false)}
          onApply={(paths: string[]) => {
            setPicked(paths);
            setOpen(false);
          }}
          actions={actions}
          rootDir="/uploads"
          mode="edit"
          multiple
        />
      </>
    );
  },
};
