import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useDraggable, useDroppable } from '@dnd-kit/core';
import { Dropdown } from '../Dropdown';
import { Menu, MenuItem } from '../Menu/Menu';
import { FolderOutlined, MoreOutlined } from '../_icons';
import type { ServerFolder } from './types';

export interface FolderCardProps {
  folder: ServerFolder;
  prefixCls: string;
  editable: boolean;
  draggable: boolean;
  droppable: boolean;
  onOpen: (folder: ServerFolder) => void;
  onRename?: (folder: ServerFolder) => void;
  onDelete?: (folder: ServerFolder) => void;
}

export const FolderCard: React.FC<FolderCardProps> = ({
  folder,
  prefixCls,
  editable,
  draggable,
  droppable,
  onOpen,
  onRename,
  onDelete,
}) => {
  const dragId = `folder:${folder.path}`;

  const {
    setNodeRef: setDragRef,
    listeners,
    attributes,
    isDragging,
  } = useDraggable({
    id: dragId,
    data: { kind: 'folder', path: folder.path, name: folder.name },
    disabled: !draggable,
  });

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `drop:${folder.path}`,
    data: { kind: 'folder-target', path: folder.path },
    disabled: !droppable,
  });

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      setDragRef(node);
      setDropRef(node);
    },
    [setDragRef, setDropRef]
  );

  const handleDoubleClick = useCallback(() => onOpen(folder), [folder, onOpen]);
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        onOpen(folder);
      }
    },
    [folder, onOpen]
  );

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  const menu = (
    <Menu>
      {onRename && (
        <MenuItem key="rename" onClick={() => onRename(folder)}>
          Rename
        </MenuItem>
      )}
      {onDelete && (
        <MenuItem key="delete" onClick={() => onDelete(folder)}>
          Delete
        </MenuItem>
      )}
    </Menu>
  );

  // DragOverlay handles the visual follow; keep original in place, just dim it.
  const style: React.CSSProperties = isDragging ? { opacity: 0.4 } : {};

  return (
    <div
      ref={setRef}
      {...attributes}
      {...listeners}
      className={classNames(`${prefixCls}-card`, `${prefixCls}-card-folder`, {
        [`${prefixCls}-card-dragging`]: isDragging,
        [`${prefixCls}-card-drop-over`]: isOver,
      })}
      style={style}
      tabIndex={0}
      role="button"
      aria-label={`Folder ${folder.name}`}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
    >
      <div className={`${prefixCls}-card-folder-icon`} aria-hidden="true">
        <FolderOutlined />
      </div>
      <div className={`${prefixCls}-card-body`}>
        <div className={`${prefixCls}-card-name`} title={folder.name}>
          {folder.name}
        </div>
        {typeof folder.itemCount === 'number' && (
          <div className={`${prefixCls}-card-meta`}>{folder.itemCount} items</div>
        )}
      </div>

      {editable && (onRename || onDelete) && (
        <div
          className={`${prefixCls}-card-actions`}
          onPointerDown={stop}
          onClick={stop}
          onDoubleClick={stop}
        >
          <Dropdown overlay={menu} trigger={['click']}>
            <button type="button" className={`${prefixCls}-card-action-btn`} aria-label="More">
              <MoreOutlined />
            </button>
          </Dropdown>
        </div>
      )}
    </div>
  );
};

FolderCard.displayName = 'FolderCard';
