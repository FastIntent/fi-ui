import React, { forwardRef, useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useConfig } from '../ConfigProvider';
import { getDefaultPrefixCls } from '../ConfigProvider/prefix';
import { Input } from '../Input';
import type { InputRef, InputSize } from '../Input';
import { ImageManager, ImagePreviewModal } from '../ImageManager';
import type { ImageManagerActions, ImageManagerMode, ServerImage } from '../ImageManager/types';
import { PictureOutlined, CloseCircleOutlined, FolderOutlined } from '../_icons';

export interface ImagePickerInputProps {
  /** Controlled value: selected image path or URL. */
  value?: string;
  /** Default value when uncontrolled. */
  defaultValue?: string;
  /**
   * Fires with the selection. The first argument (the path) is the
   * field's value — it's what Form.Item stores when this component is
   * used inside a Form. The second argument carries the full
   * ServerImage when the selection came from the manager; note that
   * Form.Item ignores it, so read it here if you need the rich object.
   */
  onChange?: (path: string | undefined, image?: ServerImage) => void;
  /** Server adapter (forwarded to ImageManager.Modal). */
  actions: ImageManagerActions;
  /** Sandbox root forwarded to the manager. */
  rootDir?: string;
  /** Manager mode. Default: "view". */
  mode?: ImageManagerMode;
  /** Placeholder when no image is selected. */
  placeholder?: string;
  /**
   * Size forwarded to the underlying Input. Falls back to the
   * ConfigProvider `size`, then "middle".
   */
  size?: InputSize;
  /** Disable the input. */
  disabled?: boolean;
  /** Allow the user to type a URL directly. Default: false (readOnly). */
  editable?: boolean;
  /** Optional title for the manager modal. */
  modalTitle?: React.ReactNode;
  /** Accept attribute forwarded for upload in edit mode. */
  accept?: string;
  /** Validation state forwarded to the underlying Input. */
  status?: 'error' | 'warning' | 'success';
  /** Activates the floating-label variant. Default: false. */
  floating?: boolean;
  /** Label text shown by the floating variant. */
  label?: string;
  /** Custom color for the floating label when active. */
  labelColor?: string;
  /** className for the trigger. */
  className?: string;
  style?: React.CSSProperties;
}

const filenameOf = (path: string): string => {
  const idx = path.lastIndexOf('/');
  return idx === -1 ? path : path.slice(idx + 1);
};

/**
 * Calendar-style image picker: a text input that shows the selected
 * image's URL or path with two affordances on the suffix —
 *
 *   • Folder icon → opens the ImageManager.Modal so the user can browse
 *     and pick an image.
 *   • Clear icon (only when there's a value) → empties the field.
 *
 * Clicking the input itself opens the preview when there's a value,
 * the manager when there isn't.
 *
 * Pass `editable` to let the user paste a URL directly into the field
 * (e.g. for admin settings where the URL is the source of truth and
 * the picker is just a helper).
 */
