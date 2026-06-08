import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useDraggable } from '@dnd-kit/core';
import { Checkbox } from '../Checkbox';
import { Dropdown } from '../Dropdown';
import { Menu, MenuItem } from '../Menu';
import { EyeOutlined, MoreOutlined, PictureOutlined } from '../_icons';
import type { ServerImage } from './types';
import { formatBytes } from './utils';

export interface ImageCardProps {
  image: ServerImage;
  prefixCls: string;
  selected: boolean;
  editable: boolean;
  draggable: boolean;
  onToggle: (image: ServerImage, additive: boolean) => void;
  onOpen?: (image: ServerImage) => void;
  /** Opens the built-in preview modal. When undefined, the eye action
      is not rendered (preview disabled by the parent). */
  onPreview?: (image: ServerImage) => void;
  onRename?: (image: ServerImage) => void;
  onDelete?: (image: ServerImage) => void;
}

export const ImageCard: React.FC<ImageCardProps> = ({
  image,
  prefixCls,
  selected,
  editable,
  draggable,
  onToggle,
  onOpen,
  onPreview,
  onRename,
  onDelete,
}) => {
  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: `image:${image.path}`,
    data: {
      kind: 'image',
      path: image.path,
      name: image.name,
      url: image.thumbnailUrl || image.url,
    },
    disabled: !draggable,
  });

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      onToggle(image, e.metaKey || e.ctrlKey || e.shiftKey);
    },
    [image, onToggle]
  );

  const handleDoubleClick = useCallback(() => {
    onOpen?.(image);
  }, [image, onOpen]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onToggle(image, e.metaKey || e.ctrlKey || e.shiftKey);
      }
    },
    [image, onToggle]
  );

  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  const menu = (
    <Menu>
      {onRename && (
        <MenuItem key="rename" onClick={() => onRename(image)}>
          Rename
        </MenuItem>
      )}
      {onDelete && (
        <MenuItem key="delete" onClick={() => onDelete(image)}>
          Delete
        </MenuItem>
      )}
    </Menu>
  );

  // Don't transform the original — DragOverlay handles the visual follow.
  // Just dim it so the user sees what's being dragged.
  const style: React.CSSProperties = isDragging ? { opacity: 0.4 } : {};

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={classNames(`${prefixCls}-card`, `${prefixCls}-card-image`, {
        [`${prefixCls}-card-selected`]: selected,
        [`${prefixCls}-card-dragging`]: isDragging,
      })}
      style={style}
      tabIndex={0}
      role="button"
      aria-pressed={selected}
      aria-label={image.name}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
    >
      <div className={`${prefixCls}-card-thumb`}>
        <img src={image.thumbnailUrl || image.url} alt={image.name} loading="lazy" />
        <span className={`${prefixCls}-card-thumb-fallback`} aria-hidden="true">
          <PictureOutlined />
        </span>
      </div>

      <div className={`${prefixCls}-card-body`}>
        <div className={`${prefixCls}-card-name`} title={image.name}>
          {image.name}
        </div>
        <div className={`${prefixCls}-card-meta`}>{formatBytes(image.size)}</div>
      </div>

      <div
        className={`${prefixCls}-card-select`}
        onPointerDown={stop}
        onClick={stop}
        onDoubleClick={stop}
      >
        <Checkbox
          checked={selected}
          onChange={() => onToggle(image, true)}
          aria-label={`Select ${image.name}`}
        />
      </div>

      {(onPreview || (editable && (onRename || onDelete))) && (
        <div
          className={`${prefixCls}-card-actions`}
          onPointerDown={stop}
          onClick={stop}
          onDoubleClick={stop}
        >
          {onPreview && (
            <button
              type="button"
              className={`${prefixCls}-card-action-btn`}
              aria-label={`Preview ${image.name}`}
              onClick={() => onPreview(image)}
            >
              <EyeOutlined />
            </button>
          )}
          {editable && (onRename || onDelete) && (
            <Dropdown overlay={menu} trigger={['click']}>
              <button type="button" className={`${prefixCls}-card-action-btn`} aria-label="More">
                <MoreOutlined />
              </button>
            </Dropdown>
          )}
        </div>
      )}
    </div>
  );
};

ImageCard.displayName = 'ImageCard';
