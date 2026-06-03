import React, { useCallback, useRef } from 'react';
import classNames from 'classnames';
import { useDroppable } from '@dnd-kit/core';
import { Breadcrumb, BreadcrumbItem } from '../Breadcrumb';
import { Button } from '../Button/Button';
import { Input } from '../Input';
import {
  AppstoreOutlined,
  FolderAddOutlined,
  HomeOutlined,
  SearchOutlined,
  UnorderedListOutlined,
  UploadOutlined,
} from '../_icons';
import type { ImageManagerView } from './types';
import { segments } from './utils';

export interface ToolbarProps {
  prefixCls: string;
  path: string;
  query: string;
  view: ImageManagerView;
  mode: 'view' | 'edit';
  canUpload: boolean;
  canCreateFolder: boolean;
  selectionCount: number;
  canRemove: boolean;
  canMoveOut: boolean;
  accept?: string;
  onNavigate: (path: string) => void;
  onSearchChange: (q: string) => void;
  onViewChange: (v: ImageManagerView) => void;
  onUploadFiles: (files: File[]) => void;
  onCreateFolderClick: () => void;
  onDeleteSelected: () => void;
}

interface BreadcrumbDropZoneProps {
  prefixCls: string;
  path: string;
  enabled: boolean;
  children: React.ReactNode;
}

// Drop zone rendered *inside* a BreadcrumbItem's content so it doesn't
// disturb Breadcrumb's React.cloneElement pass over its children
// (which injects the separator and would otherwise miss the item).
const BreadcrumbDropZone: React.FC<BreadcrumbDropZoneProps> = ({
  prefixCls,
  path,
  enabled,
  children,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `drop-breadcrumb:${path}`,
    data: { kind: 'folder-target', path },
    disabled: !enabled,
  });
  return (
    <span
      ref={setNodeRef}
      className={classNames(`${prefixCls}-toolbar-crumb`, {
        [`${prefixCls}-toolbar-crumb-drop-over`]: isOver && enabled,
      })}
    >
      {children}
    </span>
  );
};

export const Toolbar: React.FC<ToolbarProps> = ({
  prefixCls,
  path,
  query,
  view,
  mode,
  canUpload,
  canCreateFolder,
  selectionCount,
  canRemove,
  canMoveOut,
  accept,
  onNavigate,
  onSearchChange,
  onViewChange,
  onUploadFiles,
  onCreateFolderClick,
  onDeleteSelected,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const parts = segments(path);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      if (files.length > 0) onUploadFiles(files);
      // Reset so selecting the same file again re-triggers change.
      e.target.value = '';
    },
    [onUploadFiles]
  );

  return (
    <div className={`${prefixCls}-toolbar`}>
      <div className={`${prefixCls}-toolbar-nav`}>
        <Breadcrumb separator="/">
          <BreadcrumbItem onClick={() => onNavigate('')}>
            <BreadcrumbDropZone
              prefixCls={prefixCls}
              path=""
              // Root is a valid drop target only if we're nested.
              enabled={canMoveOut && parts.length > 0}
            >
              <span
                className={`${prefixCls}-toolbar-home`}
                aria-label="Root"
                title="Go to sandbox root"
              >
                <HomeOutlined />
              </span>
            </BreadcrumbDropZone>
          </BreadcrumbItem>
          {parts.map((seg, idx) => {
            const target = parts.slice(0, idx + 1).join('/');
            const isLast = idx === parts.length - 1;
            return (
              <BreadcrumbItem key={target} onClick={isLast ? undefined : () => onNavigate(target)}>
                <BreadcrumbDropZone
                  prefixCls={prefixCls}
                  path={target}
                  // The current folder is never its own drop target.
                  enabled={canMoveOut && !isLast}
                >
                  {seg}
                </BreadcrumbDropZone>
              </BreadcrumbItem>
            );
          })}
        </Breadcrumb>
      </div>

      <div className={`${prefixCls}-toolbar-actions`}>
        <div className={`${prefixCls}-toolbar-search`}>
          <Input
            placeholder="Search images and folders"
            value={query}
            onChange={(e) => onSearchChange(e.target.value)}
            prefix={<SearchOutlined />}
            allowClear
          />
        </div>

        <div className={`${prefixCls}-toolbar-view`} role="group" aria-label="View mode">
          <button
            type="button"
            className={classNames(`${prefixCls}-toolbar-view-btn`, {
              [`${prefixCls}-toolbar-view-btn-active`]: view === 'grid',
            })}
            aria-pressed={view === 'grid'}
            aria-label="Grid view"
            onClick={() => onViewChange('grid')}
          >
            <AppstoreOutlined />
          </button>
          <button
            type="button"
            className={classNames(`${prefixCls}-toolbar-view-btn`, {
              [`${prefixCls}-toolbar-view-btn-active`]: view === 'list',
            })}
            aria-pressed={view === 'list'}
            aria-label="List view"
            onClick={() => onViewChange('list')}
          >
            <UnorderedListOutlined />
          </button>
        </div>

        {mode === 'edit' && (
          <div className={`${prefixCls}-toolbar-edit`}>
            {canCreateFolder && (
              <Button onClick={onCreateFolderClick} icon={<FolderAddOutlined />}>
                New folder
              </Button>
            )}
            {canUpload && (
              <>
                <Button type="primary" onClick={handleUploadClick} icon={<UploadOutlined />}>
                  Upload
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={accept}
                  hidden
                  onChange={handleFileChange}
                />
              </>
            )}
            {canRemove && (
              <Button danger onClick={onDeleteSelected} disabled={selectionCount === 0}>
                {selectionCount > 0 ? `Delete (${selectionCount})` : 'Delete'}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

Toolbar.displayName = 'ImageManagerToolbar';
