import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { ImageManager } from '../ImageManager';
import type { ImageManagerActions, ImageManagerMode, ServerImage } from '../ImageManager/types';
import { PictureOutlined, CloseCircleOutlined } from '../_icons';

export interface ImagePickerInputProps {
  /** Controlled value: selected image paths. */
  value?: string[];
  /** Default value when uncontrolled. */
  defaultValue?: string[];
  /** Fires with selection (paths + image objects). */
  onChange?: (paths: string[], images: ServerImage[]) => void;
  /** Allow multiple selection. Default: false. */
  multiple?: boolean;
  /** Server adapter (forwarded to ImageManager.Modal). */
  actions: ImageManagerActions;
  /** Sandbox root forwarded to the manager. */
  rootDir?: string;
  /** Manager mode. Default: "view". */
  mode?: ImageManagerMode;
  /** Placeholder when no image is selected. */
  placeholder?: string;
  /** Disable the trigger. */
  disabled?: boolean;
  /** Trigger width. */
  width?: number | string;
  /** className for the trigger. */
  className?: string;
  style?: React.CSSProperties;
  /** Optional title for the modal. */
  modalTitle?: React.ReactNode;
  /** Accept attribute forwarded for upload in edit mode. */
  accept?: string;
}

const EMPTY: string[] = [];

const filenameOf = (path: string): string => {
  const idx = path.lastIndexOf('/');
  return idx === -1 ? path : path.slice(idx + 1);
};

export const ImagePickerInput: React.FC<ImagePickerInputProps> = ({
  value,
  defaultValue,
  onChange,
  multiple = false,
  actions,
  rootDir,
  mode = 'view',
  placeholder = 'Select image',
  disabled = false,
  width,
  className,
  style,
  modalTitle,
  accept,
}) => {
  const { getPrefixCls } = useConfig();
  const prefixCls =
    getPrefixCls?.('image-picker-input') || getDefaultPrefixCls('image-picker-input');

  const isControlled = value !== undefined;
  const [innerPaths, setInnerPaths] = useState<string[]>(defaultValue ?? EMPTY);
  const paths = isControlled ? (value as string[]) : innerPaths;

  const [imageCache, setImageCache] = useState<Record<string, ServerImage>>({});
  const [open, setOpen] = useState(false);

  const handleApply = useCallback(
    (nextPaths: string[], images: ServerImage[]) => {
      const cache = { ...imageCache };
      for (const img of images) cache[img.path] = img;
      setImageCache(cache);
      if (!isControlled) setInnerPaths(nextPaths);
      onChange?.(nextPaths, images);
      setOpen(false);
    },
    [imageCache, isControlled, onChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!isControlled) setInnerPaths(EMPTY);
      onChange?.(EMPTY, []);
    },
    [isControlled, onChange]
  );

  const handleOpen = useCallback(() => {
    if (!disabled) setOpen(true);
  }, [disabled]);

  const previews = useMemo(
    () =>
      paths.map((p) => ({
        path: p,
        name: imageCache[p]?.name ?? filenameOf(p),
        url: imageCache[p]?.thumbnailUrl ?? imageCache[p]?.url,
      })),
    [paths, imageCache]
  );

  const hasValue = paths.length > 0;

  return (
    <>
      <button
        type="button"
        className={classNames(prefixCls, className, {
          [`${prefixCls}-empty`]: !hasValue,
          [`${prefixCls}-disabled`]: disabled,
          [`${prefixCls}-multiple`]: multiple,
        })}
        style={{ width, ...style }}
        onClick={handleOpen}
        disabled={disabled}
        aria-haspopup="dialog"
      >
        {hasValue ? (
          <span className={`${prefixCls}-previews`}>
            {previews.map((p) => (
              <span key={p.path} className={`${prefixCls}-preview`} title={p.name}>
                {p.url ? (
                  <img src={p.url} alt={p.name} />
                ) : (
                  <span className={`${prefixCls}-preview-fallback`} aria-hidden="true">
                    <PictureOutlined />
                  </span>
                )}
                <span className={`${prefixCls}-preview-name`}>{p.name}</span>
              </span>
            ))}
          </span>
        ) : (
          <span className={`${prefixCls}-placeholder`}>
            <PictureOutlined />
            <span>{placeholder}</span>
          </span>
        )}

        {hasValue && !disabled && (
          <span
            className={`${prefixCls}-clear`}
            role="button"
            tabIndex={-1}
            aria-label="Clear selection"
            onClick={handleClear}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <CloseCircleOutlined />
          </span>
        )}
      </button>

      <ImageManager.Modal
        open={open}
        onCancel={() => setOpen(false)}
        onApply={handleApply}
        title={modalTitle}
        multiple={multiple}
        actions={actions}
        rootDir={rootDir}
        mode={mode}
        defaultSelected={paths}
        accept={accept}
      />
    </>
  );
};

ImagePickerInput.displayName = 'ImagePickerInput';