export const ImagePickerInput = forwardRef<InputRef, ImagePickerInputProps>(
  (
    {
      value,
      defaultValue,
      onChange,
      actions,
      rootDir,
      mode = 'view',
      placeholder = 'Pick an image…',
      size,
      disabled = false,
      editable = false,
      modalTitle,
      accept,
      status,
      floating = false,
      label,
      labelColor,
      className,
      style,
    },
    ref
  ) => {
    const { getPrefixCls, size: contextSize } = useConfig();
    const prefixCls =
      getPrefixCls?.('image-picker-input') || getDefaultPrefixCls('image-picker-input');
    const mergedSize: InputSize = size || contextSize || 'middle';

    // We keep `innerPath` mirrored with the consumer's `value` and always
    // update it from our own handlers. Picking between `value` and
    // `innerPath` based on `value !== undefined` is what caused the
    // double-click bug: clearing a controlled value flipped the field
    // back to "uncontrolled" mid-flight and re-read the stale `innerPath`,
    // so the cleared value reappeared until a second click.
    const [innerPath, setInnerPath] = useState<string | undefined>(
      value !== undefined ? value : defaultValue
    );
    const path = value !== undefined ? value : innerPath;

    // Keep the ServerImage the manager handed us so we can show a rich
    // preview later (dimensions / size / mtime). When the user types a
    // URL directly, we won't have one and the preview falls back to the
    // raw URL.
    const [imageCache, setImageCache] = useState<Record<string, ServerImage>>({});

    const [managerOpen, setManagerOpen] = useState(false);
    const [previewOpen, setPreviewOpen] = useState(false);

    const hasValue = Boolean(path);

    // The action button lives OUTSIDE the Input (absolutely positioned
    // on top, see ImagePickerInput.scss). That's deliberate: rc-input's
    // affix-wrapper installs internal mousedown handlers that focus the
    // <input> during the down phase, eating the first click on anything
    // rendered inside the wrapper's `suffix` slot. By hoisting the
    // button out of the wrapper entirely we sidestep that race — the
    // click goes straight to our handler.
    const swallow = useCallback((e: React.SyntheticEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const openManager = useCallback(() => {
      if (!disabled) setManagerOpen(true);
    }, [disabled]);

    const openPreview = useCallback(() => {
      if (!disabled && hasValue) setPreviewOpen(true);
    }, [disabled, hasValue]);

    const handleApply = useCallback(
      (nextPaths: string[], images: ServerImage[]) => {
        const picked = nextPaths[0];
        const image = images[0];
        if (image) {
          setImageCache((prev) => ({ ...prev, [image.path]: image }));
        }
        setInnerPath(picked);
        onChange?.(picked, image);
        setManagerOpen(false);
      },
      [onChange]
    );

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        setInnerPath(undefined);
        onChange?.(undefined);
      },
      [onChange]
    );

    const handleTypedChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const next = e.target.value || undefined;
        setInnerPath(next);
        onChange?.(next);
      },
      [onChange]
    );

    // The preview modal expects a ServerImage; build a minimal one from
    // the raw path if we never got a real one from the manager.
    const previewImage: ServerImage | null = useMemo(() => {
      if (!path) return null;
      if (imageCache[path]) return imageCache[path];
      return {
        name: filenameOf(path),
        path,
        url: path,
        size: 0,
        mtime: 0,
      };
    }, [path, imageCache]);

    // Click on the input chrome itself — anywhere outside the action
    // button — opens the preview when there's a value, the manager when
    // empty. In `editable` mode the click means "I want to type here",
    // so we do nothing and let the input take focus; the folder button
    // stays as the explicit way to open the manager.
    const handleSurfaceClick = useCallback(() => {
      if (disabled || editable) return;
      if (hasValue) openPreview();
      else openManager();
    }, [disabled, editable, hasValue, openPreview, openManager]);

    return (
      <>
        <span
          className={classNames(prefixCls, className, {
            [`${prefixCls}-disabled`]: disabled,
            [`${prefixCls}-floating`]: floating,
          })}
          style={style}
        >
          <Input
            ref={ref}
            value={path ?? ''}
            readOnly={!editable}
            disabled={disabled}
            placeholder={placeholder}
            size={mergedSize}
            status={status}
            // Delegate the floating-label wrapper to the Input itself —
            // it already owns the focus state, the placeholder hide/show
            // logic and the `.fi-float-label` markup. Doing it here too
            // would just stack the label twice.
            floating={floating}
            label={label}
            labelColor={labelColor}
            // In floating mode the label IS the visual cue, so we drop
            // the picture-prefix icon to keep the inside of the field
            // clean.
            prefix={floating ? undefined : <PictureOutlined />}
            onChange={editable ? handleTypedChange : undefined}
            onClick={handleSurfaceClick}
            // We intentionally leave the suffix slot empty — the action
            // button is rendered as a sibling below to avoid rc-input
            // intercepting the first click.
          />
          {hasValue && !disabled ? (
            <button
              type="button"
              className={`${prefixCls}-action`}
              aria-label="Clear"
              onMouseDown={swallow}
              onClick={(e) => {
                e.stopPropagation();
                handleClear(e);
              }}
            >
              <CloseCircleOutlined />
            </button>
          ) : (
            <button
              type="button"
              className={`${prefixCls}-action`}
              aria-label="Browse images"
              disabled={disabled}
              onMouseDown={swallow}
              onClick={(e) => {
                e.stopPropagation();
                openManager();
              }}
            >
              <FolderOutlined />
            </button>
          )}
        </span>

        <ImageManager.Modal
          open={managerOpen}
          onCancel={() => setManagerOpen(false)}
          onApply={handleApply}
          title={modalTitle}
          multiple={false}
          actions={actions}
          rootDir={rootDir}
          mode={mode}
          defaultSelected={hasValue && path ? [path] : []}
          accept={accept}
        />

        <ImagePreviewModal
          prefixCls={getPrefixCls?.('image-manager') || 'atom-image-manager'}
          image={previewOpen ? previewImage : null}
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />
      </>
    );
  }
);

ImagePickerInput.displayName = 'ImagePickerInput';
