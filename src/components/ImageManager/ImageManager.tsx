import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { Empty } from '../Empty';
import { Spin } from '../Spin';
import { Alert } from '../Alert';
import { Modal } from '../Modal';
import { Input } from '../Input';
import { Button } from '../Button/Button';
import { FolderOutlined, PictureOutlined } from '../_icons';
import { FolderCard } from './FolderCard';
import { ImageCard } from './ImageCard';
import { Toolbar } from './Toolbar';
import type {
  ImageManagerProps,
  ListResult,
  ServerFolder,
  ServerImage,
  ImageManagerView,
} from './types';
import { filterByQuery, isValidName, joinPath, normalizePath } from './utils';

type RenameTarget =
  | { kind: 'image'; item: ServerImage }
  | { kind: 'folder'; item: ServerFolder }
  | null;

const EMPTY_LIST: ListResult = { folders: [], images: [] };

export const ImageManager: React.FC<ImageManagerProps> = ({
  rootDir: _rootDir,
  initialPath = '',
  mode = 'view',
  multiple = false,
  actions,
  defaultSelected,
  selected: controlledSelected,
  onSelectionChange,
  onImageOpen,
  accept,
  maxFileSize,
  defaultView = 'grid',
  itemSize = 'md',
  itemMinWidth,
  emptyState,
  className,
  style,
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls = getPrefixCls?.('image-manager') || getDefaultPrefixCls('image-manager');

  const [path, setPath] = useState<string>(() => normalizePath(initialPath));
  const [view, setView] = useState<ImageManagerView>(defaultView);
  const [query, setQuery] = useState<string>('');
  const [data, setData] = useState<ListResult>(EMPTY_LIST);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const isControlled = controlledSelected !== undefined;
  const [innerSelected, setInnerSelected] = useState<string[]>(defaultSelected ?? []);
  const selected = isControlled ? (controlledSelected as string[]) : innerSelected;

  // Drag state for the overlay
  const [activeDrag, setActiveDrag] = useState<{
    kind: 'image' | 'folder';
    path: string;
    name: string;
    url?: string;
  } | null>(null);

  // Inline modals
  const [folderModalOpen, setFolderModalOpen] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [renameTarget, setRenameTarget] = useState<RenameTarget>(null);
  const [renameValue, setRenameValue] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<{
    paths: string[];
    label: string;
  } | null>(null);

  // Keep latest actions in a ref so changes to the object identity
  // (common when consumers build it inline each render) don't retrigger
  // the list effect. Only path/reloadToken cause a real refetch.
  const actionsRef = useRef(actions);
  useEffect(() => {
    actionsRef.current = actions;
  }, [actions]);

  // Reload when path changes or after a write op
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    actionsRef.current
      .list(path)
      .then((res) => {
        if (cancelled) return;
        setData(res);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : String(err));
        setData(EMPTY_LIST);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [path, reloadToken]);

  const reload = useCallback(() => setReloadToken((n) => n + 1), []);

  const filtered = useMemo(
    () => ({
      folders: filterByQuery(data.folders, query),
      images: filterByQuery(data.images, query),
    }),
    [data, query]
  );

  const emitSelection = useCallback(
    (next: string[]) => {
      if (!isControlled) setInnerSelected(next);
      if (onSelectionChange) {
        const map = new Map(data.images.map((img) => [img.path, img]));
        const images = next
          .map((p) => map.get(p))
          .filter((img): img is ServerImage => Boolean(img));
        onSelectionChange(next, images);
      }
    },
    [data.images, isControlled, onSelectionChange]
  );

  const handleToggleImage = useCallback(
    (image: ServerImage, additive: boolean) => {
      const isSelected = selected.includes(image.path);
      if (!multiple) {
        emitSelection(isSelected ? [] : [image.path]);
        return;
      }
      if (additive) {
        const next = isSelected
          ? selected.filter((p) => p !== image.path)
          : [...selected, image.path];
        emitSelection(next);
      } else {
        emitSelection(isSelected && selected.length === 1 ? [] : [image.path]);
      }
    },
    [emitSelection, multiple, selected]
  );

  const handleOpenFolder = useCallback((folder: ServerFolder) => {
    setPath(folder.path);
    setQuery('');
  }, []);

  const handleNavigate = useCallback((target: string) => {
    setPath(normalizePath(target));
    setQuery('');
  }, []);

  const handleUploadFiles = useCallback(
    async (files: File[]) => {
      if (!actions.upload) return;
      const valid = maxFileSize ? files.filter((f) => f.size <= maxFileSize) : files;
      if (valid.length === 0) {
        setError('All selected files exceed the maximum size');
        return;
      }
      try {
        await actions.upload(path, valid);
        reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    },
    [actions, maxFileSize, path, reload]
  );

  const submitCreateFolder = useCallback(async () => {
    if (!actions.createFolder) return;
    if (!isValidName(folderName)) {
      setError('Invalid folder name');
      return;
    }
    try {
      await actions.createFolder(path, folderName.trim());
      setFolderModalOpen(false);
      setFolderName('');
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [actions, folderName, path, reload]);

  const startRename = useCallback((target: RenameTarget) => {
    setRenameTarget(target);
    setRenameValue(target ? target.item.name : '');
  }, []);

  const submitRename = useCallback(async () => {
    if (!actions.rename || !renameTarget) return;
    if (!isValidName(renameValue) || renameValue === renameTarget.item.name) {
      setRenameTarget(null);
      return;
    }
    try {
      await actions.rename(renameTarget.item.path, renameValue.trim());
      setRenameTarget(null);
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [actions, reload, renameTarget, renameValue]);

  const askDelete = useCallback((paths: string[], label: string) => {
    if (paths.length === 0) return;
    setConfirmDelete({ paths, label });
  }, []);

  const submitDelete = useCallback(async () => {
    if (!actions.remove || !confirmDelete) return;
    try {
      await actions.remove(confirmDelete.paths);
      // Clean stale selection
      emitSelection(selected.filter((p) => !confirmDelete.paths.includes(p)));
      setConfirmDelete(null);
      reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  }, [actions, confirmDelete, emitSelection, reload, selected]);

  // Drag & drop
  const handleDragStart = useCallback((e: DragStartEvent) => {
    const d = e.active.data.current as
      | { kind: 'image' | 'folder'; path: string; name: string; url?: string }
      | undefined;
    if (d) setActiveDrag(d);
  }, []);

  const handleDragEnd = useCallback(
    async (e: DragEndEvent) => {
      setActiveDrag(null);
      const over = e.over;
      const active = e.active;
      if (!over || !actions.move) return;
      const overData = over.data.current as { kind?: string; path?: string } | undefined;
      const activeData = active.data.current as { path?: string } | undefined;
      if (!overData || overData.kind !== 'folder-target') return;
      if (!activeData?.path) return;
      const destination = overData.path ?? '';
      if (destination === activeData.path) return;
      // Prevent moving a folder into itself or a descendant
      if (destination === activeData.path || destination.startsWith(`${activeData.path}/`)) {
        return;
      }
      // Move either the dragged item, or the whole selection if it includes the active
      const dragged = activeData.path;
      const sources = selected.length > 1 && selected.includes(dragged) ? selected : [dragged];
      try {
        await actions.move(sources, destination);
        emitSelection([]);
        reload();
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    },
    [actions, emitSelection, reload, selected]
  );

  const editable = mode === 'edit';
  const canMove = editable && Boolean(actions.move);
  const canRemove = editable && Boolean(actions.remove);
  const canRename = editable && Boolean(actions.rename);

  const onRenameImage = canRename
    ? (img: ServerImage) => startRename({ kind: 'image', item: img })
    : undefined;
  const onDeleteImage = canRemove
    ? (img: ServerImage) => askDelete([img.path], img.name)
    : undefined;
  const onRenameFolder = canRename
    ? (f: ServerFolder) => startRename({ kind: 'folder', item: f })
    : undefined;
  const onDeleteFolder = canRemove ? (f: ServerFolder) => askDelete([f.path], f.name) : undefined;

  const deleteSelected = useCallback(() => {
    if (selected.length === 0) return;
    askDelete(selected, `${selected.length} items`);
  }, [askDelete, selected]);

  const isEmpty = !loading && filtered.folders.length === 0 && filtered.images.length === 0;

  const rootRef = useRef<HTMLDivElement>(null);

  // Require a small pointer movement before drag starts, so plain clicks
  // (selection) and double-clicks (open folder / open image) are preserved.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor)
  );

  return (
    <div
      ref={rootRef}
      className={classNames(
        prefixCls,
        `${prefixCls}-${view}`,
        `${prefixCls}-size-${itemSize}`,
        className
      )}
      style={
        itemMinWidth
          ? ({
              ...style,
              ['--fi-image-manager-item-min']: `${itemMinWidth}px`,
            } as React.CSSProperties)
          : style
      }
      data-mode={mode}
    >
      <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <Toolbar
          prefixCls={prefixCls}
          path={path}
          query={query}
          view={view}
          mode={mode}
          canUpload={editable && Boolean(actions.upload)}
          canCreateFolder={editable && Boolean(actions.createFolder)}
          selectionCount={selected.length}
          canRemove={canRemove}
          canMoveOut={canMove}
          accept={accept}
          onNavigate={handleNavigate}
          onSearchChange={setQuery}
          onViewChange={setView}
          onUploadFiles={handleUploadFiles}
          onCreateFolderClick={() => {
            setFolderName('');
            setFolderModalOpen(true);
          }}
          onDeleteSelected={deleteSelected}
        />

        {error && (
          <div className={`${prefixCls}-error`}>
            <Alert type="error" message={error} closable onClose={() => setError(null)} showIcon />
          </div>
        )}

        <div
          className={classNames(`${prefixCls}-body`, {
            [`${prefixCls}-body-loading`]: loading,
          })}
        >
          {isEmpty ? (
            <div className={`${prefixCls}-empty`}>
              {emptyState ?? <Empty description="No images here" />}
            </div>
          ) : (
            <div className={`${prefixCls}-items`} aria-busy={loading || undefined}>
              {filtered.folders.map((folder) => (
                <FolderCard
                  key={`folder:${folder.path}`}
                  folder={folder}
                  prefixCls={prefixCls}
                  editable={editable}
                  draggable={canMove}
                  droppable={canMove}
                  onOpen={handleOpenFolder}
                  onRename={onRenameFolder}
                  onDelete={onDeleteFolder}
                />
              ))}
              {filtered.images.map((image) => (
                <ImageCard
                  key={`image:${image.path}`}
                  image={image}
                  prefixCls={prefixCls}
                  selected={selected.includes(image.path)}
                  editable={editable}
                  draggable={canMove}
                  onToggle={handleToggleImage}
                  onOpen={onImageOpen}
                  onRename={onRenameImage}
                  onDelete={onDeleteImage}
                />
              ))}
            </div>
          )}

          {loading && (
            <div className={`${prefixCls}-loading`} aria-live="polite">
              <Spin />
            </div>
          )}
        </div>

        {typeof document !== 'undefined' &&
          createPortal(
            <DragOverlay
              dropAnimation={null}
              // z-index above Modal (1000) so the preview stays visible
              // when the manager is rendered inside <ImageManager.Modal>
              // or any other overlay component.
              style={{ cursor: 'grabbing', zIndex: 2000 }}
            >
              {activeDrag ? (
                activeDrag.kind === 'image' && activeDrag.url ? (
                  <div
                    className={`${prefixCls}-drag-preview ${prefixCls}-drag-preview-image`}
                    title={activeDrag.name}
                  >
                    <img src={activeDrag.url} alt={activeDrag.name} draggable={false} />
                  </div>
                ) : (
                  <div className={`${prefixCls}-drag-preview`}>
                    {activeDrag.kind === 'folder' ? <FolderOutlined /> : <PictureOutlined />}
                    <span>{activeDrag.name}</span>
                  </div>
                )
              ) : null}
            </DragOverlay>,
            document.body
          )}

        {/* Create folder */}
        <Modal
          open={folderModalOpen}
          title="New folder"
          onCancel={() => setFolderModalOpen(false)}
          onOk={submitCreateFolder}
          okText="Create"
          width={420}
        >
          <Input
            value={folderName}
            placeholder="Folder name"
            onChange={(e) => setFolderName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitCreateFolder();
            }}
            autoFocus
          />
        </Modal>

        {/* Rename */}
        <Modal
          open={Boolean(renameTarget)}
          title={`Rename ${renameTarget?.kind ?? ''}`}
          onCancel={() => setRenameTarget(null)}
          onOk={submitRename}
          okText="Rename"
          width={420}
        >
          <Input
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submitRename();
            }}
            autoFocus
          />
        </Modal>

        {/* Delete confirmation */}
        <Modal
          open={Boolean(confirmDelete)}
          title="Delete"
          onCancel={() => setConfirmDelete(null)}
          footer={
            <>
              <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
              <Button danger onClick={submitDelete}>
                Delete
              </Button>
            </>
          }
          width={420}
        >
          <p>
            Delete <strong>{confirmDelete?.label}</strong>? This cannot be undone.
          </p>
        </Modal>
      </DndContext>
    </div>
  );
};

ImageManager.displayName = 'ImageManager';
